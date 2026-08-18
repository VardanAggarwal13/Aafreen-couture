import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/server/services/product.service';
import { handleApiError } from '@/lib/api-errors';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await productService.getProductBySlug(slug);

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleApiError(error);
  }
}
