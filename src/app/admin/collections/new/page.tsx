import { CollectionForm } from '@/features/admin/components/CollectionForm';

export const metadata = { title: 'New Collection | Admin' };

export default function NewCollectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Create New Collection</h1>
        <p className="text-xs text-white/40 mt-0.5">Curate a new bridal, seasonal, or thematic line</p>
      </div>
      <CollectionForm />
    </div>
  );
}
