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
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-wide">Editorial & Policy CMS</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-serif">Manage static brand narratives, care policies, and legal documentation</p>
        </div>
        <button className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm">
          <Plus size={14} className="text-[#C9A86A]" /> Add CMS Page
        </button>
      </div>

      <div className="bg-white border border-[#DDD2C5] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Page Title', 'URL Route', 'Last Updated', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {CMS_PAGES.map((page) => (
                <tr key={page.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-5 py-4 font-serif font-medium text-[#2E221C] text-sm flex items-center gap-2.5">
                    <FileText size={15} className="text-[#C9A86A]" /> {page.title}
                  </td>
                  <td className="px-5 py-4 font-mono text-[#8A6A55] text-xs">{page.slug}</td>
                  <td className="px-5 py-4 text-[#8A6A55]">{page.updatedAt}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium uppercase tracking-wider">
                      {page.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 flex items-center gap-4">
                    <Link href={page.slug} target="_blank" className="text-[#8A6A55] hover:text-[#2E221C] transition-colors flex items-center gap-1 font-medium">
                      <ExternalLink size={12} /> View Live
                    </Link>
                    <button className="text-[#C9A86A] hover:text-[#B89350] hover:underline font-semibold text-[11px]">
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
