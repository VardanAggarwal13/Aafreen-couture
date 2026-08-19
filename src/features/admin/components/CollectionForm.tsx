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

      toast.success(isEdit ? 'Collection updated' : 'Collection created');
      router.push('/admin/collections');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving collection');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <Link
          href="/admin/collections"
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={13} /> Back to Collections
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-brand-gold text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
        >
          <Save size={14} /> {saving ? 'Saving…' : 'Save Collection'}
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 p-6 space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-1.5">
            Collection Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Bridal Lehengas & Suits"
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
            placeholder="bridal-lehengas-suits (auto-generated if blank)"
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
            placeholder="Curated statement pieces crafted for..."
            className="w-full bg-[#111] border border-white/10 text-white px-3.5 py-2 text-xs outline-none focus:border-brand-gold/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-1.5">
              Tile Image Path / URL
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="/images/products/noor-e-ishq.webp"
              className="w-full bg-[#111] border border-white/10 text-white px-3.5 py-2 text-xs outline-none focus:border-brand-gold/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-1.5">
              Banner Image Path / URL
            </label>
            <input
              type="text"
              value={formData.bannerImage}
              onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
              placeholder="/images/hero-banner.webp"
              className="w-full bg-[#111] border border-white/10 text-white px-3.5 py-2 text-xs outline-none focus:border-brand-gold/50"
            />
          </div>
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
