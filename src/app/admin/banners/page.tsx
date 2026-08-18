import { Plus, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';

export const metadata = { title: 'Banners | Admin' };

const BANNERS = [
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

export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Promotional Banners</h1>
          <p className="text-xs text-white/40 mt-0.5">Manage hero banners and spotlight promotions</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-gold text-white text-xs font-medium px-4 py-2.5 hover:bg-brand-gold/90 transition-colors rounded-xs">
          <Plus size={14} /> Add New Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BANNERS.map((banner) => (
          <div key={banner.id} className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden flex flex-col">
            <div className="relative aspect-[16/9] w-full bg-[#222]">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" />
              <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-semibold uppercase bg-emerald-500/80 text-white rounded-xs">
                {banner.status}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-brand-gold uppercase tracking-wider font-semibold">{banner.placement}</span>
                <h3 className="font-semibold text-white text-sm mt-0.5">{banner.title}</h3>
                <p className="text-[11px] text-white/40 truncate mt-1">Link: {banner.link}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
                <span>{banner.clicks} Clicks</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:text-white transition-colors" title="Preview"><Eye size={14} /></button>
                  <button className="p-1 hover:text-red-400 transition-colors" title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
