import { connectDB } from '@/lib/db';
import Collection from '@/models/Collection';
import type { ICollection } from '@/models/Collection';
import { FALLBACK_COLLECTIONS } from '@/data/products.data';

export class CollectionRepository {
  async findAll(): Promise<ICollection[]> {
    try {
      await connectDB();
      const docs = await Collection.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean<ICollection[]>();
      if (docs.length > 0) return docs;
    } catch {
      // Fallback
    }
    return FALLBACK_COLLECTIONS as unknown as ICollection[];
  }

  async findBySlug(slug: string): Promise<ICollection | null> {
    try {
      await connectDB();
      const doc = await Collection.findOne({ slug, isActive: true }).lean<ICollection>();
      if (doc) return doc;
    } catch {
      // Fallback
    }
    const found = FALLBACK_COLLECTIONS.find((c) => c.slug === slug);
    return (found as unknown as ICollection) ?? null;
  }

  async findFeatured(): Promise<ICollection[]> {
    try {
      await connectDB();
      const docs = await Collection.find({ isActive: true, isFeatured: true }).sort({ sortOrder: 1 }).lean<ICollection[]>();
      if (docs.length > 0) return docs;
    } catch {
      // Fallback
    }
    return FALLBACK_COLLECTIONS.filter((c) => c.isFeatured && c.isActive) as unknown as ICollection[];
  }

  async create(data: Partial<ICollection>): Promise<ICollection> {
    await connectDB();
    const doc = await Collection.create(data);
    return doc.toObject() as ICollection;
  }

  async update(id: string, data: Partial<ICollection>): Promise<ICollection | null> {
    await connectDB();
    return Collection.findByIdAndUpdate(id, data, { new: true }).lean<ICollection>();
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await Collection.findByIdAndDelete(id);
    return !!result;
  }
}

export const collectionRepository = new CollectionRepository();
