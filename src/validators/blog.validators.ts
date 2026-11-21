import { z } from 'zod';
import { sanitizeBlogHtml, htmlToParagraphs } from '@/lib/blog-html';

/** Largest article body accepted (HTML, in characters): roughly 40,000 words, far beyond any real article. */
const MAX_CONTENT_HTML = 300_000;

const blogFields = z.object({
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),
  title: z.string().min(2, 'Title is required'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  /** Plain paragraphs (how articles were first stored). Derived automatically when formatted content is sent. */
  content: z.array(z.string().min(1)).optional(),
  /** The formatted article body from the rich-text editor. It is sanitized here, never stored as received. */
  contentHtml: z.string().max(MAX_CONTENT_HTML, 'The article is too long').optional(),
  image: z.string().min(1, 'Cover image is required'),
  author: z.string().min(1, 'Author is required'),
  authorRole: z.string().min(1, 'Author role is required'),
  category: z.string().min(1, 'Category is required'),
  readTime: z.string().min(1, 'Read time is required'),
  publishedAt: z.string().min(1, 'Published date is required'),
  status: z.enum(['published', 'draft']),
});

type BlogFieldsInput = z.infer<typeof blogFields>;
type PartialBlogFields = Partial<BlogFieldsInput>;

/**
 * Cleans the formatted body and keeps the plain paragraphs in step with it.
 * `requireContent` is true when creating (an article needs a body) and false for partial updates.
 */
function finalizeContent<T extends PartialBlogFields>(data: T, ctx: z.RefinementCtx, requireContent: boolean): T & { content?: string[] } {
  if (data.contentHtml !== undefined) {
    const html = sanitizeBlogHtml(data.contentHtml);
    const paragraphs = htmlToParagraphs(html);
    if (paragraphs.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['contentHtml'], message: 'Add some content for the article' });
      return z.NEVER;
    }
    return { ...data, contentHtml: html, content: paragraphs };
  }
  if (requireContent && (!data.content || data.content.length === 0)) {
    ctx.addIssue({ code: 'custom', path: ['content'], message: 'Add some content for the article' });
    return z.NEVER;
  }
  return data;
}

export const CreateBlogPostSchema = blogFields
  .extend({ status: blogFields.shape.status.default('published') })
  .transform((data, ctx) => finalizeContent(data, ctx, true) as Omit<typeof data, 'content'> & { content: string[] });

export const UpdateBlogPostSchema = blogFields
  .partial()
  .transform((data, ctx) => finalizeContent(data, ctx, false));

export type CreateBlogPostInput = z.output<typeof CreateBlogPostSchema>;
export type UpdateBlogPostInput = z.output<typeof UpdateBlogPostSchema>;
