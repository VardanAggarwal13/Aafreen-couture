import { notFound } from 'next/navigation';
import { categoryRepository } from '@/server/repositories/category.repository';
import { CategoryForm } from '@/features/admin/components/CategoryForm';

export const metadata = { title: 'Edit Category | Admin' };

interface Props { params: Promise<{ id: string }> }

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await categoryRepository.findById(id);
  if (!category) notFound();

  const serialized = JSON.parse(JSON.stringify(category));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Edit Category</h1>
        <p className="text-xs text-white/40 mt-0.5">{category.name}</p>
      </div>
      <CategoryForm category={serialized} />
    </div>
  );
}
