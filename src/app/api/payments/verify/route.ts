import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { paymentService } from '@/server/services/payment.service';
import { handleApiError, unauthorized } from '@/lib/api-errors';
import { VerifyPaymentSchema } from '@/validators/order.validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      VerifyPaymentSchema.parse(body);

    const order = await paymentService.confirmPayment(
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return handleApiError(error);
  }
}
