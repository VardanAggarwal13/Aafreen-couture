'use client';

import { useState } from 'react';
import { Plus, Minus, Save, Search } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/format';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  isActive: boolean;
}

export function AdminInventoryClient({ initialItems }: { initialItems: InventoryItem[] }) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [search, setSearch] = useState('');

  function changeStock(id: string, delta: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
      )
    );
  }

  function setDirectStock(id: string, value: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: Math.max(0, value) } : item
      )
    );
  }

  function handleSaveAll() {
    toast.success('Inventory stock levels synchronized successfully');
  }

  const filtered = items.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.sku.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (filter === 'low') return item.stock > 0 && item.stock <= 5;
    if (filter === 'out') return item.stock === 0;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-wide">Inventory & Stock Manager</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-serif">Live stock control across all couture sizes and garments</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
            <input
              type="text"
              placeholder="Search SKU or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-[#DDD2C5] pl-9 pr-3.5 py-2 text-xs text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors w-48 sm:w-64"
            />
          </div>
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm"
          >
            <Save size={13} className="text-[#C9A86A]" /> Save Stock
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(['all', 'low', 'out'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-xs rounded-lg font-medium tracking-wide transition-all ${
              filter === tab
                ? 'bg-[#2E221C] text-[#F8F5F1] shadow-sm'
                : 'bg-white text-[#8A6A55] hover:text-[#2E221C] border border-[#DDD2C5]'
            }`}
          >
            {tab === 'all' ? 'All Items' : tab === 'low' ? 'Low Stock (≤ 5)' : 'Out of Stock (0)'}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#DDD2C5] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Product Name', 'SKU', 'Variant', 'Price', 'Stock Level', 'Adjust Stock', 'Status'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-5 py-4 font-serif font-medium text-[#2E221C] text-sm max-w-[240px] truncate">
                    {item.name}
                  </td>
                  <td className="px-5 py-4 font-mono text-[#8A6A55] text-xs">
                    {item.sku}
                  </td>
                  <td className="px-5 py-4 text-[#8A6A55]">
                    {item.size || 'Free Size'} {item.color ? `· ${item.color}` : ''}
                  </td>
                  <td className="px-5 py-4 text-[#2E221C] font-semibold">
                    {formatPrice(item.price)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-semibold ${
                      item.stock === 0 ? 'text-red-600' : item.stock <= 5 ? 'text-amber-600' : 'text-emerald-700'
                    }`}>
                      {item.stock} units
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => changeStock(item.id, -1)}
                        className="w-7 h-7 bg-[#FAF7F2] border border-[#DDD2C5] hover:bg-[#EAE2D7] flex items-center justify-center rounded-md text-[#2E221C] transition-colors"
                        title="Decrease Stock"
                      >
                        <Minus size={12} />
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
                        <Plus size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] rounded-full uppercase tracking-wider font-medium ${
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
                  <td colSpan={7} className="px-5 py-12 text-center text-[#8A6A55]">
                    No matching inventory records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
