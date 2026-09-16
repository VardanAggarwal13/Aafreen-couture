import { NextRequest, NextResponse } from 'next/server';
import { couponRepository } from '@/server/repositories/coupon.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { CreateCouponSchema } from '@/validators/coupon.validators';
import type { ICoupon } from '@/models/Coupon';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const coupons = await couponRepository.findAll();
    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin(request);
    const body = await request.json();
    const data = CreateCouponSchema.parse(body);
    const created = await couponRepository.create(data as unknown as Partial<ICoupon>);
    logAdminAction(session, request, 'COUPON_CREATE', `Created coupon "${created.code}"`);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
