import { AdminReturnsClient } from '@/features/admin/components/AdminReturnsClient';
import { returnRepository } from '@/server/repositories/return.repository';

export const metadata = { title: 'Returns & Exchanges | Admin' };

export default async function AdminReturnsPage() {
  const returns = await returnRepository.findAll();
  const serialized = JSON.parse(JSON.stringify(returns));

  return <AdminReturnsClient returns={serialized} />;
}
