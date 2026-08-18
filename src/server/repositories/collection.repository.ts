import { connectDB } from '@/lib/db';
import Collection from '@/models/Collection';
import type { ICollection } from '@/models/Collection';

export class CollectionRepository {
  async findAll(): Promise<ICollection[]> {
    await connectDB();
    return Collection.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean<ICollection[]>();
  }

  async findBySlug(slug: string): Promise<ICollection | null> {
    await connectDB();
    return Collection.findOne({ slug, isActive: true }).lean<ICollection>();
  }

  async findFeatured(): Promise<ICollection[]> {
    await connectDB();
    return Collection.find({ isActive: true, isFeatured: true }).sort({ sortOrder: 1 }).lean<ICollection[]>();
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
