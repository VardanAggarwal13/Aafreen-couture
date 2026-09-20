import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { productService } from '@/server/services/product.service';
import { productRepository } from '@/server/repositories/product.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { UpdateProductSchema } from '@/validators/product.validators';
import type { IProduct } from '@/models/Product';

interface Props { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const product = await productService.getProductBySlug(slug);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { slug } = await params;
    const body = await request.json();
    const data = UpdateProductSchema.parse(body);
    const updated = await productRepository.update(slug, data as unknown as Partial<IProduct>);
    if (!updated) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    logAdminAction(session, request, 'PRODUCT_UPDATE', `Updated product "${updated.name}"`);

    // Invalidate caches immediately across the entire site
    productRepository.clearCache();
    try {
      revalidatePath('/', 'layout');
      revalidatePath(`/product/${updated.slug}`);
      revalidatePath('/admin/products');
      revalidatePath('/shop');
      revalidatePath('/bridal');
      revalidatePath('/bridal/bridal-lehengas');
      revalidatePath('/suits');
      revalidatePath('/occasions');
      revalidatePath('/collections');
      revalidatePath('/ready-to-wear');
      revalidatePath('/bags');
      revalidatePath('/jewellery');
      revalidatePath('/cart');
    } catch {
      // Ignore cache revalidation errors in non-standard environments
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { slug } = await params;
    const deleted = await productRepository.delete(slug);
    logAdminAction(session, request, 'PRODUCT_DELETE', `Deleted product ${slug}`);

    // Invalidate caches immediately across the entire site
    productRepository.clearCache();
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/products');
      revalidatePath('/shop');
      revalidatePath('/bridal');
      revalidatePath('/suits');
      revalidatePath('/occasions');
      revalidatePath('/collections');
      revalidatePath('/ready-to-wear');
      revalidatePath('/bags');
      revalidatePath('/jewellery');
      revalidatePath('/cart');
    } catch {
      // Ignore cache revalidation errors in non-standard environments
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return handleApiError(error);
  }
}
