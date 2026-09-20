'use client';

import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/store/cart.store';
import { api } from '@/utils/api';
import type { IProduct } from '@/types';
import type { ApiResponse } from '@/types/api.types';

/**
 * Global CartSynchronizer component.
 * Automatically validates and syncs persisted localStorage cart items
 * with real-time database prices, availability, and images across the whole app.
 */
export function CartSynchronizer() {
  const items = useCartStore((s) => s.items);
  const syncItemPrices = useCartStore((s) => s.syncItemPrices);

  const productIds = useMemo(() => {
    const ids = new Set<string>();
    items.forEach((i) => {
      if (i.productId) ids.add(i.productId);
      if (i.slug) ids.add(i.slug);
    });
    return Array.from(ids);
  }, [items]);

  const { data: productsData } = useQuery<ApiResponse<IProduct[]>>({
    queryKey: ['global-cart-live-sync', productIds.sort().join(',')],
    queryFn: () => api.get<IProduct[]>(`/api/products?ids=${productIds.join(',')}&limit=100`),
    enabled: productIds.length > 0,
    staleTime: 10 * 1000, // 10s fresh cache
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (productsData?.data && Array.isArray(productsData.data) && productsData.data.length > 0) {
      syncItemPrices(productsData.data);
    }
  }, [productsData, syncItemPrices]);

  return null;
}
