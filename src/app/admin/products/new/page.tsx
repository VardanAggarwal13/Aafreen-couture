import type { Metadata } from 'next';
import { ProductForm } from '@/features/admin/components/ProductForm';

export const metadata: Metadata = { title: 'Add New Product | Admin' };

export default function NewProductPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-[#2E221C] tracking-wide">Add New Product</h1>
        <p className="text-sm text-[#8A6A55] mt-1 font-serif">Create a new couture ensemble with variants, bespoke tailoring, and imagery</p>
      </div>
      <ProductForm />
    </div>
  );
}
