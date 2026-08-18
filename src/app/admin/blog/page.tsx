import { Plus, FileText, ExternalLink, Calendar } from 'lucide-react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/data/blog.data';

export const metadata = { title: 'Blog Manager | Admin' };

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">The Bridal Journal</h1>
          <p className="text-xs text-white/40 mt-0.5">Manage style guides, craftsmanship stories, and editorial publications</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-gold text-white text-xs font-medium px-4 py-2.5 hover:bg-brand-gold/90 transition-colors rounded-xs">
          <Plus size={14} /> Write Article
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Article Title', 'Category', 'Author', 'Published Date', 'Read Time', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {BLOG_POSTS.map((post) => (
                <tr key={post.slug} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white max-w-[280px] truncate flex items-center gap-2">
                    <FileText size={14} className="text-brand-gold" /> {post.title}
                  </td>
                  <td className="px-4 py-3 text-brand-gold">{post.category}</td>
                  <td className="px-4 py-3 text-white/70">{post.author}</td>
                  <td className="px-4 py-3 text-white/50">{post.publishedAt}</td>
                  <td className="px-4 py-3 text-white/50">{post.readTime}</td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="text-white/40 hover:text-white transition-colors flex items-center gap-1">
                      <ExternalLink size={12} /> View
                    </Link>
                    <button className="text-brand-gold hover:underline text-[11px]">
                      Edit
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
