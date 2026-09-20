import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { collectionRepository } from '@/server/repositories/collection.repository';
import { collectionService } from '@/server/services/collection.service';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { UpdateCollectionSchema } from '@/validators/category.validators';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const collection = await collectionRepository.findById(id);
    if (!collection) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    return NextResponse.json(
      { success: true, data: collection },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const validated = UpdateCollectionSchema.parse(body);
    const updated = await collectionRepository.update(id, validated);
    if (!updated) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    logAdminAction(session, req, 'COLLECTION_UPDATE', `Updated collection "${updated.name}"`);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/collections');
      revalidatePath('/collections');
      revalidatePath('/shop');
    } catch {
      // Ignore in non-standard environments
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(req);
    const { id } = await params;
    await collectionService.deleteCollection(id);
    logAdminAction(session, req, 'COLLECTION_DELETE', `Deleted collection ${id}`);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/collections');
      revalidatePath('/collections');
      revalidatePath('/shop');
    } catch {
      // Ignore in non-standard environments
    }

    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
