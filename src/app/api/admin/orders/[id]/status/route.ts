import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/server/repositories/order.repository';
import { handleApiError } from '@/lib/api-errors';
import type { OrderStatus } from '@/models/Order';

interface Props { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const { status, note } = await req.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updated = await orderRepository.updateStatus(id, status as OrderStatus, note);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
