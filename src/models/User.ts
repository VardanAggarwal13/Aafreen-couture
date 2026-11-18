import { Schema, model, models, type Model } from 'mongoose';

export interface IUserDoc {
  name?: string;
  email: string;
  emailVerified?: boolean;
  role: string;
  phone?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Account model. Better Auth keeps accounts in the singular "user" collection, so the collection
 * name is pinned here (Mongoose would otherwise pluralise it to the empty "users"). It is registered
 * as "User" because other models (Order, Cart, Wishlist, Coupon) reference it with `ref: 'User'`,
 * which populate() needs in order to attach customer names.
 */
const UserSchema = new Schema<IUserDoc>(
  {
    name: String,
    email: { type: String, unique: true },
    emailVerified: Boolean,
    role: { type: String, default: 'customer' },
    phone: String,
    image: String,
  },
  { timestamps: true, collection: 'user' }
);

const User: Model<IUserDoc> = (models.User as Model<IUserDoc>) ?? model<IUserDoc>('User', UserSchema);

export default User;
