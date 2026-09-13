'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit2, X, Check, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { BLOG_POSTS, type IBlogPost } from '@/data/blog.data';

export function AdminBlogClient() {
  const [posts, setPosts] = useState<IBlogPost[]>(BLOG_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const [formData, setFormData] = useState({
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
  });

  function openCreateModal() {
    setEditingSlug(null);
    setFormData({
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
    });
    setIsModalOpen(true);
  }

  function openEditModal(post: IBlogPost) {
    setEditingSlug(post.slug);
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
    });
    setIsModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Article title is required');
      return;
    }

    const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-');
    const contentParagraphs = formData.content.split('\n\n').filter(Boolean);

    if (editingSlug) {
      setPosts((prev) =>
        prev.map((p) =>
          p.slug === editingSlug
            ? {
                ...p,
                ...formData,
                slug,
                content: contentParagraphs.length > 0 ? contentParagraphs : p.content,
              }
            : p
        )
      );
      toast.success(`Article "${formData.title}" updated successfully`);
    } else {
      const newPost: IBlogPost = {
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
      };
      setPosts((prev) => [newPost, ...prev]);
      toast.success(`Article "${formData.title}" published successfully`);
    }
    setIsModalOpen(false);
  }

  function handleDelete(slug: string) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
    toast.success('Article deleted');
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-wide">Journal & Editorial Stories</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-serif">Manage couture fashion stories, bespoke styling guides, and heritage essays</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm"
        >
          <Plus size={14} className="text-[#C9A86A]" /> Write Article
        </button>
      </div>

      <div className="bg-white border border-[#DDD2C5] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Article', 'Category', 'Author', 'Read Time', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-5 py-4 font-serif font-medium text-[#2E221C] text-sm flex items-center gap-3">
                    <div className="w-12 h-12 relative bg-[#FAF7F2] shrink-0 rounded-lg overflow-hidden border border-[#DDD2C5]">
                      <Image src={post.image} alt={post.title} fill className="object-cover" />
                    </div>
                    <span className="truncate max-w-[280px]">{post.title}</span>
                  </td>
                  <td className="px-5 py-4 text-[#C9A86A] font-semibold">
                    {post.category}
                  </td>
                  <td className="px-5 py-4 text-[#2E221C] font-medium">
                    {post.author}
                  </td>
                  <td className="px-5 py-4 text-[#8A6A55]">
                    {post.readTime}
                  </td>
                  <td className="px-5 py-4 text-[#8A6A55]">
                    {post.publishedAt}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
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
                        className="p-1 rounded text-[#8A6A55] hover:text-[#2E221C] transition-colors"
                        title="Edit Article"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="p-1 rounded text-[#8A6A55] hover:text-red-600 transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDD2C5] w-full max-w-2xl p-6 sm:p-7 rounded-2xl shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD2C5]">
              <h3 className="font-serif font-semibold text-[#2E221C] text-base">
                {editingSlug ? 'Edit Editorial Story' : 'Write New Editorial Story'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md">
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
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Bridal Heritage"
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A]"
                  />
                </div>
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="4 min read"
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A]"
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
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short introductory summary for the article card..."
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A]"
                />
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Full Content (Separate paragraphs with double Enter)</label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full editorial story here..."
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A]"
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
                  <Check size={13} className="text-[#C9A86A]" /> {editingSlug ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
