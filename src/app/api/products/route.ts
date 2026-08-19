import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/server/services/product.service';
import { productRepository } from '@/server/repositories/product.repository';
import { handleApiError } from '@/lib/api-errors';
import type { ProductFilters } from '@/server/repositories/product.repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const filters: ProductFilters = {
      category: searchParams.get('category') ?? undefined,
      collectionRef: searchParams.get('collection') ?? undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sort: (searchParams.get('sort') as ProductFilters['sort']) ?? undefined,
      search: searchParams.get('q') ?? undefined,
      isFeatured: searchParams.get('featured') === 'true' ? true : undefined,
      isNewArrival: searchParams.get('new') === 'true' ? true : undefined,
      isBestSeller: searchParams.get('bestseller') === 'true' ? true : undefined,
    };

    const pagination = {
      page: Number(searchParams.get('page') ?? 1),
      limit: Math.min(Number(searchParams.get('limit') ?? 24), 100),
    };

    const result = await productService.getProducts(filters, pagination);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await productRepository.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
