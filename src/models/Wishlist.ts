import mongoose, { Schema, model, models, type Document } from 'mongoose';

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

WishlistSchema.index({ user: 1 });

const Wishlist = models.Wishlist ?? model<IWishlist>('Wishlist', WishlistSchema);
export default Wishlist;
