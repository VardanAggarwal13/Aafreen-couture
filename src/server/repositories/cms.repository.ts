import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import CmsPage from '@/models/CmsPage';
import type { ICmsPage } from '@/models/CmsPage';

export class CmsRepository {
  async findAll(): Promise<ICmsPage[]> {
    await connectDB();
    return CmsPage.find({}).sort({ title: 1 }).lean<ICmsPage[]>();
  }

  async findById(id: string): Promise<ICmsPage | null> {
    await connectDB();
    const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
    return CmsPage.findOne(query).lean<ICmsPage>();
  }

  async findBySlug(slug: string): Promise<ICmsPage | null> {
    await connectDB();
    return CmsPage.findOne({ slug }).lean<ICmsPage>();
  }

  async create(data: Partial<ICmsPage>): Promise<ICmsPage> {
    await connectDB();
    const doc = await CmsPage.create(data);
    return doc.toObject() as ICmsPage;
  }

  async update(id: string, data: Partial<ICmsPage>): Promise<ICmsPage | null> {
    await connectDB();
    const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
    return CmsPage.findOneAndUpdate(query, data, { new: true }).lean<ICmsPage>();
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
    const result = await CmsPage.findOneAndDelete(query);
    return !!result;
  }
}

export const cmsRepository = new CmsRepository();
