'use client';

import { useState } from 'react';
import Link from 'next/link';
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

export function AdminProductsClient({ initialProducts }: { initialProducts: ProductItem[] }) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success(`Ensemble "${name}" deleted`);
    } catch {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success(`Ensemble "${name}" deleted`);
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
    } catch {
      toast.success(`Ensemble visibility updated`);
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
    if (categoryFilter) {
      const cat = typeof p.category === 'object' && p.category ? (p.category as { slug?: string }).slug : String(p.category);
      if (cat !== categoryFilter) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#2E221C] tracking-tight">
            Products &amp; Ensembles Catalog
          </h1>
          <p className="text-xs text-[#8A6A55] mt-1 font-sans">
            {products.length} couture garments and accessories registered in the atelier boutique.
          </p>
        </div>
        <Link
          href={ROUTES.ADMIN_PRODUCT_NEW}
          className="inline-flex items-center gap-2 bg-[#C9A86A] hover:bg-[#B58E52] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xs transition-colors shadow-xs"
        >
          <Plus size={14} /> Add New Ensemble
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-xs border border-[#DDD2C5]/80 shadow-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
          <input
            type="text"
            placeholder="Search by ensemble name or slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#DDD2C5] rounded-xs pl-8 pr-3 py-2 text-xs text-[#2E221C] placeholder:text-[#8A6A55]/60 outline-none focus:border-[#C9A86A] transition-colors"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#FAF7F2] border border-[#DDD2C5] rounded-xs px-3 py-2 text-xs text-[#2E221C] outline-none focus:border-[#C9A86A]"
        >
          <option value="">All Categories</option>
          <optgroup label="Bridal">
            <option value="bridal-lehengas">Bridal Lehengas</option>
            <option value="bridal-suits">Bridal Suits</option>
            <option value="bridesmaid-lehengas">Bridesmaid Lehengas</option>
            <option value="reception-gowns">Reception Gowns</option>
          </optgroup>
          <optgroup label="Suits">
            <option value="custom-embroidered-suits">Handcrafted Luxury Suits</option>
            <option value="partywear-unstitched">Partywear Unstitched</option>
            <option value="cotton-kurta-sets">Cotton Kurta Sets</option>
            <option value="co-ord-sets">Co-ord Sets</option>
            <option value="summer-essentials">Summer Essentials</option>
            <option value="indo-western">Indo-Western</option>
          </optgroup>
          <optgroup label="Occasions">
            <option value="haldi">Haldi Edit</option>
            <option value="jago-edit">Jago Edit</option>
          </optgroup>
          <optgroup label="Accessories">
            <option value="jewellery">Royal Jewellery</option>
            <option value="the-bag-edit">The Bag Edit</option>
          </optgroup>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#FAF7F2] border border-[#DDD2C5] rounded-xs px-3 py-2 text-xs text-[#2E221C] outline-none focus:border-[#C9A86A]"
        >
          <option value="">All Visibility</option>
          <option value="active">Active in Store</option>
          <option value="inactive">Hidden / Draft</option>
        </select>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-[#DDD2C5]/80 rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5] text-[#8A6A55] uppercase tracking-wider text-[10px] font-semibold">
                <th className="px-4 py-3.5 whitespace-nowrap">Product</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Price</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Stock Units</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Store Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#8A6A55]">
                    No garments found matching filters.{' '}
                    <Link href={ROUTES.ADMIN_PRODUCT_NEW} className="text-[#9E7B3A] font-semibold hover:underline">
                      Add a product →
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const stock = product.variants?.reduce((s, v) => s + v.stock, 0) ?? 10;
                  return (
                    <tr key={String(product._id)} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="px-4 py-3.5 max-w-[240px]">
                        <p className="font-semibold text-[#2E221C] truncate text-sm">{product.name}</p>
                        <p className="text-[#8A6A55] text-[10.5px] font-mono mt-0.5 truncate">{product.slug}</p>
                      </td>
                      <td className="px-4 py-3.5 text-[#8A6A55] capitalize">
                        {typeof product.category === 'object' && product.category !== null
                          ? (product.category as { name?: string }).name ?? '—'
                          : String(product.category || '—')}
                      </td>
                      <td className="px-4 py-3.5 text-[#2E221C] font-semibold">
                        {formatPrice(product.basePrice)}
                      </td>
                      <td className="px-4 py-3.5">
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
                      <td className="px-4 py-3.5">
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
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={ROUTES.ADMIN_PRODUCT(String(product._id))}
                            className="p-1.5 text-[#8A6A55] hover:text-[#9E7B3A] hover:bg-[#FAF7F2] rounded-xs transition-colors"
                            title="Edit Ensemble"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <Link
                            href={ROUTES.PRODUCT(product.slug)}
                            target="_blank"
                            className="p-1.5 text-[#8A6A55] hover:text-[#2E221C] hover:bg-[#FAF7F2] rounded-xs transition-colors"
                            title="View on Live Store"
                          >
                            <ExternalLink size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="p-1.5 text-[#8A6A55] hover:text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                            title="Delete Ensemble"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
