import { z } from 'zod';

export const CreateBannerSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional(),
  image: z.string().min(1),
  mobileImage: z.string().optional(),
  link: z.string().optional(),
  position: z.enum(['hero', 'category', 'popup', 'strip']),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  validFrom: z.coerce.date().optional(),
  validUntil: z.coerce.date().optional(),
});

export const UpdateBannerSchema = CreateBannerSchema.partial();

export type CreateBannerInput = z.infer<typeof CreateBannerSchema>;
export type UpdateBannerInput = z.infer<typeof UpdateBannerSchema>;
