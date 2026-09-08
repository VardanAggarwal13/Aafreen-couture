import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { orderRepository } from '@/server/repositories/order.repository';

export async function POST(request: NextRequest) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: 'Razorpay secret key is not configured on server' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));

    // Support both standard snake_case and camelCase parameters
    const order_id = body.razorpay_order_id || body.order_id || body.razorpayOrderId;
    const payment_id = body.razorpay_payment_id || body.payment_id || body.razorpayPaymentId;
    const signature = body.razorpay_signature || body.signature || body.razorpaySignature;

    // Missing fields validation -> return 400
    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required payment verification fields. razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.',
          received: {
            order_id: !!order_id,
            payment_id: !!payment_id,
            signature: !!signature,
          },
        },
        { status: 400 }
      );
    }

    // Generate HMAC-SHA256 signature
    const hmacPayload = `${order_id}|${payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(hmacPayload)
      .digest('hex');

    // Timing-safe comparison to prevent timing attacks
    const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
    const signatureBuf = Buffer.from(String(signature), 'utf-8');

    const isMatch =
      expectedBuf.length === signatureBuf.length &&
      crypto.timingSafeEqual(expectedBuf, signatureBuf);

    // Signature mismatch -> return 400, do NOT mark as paid
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment verification failed: Signature mismatch.',
        },
        { status: 400 }
      );
    }

    // If this order belongs to an app order, confirm payment and process stock & email side-effects
    const { paymentService } = await import('@/server/services/payment.service');
    const appOrderId = body.orderId;
    try {
      let targetId = appOrderId;
      if (!targetId) {
        const matchingOrder = await orderRepository.findByRazorpayOrderId(order_id);
        if (matchingOrder) targetId = matchingOrder._id.toString();
      }
      if (targetId) {
        await paymentService.confirmPayment(targetId, order_id, payment_id, signature);
      }
    } catch (e) {
      console.warn('Could not confirm order payment in DB (non-fatal):', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment signature verified successfully',
      order_id,
      payment_id,
    });
  } catch (error: any) {
    console.error('Error in /api/verify-payment:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal payment verification error' },
      { status: 500 }
    );
  }
}
