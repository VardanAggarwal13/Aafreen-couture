import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { productService } from '@/server/services/product.service';
import { productRepository } from '@/server/repositories/product.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { CreateProductSchema } from '@/validators/product.validators';
import type { ProductFilters } from '@/server/repositories/product.repository';
import type { IProduct } from '@/models/Product';

export const dynamic = 'force-dynamic';

const MAX_IDS = 50;
const SORTS = ['newest', 'price-asc', 'price-desc', 'popular', 'rating'] as const;

/** Trimmed, length-capped text filter; empty becomes undefined. */
function text(value: string | null): string | undefined {
  const v = value?.trim().slice(0, 100);
  return v ? v : undefined;
}

/** A non-negative finite number, or undefined (never NaN, which would break the database query). */
function price(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const idsParam = searchParams.get('ids');
    const ids = idsParam
      ? idsParam.split(',').map((s) => s.trim()).filter(Boolean).slice(0, MAX_IDS)
      : undefined;

    const isActiveParam = searchParams.get('isActive');
    let isActive = isActiveParam === 'false' ? false : isActiveParam === 'true' ? true : undefined;
    let includeInactive = searchParams.get('all') === 'true' || searchParams.get('includeInactive') === 'true';

    // Unpublished / inactive products are private. Only an admin may see them; for anyone else the
    // request quietly falls back to the public catalogue.
    let wantsPrivate = includeInactive || isActive === false;
    if (wantsPrivate) {
      try {
        await requireAdmin(request);
      } catch {
        includeInactive = false;
        if (isActive === false) isActive = undefined;
        wantsPrivate = false;
      }
    }

    const filters: ProductFilters = {
      ids,
      category: text(searchParams.get('category')),
      collectionRef: text(searchParams.get('collection')),
      occasion: text(searchParams.get('occasion')),
      color: text(searchParams.get('color')),
      size: text(searchParams.get('size')),
      fabric: text(searchParams.get('fabric')),
      minPrice: price(searchParams.get('minPrice')),
      maxPrice: price(searchParams.get('maxPrice')),
      sort: SORTS.includes(searchParams.get('sort') as never) ? (searchParams.get('sort') as ProductFilters['sort']) : undefined,
      search: text(searchParams.get('q')),
      isActive,
      includeInactive,
      isFeatured: searchParams.get('featured') === 'true' ? true : undefined,
      isNewArrival: searchParams.get('new') === 'true' ? true : undefined,
      isBestSeller: searchParams.get('bestseller') === 'true' ? true : undefined,
    };

    const pagination = {
      page: Math.max(1, Number(searchParams.get('page') ?? 1)),
      limit: Math.min(Math.max(1, Number(searchParams.get('limit') ?? 24)), 100),
    };

    const result = await productService.getProducts(filters, pagination);

    // Public catalogue reads may be shared by the CDN for a minute (matching the 2-minute page
    // cache); anything private to the admin is never cached.
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': wantsPrivate
          ? 'private, no-store'
          : 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin(request);
    const body = await request.json();
    const validated = CreateProductSchema.parse(body);
    const created = await productRepository.create(validated as unknown as Partial<IProduct>);
    logAdminAction(session, request, 'PRODUCT_CREATE', `Created product "${created.name}"`);

    // Invalidate caches immediately across the entire site
    productRepository.clearCache();
    try {
      revalidatePath('/', 'layout');
      revalidatePath(`/product/${created.slug}`);
      revalidatePath('/admin/products');
      revalidatePath('/shop');
      revalidatePath('/bridal');
      revalidatePath('/suits');
      revalidatePath('/occasions');
      revalidatePath('/collections');
      revalidatePath('/ready-to-wear');
      revalidatePath('/bags');
      revalidatePath('/jewellery');
    } catch {
      // Ignore in non-standard runtimes
    }

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
