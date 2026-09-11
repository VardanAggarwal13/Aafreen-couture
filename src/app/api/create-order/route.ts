import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { paymentService } from '@/server/services/payment.service';
import { handleApiError } from '@/lib/api-errors';
import { z } from 'zod';

const schema = z.object({
  orderId: z.string().optional(),
  amount: z.number().optional(), // in paise
  currency: z.string().default('INR'),
  receipt: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, currency, receipt } = schema.parse(body);

    if (orderId) {
      const result = await paymentService.createRazorpayOrder(orderId);
      return NextResponse.json({
        success: true,
        order_id: result.razorpayOrderId,
        razorpayOrderId: result.razorpayOrderId,
        amount: result.amount,
        currency: result.currency,
        keyId: result.keyId,
      });
    }

    if (!amount || amount < 100) {
      return NextResponse.json(
        { success: false, error: 'Amount must be at least 100 paise (₹1.00).' },
        { status: 400 }
      );
    }

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now().toString().slice(-10)}`,
    });

    return NextResponse.json({
      success: true,
      order_id: rzpOrder.id,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
