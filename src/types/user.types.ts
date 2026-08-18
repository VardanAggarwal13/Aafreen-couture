export type UserRole = 'customer' | 'admin' | 'manager';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAddress {
  _id: string;
  userId: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
