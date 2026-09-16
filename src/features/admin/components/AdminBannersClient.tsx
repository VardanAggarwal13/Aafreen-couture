'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Trash2, Edit2, Eye, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { extractFieldErrors, FIELD_ERROR_CLASS } from '@/utils/form-errors';

export interface BannerItem {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  position: 'hero' | 'category' | 'popup' | 'strip';
  isActive: boolean;
  sortOrder: number;
  validFrom?: string;
  validUntil?: string;
}

interface FormState {
  title: string;
  subtitle: string;
  image: string;
  mobileImage: string;
  link: string;
  position: BannerItem['position'];
  isActive: boolean;
  sortOrder: number;
  validFrom: string;
  validUntil: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  subtitle: '',
  image: '/images/hero-banner.webp',
  mobileImage: '',
  link: '/shop',
  position: 'hero',
  isActive: true,
  sortOrder: 0,
  validFrom: '',
  validUntil: '',
};

const POSITION_LABELS: Record<BannerItem['position'], string> = {
  hero: 'Homepage Hero',
  category: 'Category Spotlight',
  popup: 'Popup Banner',
  strip: 'Announcement Strip',
};

export function AdminBannersClient({ banners }: { banners: BannerItem[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<BannerItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);

  function openCreateModal() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  }

  function openEditModal(banner: BannerItem) {
    setEditingId(banner._id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle ?? '',
      image: banner.image,
      mobileImage: banner.mobileImage ?? '',
      link: banner.link ?? '',
      position: banner.position,
      isActive: banner.isActive,
      sortOrder: banner.sortOrder,
      validFrom: banner.validFrom ? banner.validFrom.slice(0, 10) : '',
      validUntil: banner.validUntil ? banner.validUntil.slice(0, 10) : '',
    });
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      setFieldErrors({
        ...(!formData.title && { title: 'Banner title is required' }),
        ...(!formData.image && { image: 'Banner image is required' }),
      });
      toast.error('Banner title and image are required');
      return;
    }

    setFieldErrors({});
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle || undefined,
        image: formData.image,
        mobileImage: formData.mobileImage || undefined,
        link: formData.link || undefined,
        position: formData.position,
        isActive: formData.isActive,
        sortOrder: formData.sortOrder,
        validFrom: formData.validFrom || undefined,
        validUntil: formData.validUntil || undefined,
      };

      const url = editingId ? `/api/admin/banners/${editingId}` : '/api/admin/banners';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errors = extractFieldErrors(json);
        if (errors.length > 0) {
          setFieldErrors(Object.fromEntries(errors.map((e) => [e.path, e.message])));
          toast.error(`Please fix the highlighted field${errors.length > 1 ? 's' : ''} below`);
          return;
        }
        throw new Error(json.error ?? 'Failed to save banner');
      }

      toast.success(editingId ? `Banner "${formData.title}" updated` : `Banner "${formData.title}" created`);
      setIsModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete banner');
      toast.success('Banner deleted');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete banner');
    } finally {
      setDeleting(null);
    }
  }

  async function toggleStatus(banner: BannerItem) {
    try {
      const res = await fetch(`/api/admin/banners/${banner._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Failed to update banner visibility');
      toast.success('Banner visibility updated');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update banner visibility');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Visual Storytelling & Banners</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-sans">Manage hero billboards, lookbook banners, and curated spotlights</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-5 py-2 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm cursor-pointer"
        >
          <Plus size={14} className="text-[#C9A86A]" /> Add New Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="relative aspect-[16/9] w-full bg-[#FAF7F2] border-b border-[#DDD2C5]">
              <Image src={banner.image} alt={banner.title} fill sizes="400px" className="object-cover" />
              <button
                onClick={() => toggleStatus(banner)}
                className={`absolute top-3 right-3 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-sm transition-colors cursor-pointer ${
                  banner.isActive ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {banner.isActive ? 'active' : 'inactive'}
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#C9A86A] uppercase tracking-wider font-semibold">{POSITION_LABELS[banner.position]}</span>
                <h3 className="font-sans font-semibold text-[#2E221C] text-base mt-1">{banner.title}</h3>
                {banner.link && <p className="text-xs text-[#8A6A55] truncate mt-1 font-mono">Link: {banner.link}</p>}
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#EAE2D7] flex items-center justify-between text-xs text-[#8A6A55]">
                <span className="font-medium">Order: {banner.sortOrder}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewing(banner)}
                    className="p-1 rounded text-[#8A6A55] hover:text-[#2E221C] transition-colors cursor-pointer"
                    title="View Banner"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-1 rounded text-[#8A6A55] hover:text-[#2E221C] transition-colors cursor-pointer"
                    title="Edit Banner"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    disabled={deleting === banner._id}
                    className="p-1 rounded text-[#8A6A55] hover:text-red-600 transition-colors disabled:opacity-40 cursor-pointer"
                    title="Delete Banner"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="col-span-full text-center py-12 text-[#8A6A55] bg-white rounded-xl shadow-sm">
            No banners created yet.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-4 sm:p-7 rounded-2xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
              <h3 className="font-sans font-semibold text-[#2E221C] text-base">
                {editingId ? 'Edit Visual Banner' : 'Add New Visual Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Bridal Edit 2026"
                  className={`w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors ${fieldErrors.title ? FIELD_ERROR_CLASS : ''}`}
                />
                {fieldErrors.title && <p className="text-xs text-red-600 mt-1">{fieldErrors.title}</p>}
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Optional supporting line"
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Placement</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value as BannerItem['position'] })}
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg"
                >
                  {(Object.entries(POSITION_LABELS) as [BannerItem['position'], string][]).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Image Path / URL *</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/hero-banner.webp"
                  className={`w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg font-mono text-[11px] ${fieldErrors.image ? FIELD_ERROR_CLASS : ''}`}
                />
                {fieldErrors.image && <p className="text-xs text-red-600 mt-1">{fieldErrors.image}</p>}
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Mobile Image (optional)</label>
                <input
                  type="text"
                  value={formData.mobileImage}
                  onChange={(e) => setFormData({ ...formData, mobileImage: e.target.value })}
                  placeholder="/images/hero-banner-mobile.webp"
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Target Destination Link</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/collections/bridal-lehengas-suits"
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Valid From</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Valid Until</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="accent-[#C9A86A] w-4 h-4"
                />
                <span className="text-[#2E221C] font-medium">Active</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#DDD2C5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-[#8A6A55] hover:text-[#2E221C] text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-[#2E221C] text-[#F8F5F1] font-semibold uppercase tracking-wider px-5 py-2 hover:bg-[#1A1410] text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Check size={13} className="text-[#C9A86A]" /> {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-4 sm:p-7 rounded-2xl shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
              <h3 className="font-sans font-semibold text-[#2E221C] text-base">{viewing.title}</h3>
              <button onClick={() => setViewing(null)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#DDD2C5]">
              <Image src={viewing.image} alt={viewing.title} fill sizes="400px" className="object-cover" />
            </div>
            <div className="space-y-3 text-[#2E221C]">
              {viewing.subtitle && (
                <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                  <span className="text-[#8A6A55]">Subtitle:</span>
                  <span className="font-medium">{viewing.subtitle}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Placement:</span>
                <span className="font-medium">{POSITION_LABELS[viewing.position]}</span>
              </div>
              {viewing.link && (
                <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                  <span className="text-[#8A6A55]">Link:</span>
                  <span className="font-mono">{viewing.link}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Status:</span>
                <span className={`font-semibold ${viewing.isActive ? 'text-emerald-700' : 'text-[#8A6A55]'}`}>
                  {viewing.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {(viewing.validFrom || viewing.validUntil) && (
                <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                  <span className="text-[#8A6A55]">Scheduled:</span>
                  <span className="font-medium">
                    {viewing.validFrom ? new Date(viewing.validFrom).toLocaleDateString('en-IN') : '—'} to{' '}
                    {viewing.validUntil ? new Date(viewing.validUntil).toLocaleDateString('en-IN') : '—'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-4 border-t border-[#DDD2C5]">
              <button
                onClick={() => setViewing(null)}
                className="px-5 py-2 bg-[#2E221C] text-[#F8F5F1] hover:bg-[#1A1410] rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
