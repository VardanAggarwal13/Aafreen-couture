import { AdminBlogClient } from '@/features/admin/components/AdminBlogClient';
import { blogRepository } from '@/server/repositories/blog.repository';

export const metadata = { title: 'Journal & Blog | Admin' };

export default async function AdminBlogPage() {
  const posts = await blogRepository.findAllForAdmin();
  const serialized = JSON.parse(JSON.stringify(posts));

  return <AdminBlogClient posts={serialized} />;
}
