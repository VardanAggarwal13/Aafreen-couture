import { z } from 'zod';

export const CreateCmsPageSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(150),
  route: z.string().min(1).max(150).regex(/^\//, 'Route must start with /'),
  heroBadge: z.string().max(150).optional(),
  heroTitle: z.string().min(2).max(200),
  heroItalicTitle: z.string().max(150).optional(),
  heroSubtitle: z.string().min(2).max(500),
  heroMetaInfo: z.string().max(300).optional(),
  status: z.enum(['published', 'draft']).default('published'),
});

export const UpdateCmsPageSchema = CreateCmsPageSchema.partial();
