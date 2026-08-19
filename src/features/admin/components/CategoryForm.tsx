'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryData {
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export function CategoryForm({ category }: { category?: CategoryData }) {
  const router = useRouter();
  const isEdit = !!category?._id;
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
    image: category?.image ?? '/images/cats/bridal.webp',
    sortOrder: category?.sortOrder ?? 1,
    isActive: category?.isActive ?? true,
    isFeatured: category?.isFeatured ?? false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    setSaving(true);
    try {
      const url = isEdit ? `/api/categories/${category._id}` : '/api/categories';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        }),
      });

      if (!res.ok) throw new Error('Failed to save category');

      toast.success(isEdit ? 'Category updated' : 'Category created');
      router.push('/admin/categories');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving category');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={13} /> Back to Categories
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-brand-gold text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
        >
          <Save size={14} /> {saving ? 'Saving…' : 'Save Category'}
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 p-6 space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-1.5">
            Category Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Bridal Lehengas"
            className="w-full bg-[#111] border border-white/10 text-white px-3.5 py-2 text-xs outline-none focus:border-brand-gold/50"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-1.5">
            Slug
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="bridal-lehengas (auto-generated if blank)"
            className="w-full bg-[#111] border border-white/10 text-white px-3.5 py-2 text-xs outline-none focus:border-brand-gold/50"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Short description for category header"
            className="w-full bg-[#111] border border-white/10 text-white px-3.5 py-2 text-xs outline-none focus:border-brand-gold/50"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-1.5">
            Image Path / URL
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="/images/cats/bridal.webp"
            className="w-full bg-[#111] border border-white/10 text-white px-3.5 py-2 text-xs outline-none focus:border-brand-gold/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-1.5">
              Display Sort Order
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
              className="w-full bg-[#111] border border-white/10 text-white px-3.5 py-2 text-xs outline-none focus:border-brand-gold/50"
            />
          </div>

          <div className="flex items-center gap-6 pt-5">
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="accent-brand-gold"
              />
              Active in Store
            </label>

            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="accent-brand-gold"
              />
              Featured
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
