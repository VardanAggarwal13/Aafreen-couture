import { z } from 'zod';

export const CreateCouponSchema = z.object({
  code: z.string().min(3).max(30).regex(/^[A-Za-z0-9_-]+$/, 'Use letters, numbers, - or _ only'),
  type: z.enum(['percentage', 'fixed', 'free_shipping']),
  value: z.number().int().min(0),
  minOrderValue: z.number().int().min(0).default(0),
  maxDiscountAmount: z.number().int().min(0).optional(),
  usageLimit: z.number().int().min(1).optional(),
  perUserLimit: z.number().int().min(1).default(1),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
});

export const UpdateCouponSchema = CreateCouponSchema.partial();

export const ValidateCouponSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().int().min(0),
});

export type CreateCouponInput = z.infer<typeof CreateCouponSchema>;
export type UpdateCouponInput = z.infer<typeof UpdateCouponSchema>;
