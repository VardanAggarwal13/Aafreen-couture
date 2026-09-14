import { productRepository } from '@/server/repositories/product.repository';
import { categoryRepository } from '@/server/repositories/category.repository';
import { AdminProductsClient } from '@/features/admin/components/AdminProductsClient';

export const metadata = { title: 'Products | Admin' };

export default async function AdminProductsPage() {
  const [{ items: products }, categories] = await Promise.all([
    productRepository.findMany({}, { page: 1, limit: 100 }),
    categoryRepository.findAll(true),
  ]);
  const serializedProducts = JSON.parse(JSON.stringify(products));
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return <AdminProductsClient initialProducts={serializedProducts} categories={serializedCategories} />;
}
