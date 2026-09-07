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

  return (
    <motion.article
      className={cn('group relative flex flex-col', className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF7F2] border border-[#E8D8C8] rounded-xs shadow-2xs">
        <Link href={ROUTES.PRODUCT(product.slug)} className="block w-full h-full">
          <Image
            src={product.images[0] ?? '/images/products/shahi-sindoori-red-bridal-lehenga-0929.webp'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={priority}
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} — alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none z-10">
          {discountPct && (
            <span className="bg-[#A67C52] text-white text-[9.5px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs">
              -{discountPct}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#221617] text-white text-[9.5px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs">
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
            'absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs transition-all shadow-xs z-10',
            isWishlisted ? 'text-[#A67C52]' : 'text-[#221617]/70 hover:text-[#A67C52]'
          )}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={15} fill={isWishlisted ? '#A67C52' : 'none'} />
        </button>
      </div>

      {/* Info matching reference image */}
      <div className="pt-3 flex flex-col gap-1 text-center sm:text-left">
        <Link href={ROUTES.PRODUCT(product.slug)} className="hover:text-[#A67C52] transition-colors">
          <h3 className="font-serif text-sm font-medium text-[#221617] line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {product.fabric && (
          <p className="text-[11px] text-[#6E6A66] uppercase tracking-wider">{product.fabric}</p>
        )}

        <div className="flex items-baseline gap-2 mt-0.5 justify-center sm:justify-start">
          <span className="text-sm font-serif font-semibold text-[#221617]">
            {formatPrice(product.basePrice)}
          </span>
          {product.comparePrice && product.comparePrice > product.basePrice && (
            <span className="text-xs text-[#6E6A66] line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
