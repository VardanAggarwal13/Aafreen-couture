import { z } from 'zod';
import { HERO_SLOT_KEYS } from '@/config/hero-images.config';

/** Only images hosted on our Cloudinary account may be used, so a bad URL cannot be saved. */
const cloudinaryUrl = z
  .string()
  .trim()
  .url('Enter a valid image URL')
  .refine((u) => u.startsWith('https://res.cloudinary.com/'), 'Image must be uploaded through the uploader');

const percent = z.number().min(0, 'Focal point must be between 0 and 100').max(100, 'Focal point must be between 0 and 100');

export const heroImageUpdateSchema = z.object({
  key: z.enum(HERO_SLOT_KEYS),
  image: cloudinaryUrl,
  focalX: percent,
  focalY: percent,
});

export const heroImageResetSchema = z.object({
  key: z.enum(HERO_SLOT_KEYS),
});
