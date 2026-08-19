import { notFound } from 'next/navigation';
import { collectionRepository } from '@/server/repositories/collection.repository';
import { CollectionForm } from '@/features/admin/components/CollectionForm';

export const metadata = { title: 'Edit Collection | Admin' };

interface Props { params: Promise<{ id: string }> }

export default async function EditCollectionPage({ params }: Props) {
  const { id } = await params;
  const collection = await collectionRepository.findById(id);
  if (!collection) notFound();

  const serialized = JSON.parse(JSON.stringify(collection));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Edit Collection</h1>
        <p className="text-xs text-white/40 mt-0.5">{collection.name}</p>
      </div>
      <CollectionForm collection={serialized} />
    </div>
  );
}
