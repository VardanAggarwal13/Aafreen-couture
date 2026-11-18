import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/server/repositories/order.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { UpdatePaymentStatusSchema } from '@/validators/order.validators';

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(req);
    const { id } = await params;
    const { paymentStatus, note } = UpdatePaymentStatusSchema.parse(await req.json());

    const updated = await orderRepository.updatePayment(id, { paymentStatus });

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

    logAdminAction(session, req, 'ORDER_PAYMENT_STATUS_UPDATE', `Order ${updated.orderNumber} payment → ${paymentStatus}`);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
