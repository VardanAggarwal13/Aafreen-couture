import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { paymentService } from '@/server/services/payment.service';
import { handleApiError } from '@/lib/api-errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const orderId = body.order_id || body.razorpayOrderId || body.razorpay_order_id;
    const paymentId = body.payment_id || body.razorpayPaymentId || body.razorpay_payment_id;
    const signature = body.signature || body.razorpaySignature || body.razorpay_signature;
    const dbOrderId = body.orderId || body.dbOrderId;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: order_id, payment_id, and signature are required' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: RAZORPAY_KEY_SECRET is not set' },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const expBuf = Buffer.from(expectedSignature, 'utf-8');
    const sigBuf = Buffer.from(signature, 'utf-8');

    const isMatch = expBuf.length === sigBuf.length && crypto.timingSafeEqual(expBuf, sigBuf);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed: Signature mismatch' },
        { status: 400 }
      );
    }

    // If a database order is associated, confirm the order atomically
    if (dbOrderId) {
      try {
        await paymentService.confirmPayment(dbOrderId, orderId, paymentId, signature);
      } catch (err) {
        console.warn('[VerifyPayment] Order confirmation note:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment signature verified successfully',
      data: {
        order_id: orderId,
        payment_id: paymentId,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
