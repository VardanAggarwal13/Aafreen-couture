import type { Metadata } from 'next';
import { AdminCollectionsClient } from '@/features/admin/components/AdminCollectionsClient';
import { collectionRepository } from '@/server/repositories/collection.repository';

export const metadata: Metadata = { title: 'Collections | Admin' };

export default async function AdminCollectionsPage() {
  const cols = await collectionRepository.findAll(true);
  const serialized = JSON.parse(JSON.stringify(cols));

  return (
    <div>
      <div className="mb-3">
        <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Collections</h1>
        <p className="text-sm text-[#8A6A55] mt-1 font-sans">Manage curated product lines & lookbooks</p>
      </div>
      <AdminCollectionsClient collections={serialized} />
    </div>
  );
}
