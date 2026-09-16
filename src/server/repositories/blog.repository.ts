import { connectDB } from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import type { IBlogPost } from '@/models/BlogPost';
import { BLOG_POSTS as FALLBACK_BLOG_POSTS } from '@/data/blog.data';

export class BlogRepository {
  async findAllPublished(): Promise<IBlogPost[]> {
    try {
      await connectDB();
      const docs = await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 }).lean<IBlogPost[]>();
      if (docs.length > 0) return docs;
    } catch {
      // Fallback
    }
    return FALLBACK_BLOG_POSTS as unknown as IBlogPost[];
  }

  /**
   * Admin listing never falls back to the static seed data — those objects have no `_id`,
   * so edit/delete would silently fail. Returns whatever's actually in the database (which
   * may be empty until `npm run seed:blog` has been run).
   */
  async findAllForAdmin(): Promise<IBlogPost[]> {
    await connectDB();
    return BlogPost.find({}).sort({ createdAt: -1 }).lean<IBlogPost[]>();
  }

  async findBySlug(slug: string): Promise<IBlogPost | null> {
    try {
      await connectDB();
      const doc = await BlogPost.findOne({ slug, status: 'published' }).lean<IBlogPost>();
      if (doc) return doc;
    } catch {
      // Fallback
    }
    const found = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug);
    return (found as unknown as IBlogPost) ?? null;
  }

  async findById(id: string): Promise<IBlogPost | null> {
    await connectDB();
    return BlogPost.findById(id).lean<IBlogPost>();
  }

  async create(data: Partial<IBlogPost>): Promise<IBlogPost> {
    await connectDB();
    const doc = await BlogPost.create(data);
    return doc.toObject() as IBlogPost;
  }

  async update(id: string, data: Partial<IBlogPost>): Promise<IBlogPost | null> {
    await connectDB();
    return BlogPost.findByIdAndUpdate(id, data, { new: true }).lean<IBlogPost>();
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await BlogPost.findByIdAndDelete(id);
    return !!result;
  }
}

export const blogRepository = new BlogRepository();
