import mongoose, { Schema, model, models, type Document } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  variantId?: string;
  name: string;
  slug: string;
  image: string;
  size?: string;
  color?: string;
  price: number;      // paise — snapshot at time of add
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: String },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String, required: true },
  size: { type: String },
  color: { type: String },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1, max: 10 },
});

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

CartSchema.index({ user: 1 });

const Cart = models.Cart ?? model<ICart>('Cart', CartSchema);
export default Cart;
