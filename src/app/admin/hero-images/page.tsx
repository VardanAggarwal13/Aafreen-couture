import type { Metadata } from 'next';
import { AdminHeroImagesClient } from '@/features/admin/components/AdminHeroImagesClient';
import { listHeroImages } from '@/server/services/hero-image.service';

export const metadata: Metadata = { title: 'Hero Images | Admin Atelier' };
export const dynamic = 'force-dynamic';

export default async function AdminHeroImagesPage() {
  const items = await listHeroImages();
  return <AdminHeroImagesClient initialItems={JSON.parse(JSON.stringify(items))} />;
}
