import mongoose, { Schema, model, models, type Document } from 'mongoose';

export type CouponType = 'percentage' | 'fixed' | 'free_shipping';

export interface ICoupon extends Document {
  code: string;
  type: CouponType;
  value: number;           // percentage (0-100) or paise for fixed
  minOrderValue: number;   // paise
  maxDiscountAmount?: number; // paise — cap for percentage coupons
  usageLimit?: number;
  usageCount: number;
  perUserLimit: number;
  usedBy: mongoose.Types.ObjectId[];
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percentage', 'fixed', 'free_shipping'], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    maxDiscountAmount: { type: Number, min: 0 },
    usageLimit: { type: Number, min: 1 },
    usageCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1, min: 1 },
    usedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

const Coupon = models.Coupon ?? model<ICoupon>('Coupon', CouponSchema);
export default Coupon;
