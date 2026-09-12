'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatPrice, getDiscountPercentage } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { useWishlistStore } from '@/store/wishlist.store';
import type { IProduct } from '@/types';

interface ProductCardProps {
  product: IProduct;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority = false, className }: ProductCardProps) {
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isInWishlist(product._id));

  const discountPct =
    product.comparePrice && product.comparePrice > product.basePrice
      ? getDiscountPercentage(product.basePrice, product.comparePrice)
      : null;

  const primaryImage = product.images?.[0] ?? '/images/products/shahi-sindoori-red-bridal-lehenga-0929.webp';
  const secondaryImage = product.images?.[1] && product.images[1] !== primaryImage ? product.images[1] : null;

  return (
    <article
      className={cn('group relative flex flex-col transition-all duration-300', className)}
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF7F2] border border-border rounded-xs shadow-2xs">
        <Link href={ROUTES.PRODUCT(product.slug)} className="block w-full h-full relative">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} — alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105 pointer-events-none"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none">
          {discountPct && (
            <span className="bg-gold text-white text-[9.5px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs">
              {discountPct}% Off
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-heading text-surface text-[9.5px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs">
              New
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon — Always visible on image top right as in reference mockup */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product._id);
          }}
          className={cn(
            'absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-xs flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer',
            isWishlisted ? 'text-gold' : 'text-heading/70 hover:text-gold'
          )}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info matching reference image */}
      <div className="pt-3 flex flex-col gap-1 text-center sm:text-left">
        <Link href={ROUTES.PRODUCT(product.slug)} className="hover:text-gold transition-colors">
          <h3 className="font-sans text-sm font-semibold text-heading line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {product.fabric && (
          <p className="text-[11px] text-text uppercase tracking-wider">{product.fabric}</p>
        )}

        <div className="flex items-baseline gap-2 mt-0.5 justify-center sm:justify-start">
          <span className="text-sm font-sans font-bold text-heading">
            {formatPrice(product.basePrice)}
          </span>
          {product.comparePrice && product.comparePrice > product.basePrice && (
            <span className="text-xs text-text/80 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
