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
        <h1 className="text-2xl font-serif text-[#2E221C] tracking-wide">Categories</h1>
        <p className="text-sm text-[#8A6A55] mt-1 font-serif">Curate & organize product departments</p>
      </div>
      <AdminCategoriesClient categories={serialized} />
    </div>
  );
}
