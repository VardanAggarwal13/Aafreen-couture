'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useWishlistStore } from '@/store/wishlist.store';
import { ProductCard } from '@/components/product/ProductCard';
import { api } from '@/utils/api';
import type { IProduct } from '@/types';
import type { ApiResponse } from '@/types/api.types';

export function WishlistClient() {
  const ids = useWishlistStore((s) => s.items);

  const { data, isLoading } = useQuery<ApiResponse<IProduct[]>>({
    queryKey: ['wishlist-products', ids],
    queryFn: () => api.get<IProduct[]>(`/api/products?ids=${ids.join(',')}&limit=100`),
    enabled: ids.length > 0,
  });

  if (ids.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-brand-cream flex items-center justify-center mx-auto mb-5">
          <Heart size={24} className="text-brand-gold" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-serif text-brand-black mb-3">Your wishlist is empty</h2>
        <p className="text-sm text-brand-stone mb-8 max-w-xs mx-auto">
          Save pieces you love and come back to them later.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-brand-gold text-white text-[11px] font-semibold tracking-[0.22em] uppercase px-8 py-3.5 hover:bg-[#b8893f] transition-colors"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  const products = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {ids.map((id) => (
          <div key={id} className="aspect-[3/4] bg-brand-cream animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-brand-stone mb-6">
        {products.length} {products.length === 1 ? 'item' : 'items'} saved
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id as string} product={product} />
        ))}
      </div>
    </div>
  );
}
