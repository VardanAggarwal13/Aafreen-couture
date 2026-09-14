'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CollectionData {
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  sortOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export function CollectionForm({ collection }: { collection?: CollectionData }) {
  const router = useRouter();
  const isEdit = !!collection?._id;
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: collection?.name ?? '',
    slug: collection?.slug ?? '',
    description: collection?.description ?? '',
    image: collection?.image ?? '/images/products/noor-e-ishq.webp',
    bannerImage: collection?.bannerImage ?? '/images/hero-banner.webp',
    sortOrder: collection?.sortOrder ?? 1,
    isActive: collection?.isActive ?? true,
    isFeatured: collection?.isFeatured ?? false,
    seoTitle: collection?.seoTitle ?? '',
    seoDescription: collection?.seoDescription ?? '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Collection name is required');
      return;
    }

    setSaving(true);
    try {
      const url = isEdit ? `/api/collections/${collection._id}` : '/api/collections';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        }),
      });

      if (!res.ok) throw new Error('Failed to save collection');

      toast.success(isEdit ? 'Collection updated successfully' : 'Collection created successfully');
      router.push('/admin/collections');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving collection');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
        <Link
          href="/admin/collections"
          className="inline-flex items-center gap-1.5 text-xs text-[#8A6A55] hover:text-[#2E221C] transition-colors font-medium"
        >
          <ArrowLeft size={14} /> Back to Collections
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-6 py-2 rounded-lg hover:bg-[#1A1410] shadow-sm transition-all disabled:opacity-50"
        >
          <Save size={14} className="text-[#C9A86A]" /> {saving ? 'Saving…' : 'Save Collection'}
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-4 shadow-sm space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
            Collection Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Royal Heritage Couture 2026"
            className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
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
            placeholder="royal-heritage-2026 (auto-generated if left blank)"
            className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] font-mono text-xs transition-colors"
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
            placeholder="Curated editorial statement describing the theme, embroidery, and inspiration..."
            className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
              Tile Image Path / URL
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="/images/products/noor-e-ishq.webp"
              className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
              Hero Banner Image Path / URL
            </label>
            <input
              type="text"
              value={formData.bannerImage}
              onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
              placeholder="/images/hero-banner.webp"
              className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
            />
          </div>
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

            <label className="flex items-center gap-2.5 text-sm text-[#2E221C] font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="accent-[#C9A86A] w-4 h-4 rounded border-[#DDD2C5]"
              />
              Featured Line
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
