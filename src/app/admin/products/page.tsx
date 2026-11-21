import { redirect } from 'next/navigation';
import { productRepository } from '@/server/repositories/product.repository';
import { categoryRepository } from '@/server/repositories/category.repository';
import { AdminProductsClient } from '@/features/admin/components/AdminProductsClient';
import { pageHref, readPageParams } from '@/features/admin/lib/pagination';

export const metadata = { title: 'Products | Admin' };

interface Props {
  searchParams: Promise<{ page?: string; limit?: string; q?: string; category?: string; status?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { page, limit } = readPageParams(sp, 20);
  const query = (sp.q ?? '').trim().slice(0, 100);
  const categorySlug = (sp.category ?? '').trim().slice(0, 100);
  const status = sp.status === 'active' || sp.status === 'inactive' ? sp.status : '';

  const [{ items, total }, categories, overallTotal] = await Promise.all([
    productRepository.findAdminPage({ q: query, categorySlug, status, page, limit }),
    categoryRepository.findAll(true),
    productRepository.countAll(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (page > totalPages) {
    redirect(pageHref('/admin/products', { q: query, category: categorySlug, status, limit: limit === 20 ? undefined : limit }, totalPages));
  }

  return (
    <AdminProductsClient
      initialProducts={JSON.parse(JSON.stringify(items))}
      categories={JSON.parse(JSON.stringify(categories))}
      total={total}
      overallTotal={overallTotal}
      page={page}
      limit={limit}
      query={query}
      categorySlug={categorySlug}
      status={status}
    />
  );
}
