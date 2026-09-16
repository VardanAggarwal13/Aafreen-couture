'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { extractFieldErrors, FIELD_ERROR_CLASS } from '@/utils/form-errors';

interface CategoryData {
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export function CategoryForm({ category }: { category?: CategoryData }) {
  const router = useRouter();
  const isEdit = !!category?._id;
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
    image: category?.image ?? '/images/cats/bridal.webp',
    sortOrder: category?.sortOrder ?? 1,
    isActive: category?.isActive ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name) {
      setFieldErrors({ name: 'Category name is required' });
      toast.error('Category name is required');
      return;
    }

    setFieldErrors({});
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

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const errors = extractFieldErrors(body);
        if (errors.length > 0) {
          setFieldErrors(Object.fromEntries(errors.map((e) => [e.path, e.message])));
          toast.error(`Please fix the highlighted field${errors.length > 1 ? 's' : ''} below`);
          return;
        }
        throw new Error(body.error ?? 'Failed to save category');
      }

      toast.success(isEdit ? 'Category updated successfully' : 'Category created successfully');
      router.push('/admin/categories');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving category');
    } finally {
      setSaving(false);
    }
  }

  const inputClass = (field: string) =>
    `w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors ${
      fieldErrors[field] ? FIELD_ERROR_CLASS : ''
    }`;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 text-xs text-[#8A6A55] hover:text-[#2E221C] transition-colors font-medium"
        >
          <ArrowLeft size={14} /> Back to Categories
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-6 py-2 rounded-lg hover:bg-[#1A1410] shadow-sm transition-all disabled:opacity-50"
        >
          <Save size={14} className="text-[#C9A86A]" /> {saving ? 'Saving…' : 'Save Category'}
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-4 shadow-sm space-y-4">
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
            className={inputClass('name')}
          />
          {fieldErrors.name && <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>}
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
            className={`${inputClass('slug')} font-mono text-xs`}
          />
          {fieldErrors.slug && <p className="text-xs text-red-600 mt-1">{fieldErrors.slug}</p>}
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
            className={inputClass('description')}
          />
          {fieldErrors.description && <p className="text-xs text-red-600 mt-1">{fieldErrors.description}</p>}
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
            className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
              Display Sort Order
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
              className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 sm:pt-6">
            <label className="flex items-center gap-2.5 text-sm text-[#2E221C] font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="accent-[#C9A86A] w-4 h-4 rounded border-[#DDD2C5]"
              />
              Active in Store
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
