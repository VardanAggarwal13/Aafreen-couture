import { NextRequest, NextResponse } from 'next/server';
import { collectionRepository } from '@/server/repositories/collection.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { CreateCollectionSchema } from '@/validators/category.validators';

export async function GET() {
  try {
    const collections = await collectionRepository.findAll();
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
    await requireAdmin(req);
    const body = await req.json();
    const validated = CreateCollectionSchema.parse(body);
    const created = await collectionRepository.create(validated);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
