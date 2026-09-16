import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100).regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int('Sort order must be a whole number').default(0),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export const CreateCollectionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100).regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),
  description: z.string().optional(),
  image: z.string().optional(),
  bannerImage: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int('Sort order must be a whole number').default(0),
});

export const UpdateCollectionSchema = CreateCollectionSchema.partial();
