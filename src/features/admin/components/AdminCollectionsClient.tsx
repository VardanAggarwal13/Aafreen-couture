'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';

interface Collection {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
}

export function AdminCollectionsClient({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Delete this collection?')) return;
    setDeleting(id);
    await fetch(`/api/collections/${id}`, { method: 'DELETE' });
    router.refresh();
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-white/40">{collections.length} collections</p>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 bg-brand-gold text-white text-[11px] font-semibold tracking-wider uppercase px-5 py-2.5 hover:bg-[#b8893f] transition-colors"
        >
          <Plus size={14} /> Add Collection
        </Link>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-white/40 text-[11px] uppercase tracking-wider">
              <th className="text-left px-6 py-3.5 font-medium">Name</th>
              <th className="text-left px-6 py-3.5 font-medium hidden sm:table-cell">Slug</th>
              <th className="text-left px-6 py-3.5 font-medium hidden md:table-cell">Featured</th>
              <th className="text-left px-6 py-3.5 font-medium">Status</th>
              <th className="text-right px-6 py-3.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr key={col._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 text-white font-medium">{col.name}</td>
                <td className="px-6 py-4 text-white/40 text-xs font-mono hidden sm:table-cell">{col.slug}</td>
                <td className="px-6 py-4 hidden md:table-cell">
                  {col.isFeatured && <Star size={13} className="text-brand-gold fill-brand-gold" />}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 ${col.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                    {col.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/collections/${col._id}`} className="text-white/40 hover:text-brand-gold transition-colors">
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(col._id)}
                      disabled={deleting === col._id}
                      className="text-white/40 hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {collections.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-white/30">No collections yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
