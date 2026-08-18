import { Plus, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'CMS Pages | Admin' };

const CMS_PAGES = [
  { id: 'cms-01', title: 'About the Atelier', slug: '/about', updatedAt: '2026-08-15', status: 'published' },
  { id: 'cms-02', title: 'Customer Care & Contact', slug: '/contact', updatedAt: '2026-08-15', status: 'published' },
  { id: 'cms-03', title: 'Frequently Asked Questions', slug: '/faq', updatedAt: '2026-08-14', status: 'published' },
  { id: 'cms-04', title: 'Shipping & Delivery Policy', slug: '/shipping-policy', updatedAt: '2026-08-14', status: 'published' },
  { id: 'cms-05', title: 'Returns & Exchange Policy', slug: '/returns-policy', updatedAt: '2026-08-18', status: 'published' },
  { id: 'cms-06', title: 'Privacy & Security Policy', slug: '/privacy-policy', updatedAt: '2026-08-12', status: 'published' },
  { id: 'cms-07', title: 'Terms & Conditions', slug: '/terms', updatedAt: '2026-08-12', status: 'published' },
];

export default function AdminCmsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">CMS Content Pages</h1>
          <p className="text-xs text-white/40 mt-0.5">Manage static policies, about pages, and legal information</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-gold text-white text-xs font-medium px-4 py-2.5 hover:bg-brand-gold/90 transition-colors rounded-xs">
          <Plus size={14} /> Add CMS Page
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Page Title', 'URL Route', 'Last Updated', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {CMS_PAGES.map((page) => (
                <tr key={page.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                    <FileText size={14} className="text-brand-gold" /> {page.title}
                  </td>
                  <td className="px-4 py-3 font-mono text-white/60 text-[11px]">{page.slug}</td>
                  <td className="px-4 py-3 text-white/50">{page.updatedAt}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 rounded-full font-medium uppercase">
                      {page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <Link href={page.slug} target="_blank" className="text-white/40 hover:text-white transition-colors flex items-center gap-1">
                      <ExternalLink size={12} /> View Live
                    </Link>
                    <button className="text-brand-gold hover:underline text-[11px]">
                      Edit Content
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
