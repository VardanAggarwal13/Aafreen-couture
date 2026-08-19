import { productRepository } from '@/server/repositories/product.repository';
import { AdminProductsClient } from '@/features/admin/components/AdminProductsClient';

export const metadata = { title: 'Products | Admin' };

export default async function AdminProductsPage() {
  const { items: products } = await productRepository.findMany({}, { page: 1, limit: 100 });
  const serialized = JSON.parse(JSON.stringify(products));

  return <AdminProductsClient initialProducts={serialized} />;
}
