import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/server/services/product.service';
import { productRepository } from '@/server/repositories/product.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { CreateProductSchema } from '@/validators/product.validators';
import type { ProductFilters } from '@/server/repositories/product.repository';
import type { IProduct } from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const idsParam = searchParams.get('ids');
    const ids = idsParam ? idsParam.split(',').map((s) => s.trim()).filter(Boolean) : undefined;

    const filters: ProductFilters = {
      ids,
      category: searchParams.get('category') ?? undefined,
      collectionRef: searchParams.get('collection') ?? undefined,
      occasion: searchParams.get('occasion') ?? undefined,
      color: searchParams.get('color') ?? undefined,
      size: searchParams.get('size') ?? undefined,
      fabric: searchParams.get('fabric') ?? undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sort: (searchParams.get('sort') as ProductFilters['sort']) ?? undefined,
      search: searchParams.get('q') ?? undefined,
      isFeatured: searchParams.get('featured') === 'true' ? true : undefined,
      isNewArrival: searchParams.get('new') === 'true' ? true : undefined,
      isBestSeller: searchParams.get('bestseller') === 'true' ? true : undefined,
    };

    const pagination = {
      page: Math.max(1, Number(searchParams.get('page') ?? 1)),
      limit: Math.min(Math.max(1, Number(searchParams.get('limit') ?? 24)), 100),
    };

    const result = await productService.getProducts(filters, pagination);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const validated = CreateProductSchema.parse(body);
    const created = await productRepository.create(validated as unknown as Partial<IProduct>);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
