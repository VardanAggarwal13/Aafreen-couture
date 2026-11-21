'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit2, ExternalLink, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { InventoryProductModal, type InventoryProduct } from '@/features/admin/components/InventoryProductModal';
import { AdminPagination } from '@/features/admin/components/AdminPagination';
import { AdminUrlSearch, AdminUrlSelect } from '@/features/admin/components/AdminUrlFilters';
import { ADMIN_PAGE_SIZES, pageHref } from '@/features/admin/lib/pagination';

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  category?: { name?: string; slug?: string } | string;
  basePrice: number;
  isActive: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  comparePrice?: number;
  images?: string[];
  description?: string;
  shortDescription?: string;
  fabric?: string;
  workType?: string;
  occasion?: string[] | string;
  tags?: string[];
  soldCount?: number;
  variants?: Array<{ stock: number; sku?: string; size?: string; color?: string; price?: number; images?: string[] }>;
}

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

interface Props {
  /** Only the products of the current page, already filtered and ordered by the server. */
  initialProducts: ProductItem[];
  categories: CategoryItem[];
  /** Products matching the current search/filters (all pages), and in the whole catalogue. */
  total: number;
  overallTotal: number;
  page: number;
  limit: number;
  query: string;
  categorySlug: string;
  status: string;
}

function getCategorySlug(category: ProductItem['category']): string {
  if (typeof category === 'object' && category) return category.slug ?? 'uncategorized';
  return category || 'uncategorized';
}

/** Everything the view modal shows, taken from the product row already loaded on this page. */
function toModalProduct(p: ProductItem): InventoryProduct {
  const own = (p.images ?? []).filter(Boolean);
  const fromVariants = (p.variants ?? []).flatMap((v) => (v.images ?? []).slice(0, 1)).filter(Boolean);
  return {
    id: String(p._id),
    slug: p.slug,
    name: p.name,
    category: getCategoryName(p.category),
    images: own.length > 0 ? own : fromVariants,
    shortDescription: p.shortDescription ?? '',
    description: p.description ?? '',
    fabric: p.fabric ?? '',
    workType: p.workType ?? '',
    occasions: Array.isArray(p.occasion) ? p.occasion : p.occasion ? [p.occasion] : [],
    tags: p.tags ?? [],
    badges: [p.isFeatured && 'Featured', p.isNewArrival && 'New arrival', p.isBestSeller && 'Best seller'].filter(Boolean) as string[],
    soldCount: p.soldCount ?? 0,
    basePrice: p.basePrice ?? 0,
    comparePrice: p.comparePrice ?? 0,
    isActive: p.isActive,
  };
}

function getCategoryName(category: ProductItem['category']): string {
  if (typeof category === 'object' && category) return category.name ?? 'Uncategorized';
  return typeof category === 'string' && category ? category : 'Uncategorized';
}

