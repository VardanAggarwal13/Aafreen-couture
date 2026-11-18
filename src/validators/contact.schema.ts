import { z } from 'zod';

export const CONTACT_SUBJECTS = [
  'Order Enquiry',
  'Customisation Request',
  'Return / Refund',
  'Shipping Query',
  'General Question',
] as const;

/** Shared by the contact form (client) and POST /api/contact (server). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80, 'Name is too long'),
  email: z.string().trim().email('Enter a valid email address').max(120),
  phone: z
    .string()
    .trim()
    .max(20, 'Phone number is too long')
    .regex(/^[0-9+()\-\s]*$/, 'Use digits, spaces, + or - only')
    .optional()
    .or(z.literal('')),
  subject: z.enum(CONTACT_SUBJECTS, { message: 'Please select a subject' }),
  message: z.string().trim().min(10, 'Please write at least 10 characters').max(2000, 'Message is too long'),
  /** Honeypot: real visitors never see or fill this. */
  website: z.string().max(0).optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;
