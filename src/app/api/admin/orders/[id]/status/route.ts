import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/server/services/order.service';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import type { OrderStatus } from '@/models/Order';

interface Props { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(req);
    const { id } = await params;
    const { status, note } = await req.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updated = await orderService.updateOrderStatus(id, status as OrderStatus, note);
    logAdminAction(session, req, 'ORDER_STATUS_UPDATE', `Order ${updated.orderNumber} → ${status}`);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
