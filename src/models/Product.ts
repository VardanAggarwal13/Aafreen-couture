import mongoose, { Schema, model, models, type Document } from 'mongoose';

export interface IProductVariant {
  _id?: mongoose.Types.ObjectId;
  size?: string;
  color?: string;
  colorHex?: string;
  material?: string;
  sku: string;
  price: number;       // paise
  comparePrice?: number; // paise
  stock: number;
  images: string[];
  isActive: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: mongoose.Types.ObjectId;
  collectionRef?: mongoose.Types.ObjectId;
  images: string[];
  variants: IProductVariant[];
  basePrice: number;       // paise — lowest variant price
  comparePrice?: number;   // paise — for "was ₹X" display
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  careInstructions?: string;
  fabric?: string;
  occasion?: string[];
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>({
  size: { type: String },
  color: { type: String },
  colorHex: { type: String },
  material: { type: String },
  sku: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, min: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    collectionRef: { type: Schema.Types.ObjectId, ref: 'Collection' },
    images: [{ type: String }],
    variants: [ProductVariantSchema],
    basePrice: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    tags: [{ type: String, lowercase: true }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    careInstructions: { type: String },
    fabric: { type: String },
    occasion: [{ type: String }],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ collectionRef: 1, isActive: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ isNewArrival: 1, isActive: 1 });
ProductSchema.index({ isBestSeller: 1, isActive: 1 });
ProductSchema.index({ basePrice: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = models.Product ?? model<IProduct>('Product', ProductSchema);
export default Product;
