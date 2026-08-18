import type { Metadata } from 'next';
import { ProductForm } from '@/features/admin/components/ProductForm';

export const metadata: Metadata = { title: 'New Product | Admin' };

export default function NewProductPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-serif text-white">Add New Product</h1>
        <p className="text-sm text-white/50 mt-1">Create a new product listing</p>
      </div>
      <ProductForm />
    </div>
  );
}
