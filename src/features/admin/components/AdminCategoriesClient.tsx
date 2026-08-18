'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
}

export function AdminCategoriesClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    setDeleting(id);
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    router.refresh();
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-white/40">{categories.length} categories</p>
        <a
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-brand-gold text-white text-[11px] font-semibold tracking-wider uppercase px-5 py-2.5 hover:bg-[#b8893f] transition-colors"
        >
          <Plus size={14} /> Add Category
        </a>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-white/40 text-[11px] uppercase tracking-wider">
              <th className="text-left px-6 py-3.5 font-medium">Name</th>
              <th className="text-left px-6 py-3.5 font-medium hidden sm:table-cell">Slug</th>
              <th className="text-left px-6 py-3.5 font-medium hidden md:table-cell">Order</th>
              <th className="text-left px-6 py-3.5 font-medium">Status</th>
              <th className="text-right px-6 py-3.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 text-white font-medium">{cat.name}</td>
                <td className="px-6 py-4 text-white/40 text-xs font-mono hidden sm:table-cell">{cat.slug}</td>
                <td className="px-6 py-4 text-white/60 hidden md:table-cell">{cat.displayOrder}</td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 ${cat.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <a href={`/admin/categories/${cat._id}`} className="text-white/40 hover:text-brand-gold transition-colors">
                      <Pencil size={14} />
                    </a>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      disabled={deleting === cat._id}
                      className="text-white/40 hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-white/30">No categories yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
