import { reviewRepository, type PublicReview } from '@/server/repositories/review.repository';
import { AppError, ConflictError } from '@/lib/api-errors';

export interface ReviewEligibility {
  eligible: boolean;
  reason?: 'not_purchased' | 'already_reviewed';
}

export interface SubmitReviewInput {
  productId: string;
  rating: number;
  title: string;
  body: string;
}

/** "Priya Sharma" becomes "Priya S." so public reviews never expose a full name. */
function toDisplayName(name: string | null | undefined): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) return 'Verified Customer';
  const last = parts.length > 1 ? parts[parts.length - 1] : undefined;
  return last ? `${first} ${last.charAt(0).toUpperCase()}.` : first;
}

export class ReviewService {
  async getPublicReviews(productId: string): Promise<PublicReview[]> {
    return reviewRepository.findApprovedByProduct(productId);
  }

  async getRatingStats(productId: string): Promise<{ count: number; average: number }> {
    return reviewRepository.getStats(productId);
  }

  async getEligibility(userId: string, productId: string): Promise<ReviewEligibility> {
    if (await reviewRepository.hasReviewed(userId, productId)) {
      return { eligible: false, reason: 'already_reviewed' };
    }
    const orderId = await reviewRepository.findDeliveredOrderWithProduct(userId, productId);
    return orderId ? { eligible: true } : { eligible: false, reason: 'not_purchased' };
  }

  async submitReview(user: { id: string; name?: string | null }, input: SubmitReviewInput): Promise<void> {
    if (await reviewRepository.hasReviewed(user.id, input.productId)) {
      throw new ConflictError('You have already reviewed this product');
    }
    const orderId = await reviewRepository.findDeliveredOrderWithProduct(user.id, input.productId);
    if (!orderId) {
      throw new AppError('Only customers whose order has been delivered can review this product', 403, 'NOT_VERIFIED_BUYER');
    }
    await reviewRepository.create({
      product: input.productId,
      user: user.id,
      authorName: toDisplayName(user.name),
      order: orderId,
      rating: input.rating,
      title: input.title,
      body: input.body,
    });
  }
}

export const reviewService = new ReviewService();
