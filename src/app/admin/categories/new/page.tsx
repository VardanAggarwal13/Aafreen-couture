import { CategoryForm } from '@/features/admin/components/CategoryForm';

export const metadata = { title: 'New Category | Admin' };

export default function NewCategoryPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-[#2E221C] tracking-wide">Create New Category</h1>
        <p className="text-sm text-[#8A6A55] mt-1 font-serif">Add a new product department to your catalogue</p>
      </div>
      <CategoryForm />
    </div>
  );
}
