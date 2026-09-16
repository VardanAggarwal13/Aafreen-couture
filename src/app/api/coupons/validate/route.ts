import { NextRequest, NextResponse } from 'next/server';
import { couponService } from '@/server/services/coupon.service';
import { handleApiError } from '@/lib/api-errors';
import { requireAuth } from '@/server/auth';
import { ValidateCouponSchema } from '@/validators/coupon.validators';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const body = await request.json();
    const { code, subtotal } = ValidateCouponSchema.parse(body);

    const { coupon, discount, freeShipping } = await couponService.validateAndPrice(
      code,
      subtotal,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        discount,
        freeShipping,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
