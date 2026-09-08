import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/server/services/payment.service';
import { handleApiError } from '@/lib/api-errors';

interface Context {
  params: Promise<{ id: string }>;
}

/**
 * Reconcile endpoint:
 * Directly checks live payment status with Razorpay servers and updates order & stock if captured.
 */
export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;

    const result = await paymentService.reconcilePayment(id);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
