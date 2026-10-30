import mongoose, { Schema, model, models, type Document } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId | string;
  authorName: string;
  order: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  body: string;
  images: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    // Better Auth user ids are plain strings in some collections, so don't force ObjectId.
    user: { type: Schema.Types.Mixed, required: true },
    authorName: { type: String, trim: true, maxlength: 80, default: 'Verified Customer' },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    body: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    images: [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, isApproved: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true });

const Review = models.Review ?? model<IReview>('Review', ReviewSchema);
export default Review;
