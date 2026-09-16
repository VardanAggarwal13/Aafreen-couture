'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Trash2, Edit2, Eye, X, Check, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { extractFieldErrors, FIELD_ERROR_CLASS } from '@/utils/form-errors';

export interface BlogPostItem {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
  publishedAt: string;
  status: 'published' | 'draft';
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  category: 'Bridal Heritage',
  excerpt: '',
  readTime: '4 min read',
  publishedAt: new Date().toISOString().split('T')[0],
  image: '/images/hero-banner.webp',
  author: 'Aafreen Style Studio',
  authorRole: 'Head Curator',
  content: '',
  status: 'published' as 'published' | 'draft',
};

export function AdminBlogClient({ posts }: { posts: BlogPostItem[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<BlogPostItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function openCreateModal() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFieldErrors({});
    setIsModalOpen(true);
  }

  function openEditModal(post: BlogPostItem) {
    setEditingId(post._id);
    setFieldErrors({});
    setFormData({
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      readTime: post.readTime,
      publishedAt: post.publishedAt,
      image: post.image,
      author: post.author,
      authorRole: post.authorRole,
      content: post.content.join('\n\n'),
      status: post.status,
    });
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title) {
      setFieldErrors({ title: 'Article title is required' });
      toast.error('Article title is required');
      return;
    }

    setFieldErrors({});
    setSaving(true);
    try {
      const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const contentParagraphs = formData.content.split('\n\n').map((p) => p.trim()).filter(Boolean);

      const payload = {
        title: formData.title,
        slug,
        category: formData.category,
        excerpt: formData.excerpt,
        readTime: formData.readTime,
        publishedAt: formData.publishedAt,
        image: formData.image,
        author: formData.author,
        authorRole: formData.authorRole,
        content: contentParagraphs.length > 0 ? contentParagraphs : [formData.excerpt],
        status: formData.status,
      };

      const url = editingId ? `/api/admin/blog/${editingId}` : '/api/admin/blog';
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
        throw new Error(json.error ?? 'Failed to save article');
      }

      toast.success(editingId ? `Article "${formData.title}" updated` : `Article "${formData.title}" published`);
      setIsModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete article');
      toast.success('Article deleted');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete article');
    } finally {
      setDeleting(null);
    }
  }

  const fieldClass = (field: string) =>
    `w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors ${
      fieldErrors[field] ? FIELD_ERROR_CLASS : ''
    }`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Journal & Editorial Stories</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-sans">Manage couture fashion stories, bespoke styling guides, and heritage essays</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-5 py-2 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm cursor-pointer"
        >
          <Plus size={14} className="text-[#C9A86A]" /> Write Article
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Article', 'Category', 'Author', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-5 py-2.5 font-sans font-medium text-[#2E221C] text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative bg-[#FAF7F2] shrink-0 rounded-lg overflow-hidden border border-[#DDD2C5]">
                        <Image src={post.image} alt={post.title} fill sizes="48px" className="object-cover" />
                      </div>
                      <span className="truncate max-w-[280px]">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5 text-[#C9A86A] font-semibold">{post.category}</td>
                  <td className="px-5 py-2.5 text-[#2E221C] font-medium">{post.author}</td>
                  <td className="px-5 py-2.5">
                    <span className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase tracking-wider font-semibold ${
                      post.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#FAF7F2] text-[#8A6A55] border border-[#DDD2C5]'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-[#8A6A55]">{post.publishedAt}</td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setViewing(post)}
                        className="p-1 rounded text-[#8A6A55] hover:text-[#2E221C] transition-colors cursor-pointer"
                        title="View Article"
                      >
                        <Eye size={14} />
                      </button>
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded text-[#8A6A55] hover:text-[#2E221C] transition-colors"
                        title="Preview Live"
                      >
                        <BookOpen size={14} />
                      </a>
                      <button
                        onClick={() => openEditModal(post)}
                        className="p-1 rounded text-[#8A6A55] hover:text-[#2E221C] transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={deleting === post._id}
                        className="p-1 rounded text-[#8A6A55] hover:text-red-600 transition-colors disabled:opacity-40 cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A6A55]">
                    No articles published yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl p-4 sm:p-7 rounded-2xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
              <h3 className="font-sans font-semibold text-[#2E221C] text-base">
                {editingId ? 'Edit Editorial Story' : 'Write New Editorial Story'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Article Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Art of Zardozi: Handcrafted Elegance"
                  className={fieldClass('title')}
                />
                {fieldErrors.title && <p className="text-xs text-red-600 mt-1">{fieldErrors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Bridal Heritage"
                    className={fieldClass('category')}
                  />
                </div>
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="4 min read"
                    className={fieldClass('readTime')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Cover Image Path / URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/hero-banner.webp"
                  className={`${fieldClass('image')} font-mono text-[11px]`}
                />
                {fieldErrors.image && <p className="text-xs text-red-600 mt-1">{fieldErrors.image}</p>}
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short introductory summary for the article card..."
                  className={fieldClass('excerpt')}
                />
                {fieldErrors.excerpt && <p className="text-xs text-red-600 mt-1">{fieldErrors.excerpt}</p>}
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Full Content (Separate paragraphs with double Enter)</label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full editorial story here..."
                  className={fieldClass('content')}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Published Date</label>
                  <input
                    type="text"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className={fieldClass('publishedAt')}
                  />
                </div>
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                    className={fieldClass('status')}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

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
                  <Check size={13} className="text-[#C9A86A]" /> {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-4 sm:p-7 rounded-2xl shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
              <h3 className="font-sans font-semibold text-[#2E221C] text-base">{viewing.title}</h3>
              <button onClick={() => setViewing(null)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#DDD2C5]">
              <Image src={viewing.image} alt={viewing.title} fill sizes="500px" className="object-cover" />
            </div>
            <div className="space-y-3 text-[#2E221C]">
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">By:</span>
                <span className="font-medium">{viewing.author} ({viewing.authorRole})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Category:</span>
                <span className="font-medium">{viewing.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Slug:</span>
                <span className="font-mono">{viewing.slug}</span>
              </div>
              <p className="italic text-[#8A6A55]">{viewing.excerpt}</p>
              <div className="space-y-2 pt-2">
                {viewing.content.map((p, i) => (
                  <p key={i} className="text-[#2E221C] leading-relaxed">{p}</p>
                ))}
              </div>
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
