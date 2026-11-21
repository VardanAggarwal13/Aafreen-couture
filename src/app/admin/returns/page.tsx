import { redirect } from 'next/navigation';
import { AdminReturnsClient } from '@/features/admin/components/AdminReturnsClient';
import { returnRepository } from '@/server/repositories/return.repository';
import { pageHref, readPageParams } from '@/features/admin/lib/pagination';

export const metadata = { title: 'Returns & Exchanges | Admin' };

interface Props {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function AdminReturnsPage({ searchParams }: Props) {
  const { page, limit } = readPageParams(await searchParams, 20);
  const { items, total } = await returnRepository.findPage(page, limit);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (page > totalPages) redirect(pageHref('/admin/returns', { limit: limit === 20 ? undefined : limit }, totalPages));

  const serialized = JSON.parse(JSON.stringify(items));
  return <AdminReturnsClient returns={serialized} page={page} limit={limit} total={total} />;
}
