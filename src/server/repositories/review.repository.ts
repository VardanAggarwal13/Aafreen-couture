import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';
import type { IReview } from '@/models/Review';

export interface AdminReviewItem {
  _id: string;
  productName: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  isApproved: boolean;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export class ReviewRepository {
  async findAllForAdmin(): Promise<AdminReviewItem[]> {
    await connectDB();
    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .populate('product', 'name')
      .populate('user', 'name')
      .lean<(IReview & { product: { name?: string } | null; user: { name?: string } | null })[]>();

    return reviews.map((r) => ({
      _id: String(r._id),
      productName: r.product?.name ?? 'Unknown Product',
      authorName: r.user?.name ?? 'Anonymous',
      rating: r.rating,
      title: r.title,
      body: r.body,
      isApproved: r.isApproved,
      isVerifiedPurchase: r.isVerifiedPurchase,
      createdAt: (r as unknown as { createdAt: Date }).createdAt?.toISOString?.() ?? '',
    }));
  }

  async findById(id: string): Promise<IReview | null> {
    await connectDB();
    return Review.findById(id).lean<IReview>();
  }

  async setApproval(id: string, isApproved: boolean): Promise<IReview | null> {
    await connectDB();
    const updated = await Review.findByIdAndUpdate(id, { isApproved }, { new: true }).lean<IReview>();
    if (updated) await this.syncProductRating(String(updated.product));
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const doc = await Review.findByIdAndDelete(id);
    if (doc) await this.syncProductRating(String(doc.product));
    return !!doc;
  }

  private async syncProductRating(productId: string): Promise<void> {
    const approved = await Review.find({ product: productId, isApproved: true }).lean<IReview[]>();
    const reviewCount = approved.length;
    const averageRating = reviewCount > 0
      ? approved.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;
    await Product.findByIdAndUpdate(productId, { averageRating, reviewCount });
  }
}

export const reviewRepository = new ReviewRepository();
