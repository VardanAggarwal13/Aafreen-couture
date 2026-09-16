import { connectDB } from '@/lib/db';
import Coupon from '@/models/Coupon';
import type { ICoupon } from '@/models/Coupon';

export class CouponRepository {
  async findAll(): Promise<ICoupon[]> {
    await connectDB();
    return Coupon.find({}).sort({ createdAt: -1 }).lean<ICoupon[]>();
  }

  async findById(id: string): Promise<ICoupon | null> {
    await connectDB();
    return Coupon.findById(id).lean<ICoupon>();
  }

  async findByCode(code: string): Promise<ICoupon | null> {
    await connectDB();
    return Coupon.findOne({ code: code.toUpperCase().trim() }).lean<ICoupon>();
  }

  async create(data: Partial<ICoupon>): Promise<ICoupon> {
    await connectDB();
    const doc = await Coupon.create({ ...data, code: String(data.code).toUpperCase().trim() });
    return doc.toObject() as ICoupon;
  }

  async update(id: string, data: Partial<ICoupon>): Promise<ICoupon | null> {
    await connectDB();
    const payload = data.code ? { ...data, code: String(data.code).toUpperCase().trim() } : data;
    return Coupon.findByIdAndUpdate(id, payload, { new: true }).lean<ICoupon>();
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await Coupon.findByIdAndDelete(id);
    return !!result;
  }

  async recordUsage(code: string, userId?: string): Promise<void> {
    await connectDB();
    const update: Record<string, unknown> = { $inc: { usageCount: 1 } };
    if (userId) update.$push = { usedBy: userId };
    await Coupon.updateOne({ code: code.toUpperCase().trim() }, update);
  }
}

export const couponRepository = new CouponRepository();
