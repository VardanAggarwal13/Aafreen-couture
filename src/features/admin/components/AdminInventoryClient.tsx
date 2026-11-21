'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Plus, Minus, Save, Search } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/format';
import { AdminPagination } from '@/features/admin/components/AdminPagination';
import { InventoryProductModal, type InventoryProduct } from '@/features/admin/components/InventoryProductModal';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export interface InventoryItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  isActive: boolean;
}

interface Props {
  initialItems: InventoryItem[];
  /** Product-level details (pictures, description, ...) for the view modal, keyed by product id. */
  products: Record<string, InventoryProduct>;
}

export function AdminInventoryClient({ initialItems, products }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState<InventoryItem | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [saving, setSaving] = useState(false);

  function changeStock(id: string, delta: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
      )
    );
    setDirtyIds((prev) => new Set(prev).add(id));
  }

  function setDirectStock(id: string, value: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: Math.max(0, value) } : item
      )
    );
    setDirtyIds((prev) => new Set(prev).add(id));
  }

  async function handleSaveAll() {
    if (dirtyIds.size === 0) {
      toast.info('No stock changes to save');
      return;
    }
    setSaving(true);
    try {
      const updates = items
        .filter((item) => dirtyIds.has(item.id))
        .map((item) => ({ productId: item.productId, sku: item.sku, stock: item.stock }));

      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Failed to save inventory');

      toast.success(`Inventory stock levels synchronized (${json.data?.updated ?? updates.length} updated)`);
      setDirtyIds(new Set());
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save inventory');
    } finally {
      setSaving(false);
    }
  }

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    if (search && !item.name.toLowerCase().includes(q) && !item.sku.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q)) {
      return false;
    }
    if (filter === 'low') return item.stock > 0 && item.stock <= 5;
    if (filter === 'out') return item.stock === 0;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleFilterChange(value: 'all' | 'low' | 'out') {
    setFilter(value);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Inventory & Stock Manager</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-sans">Live stock control across all couture sizes and garments</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size="0.875rem" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
            <input
              type="text"
              placeholder="Search SKU, product or category..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-white border border-[#DDD2C5] pl-9 pr-3.5 py-2 text-xs text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors w-48 sm:w-64"
            />
          </div>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-1.5 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-5 py-2 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save size="0.8125rem" className="text-[#C9A86A]" /> {saving ? 'Saving…' : dirtyIds.size > 0 ? `Save Stock (${dirtyIds.size})` : 'Save Stock'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(['all', 'low', 'out'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleFilterChange(tab)}
            className={`px-3.5 py-2 text-xs rounded-lg font-medium tracking-wide transition-all ${
              filter === tab
                ? 'bg-[#2E221C] text-[#F8F5F1] shadow-sm'
                : 'bg-white text-[#8A6A55] hover:text-[#2E221C] border border-[#DDD2C5]'
            }`}
          >
            {tab === 'all' ? 'All Items' : tab === 'low' ? 'Low Stock (≤ 5)' : 'Out of Stock (0)'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['', 'Product Name', 'Category', 'SKU', 'Variant', 'Price', 'Stock Level', 'Adjust Stock', 'Status'].map((h, i) => (
                  <th key={h || `col-${i}`} className={`text-left py-2 text-[0.625rem] font-semibold text-[#8A6A55] uppercase tracking-wider ${i === 0 ? 'pl-4 pr-1' : 'px-5'}`}>
                    {h || <span className="sr-only">View</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {paged.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="pl-4 pr-1 py-2.5">
                    <button
                      type="button"
                      onClick={() => setViewing(item)}
                      disabled={!products[item.productId]}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#DDD2C5] bg-[#FAF7F2] text-[#6B4F3A] transition-colors hover:border-[#C9A86A] hover:text-[#2E221C] disabled:cursor-not-allowed disabled:opacity-40"
                      title="View product details"
                      aria-label={`View details of ${item.name}${item.size ? ` (${item.size})` : ''}`}
                    >
                      <Eye size="0.9375rem" />
                    </button>
                  </td>
                  <td className="px-5 py-2.5 font-sans font-medium text-[#2E221C] text-sm max-w-[15rem] truncate">
                    {item.name}
                  </td>
                  <td className="px-5 py-2.5">
                    <span className="inline-block max-w-[10rem] truncate rounded-full border border-[#DDD2C5] bg-[#FAF7F2] px-2.5 py-0.5 text-[0.6875rem] font-medium text-[#6B4F3A]" title={item.category}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 font-mono text-[#8A6A55] text-xs">
                    {item.sku}
                  </td>
                  <td className="px-5 py-2.5 text-[#8A6A55]">
                    {item.size || 'Free Size'} {item.color ? `· ${item.color}` : ''}
                  </td>
                  <td className="px-5 py-2.5 text-[#2E221C] font-semibold">
                    {formatPrice(item.price)}
                  </td>
                  <td className="px-5 py-2.5">
                    <span className={`font-semibold ${
                      item.stock === 0 ? 'text-red-600' : item.stock <= 5 ? 'text-amber-600' : 'text-emerald-700'
                    }`}>
                      {item.stock} units
                    </span>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => changeStock(item.id, -1)}
                        className="w-7 h-7 bg-[#FAF7F2] border border-[#DDD2C5] hover:bg-[#EAE2D7] flex items-center justify-center rounded-md text-[#2E221C] transition-colors"
                        title="Decrease Stock"
                      >
                        <Minus size="0.75rem" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={item.stock}
                        onChange={(e) => setDirectStock(item.id, Number(e.target.value))}
                        className="w-14 text-center bg-white border border-[#DDD2C5] py-1 text-xs text-[#2E221C] font-semibold rounded-md outline-none focus:border-[#C9A86A]"
                      />
                      <button
                        onClick={() => changeStock(item.id, 1)}
                        className="w-7 h-7 bg-[#FAF7F2] border border-[#DDD2C5] hover:bg-[#EAE2D7] flex items-center justify-center rounded-md text-[#2E221C] transition-colors"
                        title="Increase Stock"
                      >
                        <Plus size="0.75rem" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-[0.625rem] rounded-full uppercase tracking-wider font-medium ${
                      item.stock === 0
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : item.stock <= 5
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {item.stock === 0 ? 'Out of Stock' : item.stock <= 5 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-[#8A6A55]">
                    No matching inventory records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {viewing && products[viewing.productId] && (
        <InventoryProductModal
          product={products[viewing.productId]!}
          variants={items.filter((i) => i.productId === viewing.productId)}
          activeVariantId={viewing.id}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
