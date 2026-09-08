import crypto from 'crypto';
import { razorpay } from '@/lib/razorpay';
import { orderRepository } from '@/server/repositories/order.repository';
import { productRepository } from '@/server/repositories/product.repository';
import { emailService } from '@/server/services/email.service';
import { BusinessError, NotFoundError, ValidationError } from '@/lib/api-errors';
import type { IOrder } from '@/models/Order';

export class PaymentService {
  async createRazorpayOrder(orderId: string): Promise<{
    razorpayOrderId: string;
    amount: number;
    currency: string;
    keyId: string;
  }> {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order');

    if (!order.total || order.total < 100) {
      throw new ValidationError('Order amount must be at least 100 paise (₹1.00).');
    }

    const rzpOrder = await razorpay.orders.create({
      amount: order.total,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderId: orderId },
    });

    // Persist the Razorpay order ID
    await orderRepository.updatePayment(orderId, {
      paymentStatus: 'pending',
      razorpayPaymentId: undefined,
    });

    await orderRepository.findByIdAndPatchRzpOrderId(orderId, rzpOrder.id);

    return {
      razorpayOrderId: rzpOrder.id,
      amount: order.total,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    };
  }

  verifySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) return false;
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    const expBuf = Buffer.from(expectedSignature, 'utf-8');
    const sigBuf = Buffer.from(razorpaySignature, 'utf-8');
    return expBuf.length === sigBuf.length && crypto.timingSafeEqual(expBuf, sigBuf);
  }

  /**
   * Confirms payment, marks order as paid & confirmed, decrements stock atomically, and triggers confirmation emails.
   * Completely idempotent: calling multiple times will not duplicate deductions or emails.
   */
  async confirmPayment(
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    skipSignatureCheck = false
  ): Promise<IOrder> {
    if (!skipSignatureCheck) {
      const isValid = this.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
      if (!isValid) throw new ValidationError('Payment verification failed. Invalid signature.');
    }

    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order');

    // Idempotency: if already confirmed/paid, return order immediately
    if (order.paymentStatus === 'paid') return order;

    // Update payment details and status
    const updated = await orderRepository.updatePayment(orderId, {
      paymentStatus: 'paid',
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!updated) throw new NotFoundError('Order');

    await orderRepository.updateStatus(orderId, 'confirmed', 'Payment received and verified via Razorpay');

    // Real-time stock decrement for all purchased items
    try {
      for (const item of order.items) {
        const pId = item.product ? item.product.toString() : '';
        const vId = item.variant ? item.variant.toString() : undefined;
        if (pId) {
          await productRepository.decrementStock(pId, vId, item.quantity);
        }
      }
    } catch (stockErr) {
      console.error('[PaymentService] Error updating product stock:', stockErr);
    }

    // Real-time email notification to customer & admin
    emailService.sendOrderConfirmation(updated).catch((emailErr) => {
      console.error('[PaymentService] Error dispatching confirmation email:', emailErr);
    });

    return updated;
  }

  /**
   * Reconciles order payment status directly with Razorpay API.
   * Solves the scenario where money was deducted from user's bank but network dropped before client verification.
   */
  async reconcilePayment(orderId: string): Promise<{
    status: string;
    reconciled: boolean;
    message: string;
    order: IOrder;
  }> {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order');

    // If already paid, nothing to reconcile
    if (order.paymentStatus === 'paid') {
      return {
        status: 'paid',
        reconciled: true,
        message: 'Order is already paid and confirmed.',
        order,
      };
    }

    // If no Razorpay order ID is associated, cannot check Razorpay API
    if (!order.razorpayOrderId) {
      return {
        status: order.paymentStatus,
        reconciled: false,
        message: 'No Razorpay order ID associated with this order.',
        order,
      };
    }

    try {
      // Query Razorpay API directly
      const paymentsResponse: any = await (razorpay.orders as any).fetchPayments(order.razorpayOrderId);
      const payments = paymentsResponse?.items || [];

      // Look for any captured payment
      const capturedPayment = payments.find((p: any) => p.status === 'captured');

      if (capturedPayment) {
        // Payment was captured on Razorpay! Auto-reconcile and confirm
        const confirmedOrder = await this.confirmPayment(
          orderId,
          order.razorpayOrderId,
          capturedPayment.id,
          'reconciled_via_razorpay_api',
          true
        );

        return {
          status: 'paid',
          reconciled: true,
          message: `Payment ${capturedPayment.id} verified and captured successfully via Razorpay.`,
          order: confirmedOrder,
        };
      }

      // Check if there are failed attempts
      const failedPayment = payments.find((p: any) => p.status === 'failed');
      if (failedPayment && payments.length === 1) {
        await orderRepository.updatePayment(orderId, { paymentStatus: 'failed' });
        const updated = (await orderRepository.findById(orderId))!;
        return {
          status: 'failed',
          reconciled: false,
          message: `Payment failed on Razorpay: ${failedPayment.error_description || 'Transaction unsuccessful'}. No money was deducted.`,
          order: updated,
        };
      }

      return {
        status: 'pending',
        reconciled: false,
        message: 'No completed payment found on Razorpay yet. Please try again or complete the payment.',
        order,
      };
    } catch (err: any) {
      console.error('[PaymentService] Reconciliation error:', err);
      return {
        status: order.paymentStatus,
        reconciled: false,
        message: `Failed to communicate with Razorpay: ${err?.message || 'Network error'}`,
        order,
      };
    }
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return false;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');
    return expectedSignature === signature;
  }
}

export const paymentService = new PaymentService();

