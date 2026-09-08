import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, error: 'Razorpay credentials are not configured on server' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { amount, currency = 'INR', receipt, notes } = body;

    // Validate amount: required, number, >= 100 paise
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount < 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Amount is required and must be at least 100 paise (₹1.00).',
          received: amount,
        },
        { status: 400 }
      );
    }

    const razorpay = getRazorpay();
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(numAmount),
      currency: (currency || 'INR').toUpperCase(),
      receipt: receipt ? String(receipt).slice(0, 40) : `rcpt_${Date.now()}`,
      notes: notes && typeof notes === 'object' ? notes : undefined,
    });

    return NextResponse.json({
      success: true,
      order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key_id: keyId,
    });
  } catch (error: any) {
    console.error('Error in /api/create-order:', error);

    // Handle authentication failures from Razorpay API
    if (error?.statusCode === 401 || error?.error?.code === 'BAD_REQUEST_ERROR' && error?.error?.description?.includes('auth')) {
      return NextResponse.json(
        { success: false, error: 'Razorpay authentication failed' },
        { status: 401 }
      );
    }

    const statusCode = error?.statusCode >= 400 && error?.statusCode < 600 ? error.statusCode : 500;
    const message = error?.error?.description || error?.message || 'Failed to create Razorpay order';

    return NextResponse.json(
      { success: false, error: message },
      { status: statusCode }
    );
  }
}
