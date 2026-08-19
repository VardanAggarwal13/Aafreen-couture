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
      toast.success(`Article "${formData.title}" updated`);
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
      toast.success(`Article "${formData.title}" published`);
    }
    setIsModalOpen(false);
  }

  function handleDelete(slug: string) {
    if (!confirm('Delete this article?')) return;
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
    toast.success('Article deleted');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Journal & Editorial Articles</h1>
          <p className="text-xs text-white/40 mt-0.5">Manage fashion stories, bridal guides, and craftsmanship essays</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-brand-gold text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 hover:bg-brand-gold/90 transition-colors rounded-xs"
        >
          <Plus size={14} /> Write Article
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Article', 'Category', 'Author', 'Read Time', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white flex items-center gap-3">
                    <div className="w-10 h-10 relative bg-white/5 shrink-0 rounded-xs overflow-hidden">
                      <Image src={post.image} alt={post.title} fill className="object-cover" />
                    </div>
                    <span className="truncate max-w-[260px]">{post.title}</span>
                  </td>
                  <td className="px-4 py-3 text-brand-gold font-medium">
                    {post.category}
                  </td>
                  <td className="px-4 py-3 text-white/70">
                    {post.author}
                  </td>
                  <td className="px-4 py-3 text-white/50">
                    {post.readTime}
                  </td>
                  <td className="px-4 py-3 text-white/50">
                    {post.publishedAt}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white/40 hover:text-white transition-colors"
                        title="Preview"
                      >
                        <BookOpen size={13} />
                      </a>
                      <button
                        onClick={() => openEditModal(post)}
                        className="text-white/40 hover:text-brand-gold transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="text-white/40 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
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
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-white/10 w-full max-w-2xl p-6 rounded-xs shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="font-semibold text-white text-sm">
                {editingSlug ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Article Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Art of Zardozi: Handcrafted Elegance"
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none focus:border-brand-gold/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Bridal Heritage"
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="4 min read"
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Cover Image Path / URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/hero-banner.webp"
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none focus:border-brand-gold/50"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short introductory summary for the article card"
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Full Content (Separate paragraphs with double Enter)</label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full editorial story here..."
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none"
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
                  <Check size={13} /> {editingSlug ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
