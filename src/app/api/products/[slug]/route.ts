import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/server/services/product.service';
import { productRepository } from '@/server/repositories/product.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';

interface Props { params: Promise<{ slug: string }> }

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const product = await productService.getProductBySlug(slug);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    await requireAdmin(request);
    const { slug } = await params;
    const body = await request.json();
    const updated = await productRepository.update(slug, body);
    if (!updated) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await requireAdmin(request);
    const { slug } = await params;
    const deleted = await productRepository.delete(slug);
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return handleApiError(error);
  }
}
