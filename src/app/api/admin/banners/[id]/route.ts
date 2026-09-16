import { NextRequest, NextResponse } from 'next/server';
import { bannerRepository } from '@/server/repositories/banner.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { UpdateBannerSchema } from '@/validators/banner.validators';
import type { IBanner } from '@/models/Banner';

interface Props { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const data = UpdateBannerSchema.parse(body);
    const updated = await bannerRepository.update(id, data as unknown as Partial<IBanner>);
    if (!updated) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    logAdminAction(session, request, 'BANNER_UPDATE', `Updated banner "${updated.title}"`);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;
    const deleted = await bannerRepository.delete(id);
    if (!deleted) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    logAdminAction(session, request, 'BANNER_DELETE', `Deleted banner ${id}`);
    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
