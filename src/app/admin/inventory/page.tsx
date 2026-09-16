import type { Metadata } from 'next';
import { productRepository } from '@/server/repositories/product.repository';
import { AdminInventoryClient, type InventoryItem } from '@/features/admin/components/AdminInventoryClient';

export const metadata: Metadata = { title: 'Inventory | Admin' };

export default async function AdminInventoryPage() {
  const { items } = await productRepository.findMany({ isActive: undefined }, { limit: 100 });
  const products = JSON.parse(JSON.stringify(items));

  const inventoryList: InventoryItem[] = [];

  products.forEach((p: Record<string, unknown>) => {
    const variants = (p.variants as Array<{ size?: string; color?: string; stock: number; price: number; sku: string }>) ?? [];
    variants.forEach((v, idx) => {
      inventoryList.push({
        id: `${p._id as string}-${idx}`,
        productId: p._id as string,
        name: p.name as string,
        sku: v.sku,
        size: v.size || '',
        color: v.color || '',
        stock: v.stock ?? 0,
        price: v.price || (p.basePrice as number) || 0,
        isActive: !!p.isActive,
      });
    });
  });

  return <AdminInventoryClient initialItems={inventoryList} />;
}
