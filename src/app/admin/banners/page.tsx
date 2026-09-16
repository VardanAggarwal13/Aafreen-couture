import { AdminBannersClient } from '@/features/admin/components/AdminBannersClient';
import { bannerRepository } from '@/server/repositories/banner.repository';

export const metadata = { title: 'Banners | Admin' };

export default async function AdminBannersPage() {
  const banners = await bannerRepository.findAll();
  const serialized = JSON.parse(JSON.stringify(banners));

  return <AdminBannersClient banners={serialized} />;
}
