import crypto from 'crypto';
import { razorpay } from '@/lib/razorpay';
import { orderRepository } from '@/server/repositories/order.repository';
import { BusinessError, NotFoundError } from '@/lib/api-errors';
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
    if (!secret) return false;
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    return expectedSignature === razorpaySignature;
  }

  async confirmPayment(
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<IOrder> {
    const isValid = this.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) throw new BusinessError('Payment verification failed. Invalid signature.');

    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order');

    // Idempotency: if already confirmed, return order
    if (order.paymentStatus === 'paid') return order;

    const updated = await orderRepository.updatePayment(orderId, {
      paymentStatus: 'paid',
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!updated) throw new NotFoundError('Order');

    await orderRepository.updateStatus(orderId, 'confirmed', 'Payment received');

    return updated;
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
