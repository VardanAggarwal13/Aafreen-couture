/**
 * Seeds the BlogPost collection with the current live journal articles (previously
 * hardcoded in src/data/blog.data.ts), so the new Admin > Blog editor and the live
 * /blog pages start with real, DB-backed content instead of an empty list.
 *
 * Idempotent — safe to re-run; upserts by slug and never touches other collections.
 *
 * Run: npx tsx scripts/seed-blog.ts
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { BLOG_POSTS } from '../src/data/blog.data';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI not set in .env.local');

const BlogPostSchema = new mongoose.Schema(
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

const BlogPost = mongoose.models.BlogPost ?? mongoose.model('BlogPost', BlogPostSchema);

async function main() {
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected to MongoDB');

  for (const post of BLOG_POSTS) {
    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      { $set: { ...post, status: 'published' } },
      { upsert: true, new: true }
    );
    console.log(`Upserted blog post: ${post.slug}`);
  }

  console.log(`Done — seeded ${BLOG_POSTS.length} blog posts.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
