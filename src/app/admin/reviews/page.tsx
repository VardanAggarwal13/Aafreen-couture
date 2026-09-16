import { AdminReviewsClient } from '@/features/admin/components/AdminReviewsClient';
import { reviewRepository } from '@/server/repositories/review.repository';

export const metadata = { title: 'Reviews | Admin' };

export default async function AdminReviewsPage() {
  const reviews = await reviewRepository.findAllForAdmin();

  return <AdminReviewsClient reviews={reviews} />;
}
