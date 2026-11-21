import { redirect } from 'next/navigation';
import { AdminReviewsClient, type ReviewStatusFilter } from '@/features/admin/components/AdminReviewsClient';
import { reviewRepository } from '@/server/repositories/review.repository';
import { pageHref, readPageParams } from '@/features/admin/lib/pagination';

export const metadata = { title: 'Reviews | Admin' };

interface Props {
  searchParams: Promise<{ page?: string; limit?: string; status?: string }>;
}

export default async function AdminReviewsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { page, limit } = readPageParams(sp, 20);
  const status: ReviewStatusFilter = sp.status === 'pending' || sp.status === 'approved' ? sp.status : 'all';

  const { items, total, counts } = await reviewRepository.findPageForAdmin({ status, page, limit });
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (page > totalPages) {
    redirect(pageHref('/admin/reviews', { status: status === 'all' ? undefined : status, limit: limit === 20 ? undefined : limit }, totalPages));
  }

  return <AdminReviewsClient reviews={items} status={status} counts={counts} page={page} limit={limit} total={total} />;
}
