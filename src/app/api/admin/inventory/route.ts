import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/server/services/product.service';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { z } from 'zod';

const BatchSchema = z.object({
  updates: z.array(
    z.object({
      productId: z.string().min(1),
      sku: z.string().min(1),
      stock: z.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
    })
  ).min(1),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAdmin(request);
    const body = await request.json();
    const { updates } = BatchSchema.parse(body);
    const result = await productService.updateVariantStockBatch(updates);
    logAdminAction(session, request, 'INVENTORY_UPDATE', `Updated stock for ${result.updated} variant(s)`);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
