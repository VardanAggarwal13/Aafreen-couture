import { z } from 'zod';

export const AddressSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  line1: z.string().min(5).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  country: z.string().min(1),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
});

export const CreateOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().optional(),
      quantity: z.number().int().min(1).max(10),
    })
  ).min(1),
  shippingAddress: AddressSchema,
  paymentMethod: z.enum(['razorpay', 'cod']),
  couponCode: z.string().optional(),
});

export const VerifyPaymentSchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type AddressInput = z.infer<typeof AddressSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
