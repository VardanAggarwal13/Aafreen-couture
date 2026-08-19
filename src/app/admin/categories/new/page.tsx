import { CategoryForm } from '@/features/admin/components/CategoryForm';

export const metadata = { title: 'New Category | Admin' };

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Create New Category</h1>
        <p className="text-xs text-white/40 mt-0.5">Add a new product department to your catalogue</p>
      </div>
      <CategoryForm />
    </div>
  );
}
