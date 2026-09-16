import { z } from 'zod';

export const CreateReturnSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  productName: z.string().min(1, 'Product name is required'),
  quantity: z.number().int('Quantity must be a whole number').min(1, 'Quantity must be at least 1'),
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
  refundAmount: z.number().int('Refund amount must be a whole number').min(0, 'Refund amount cannot be negative'),
});

export const UpdateReturnSchema = z.object({
  status: z.enum(['under_review', 'approved', 'rejected', 'refunded']).optional(),
  adminNote: z.string().optional(),
});

export type CreateReturnInput = z.infer<typeof CreateReturnSchema>;
export type UpdateReturnInput = z.infer<typeof UpdateReturnSchema>;
