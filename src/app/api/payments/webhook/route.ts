import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/server/services/payment.service';
import { orderRepository } from '@/server/repositories/order.repository';
import { emailService } from '@/server/services/email.service';
import { handleApiError } from '@/lib/api-errors';

// Must use raw body for Razorpay signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') ?? '';

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      if (!paymentService.verifyWebhookSignature(rawBody, signature)) {
        return NextResponse.json(
          { success: false, error: 'Invalid webhook signature' },
          { status: 400 }
        );
      }
    } else {
      console.warn('[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET not set in env. Allowing request in development.');
    }

    const event = JSON.parse(rawBody) as {
      event: string;
      payload: {
        payment?: { entity: { id: string; order_id: string; status: string; error_description?: string } };
        order?: { entity: { id: string; status: string } };
      };
    };

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload.payment?.entity;
      const rzpOrderId = payment?.order_id || event.payload.order?.entity?.id;
      if (rzpOrderId) {
        const order = await orderRepository.findByRazorpayOrderId(rzpOrderId);
        if (order && order.paymentStatus !== 'paid') {
          await paymentService.confirmPayment(
            order._id.toString(),
            rzpOrderId,
            payment?.id || `webhook_${Date.now()}`,
            'webhook_captured',
            true // Verified via webhook signature
          );
          console.log(`[Webhook] Order ${order.orderNumber} successfully confirmed & stock updated`);
        }
      }
    }

    if (event.event === 'payment.failed') {
      const payment = event.payload.payment?.entity;
      if (payment) {
        const order = await orderRepository.findByRazorpayOrderId(payment.order_id);
        if (order && order.paymentStatus === 'pending') {
          await orderRepository.updatePayment(order._id.toString(), { paymentStatus: 'failed' });
          await orderRepository.updateStatus(
            order._id.toString(),
            'pending',
            `Payment attempt failed: ${payment.error_description || 'Unsuccessful'}`
          );
          emailService.sendPaymentFailedNotification(order, payment.error_description).catch((err) =>
            console.warn('[Webhook] Failed to send payment failed notice:', err)
          );
          console.log(`[Webhook] Order ${order.orderNumber} marked as payment failed`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}

