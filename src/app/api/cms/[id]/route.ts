import { NextRequest, NextResponse } from 'next/server';
import { cmsRepository } from '@/server/repositories/cms.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { UpdateCmsPageSchema } from '@/validators/cms.validators';

interface Props { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const page = await cmsRepository.findById(id);
    if (!page) return NextResponse.json({ error: 'CMS page not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const validated = UpdateCmsPageSchema.parse(body);
    const updated = await cmsRepository.update(id, validated);
    if (!updated) return NextResponse.json({ error: 'CMS page not found' }, { status: 404 });
    logAdminAction(session, req, 'CMS_PAGE_UPDATE', `Updated CMS page "${updated.title}"`);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(req);
    const { id } = await params;
    const deleted = await cmsRepository.delete(id);
    logAdminAction(session, req, 'CMS_PAGE_DELETE', `Deleted CMS page ${id}`);
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return handleApiError(error);
  }
}
