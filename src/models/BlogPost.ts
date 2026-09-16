import { Schema, model, models, type Document } from 'mongoose';

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
  publishedAt: string;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    content: [{ type: String, required: true }],
    image: { type: String, required: true },
    author: { type: String, required: true },
    authorRole: { type: String, required: true },
    category: { type: String, required: true },
    readTime: { type: String, required: true },
    publishedAt: { type: String, required: true },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

BlogPostSchema.index({ status: 1, createdAt: -1 });

const BlogPost = models.BlogPost ?? model<IBlogPost>('BlogPost', BlogPostSchema);
export default BlogPost;
