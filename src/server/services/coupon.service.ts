import { couponRepository } from '@/server/repositories/coupon.repository';
import { BusinessError, NotFoundError } from '@/lib/api-errors';
import type { ICoupon } from '@/models/Coupon';

export interface CouponPricingResult {
  coupon: ICoupon;
  discount: number; // paise
  freeShipping: boolean;
}

export class CouponService {
  /**
   * Validates a coupon code against its rules (active, date window, usage caps, minimum order
   * value) and computes the discount for the given subtotal. Never trusts a client-computed
   * discount — this is the single source of truth called both by the cart preview endpoint and
   * by order creation.
   */
  async validateAndPrice(code: string, subtotal: number, userId?: string): Promise<CouponPricingResult> {
    const coupon = await couponRepository.findByCode(code);
    if (!coupon) throw new NotFoundError('Coupon');

    if (!coupon.isActive) {
      throw new BusinessError('This coupon is no longer active.');
    }

    const now = new Date();
    if (now < new Date(coupon.validFrom)) {
      throw new BusinessError('This coupon is not valid yet.');
    }
    if (now > new Date(coupon.validUntil)) {
      throw new BusinessError('This coupon has expired.');
    }

    if (coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
      throw new BusinessError('This coupon has reached its usage limit.');
    }

    if (userId && coupon.perUserLimit) {
      const usedByThisUser = (coupon.usedBy ?? []).filter((u) => String(u) === userId).length;
      if (usedByThisUser >= coupon.perUserLimit) {
        throw new BusinessError('You have already used this coupon the maximum number of times.');
      }
    }

    if (subtotal < coupon.minOrderValue) {
      throw new BusinessError(
        `This coupon requires a minimum order value of ₹${(coupon.minOrderValue / 100).toLocaleString('en-IN')}.`
      );
    }

    let discount = 0;
    let freeShipping = false;

    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, subtotal);
    } else if (coupon.type === 'free_shipping') {
      freeShipping = true;
    }

    return { coupon, discount, freeShipping };
  }

  async recordUsage(code: string, userId?: string): Promise<void> {
    await couponRepository.recordUsage(code, userId);
  }
}

export const couponService = new CouponService();
