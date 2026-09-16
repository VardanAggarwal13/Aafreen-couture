import { connectDB } from '@/lib/db';
import Banner from '@/models/Banner';
import type { IBanner } from '@/models/Banner';

export class BannerRepository {
  async findAll(): Promise<IBanner[]> {
    await connectDB();
    return Banner.find({}).sort({ position: 1, sortOrder: 1 }).lean<IBanner[]>();
  }

  async findById(id: string): Promise<IBanner | null> {
    await connectDB();
    return Banner.findById(id).lean<IBanner>();
  }

  async create(data: Partial<IBanner>): Promise<IBanner> {
    await connectDB();
    const doc = await Banner.create(data);
    return doc.toObject() as IBanner;
  }

  async update(id: string, data: Partial<IBanner>): Promise<IBanner | null> {
    await connectDB();
    return Banner.findByIdAndUpdate(id, data, { new: true }).lean<IBanner>();
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await Banner.findByIdAndDelete(id);
    return !!result;
  }
}

export const bannerRepository = new BannerRepository();
