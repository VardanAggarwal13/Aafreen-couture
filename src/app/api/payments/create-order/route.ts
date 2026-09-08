import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { paymentService } from '@/server/services/payment.service';
import { handleApiError, unauthorized } from '@/lib/api-errors';
import { z } from 'zod';

const schema = z.object({ orderId: z.string().min(1) });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = schema.parse(body);

    const result = await paymentService.createRazorpayOrder(orderId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
