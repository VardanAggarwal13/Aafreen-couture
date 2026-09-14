import type { Metadata } from 'next';
import { productRepository } from '@/server/repositories/product.repository';
import { ProductForm } from '@/features/admin/components/ProductForm';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Edit Product | Admin' };

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await productRepository.findById(id);
  if (!product) notFound();

  const serialized = JSON.parse(JSON.stringify(product));

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Edit Product</h1>
        <p className="text-sm text-[#8A6A55] mt-1 font-sans">{product.name}</p>
      </div>
      <ProductForm product={serialized} />
    </div>
  );
}
