import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/server/repositories/order.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import type { PaymentStatus } from '@/models/Order';

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const { paymentStatus, note } = await req.json();

    if (!paymentStatus) {
      return NextResponse.json({ error: 'paymentStatus is required' }, { status: 400 });
    }

    const updated = await orderRepository.updatePayment(id, {
      paymentStatus: paymentStatus as PaymentStatus,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Add status history note if provided
    if (note) {
      await orderRepository.updateStatus(
        id,
        updated.status,
        `Payment status updated to "${paymentStatus}": ${note}`
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
