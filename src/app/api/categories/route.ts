import { NextRequest, NextResponse } from 'next/server';
import { categoryRepository } from '@/server/repositories/category.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { CreateCategorySchema } from '@/validators/category.validators';

export async function GET() {
  try {
    const categories = await categoryRepository.findAll();
    return NextResponse.json(
      { success: true, data: categories },
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
    const validated = CreateCategorySchema.parse(body);
    const created = await categoryRepository.create(validated);
    logAdminAction(session, req, 'CATEGORY_CREATE', `Created category "${created.name}"`);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
