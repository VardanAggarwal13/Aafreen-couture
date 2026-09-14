import { CollectionForm } from '@/features/admin/components/CollectionForm';

export const metadata = { title: 'New Collection | Admin' };

export default function NewCollectionPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Create New Collection</h1>
        <p className="text-sm text-[#8A6A55] mt-1 font-sans">Curate a new bridal, seasonal, or thematic line</p>
      </div>
      <CollectionForm />
    </div>
  );
}
