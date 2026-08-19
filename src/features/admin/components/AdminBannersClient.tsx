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
      toast.success(`Banner "${formData.title}" updated`);
    } else {
      const newBanner: BannerItem = {
        id: `b-${Date.now().toString().slice(-4)}`,
        ...formData,
        clicks: 0,
      };
      setBanners((prev) => [newBanner, ...prev]);
      toast.success(`Banner "${formData.title}" added`);
    }
    setIsModalOpen(false);
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this banner?')) return;
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast.success('Banner deleted');
  }

  function toggleStatus(id: string) {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
      )
    );
    toast.success('Banner status toggled');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Promotional Banners</h1>
          <p className="text-xs text-white/40 mt-0.5">Manage hero banners and spotlight promotions</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-brand-gold text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 hover:bg-brand-gold/90 transition-colors rounded-xs"
        >
          <Plus size={14} /> Add New Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden flex flex-col">
            <div className="relative aspect-[16/9] w-full bg-[#222]">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" />
              <button
                onClick={() => toggleStatus(banner.id)}
                className={`absolute top-2 right-2 px-2 py-0.5 text-[9px] font-semibold uppercase rounded-xs transition-colors ${
                  banner.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {banner.status}
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-brand-gold uppercase tracking-wider font-semibold">{banner.placement}</span>
                <h3 className="font-semibold text-white text-sm mt-0.5">{banner.title}</h3>
                <p className="text-[11px] text-white/40 truncate mt-1">Link: {banner.link}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
                <span>{banner.clicks} Clicks</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="hover:text-brand-gold transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-white/10 w-full max-w-md p-6 rounded-xs shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="font-semibold text-white text-sm">
                {editingId ? 'Edit Banner' : 'Add New Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Bridal Edit 2026"
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none focus:border-brand-gold/50"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Placement</label>
                <select
                  value={formData.placement}
                  onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none"
                >
                  <option value="Homepage Hero">Homepage Hero</option>
                  <option value="Collections Feature">Collections Feature</option>
                  <option value="Category Spotlight">Category Spotlight</option>
                  <option value="Popup Banner">Popup Banner</option>
                </select>
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Image Path / URL</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/hero-banner.webp"
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none focus:border-brand-gold/50"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Target Link</label>
                <input
                  type="text"
                  required
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/collections/bridal-lehengas-suits"
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none focus:border-brand-gold/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-white/50 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-brand-gold text-white font-semibold uppercase tracking-wider px-5 py-2 hover:bg-brand-gold/90 text-xs rounded-xs"
                >
                  <Check size={13} /> {editingId ? 'Save Changes' : 'Add Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
