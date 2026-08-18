import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import type { ICategory } from '@/models/Category';
import { FALLBACK_CATEGORIES } from '@/data/products.data';

export class CategoryRepository {
  async findAll(): Promise<ICategory[]> {
    try {
      await connectDB();
      const docs = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean<ICategory[]>();
      if (docs.length > 0) return docs;
    } catch {
      // Fallback
    }
    return FALLBACK_CATEGORIES as unknown as ICategory[];
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

  async create(data: Partial<ICategory>): Promise<ICategory> {
    await connectDB();
    const doc = await Category.create(data);
    return doc.toObject() as ICategory;
  }

  async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    await connectDB();
    return Category.findByIdAndUpdate(id, data, { new: true }).lean<ICategory>();
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await Category.findByIdAndDelete(id);
    return !!result;
  }
}

export const categoryRepository = new CategoryRepository();
