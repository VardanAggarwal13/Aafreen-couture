'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export interface BannerItem {
  id: string;
  title: string;
  placement: string;
  image: string;
  link: string;
  status: 'active' | 'inactive';
  clicks: number;
}

const INITIAL_BANNERS: BannerItem[] = [
  {
    id: 'b-01',
    title: 'The Bridal Edit 2026',
    placement: 'Homepage Hero',
    image: '/images/hero-banner.webp',
    link: '/collections/bridal-lehengas-suits',
    status: 'active',
    clicks: 1840,
  },
  {
    id: 'b-02',
    title: 'Signature Co-Ord Sets',
    placement: 'Collections Feature',
    image: '/images/products/roshani-coord.webp',
    link: '/collections/signature-co-ord-sets',
    status: 'active',
    clicks: 920,
  },
  {
    id: 'b-03',
    title: 'Royal Jadau Jewellery',
    placement: 'Category Spotlight',
    image: '/images/products/sitara-polki-choker.webp',
    link: '/collections/jewellery',
    status: 'active',
    clicks: 450,
  },
];

export function AdminBannersClient() {
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    placement: 'Homepage Hero',
    image: '/images/hero-banner.webp',
    link: '/shop',
    status: 'active' as 'active' | 'inactive',
  });

  function openCreateModal() {
    setEditingId(null);
    setFormData({
      title: '',
      placement: 'Homepage Hero',
      image: '/images/hero-banner.webp',
      link: '/shop',
      status: 'active',
    });
    setIsModalOpen(true);
  }

  function openEditModal(banner: BannerItem) {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      placement: banner.placement,
      image: banner.image,
      link: banner.link,
      status: banner.status,
    });
    setIsModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Banner title is required');
      return;
    }

    if (editingId) {
      setBanners((prev) =>
        prev.map((b) => (b.id === editingId ? { ...b, ...formData } : b))
      );
      toast.success(`Banner "${formData.title}" updated successfully`);
    } else {
      const newBanner: BannerItem = {
        id: `b-${Date.now().toString().slice(-4)}`,
        ...formData,
        clicks: 0,
      };
      setBanners((prev) => [newBanner, ...prev]);
      toast.success(`Banner "${formData.title}" created successfully`);
    }
    setIsModalOpen(false);
  }

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast.success('Banner deleted');
  }

  function toggleStatus(id: string) {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
      )
    );
    toast.success('Banner visibility updated');
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-wide">Visual Storytelling & Banners</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-serif">Manage hero billboards, lookbook banners, and curated spotlights</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm"
        >
          <Plus size={14} className="text-[#C9A86A]" /> Add New Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white border border-[#DDD2C5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="relative aspect-[16/9] w-full bg-[#FAF7F2] border-b border-[#DDD2C5]">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" />
              <button
                onClick={() => toggleStatus(banner.id)}
                className={`absolute top-3 right-3 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-sm transition-colors ${
                  banner.status === 'active' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {banner.status}
              </button>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#C9A86A] uppercase tracking-wider font-semibold">{banner.placement}</span>
                <h3 className="font-serif font-semibold text-[#2E221C] text-base mt-1">{banner.title}</h3>
                <p className="text-xs text-[#8A6A55] truncate mt-1 font-mono">Link: {banner.link}</p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#EAE2D7] flex items-center justify-between text-xs text-[#8A6A55]">
                <span className="font-medium">{banner.clicks} Client Clicks</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-1 rounded text-[#8A6A55] hover:text-[#2E221C] transition-colors"
                    title="Edit Banner"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-1 rounded text-[#8A6A55] hover:text-red-600 transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDD2C5] w-full max-w-md p-6 sm:p-7 rounded-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD2C5]">
              <h3 className="font-serif font-semibold text-[#2E221C] text-base">
                {editingId ? 'Edit Visual Banner' : 'Add New Visual Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md">
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
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Placement</label>
                <select
                  value={formData.placement}
                  onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg"
                >
                  <option value="Homepage Hero">Homepage Hero</option>
                  <option value="Collections Feature">Collections Feature</option>
                  <option value="Category Spotlight">Category Spotlight</option>
                  <option value="Popup Banner">Popup Banner</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Image Path / URL</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/hero-banner.webp"
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Target Destination Link</label>
                <input
                  type="text"
                  required
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/collections/bridal-lehengas-suits"
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#DDD2C5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#8A6A55] hover:text-[#2E221C] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#2E221C] text-[#F8F5F1] font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-[#1A1410] text-xs rounded-lg shadow-sm transition-all"
                >
                  <Check size={13} className="text-[#C9A86A]" /> {editingId ? 'Save Changes' : 'Add Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
