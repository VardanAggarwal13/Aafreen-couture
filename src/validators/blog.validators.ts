import { z } from 'zod';

export const CreateBlogPostSchema = z.object({
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),
  title: z.string().min(2, 'Title is required'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.array(z.string().min(1)).min(1, 'Add at least one paragraph of content'),
  image: z.string().min(1, 'Cover image is required'),
  author: z.string().min(1, 'Author is required'),
  authorRole: z.string().min(1, 'Author role is required'),
  category: z.string().min(1, 'Category is required'),
  readTime: z.string().min(1, 'Read time is required'),
  publishedAt: z.string().min(1, 'Published date is required'),
  status: z.enum(['published', 'draft']).default('published'),
});

export const UpdateBlogPostSchema = CreateBlogPostSchema.partial();

export type CreateBlogPostInput = z.infer<typeof CreateBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof UpdateBlogPostSchema>;
