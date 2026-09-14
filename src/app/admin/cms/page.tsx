import { Plus, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { cmsRepository } from '@/server/repositories/cms.repository';
import { formatDate } from '@/utils/format';

export const metadata = { title: 'CMS Pages | Admin' };

export default async function AdminCmsPage() {
  const pages = await cmsRepository.findAll();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Editorial & Policy CMS</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-sans">Manage the hero banner content for static brand and policy pages</p>
        </div>
        <Link
          href="/admin/cms/new"
          className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-5 py-2 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm"
        >
          <Plus size={14} className="text-[#C9A86A]" /> Add CMS Page
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Page Title', 'URL Route', 'Last Updated', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#8A6A55]">
                    No CMS pages yet.{' '}
                    <Link href="/admin/cms/new" className="text-[#9E7B3A] font-semibold hover:underline">
                      Add your first page →
                    </Link>
                  </td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={String(page._id)} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="px-5 py-2.5 font-sans font-medium text-[#2E221C] text-sm flex items-center gap-2.5">
                      <FileText size={15} className="text-[#C9A86A]" /> {page.title}
                    </td>
                    <td className="px-5 py-2.5 font-mono text-[#8A6A55] text-xs">{page.route}</td>
                    <td className="px-5 py-2.5 text-[#8A6A55]">{formatDate(page.updatedAt)}</td>
                    <td className="px-5 py-2.5">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] rounded-full font-medium uppercase tracking-wider border ${
                          page.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {page.status}
                      </span>
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-3">
                        <Link href={page.route} target="_blank" className="text-[#8A6A55] hover:text-[#2E221C] transition-colors flex items-center gap-1 font-medium">
                          <ExternalLink size={12} /> View Live
                        </Link>
                        <Link href={`/admin/cms/${page._id}`} className="text-[#C9A86A] hover:text-[#B89350] hover:underline font-semibold text-[11px]">
                          Edit Content
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
