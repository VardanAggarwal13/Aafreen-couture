import { NextRequest, NextResponse } from 'next/server';
import { collectionRepository } from '@/server/repositories/collection.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { CreateCollectionSchema } from '@/validators/category.validators';

export async function GET(request: NextRequest) {
  try {
    const wantsInactive = request.nextUrl.searchParams.get('includeInactive') === 'true';
    let includeInactive = false;
    if (wantsInactive) {
      try {
        await requireAdmin(request);
        includeInactive = true;
      } catch {
        includeInactive = false;
      }
    }
    const collections = await collectionRepository.findAll(includeInactive);
    return NextResponse.json(
      { success: true, data: collections },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin(req);
    const body = await req.json();
    const validated = CreateCollectionSchema.parse(body);
    const created = await collectionRepository.create(validated);
    logAdminAction(session, req, 'COLLECTION_CREATE', `Created collection "${created.name}"`);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
