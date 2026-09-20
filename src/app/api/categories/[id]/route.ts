import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { categoryRepository } from '@/server/repositories/category.repository';
import { categoryService } from '@/server/services/category.service';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { UpdateCategorySchema } from '@/validators/category.validators';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const category = await categoryRepository.findById(id);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    return NextResponse.json(
      { success: true, data: category },
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
    const validated = UpdateCategorySchema.parse(body);
    const updated = await categoryRepository.update(id, validated);
    if (!updated) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    logAdminAction(session, req, 'CATEGORY_UPDATE', `Updated category "${updated.name}"`);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/categories');
      revalidatePath('/admin/products');
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
    await categoryService.deleteCategory(id);
    logAdminAction(session, req, 'CATEGORY_DELETE', `Deleted category ${id}`);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/categories');
      revalidatePath('/admin/products');
      revalidatePath('/shop');
    } catch {
      // Ignore in non-standard environments
    }

    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
