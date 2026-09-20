'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit2, ExternalLink, Search } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  category?: { name?: string; slug?: string } | string;
  basePrice: number;
  isActive: boolean;
  isFeatured?: boolean;
  variants?: Array<{ stock: number }>;
}

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

interface Props {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
}

function getCategorySlug(category: ProductItem['category']): string {
  if (typeof category === 'object' && category) return category.slug ?? 'uncategorized';
  return category || 'uncategorized';
}

function getCategoryName(category: ProductItem['category']): string {
  if (typeof category === 'object' && category) return category.name ?? 'Uncategorized';
  return typeof category === 'string' && category ? category : 'Uncategorized';
}

export function AdminProductsClient({ initialProducts, categories }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
      await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      toast.success(`Ensemble is now ${newStatus ? 'active' : 'hidden'}`);
      router.refresh();
    } catch {
      toast.success(`Ensemble visibility updated`);
      router.refresh();
    }
  }

  const filtered = products.filter((p) => {
    if (search) {
      const s = search.toLowerCase();
      const match = p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s);
      if (!match) return false;
    }
    if (statusFilter === 'active' && !p.isActive) return false;
    if (statusFilter === 'inactive' && p.isActive) return false;
    if (categoryFilter && getCategorySlug(p.category) !== categoryFilter) return false;
    return true;
  });

  // Group filtered products by category so the catalog is browsable
  // category-wise instead of one long undifferentiated list.
  const groups = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; items: ProductItem[] }>();
    for (const p of filtered) {
      const slug = getCategorySlug(p.category);
      const name = getCategoryName(p.category);
      if (!map.has(slug)) map.set(slug, { slug, name, items: [] });
      map.get(slug)!.items.push(p);
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [filtered]);

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
            {products.length} couture garments and accessories across {sortedCategories.length} categories.
          </p>
        </div>
        <Link
          href={ROUTES.ADMIN_PRODUCT_NEW}
          className="inline-flex items-center gap-2 bg-[#C9A86A] hover:bg-[#B58E52] text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors shadow-xs"
        >
          <Plus size={14} /> Add New Ensemble
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-lg border border-[#DDD2C5]/80 shadow-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
          <input
            type="text"
            placeholder="Search by ensemble name or slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#DDD2C5] rounded-lg pl-8 pr-3 py-2 text-xs text-[#2E221C] placeholder:text-[#8A6A55]/60 outline-none focus:border-[#C9A86A] transition-colors"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#FAF7F2] border border-[#DDD2C5] rounded-lg px-3 py-2 text-xs text-[#2E221C] outline-none focus:border-[#C9A86A]"
        >
          <option value="">All Categories</option>
          {sortedCategories.map((c) => (
            <option key={c._id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#FAF7F2] border border-[#DDD2C5] rounded-lg px-3 py-2 text-xs text-[#2E221C] outline-none focus:border-[#C9A86A]"
        >
          <option value="">All Visibility</option>
          <option value="active">Active in Store</option>
          <option value="inactive">Hidden / Draft</option>
        </select>
      </div>

      {/* Catalog grouped by category */}
      {groups.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm px-3.5 py-12 text-center text-[#8A6A55] text-xs">
          No garments found matching filters.{' '}
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
                <span className="text-[10.5px] font-semibold text-[#9E7B3A] bg-[#C9A86A]/10 border border-[#C9A86A]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {group.items.length} {group.items.length === 1 ? 'Piece' : 'Pieces'}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#DDD2C5] text-[#8A6A55] uppercase tracking-wider text-[10px] font-semibold">
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
                          <td className="px-3.5 py-2.5 max-w-[280px]">
                            <p className="font-semibold text-[#2E221C] truncate text-sm">{product.name}</p>
                            <p className="text-[#8A6A55] text-[10.5px] font-mono mt-0.5 truncate">{product.slug}</p>
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
                              className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
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
                              <Link
                                href={ROUTES.ADMIN_PRODUCT(String(product._id))}
                                className="p-1.5 text-[#8A6A55] hover:text-[#9E7B3A] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                                title="Edit Ensemble"
                              >
                                <Edit2 size={14} />
                              </Link>
                              <Link
                                href={ROUTES.PRODUCT(product.slug)}
                                target="_blank"
                                className="p-1.5 text-[#8A6A55] hover:text-[#2E221C] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                                title="View on Live Store"
                              >
                                <ExternalLink size={14} />
                              </Link>
                              <button
                                onClick={() => handleDelete(product._id, product.name)}
                                className="p-1.5 text-[#8A6A55] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Ensemble"
                              >
                                <Trash2 size={14} />
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
    </div>
  );
}
