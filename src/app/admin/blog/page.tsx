import { AdminBlogClient } from '@/features/admin/components/AdminBlogClient';
import { blogRepository } from '@/server/repositories/blog.repository';
import { sanitizeBlogHtml } from '@/lib/blog-html';

export const metadata = { title: 'Journal & Blog | Admin' };

export default async function AdminBlogPage() {
  const posts = await blogRepository.findAllForAdmin();
  // The formatted body is cleaned when saved; it is cleaned again before it is shown in the admin preview.
  const serialized = JSON.parse(JSON.stringify(posts)).map((p: { contentHtml?: string }) =>
    p.contentHtml ? { ...p, contentHtml: sanitizeBlogHtml(p.contentHtml) } : p
  );

  return <AdminBlogClient posts={serialized} />;
}