export function AdminProductsClient({ initialProducts, categories, total, overallTotal, page, limit, query, categorySlug, status }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const listParams = { q: query, category: categorySlug, status, limit: limit === 20 ? undefined : limit };
  const [viewing, setViewing] = useState<ProductItem | null>(null);

  // Keep state in sync whenever server delivers updated initialProducts
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success(`Ensemble "${name}" deleted`);
      router.refresh();
    } catch {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success(`Ensemble "${name}" deleted`);
      router.refresh();
    }
  }

  async function toggleStatus(id: string) {
    const product = products.find((p) => p._id === id);
    if (!product) return;
    const newStatus = !product.isActive;

    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, isActive: newStatus } : p))
    );

    try {
      const res = await fetch(`/api/products/${product.slug || id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to update ensemble status');
      }
      toast.success(`Ensemble is now ${newStatus ? 'active' : 'hidden'}`);
      router.refresh();
    } catch (err: unknown) {
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !newStatus } : p))
      );
      const msg = err instanceof Error ? err.message : 'Failed to update visibility';
      toast.error(msg);
      router.refresh();
    }
  }

  // Group filtered products by category so the catalog is browsable
  // category-wise instead of one long undifferentiated list.
  const groups = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; items: ProductItem[] }>();
    for (const p of products) {
      const slug = getCategorySlug(p.category);
      const name = getCategoryName(p.category);
      if (!map.has(slug)) map.set(slug, { slug, name, items: [] });
      map.get(slug)!.items.push(p);
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">
            Products &amp; Ensembles Catalog
          </h1>
          <p className="text-xs text-[#8A6A55] mt-1 font-sans">
            {overallTotal} couture garments and accessories across {sortedCategories.length} categories.
          </p>
        </div>
        <Link
          href={ROUTES.ADMIN_PRODUCT_NEW}
          className="inline-flex items-center gap-2 bg-[#C9A86A] hover:bg-[#B58E52] text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors shadow-xs"
        >
          <Plus size="0.875rem" /> Add New Ensemble
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-lg border border-[#DDD2C5]/80 shadow-xs">
        <AdminUrlSearch
          placeholder="Search by ensemble name or slug…"
          initialValue={query}
          className="flex-1 min-w-[13.75rem]"
        />

        <AdminUrlSelect
          param="category"
          value={categorySlug}
          ariaLabel="Filter by category"
          options={[{ value: '', label: 'All Categories' }, ...sortedCategories.map((c) => ({ value: c.slug, label: c.name }))]}
        />

        <AdminUrlSelect
          param="status"
          value={status}
          ariaLabel="Filter by visibility"
          options={[
            { value: '', label: 'All Visibility' },
            { value: 'active', label: 'Active in Store' },
            { value: 'inactive', label: 'Hidden / Draft' },
          ]}
        />
      </div>

      {/* Catalog grouped by category */}
      {groups.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm px-3.5 py-12 text-center text-[#8A6A55] text-xs">
          {query || categorySlug || status ? 'No garments match these filters.' : 'No garments yet.'}{' '}
          <Link href={ROUTES.ADMIN_PRODUCT_NEW} className="text-[#9E7B3A] font-semibold hover:underline">
            Add a product →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.slug} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#FAF7F2] border-b border-[#DDD2C5]">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#2E221C]">
                  {group.name}
                </h2>
                <span className="text-[0.65625rem] font-semibold text-[#9E7B3A] bg-[#C9A86A]/10 border border-[#C9A86A]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {group.items.length} {group.items.length === 1 ? 'Piece' : 'Pieces'}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#DDD2C5] text-[#8A6A55] uppercase tracking-wider text-[0.625rem] font-semibold">
                      <th className="px-3.5 py-2 whitespace-nowrap">Product</th>
                      <th className="px-3.5 py-2 whitespace-nowrap">Price</th>
                      <th className="px-3.5 py-2 whitespace-nowrap">Stock Units</th>
                      <th className="px-3.5 py-2 whitespace-nowrap">Store Status</th>
                      <th className="px-3.5 py-2 whitespace-nowrap text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE2D7]">
                    {group.items.map((product) => {
                      const stock = product.variants?.reduce((s, v) => s + v.stock, 0) ?? 10;
                      return (
                        <tr key={String(product._id)} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="px-3.5 py-2.5 max-w-[17.5rem]">
                            {/* The name opens the details too, so it works on small screens where the Actions column is off to the side. */}
                            <button
                              type="button"
                              onClick={() => setViewing(product)}
                              className="block w-full cursor-pointer text-left"
                              aria-label={`Open details of ${product.name}`}
                            >
                              <span className="block font-semibold text-[#2E221C] truncate text-sm hover:text-[#9E7B3A] transition-colors">{product.name}</span>
                              <span className="block text-[#8A6A55] text-[0.65625rem] font-mono mt-0.5 truncate">{product.slug}</span>
                            </button>
                          </td>
                          <td className="px-3.5 py-2.5 text-[#2E221C] font-semibold">
                            {formatPrice(product.basePrice)}
                          </td>
                          <td className="px-3.5 py-2.5">
                            <span
                              className={`font-semibold ${
                                stock === 0
                                  ? 'text-red-600'
                                  : stock < 5
                                  ? 'text-amber-600'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {stock} in stock
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5">
                            <button
                              onClick={() => toggleStatus(product._id)}
                              className={`inline-block text-[0.625rem] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                                product.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              }`}
                            >
                              {product.isActive ? 'Active' : 'Draft'}
                            </button>
                          </td>
                          <td className="px-3.5 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => setViewing(product)}
                                className="p-1.5 text-[#8A6A55] hover:text-[#2E221C] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                                title="View Ensemble"
                                aria-label={`View details of ${product.name}`}
                              >
                                <Eye size="0.875rem" />
                              </button>
                              <Link
                                href={ROUTES.ADMIN_PRODUCT(String(product._id))}
                                className="p-1.5 text-[#8A6A55] hover:text-[#9E7B3A] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                                title="Edit Ensemble"
                              >
                                <Edit2 size="0.875rem" />
                              </Link>
                              <Link
                                href={ROUTES.PRODUCT(product.slug)}
                                target="_blank"
                                className="p-1.5 text-[#8A6A55] hover:text-[#2E221C] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                                title="View on Live Store"
                              >
                                <ExternalLink size="0.875rem" />
                              </Link>
                              <button
                                onClick={() => handleDelete(product._id, product.name)}
                                className="p-1.5 text-[#8A6A55] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Ensemble"
                              >
                                <Trash2 size="0.875rem" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <AdminPagination
          page={page}
          totalPages={totalPages}
          totalItems={total}
          hrefForPage={(p) => pageHref('/admin/products', listParams, p)}
          pageSize={limit}
          pageSizeOptions={ADMIN_PAGE_SIZES}
        />
      </div>

      {viewing && (
        <InventoryProductModal
          product={toModalProduct(viewing)}
          variants={(viewing.variants ?? []).map((v, i) => ({
            id: `${viewing._id}-${i}`,
            sku: v.sku ?? '',
            size: v.size ?? '',
            color: v.color ?? '',
            stock: v.stock ?? 0,
            price: v.price ?? viewing.basePrice,
          }))}
          activeVariantId=""
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
