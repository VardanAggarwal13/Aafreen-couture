import { z } from 'zod';

/** PATCH /api/admin/users/[id]: change the role and/or the editable profile details. */
export const adminUserUpdateSchema = z
  .object({
    role: z.enum(['admin', 'customer']).optional(),
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name is too long').optional(),
    phone: z
      .string()
      .trim()
      .max(20, 'Phone number is too long')
      .regex(/^[0-9+()\-\s]*$/, 'Phone can only contain digits, spaces, + ( ) -')
      .optional(),
  })
  .refine((v) => v.role !== undefined || v.name !== undefined || v.phone !== undefined, {
    message: 'Nothing to update',
  });

export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;

/** POST /api/admin/users: create an account (or change the role of an existing one). */
export const adminUserCreateSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name is too long'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address').max(120),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128).optional(),
  phone: z
    .string()
    .trim()
    .max(20, 'Phone number is too long')
    .regex(/^[0-9+()\-\s]*$/, 'Phone can only contain digits, spaces, + ( ) -')
    .optional(),
  role: z.enum(['admin', 'customer']).default('admin'),
});
