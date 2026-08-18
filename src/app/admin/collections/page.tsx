import type { Metadata } from 'next';
import { AdminCollectionsClient } from '@/features/admin/components/AdminCollectionsClient';
import { collectionRepository } from '@/server/repositories/collection.repository';

export const metadata: Metadata = { title: 'Collections | Admin' };

export default async function AdminCollectionsPage() {
  const cols = await collectionRepository.findAll();
  const serialized = JSON.parse(JSON.stringify(cols));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-serif text-white">Collections</h1>
        <p className="text-sm text-white/50 mt-0.5">Manage curated product collections</p>
      </div>
      <AdminCollectionsClient collections={serialized} />
    </div>
  );
}
