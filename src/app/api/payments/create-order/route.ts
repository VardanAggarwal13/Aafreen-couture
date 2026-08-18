import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { paymentService } from '@/server/services/payment.service';
import { handleApiError, unauthorized } from '@/lib/api-errors';
import { z } from 'zod';

const schema = z.object({ orderId: z.string().length(24) });

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return unauthorized();

    const body = await request.json();
    const { orderId } = schema.parse(body);

    const result = await paymentService.createRazorpayOrder(orderId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
