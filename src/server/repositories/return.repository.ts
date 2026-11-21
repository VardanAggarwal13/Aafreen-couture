import { ADMIN_LIST_CAP } from './list-limits';
import { connectDB } from '@/lib/db';
import Return from '@/models/Return';
import type { IReturn } from '@/models/Return';

export class ReturnRepository {
  async findAll(): Promise<IReturn[]> {
    await connectDB();
    return Return.find({}).sort({ createdAt: -1 }).limit(ADMIN_LIST_CAP).lean<IReturn[]>();
  }

  /** One page of return requests, newest first, plus the total for the pager. */
  async findPage(page: number, limit: number): Promise<{ items: IReturn[]; total: number }> {
    await connectDB();
    const [items, total] = await Promise.all([
      Return.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean<IReturn[]>(),
      Return.countDocuments({}),
    ]);
    return { items, total };
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
