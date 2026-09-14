'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CmsPageData {
  _id?: string;
  slug?: string;
  title?: string;
  route?: string;
  heroBadge?: string;
  heroTitle?: string;
  heroItalicTitle?: string;
  heroSubtitle?: string;
  heroMetaInfo?: string;
  status?: 'published' | 'draft';
}

export function CmsPageForm({ page }: { page?: CmsPageData }) {
  const router = useRouter();
  const isEdit = !!page?._id;
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    slug: page?.slug ?? '',
    title: page?.title ?? '',
    route: page?.route ?? '',
    heroBadge: page?.heroBadge ?? '',
    heroTitle: page?.heroTitle ?? '',
    heroItalicTitle: page?.heroItalicTitle ?? '',
    heroSubtitle: page?.heroSubtitle ?? '',
    heroMetaInfo: page?.heroMetaInfo ?? '',
    status: page?.status ?? ('published' as 'published' | 'draft'),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.heroTitle || !formData.heroSubtitle || !formData.route) {
      toast.error('Page title, route, hero title, and hero subtitle are required');
      return;
    }

    setSaving(true);
    try {
      const url = isEdit ? `/api/cms/${page._id}` : '/api/cms';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || formData.route.replace(/^\//, '').replace(/\//g, '-'),
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error ?? 'Failed to save CMS page');
      }

      toast.success(isEdit ? 'CMS page updated successfully' : 'CMS page created successfully');
      router.push('/admin/cms');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving CMS page');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
        <Link
          href="/admin/cms"
          className="inline-flex items-center gap-1.5 text-xs text-[#8A6A55] hover:text-[#2E221C] transition-colors font-medium"
        >
          <ArrowLeft size={14} /> Back to CMS Pages
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-6 py-2 rounded-lg hover:bg-[#1A1410] shadow-sm transition-all disabled:opacity-50"
        >
          <Save size={14} className="text-[#C9A86A]" /> {saving ? 'Saving…' : 'Save Page'}
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
              Admin Label (Page Title) *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. About the Atelier"
              className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
              URL Route *
            </label>
            <input
              type="text"
              required
              value={formData.route}
              onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              placeholder="/about"
              className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] font-mono text-xs transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
            Slug (Internal Identifier)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="about (auto-generated from route if left blank)"
            className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] font-mono text-xs transition-colors"
          />
        </div>

        <div className="pt-2 border-t border-[#EAE2D7]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9E7B3A] mb-3">
            Hero Banner Content
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
                Eyebrow Badge Text
              </label>
              <input
                type="text"
                value={formData.heroBadge}
                onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                placeholder="e.g. Aafreen Couture By Pearl"
                className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
                  Hero Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="e.g. Our Story &amp; Atelier"
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
                  Hero Italic Highlight
                </label>
                <input
                  type="text"
                  value={formData.heroItalicTitle}
                  onChange={(e) => setFormData({ ...formData, heroItalicTitle: e.target.value })}
                  placeholder="e.g. Heirloom Craftsmanship"
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
                Hero Subtitle *
              </label>
              <textarea
                rows={2}
                required
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                placeholder="One or two sentences describing this page..."
                className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
                Hero Meta Info Line
              </label>
              <input
                type="text"
                value={formData.heroMetaInfo}
                onChange={(e) => setFormData({ ...formData, heroMetaInfo: e.target.value })}
                placeholder="e.g. Bespoke Bridal Atelier &middot; Amritsar, Punjab"
                className="w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#EAE2D7]">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
            className="w-full sm:w-56 bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 rounded-lg text-sm outline-none focus:border-[#C9A86A]"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
    </form>
  );
}
