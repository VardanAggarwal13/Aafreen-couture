import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { categoryRepository } from '@/server/repositories/category.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { CreateCategorySchema } from '@/validators/category.validators';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Inactive categories are only exposed to admins (e.g. the product form needs to keep
    // showing a product's current category even if it was since deactivated).
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
    const categories = await categoryRepository.findAll(includeInactive);
    return NextResponse.json(
      { success: true, data: categories },
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

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin(req);
    const body = await req.json();
    const validated = CreateCategorySchema.parse(body);
    const created = await categoryRepository.create(validated);
    logAdminAction(session, req, 'CATEGORY_CREATE', `Created category "${created.name}"`);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/categories');
      revalidatePath('/admin/products');
      revalidatePath('/shop');
    } catch {
      // Ignore in non-standard environments
    }

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
