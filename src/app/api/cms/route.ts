import { NextRequest, NextResponse } from 'next/server';
import { cmsRepository } from '@/server/repositories/cms.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { CreateCmsPageSchema } from '@/validators/cms.validators';

export async function GET() {
  try {
    const pages = await cmsRepository.findAll();
    return NextResponse.json({ success: true, data: pages });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin(req);
    const body = await req.json();
    const validated = CreateCmsPageSchema.parse(body);
    const created = await cmsRepository.create(validated);
    logAdminAction(session, req, 'CMS_PAGE_CREATE', `Created CMS page "${created.title}"`);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
