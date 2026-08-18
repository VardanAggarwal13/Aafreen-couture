import type { Metadata } from 'next';
import { AdminCategoriesClient } from '@/features/admin/components/AdminCategoriesClient';
import { categoryRepository } from '@/server/repositories/category.repository';

export const metadata: Metadata = { title: 'Categories | Admin' };

export default async function AdminCategoriesPage() {
  const categories = await categoryRepository.findAll();
  const serialized = JSON.parse(JSON.stringify(categories));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-serif text-white">Categories</h1>
        <p className="text-sm text-white/50 mt-0.5">Manage product categories</p>
      </div>
      <AdminCategoriesClient categories={serialized} />
    </div>
  );
}
