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

      toast.success(isEdit ? 'Category updated successfully' : 'Category created successfully');
      router.push('/admin/categories');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving category');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#DDD2C5]">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 text-xs text-[#8A6A55] hover:text-[#2E221C] transition-colors font-medium"
        >
          <ArrowLeft size={14} /> Back to Categories
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-[#1A1410] shadow-sm transition-all disabled:opacity-50"
        >
          <Save size={14} className="text-[#C9A86A]" /> {saving ? 'Saving…' : 'Save Category'}
        </button>
      </div>

      <div className="bg-white border border-[#DDD2C5] rounded-xl p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
            Category Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Bridal Lehengas"
            className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
            Slug (URL Identifier)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="bridal-lehengas (auto-generated if left blank)"
            className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] font-mono text-xs transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Short editorial description for category curation..."
            className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
            Cover Image Path or URL
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="/images/cats/bridal.webp"
            className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
              Display Sort Order
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
              className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
            />
          </div>

          <div className="flex items-center gap-6 sm:pt-6">
            <label className="flex items-center gap-2.5 text-sm text-[#2E221C] font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="accent-[#C9A86A] w-4 h-4 rounded border-[#DDD2C5]"
              />
              Active in Store
            </label>

            <label className="flex items-center gap-2.5 text-sm text-[#2E221C] font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="accent-[#C9A86A] w-4 h-4 rounded border-[#DDD2C5]"
              />
              Featured
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
