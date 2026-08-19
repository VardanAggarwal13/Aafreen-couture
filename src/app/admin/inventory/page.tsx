import type { Metadata } from 'next';
import { productRepository } from '@/server/repositories/product.repository';
import { AdminInventoryClient, type InventoryItem } from '@/features/admin/components/AdminInventoryClient';

export const metadata: Metadata = { title: 'Inventory | Admin' };

export default async function AdminInventoryPage() {
  const { items } = await productRepository.findMany({ isActive: undefined }, { limit: 100 });
  const products = JSON.parse(JSON.stringify(items));

  const inventoryList: InventoryItem[] = [];

  products.forEach((p: Record<string, unknown>) => {
    const variants = (p.variants as Array<{ size?: string; color?: string; stock: number; price: number; sku?: string }>) ?? [];
    if (variants.length === 0) {
      inventoryList.push({
        id: p._id as string,
        name: p.name as string,
        sku: (p.sku as string) || (p.slug as string) || 'AFR-ITEM',
        size: 'Standard',
        color: 'Original',
        stock: (p.stock as number) ?? 10,
        price: (p.price as number) || (p.basePrice as number) || 0,
        isActive: !!p.isActive,
      });
    } else {
      variants.forEach((v, idx) => {
        inventoryList.push({
          id: `${p._id as string}-${idx}`,
          name: p.name as string,
          sku: v.sku || `${(p.slug as string)?.toUpperCase()}-${v.size || idx}`,
          size: v.size || '',
          color: v.color || '',
          stock: v.stock ?? 0,
          price: v.price || (p.basePrice as number) || 0,
          isActive: !!p.isActive,
        });
      });
    }
  });

  return <AdminInventoryClient initialItems={inventoryList} />;
}
