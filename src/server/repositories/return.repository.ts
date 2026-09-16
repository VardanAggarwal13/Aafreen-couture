import { connectDB } from '@/lib/db';
import Return from '@/models/Return';
import type { IReturn } from '@/models/Return';

export class ReturnRepository {
  async findAll(): Promise<IReturn[]> {
    await connectDB();
    return Return.find({}).sort({ createdAt: -1 }).lean<IReturn[]>();
  }

  async findById(id: string): Promise<IReturn | null> {
    await connectDB();
    return Return.findById(id).lean<IReturn>();
  }

  async create(data: Partial<IReturn>): Promise<IReturn> {
    await connectDB();
    const doc = await Return.create(data);
    return doc.toObject() as IReturn;
  }

  async update(id: string, data: Partial<IReturn>): Promise<IReturn | null> {
    await connectDB();
    return Return.findByIdAndUpdate(id, data, { new: true }).lean<IReturn>();
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await Return.findByIdAndDelete(id);
    return !!result;
  }
}

export const returnRepository = new ReturnRepository();
