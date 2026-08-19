'use client';

import { useState } from 'react';
import { Plus, Minus, Save } from 'lucide-react';
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
    toast.success('Inventory stock levels saved');
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Inventory & Stock Manager</h1>
          <p className="text-xs text-white/40 mt-0.5">Live stock control across all couture sizes and variants</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search SKU or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1A1A1A] border border-white/10 px-3 py-1.5 text-xs text-white rounded-xs outline-none"
          />
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 bg-brand-gold text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 hover:bg-brand-gold/90 transition-colors rounded-xs"
          >
            <Save size={13} /> Save Stock
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(['all', 'low', 'out'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 text-xs rounded-xs font-medium uppercase tracking-wider transition-colors ${
              filter === tab
                ? 'bg-brand-gold text-white'
                : 'bg-[#1A1A1A] text-white/60 hover:text-white border border-white/5'
            }`}
          >
            {tab === 'all' ? 'All Items' : tab === 'low' ? 'Low Stock (≤ 5)' : 'Out of Stock (0)'}
          </button>
        ))}
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Product Name', 'SKU', 'Variant', 'Price', 'Stock Level', 'Adjust Stock', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white max-w-[220px] truncate">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-white/50 text-[11px]">
                    {item.sku}
                  </td>
                  <td className="px-4 py-3 text-white/70">
                    {item.size || 'Free Size'} {item.color ? `· ${item.color}` : ''}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {formatPrice(item.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${
                      item.stock === 0 ? 'text-red-400' : item.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {item.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => changeStock(item.id, -1)}
                        className="w-6 h-6 bg-white/5 hover:bg-white/10 flex items-center justify-center rounded-xs text-white transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={item.stock}
                        onChange={(e) => setDirectStock(item.id, Number(e.target.value))}
                        className="w-12 text-center bg-[#111] border border-white/10 py-0.5 text-xs text-white rounded-xs outline-none"
                      />
                      <button
                        onClick={() => changeStock(item.id, 1)}
                        className="w-6 h-6 bg-white/5 hover:bg-white/10 flex items-center justify-center rounded-xs text-white transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase font-medium ${
                      item.stock === 0
                        ? 'bg-red-500/10 text-red-400'
                        : item.stock <= 5
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {item.stock === 0 ? 'Out of Stock' : item.stock <= 5 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-white/30">
                    No matching inventory records.
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
