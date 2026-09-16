import { NextRequest, NextResponse } from 'next/server';
import { blogRepository } from '@/server/repositories/blog.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { CreateBlogPostSchema } from '@/validators/blog.validators';
import type { IBlogPost } from '@/models/BlogPost';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const posts = await blogRepository.findAllForAdmin();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin(request);
    const body = await request.json();
    const data = CreateBlogPostSchema.parse(body);
    const created = await blogRepository.create(data as unknown as Partial<IBlogPost>);
    logAdminAction(session, request, 'BLOG_POST_CREATE', `Published article "${created.title}"`);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
