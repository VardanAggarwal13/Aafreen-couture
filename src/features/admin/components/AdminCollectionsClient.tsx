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
    if (!confirm('Are you sure you want to delete this collection?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-[#8A6A55] font-medium">{collections.length} curated lines</p>
        <Link
          href="/admin/collections/new"
          className="inline-flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-[11px] font-semibold tracking-wider uppercase px-5 py-2 rounded-lg hover:bg-[#1A1410] shadow-sm transition-all"
        >
          <Plus size={14} className="text-[#C9A86A]" /> Add Collection
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5] text-[#8A6A55] text-[11px] uppercase tracking-wider font-semibold">
              <th className="text-left px-6 py-2.5">Name</th>
              <th className="text-left px-6 py-2.5 hidden sm:table-cell">Slug</th>
              <th className="text-left px-6 py-2.5 hidden md:table-cell">Featured</th>
              <th className="text-left px-6 py-2.5">Status</th>
              <th className="text-right px-6 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE2D7]">
            {collections.map((col) => (
              <tr key={col._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                <td className="px-6 py-2.5 text-[#2E221C] font-sans font-medium text-base">{col.name}</td>
                <td className="px-6 py-2.5 text-[#8A6A55] text-xs font-mono hidden sm:table-cell">{col.slug}</td>
                <td className="px-6 py-2.5 hidden md:table-cell">
                  {col.isFeatured ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[#C9A86A] font-medium bg-[#C9A86A]/10 px-2 py-0.5 rounded">
                      <Star size={12} className="fill-[#C9A86A]" /> Featured
                    </span>
                  ) : (
                    <span className="text-xs text-[#8A6A55]/50">—</span>
                  )}
                </td>
                <td className="px-6 py-2.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide ${
                      col.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#FAF7F2] text-[#8A6A55] border border-[#DDD2C5]'
                    }`}
                  >
                    {col.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/collections/${col._id}`}
                      className="p-1.5 rounded-md text-[#8A6A55] hover:text-[#2E221C] hover:bg-[#FAF7F2] transition-colors"
                      title="Edit Collection"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(col._id)}
                      disabled={deleting === col._id}
                      className="p-1.5 rounded-md text-[#8A6A55] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                      title="Delete Collection"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {collections.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#8A6A55]">
                  No collections created yet. Add a collection to feature curated lookbooks.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
