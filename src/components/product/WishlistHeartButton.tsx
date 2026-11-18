'use client';

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlist.store';

/**
 * The only interactive part of a product card. Kept tiny and separate so the rest of the
 * card can render on the server and ship no JavaScript.
 */
export function WishlistHeartButton({ productId }: { productId: string }) {
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isInWishlist(productId));

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle(productId);
      }}
      className={cn(
        'absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-xs flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer',
        isWishlisted ? 'text-gold' : 'text-heading/70 hover:text-gold'
      )}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart size="0.9375rem" fill={isWishlisted ? 'currentColor' : 'none'} />
    </button>
  );
}
