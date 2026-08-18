import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import type { ICategory } from '@/models/Category';

export class CategoryRepository {
  async findAll(): Promise<ICategory[]> {
    await connectDB();
    return Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean<ICategory[]>();
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    await connectDB();
    return Category.findOne({ slug, isActive: true }).lean<ICategory>();
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
