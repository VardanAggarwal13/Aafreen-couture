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
    filter: { role?: string },
    options: { limit?: number } = {}
  ): Promise<IUser[]> {
    await connectDB();
    const UserModel = getUserModel();
    const query: Record<string, unknown> = {};
    if (filter.role) query['role'] = filter.role;
    return UserModel.find(query)
      .limit(options.limit ?? 50)
      .sort({ createdAt: -1 })
      .lean() as Promise<IUser[]>;
  }

  async findById(id: string): Promise<IUser | null> {
    await connectDB();
    const UserModel = getUserModel();
    return UserModel.findById(id).lean() as Promise<IUser | null>;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    await connectDB();
    const UserModel = getUserModel();
    return UserModel.findOne({ email }).lean() as Promise<IUser | null>;
  }

  async updateRole(id: string, role: string): Promise<IUser | null> {
    await connectDB();
    const UserModel = getUserModel();
    return UserModel.findByIdAndUpdate(id, { role }, { new: true }).lean() as Promise<IUser | null>;
  }
}

export const userRepository = new UserRepository();
