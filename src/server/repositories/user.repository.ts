import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  phone?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

type UserDoc = IUser & mongoose.Document;

function getUserModel(): mongoose.Model<UserDoc> {
  if (mongoose.models['user']) {
    return mongoose.models['user'] as mongoose.Model<UserDoc>;
  }
  const UserSchema = new mongoose.Schema<UserDoc>(
    {
      name: String,
      email: { type: String, unique: true },
      emailVerified: Boolean,
      role: { type: String, default: 'customer' },
      phone: String,
      image: String,
    },
    { timestamps: true }
  );
  return mongoose.model<UserDoc>('user', UserSchema);
}

export class UserRepository {
  async findMany(
    filter: { role?: string; search?: string } = {},
    options: { limit?: number } = {}
  ): Promise<IUser[]> {
    await connectDB();
    const UserModel = getUserModel();
    const query: Record<string, unknown> = {};
    if (filter.role && filter.role !== 'all') {
      query['role'] = filter.role;
    }
    if (filter.search) {
      const s = filter.search.trim();
      query['$or'] = [
        { name: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { phone: { $regex: s, $options: 'i' } },
      ];
    }
    return UserModel.find(query)
      .limit(options.limit ?? 100)
      .sort({ createdAt: -1 })
      .lean() as Promise<IUser[]>;
  }

  async count(filter: { role?: string } = {}): Promise<number> {
    await connectDB();
    const UserModel = getUserModel();
    const query: Record<string, unknown> = {};
    if (filter.role && filter.role !== 'all') query['role'] = filter.role;
    return UserModel.countDocuments(query);
  }

  async findById(id: string): Promise<IUser | null> {
    await connectDB();
    const UserModel = getUserModel();
    return UserModel.findById(id).lean() as Promise<IUser | null>;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    await connectDB();
    const UserModel = getUserModel();
    return UserModel.findOne({ email: email.toLowerCase().trim() }).lean() as Promise<IUser | null>;
  }

  async updateRole(id: string, role: string): Promise<IUser | null> {
    await connectDB();
    const UserModel = getUserModel();
    return UserModel.findByIdAndUpdate(id, { role, updatedAt: new Date() }, { new: true }).lean() as Promise<IUser | null>;
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const UserModel = getUserModel();
    const res = await UserModel.findByIdAndDelete(id);
    return !!res;
  }
}

export const userRepository = new UserRepository();

