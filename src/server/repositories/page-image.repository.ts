import { connectDB } from '@/lib/db';
import PageImage from '@/models/PageImage';

export interface PageImageRecord {
  key: string;
  image: string;
  focalX?: number;
  focalY?: number;
}

function toRecord(d: PageImageRecord): PageImageRecord {
  return { key: d.key, image: d.image, focalX: d.focalX, focalY: d.focalY };
}

export class PageImageRepository {
  async findAll(): Promise<PageImageRecord[]> {
    await connectDB();
    const docs = await PageImage.find({}).select('key image focalX focalY').lean<PageImageRecord[]>();
    return docs.map(toRecord);
  }

  async findByKey(key: string): Promise<PageImageRecord | null> {
    await connectDB();
    const doc = await PageImage.findOne({ key }).select('key image focalX focalY').lean<PageImageRecord>();
    return doc ? toRecord(doc) : null;
  }

  async upsert(key: string, image: string, focalX: number, focalY: number): Promise<PageImageRecord> {
    await connectDB();
    const doc = await PageImage.findOneAndUpdate(
      { key },
      { key, image, focalX, focalY },
      { returnDocument: 'after', upsert: true }
    ).lean<PageImageRecord>();
    return toRecord(doc!);
  }

  async remove(key: string): Promise<boolean> {
    await connectDB();
    const res = await PageImage.deleteOne({ key });
    return res.deletedCount > 0;
  }
}

export const pageImageRepository = new PageImageRepository();
