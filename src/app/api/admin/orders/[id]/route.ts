import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/server/auth';
import { handleApiError } from '@/lib/api-errors';
import { orderService } from '@/server/services/order.service';
import { logAdminAction } from '@/server/services/audit-log.service';

interface Props {
  params: Promise<{ id: string }>;
}

const deleteBodySchema = z.object({ confirmPaid: z.boolean().optional() }).default({});

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;

    let raw: unknown = {};
    try {
      raw = await request.json();
    } catch {
      // no body is fine: confirmPaid defaults to false
    }
    const { confirmPaid } = deleteBodySchema.parse(raw);

    const { orderNumber } = await orderService.deleteOrder(id, confirmPaid === true);
    logAdminAction(session, request, 'ORDER_DELETE', `Deleted order ${orderNumber}`);
    return NextResponse.json({ success: true, message: `Order #${orderNumber} deleted` });
  } catch (error) {
    return handleApiError(error);
  }
}
