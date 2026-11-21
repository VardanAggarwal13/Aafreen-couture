import type { Metadata } from 'next';
import { productRepository } from '@/server/repositories/product.repository';
import { AdminInventoryClient, type InventoryItem } from '@/features/admin/components/AdminInventoryClient';
import type { InventoryProduct } from '@/features/admin/components/InventoryProductModal';

export const metadata: Metadata = { title: 'Inventory | Admin' };

/** The category is loaded with each product; it may be missing if the product has none. */
function categoryName(category: unknown): string {
  if (category && typeof category === 'object' && 'name' in category) {
    const name = (category as { name?: unknown }).name;
    if (typeof name === 'string' && name.trim()) return name;
  }
  return 'Uncategorized';
}

export default async function AdminInventoryPage() {
  const { items } = await productRepository.findMany({ includeInactive: true }, { limit: 500 });
  const products = JSON.parse(JSON.stringify(items));

  const inventoryList: InventoryItem[] = [];
  const productInfo: Record<string, InventoryProduct> = {};

  products.forEach((p: Record<string, unknown>) => {
    const variants = (p.variants as Array<{ size?: string; color?: string; stock: number; price: number; sku: string; images?: string[] }>) ?? [];

    // Pictures for the view modal: the product's own, else the first picture of each variant.
    const own = ((p.images as string[] | undefined) ?? []).filter(Boolean);
    const fallback = variants.flatMap((v) => (v.images ?? []).slice(0, 1)).filter(Boolean);
    productInfo[p._id as string] = {
      id: p._id as string,
      slug: (p.slug as string) ?? '',
      name: p.name as string,
      category: categoryName(p.category),
      images: own.length > 0 ? own : fallback,
      shortDescription: (p.shortDescription as string) ?? '',
      fabric: (p.fabric as string) ?? '',
      occasions: Array.isArray(p.occasion) ? (p.occasion as string[]) : p.occasion ? [String(p.occasion)] : [],
      basePrice: (p.basePrice as number) ?? 0,
      comparePrice: (p.comparePrice as number) ?? 0,
      isActive: !!p.isActive,
    };
    variants.forEach((v, idx) => {
      inventoryList.push({
        id: `${p._id as string}-${idx}`,
        productId: p._id as string,
        name: p.name as string,
        category: categoryName(p.category),
        sku: v.sku,
        size: v.size || '',
        color: v.color || '',
        stock: v.stock ?? 0,
        price: v.price || (p.basePrice as number) || 0,
        isActive: !!p.isActive,
      });
    });
  });

  return <AdminInventoryClient initialItems={inventoryList} products={productInfo} />;
}
