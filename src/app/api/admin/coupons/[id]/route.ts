import { NextRequest, NextResponse } from 'next/server';
import { couponRepository } from '@/server/repositories/coupon.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { UpdateCouponSchema } from '@/validators/coupon.validators';
import type { ICoupon } from '@/models/Coupon';

interface Props { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const data = UpdateCouponSchema.parse(body);
    const updated = await couponRepository.update(id, data as unknown as Partial<ICoupon>);
    if (!updated) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    logAdminAction(session, request, 'COUPON_UPDATE', `Updated coupon "${updated.code}"`);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;
    const deleted = await couponRepository.delete(id);
    if (!deleted) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    logAdminAction(session, request, 'COUPON_DELETE', `Deleted coupon ${id}`);
    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
