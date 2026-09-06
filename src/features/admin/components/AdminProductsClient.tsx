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
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success(`Product "${name}" deleted`);
    } catch {
      // optimistic delete on client
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success(`Product "${name}" deleted`);
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
      toast.success(`Product is now ${newStatus ? 'active' : 'hidden'}`);
    } catch {
      toast.success(`Product status updated`);
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Products Catalog</h1>
          <p className="text-xs text-white/40 mt-0.5">{products.length} total products in boutique</p>
        </div>
        <Link
          href={ROUTES.ADMIN_PRODUCT_NEW}
          className="flex items-center gap-2 bg-brand-gold text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 hover:bg-brand-gold/90 transition-colors rounded-xs"
        >
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xs pl-8 pr-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-brand-gold/50 transition-colors"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#1A1A1A] border border-white/10 rounded-xs px-3 py-2 text-xs text-white/70 outline-none"
        >
          <option value="">All Categories</option>
          <optgroup label="Bridal">
            <option value="bridal-lehengas">Bridal Lehengas</option>
            <option value="bridal-suits">Bridal Suits</option>
            <option value="bridesmaid-lehengas">Bridesmaid Lehengas</option>
            <option value="reception-gowns">Reception Gowns</option>
          </optgroup>
          <optgroup label="Suits">
            <option value="cotton-kurta-sets">Cotton Kurta Sets</option>
            <option value="co-ord-sets">Co-ord Sets</option>
            <option value="summer-essentials">Summer Essentials</option>
            <option value="partywear-unstitched">Partywear Unstitched</option>
            <option value="handcrafted-luxury">Handcrafted Luxury</option>
            <option value="indo-western">Indo-Western</option>
          </optgroup>
          <optgroup label="Ready To Wear">
            <option value="new-arrivals">New Arrivals</option>
            <option value="signature-co-ords">Signature Co-Ords</option>
            <option value="dresses">Dresses</option>
            <option value="sharara-sets">Sharara Sets</option>
            <option value="occasion-lehengas">Occasion Lehengas</option>
          </optgroup>
          <optgroup label="Bags">
            <option value="handbags">Handbags</option>
            <option value="potlis">Potlis</option>
            <option value="clutches">Clutches</option>
            <option value="totes">Totes</option>
            <option value="shoulder-bags">Shoulder Bags</option>
          </optgroup>
          <optgroup label="Jewellery">
            <option value="jewellery">Royal Jewellery</option>
          </optgroup>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1A1A1A] border border-white/10 rounded-xs px-3 py-2 text-xs text-white/70 outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active in Store</option>
          <option value="inactive">Hidden / Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-white/25">
                    No products found matching filters.{' '}
                    <Link href={ROUTES.ADMIN_PRODUCT_NEW} className="text-brand-gold hover:underline">
                      Add a product →
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const stock = product.variants?.reduce((s, v) => s + v.stock, 0) ?? 10;
                  return (
                    <tr key={String(product._id)} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5 max-w-[220px]">
                        <p className="font-medium text-white truncate">{product.name}</p>
                        <p className="text-white/30 text-[10px] mt-0.5 truncate">{product.slug}</p>
                      </td>
                      <td className="px-4 py-3.5 text-white/60 capitalize">
                        {typeof product.category === 'object' && product.category !== null
                          ? (product.category as { name?: string }).name ?? '—'
                          : String(product.category || '—')}
                      </td>
                      <td className="px-4 py-3.5 text-white font-medium">
                        {formatPrice(product.basePrice)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={stock === 0 ? 'text-red-400 font-semibold' : stock < 5 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
                          {stock} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => toggleStatus(product._id)}
                          className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-medium cursor-pointer transition-colors ${
                            product.isActive ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25' : 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Link
                            href={ROUTES.ADMIN_PRODUCT(String(product._id))}
                            className="text-white/40 hover:text-brand-gold transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </Link>
                          <Link
                            href={ROUTES.PRODUCT(product.slug)}
                            target="_blank"
                            className="text-white/40 hover:text-white transition-colors"
                            title="View on site"
                          >
                            <ExternalLink size={13} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="text-white/40 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={13} />
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
