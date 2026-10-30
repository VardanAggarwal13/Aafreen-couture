import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';
import Order from '@/models/Order';
import mongoose from 'mongoose';
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

export interface PublicReview {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
}

function toPublic(r: IReview): PublicReview {
  return {
    id: String(r._id),
    authorName: r.authorName || 'Verified Customer',
    rating: r.rating,
    title: r.title,
    body: r.body,
    createdAt: (r.createdAt as unknown as Date)?.toISOString?.() ?? '',
    isVerifiedPurchase: r.isVerifiedPurchase,
  };
}

function userMatch(userId: string): Record<string, unknown>[] {
  const conditions: Record<string, unknown>[] = [{ user: userId }];
  if (mongoose.isValidObjectId(userId)) conditions.push({ user: new mongoose.Types.ObjectId(userId) });
  return conditions;
}

export class ReviewRepository {
  async findApprovedByProduct(productId: string, limit = 20): Promise<PublicReview[]> {
    await connectDB();
    if (!mongoose.isValidObjectId(productId)) return [];
    const docs = await Review.find({ product: productId, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<IReview[]>();
    return docs.map(toPublic);
  }

  /** Rating summary computed from approved reviews only, never from stored product fields. */
  async getStats(productId: string): Promise<{ count: number; average: number }> {
    await connectDB();
    if (!mongoose.isValidObjectId(productId)) return { count: 0, average: 0 };
    const [row] = await Review.aggregate<{ count: number; average: number }>([
      { $match: { product: new mongoose.Types.ObjectId(productId), isApproved: true } },
      { $group: { _id: null, count: { $sum: 1 }, average: { $avg: '$rating' } } },
    ]);
    return row ? { count: row.count, average: Math.round(row.average * 10) / 10 } : { count: 0, average: 0 };
  }

  async findLatestApproved(
    minRating: number,
    limit: number
  ): Promise<(PublicReview & { productName: string; productSlug: string })[]> {
    await connectDB();
    const docs = await Review.find({ isApproved: true, rating: { $gte: minRating } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('product', 'name slug')
      .lean<(IReview & { product: { name?: string; slug?: string } | null })[]>();
    return docs
      .filter((d) => d.product?.slug)
      .map((d) => ({ ...toPublic(d), productName: d.product?.name ?? '', productSlug: d.product?.slug ?? '' }));
  }

  /** A delivered order for this user that contains the product, if any. */
  async findDeliveredOrderWithProduct(userId: string, productId: string): Promise<string | null> {
    await connectDB();
    if (!mongoose.isValidObjectId(productId)) return null;
    const order = await Order.findOne({
      $or: userMatch(userId),
      status: 'delivered',
      'items.product': { $in: [productId, new mongoose.Types.ObjectId(productId)] },
    })
      .select('_id')
      .sort({ createdAt: -1 })
      .lean<{ _id: mongoose.Types.ObjectId }>();
    return order ? String(order._id) : null;
  }

  async hasReviewed(userId: string, productId: string): Promise<boolean> {
    await connectDB();
    if (!mongoose.isValidObjectId(productId)) return false;
    return !!(await Review.exists({ product: productId, $or: userMatch(userId) }));
  }

  async create(data: {
    product: string;
    user: string;
    authorName: string;
    order: string;
    rating: number;
    title: string;
    body: string;
  }): Promise<IReview> {
    await connectDB();
    // New reviews wait for admin approval before they are public or count toward the rating.
    return Review.create({ ...data, isVerifiedPurchase: true, isApproved: false });
  }
  async findAllForAdmin(): Promise<AdminReviewItem[]> {
    await connectDB();
    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .populate('product', 'name')
      .lean<(IReview & { product: { name?: string } | null })[]>();

    return reviews.map((r) => ({
      _id: String(r._id),
      productName: r.product?.name ?? 'Unknown Product',
      authorName: r.authorName ?? 'Anonymous',
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
