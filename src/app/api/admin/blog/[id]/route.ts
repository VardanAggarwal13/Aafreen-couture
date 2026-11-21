import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { blogRepository } from '@/server/repositories/blog.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { UpdateBlogPostSchema } from '@/validators/blog.validators';
import type { IBlogPost } from '@/models/BlogPost';

interface Props { params: Promise<{ id: string }> }

/** Makes the public journal show a change straight away instead of after the cache expires. */
function refreshBlogPages(slug?: string): void {
  try {
    revalidatePath('/blog');
    if (slug) revalidatePath(`/blog/${slug}`);
    revalidatePath('/sitemap.xml');
  } catch {
    // not available outside the Next.js runtime
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const data = UpdateBlogPostSchema.parse(body);
    const updated = await blogRepository.update(id, data as unknown as Partial<IBlogPost>);
    if (!updated) return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    logAdminAction(session, request, 'BLOG_POST_UPDATE', `Updated article "${updated.title}"`);
    refreshBlogPages(updated.slug);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;
    const existing = await blogRepository.findById(id);
    const deleted = await blogRepository.delete(id);
    if (!deleted) return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    refreshBlogPages(existing?.slug);
    logAdminAction(session, request, 'BLOG_POST_DELETE', `Deleted article ${id}`);
    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
