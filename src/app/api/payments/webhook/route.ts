import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/server/services/payment.service';
import { orderRepository } from '@/server/repositories/order.repository';
import { handleApiError } from '@/lib/api-errors';

// Must use raw body for Razorpay signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') ?? '';

    if (!paymentService.verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody) as {
      event: string;
      payload: {
        payment?: { entity: { id: string; order_id: string; status: string } };
        order?: { entity: { id: string; status: string } };
      };
    };

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment?.entity;
      if (payment) {
        const order = await orderRepository.findByRazorpayOrderId(payment.order_id);
        if (order && order.paymentStatus !== 'paid') {
          await orderRepository.updatePayment(order._id.toString(), {
            paymentStatus: 'paid',
            razorpayPaymentId: payment.id,
          });
          await orderRepository.updateStatus(order._id.toString(), 'confirmed', 'Webhook: payment captured');
        }
      }
    }

    if (event.event === 'payment.failed') {
      const payment = event.payload.payment?.entity;
      if (payment) {
        const order = await orderRepository.findByRazorpayOrderId(payment.order_id);
        if (order && order.paymentStatus === 'pending') {
          await orderRepository.updatePayment(order._id.toString(), { paymentStatus: 'failed' });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}
