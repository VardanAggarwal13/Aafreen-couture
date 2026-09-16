import { NextRequest, NextResponse } from 'next/server';
import { bannerRepository } from '@/server/repositories/banner.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { CreateBannerSchema } from '@/validators/banner.validators';
import type { IBanner } from '@/models/Banner';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const banners = await bannerRepository.findAll();
    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin(request);
    const body = await request.json();
    const data = CreateBannerSchema.parse(body);
    const created = await bannerRepository.create(data as unknown as Partial<IBanner>);
    logAdminAction(session, request, 'BANNER_CREATE', `Created banner "${created.title}"`);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
