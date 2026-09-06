import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import type { ICategory } from '@/models/Category';
import { FALLBACK_CATEGORIES } from '@/data/products.data';

export class CategoryRepository {
  async findAll(includeInactive = false): Promise<ICategory[]> {
    try {
      await connectDB();
      const query = includeInactive ? {} : { isActive: true };
      const docs = await Category.find(query).sort({ sortOrder: 1, name: 1 }).lean<ICategory[]>();
      if (docs.length > 0) return docs;
    } catch {
      // Fallback
    }
    return (includeInactive
      ? FALLBACK_CATEGORIES
      : FALLBACK_CATEGORIES.filter((c) => c.isActive)) as unknown as ICategory[];
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    try {
      await connectDB();
      const doc = await Category.findOne({ slug, isActive: true }).lean<ICategory>();
      if (doc) return doc;
    } catch {
      // Fallback
    }
    const found = FALLBACK_CATEGORIES.find((c) => c.slug === slug);
    return (found as unknown as ICategory) ?? null;
  }

  async findById(id: string): Promise<ICategory | null> {
    try {
      await connectDB();
      const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
      const doc = await Category.findOne(query).lean<ICategory>();
      if (doc) return doc;
    } catch {
      // Fallback
    }
    const found = FALLBACK_CATEGORIES.find((c) => c._id === id || c.slug === id);
    return (found as unknown as ICategory) ?? null;
  }

  async create(data: Partial<ICategory>): Promise<ICategory> {
    await connectDB();
    const doc = await Category.create(data);
    return doc.toObject() as ICategory;
  }

  async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    await connectDB();
    const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
    return Category.findOneAndUpdate(query, data, { new: true }).lean<ICategory>();
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
    const result = await Category.findOneAndDelete(query);
    return !!result;
  }
}

export const categoryRepository = new CategoryRepository();
