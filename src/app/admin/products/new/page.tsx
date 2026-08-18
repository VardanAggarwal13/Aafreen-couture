import type { Metadata } from 'next';
import { ProductForm } from '@/features/admin/components/ProductForm';

export const metadata: Metadata = { title: 'Add New Product | Admin' };

export default function NewProductPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Add New Product</h1>
        <p className="text-xs text-white/40 mt-0.5">Create a new couture ensemble with variants, pricing, and imagery</p>
      </div>
      <ProductForm />
    </div>
  );
}
