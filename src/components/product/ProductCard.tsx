import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatPrice, getDiscountPercentage } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { WishlistHeartButton } from '@/components/product/WishlistHeartButton';
import type { IProduct } from '@/types';

interface ProductCardProps {
  product: IProduct;
  priority?: boolean;
  className?: string;
  /** Heading level for the product name; use 'h2' on pages whose only higher heading is the h1. */
  headingLevel?: 'h2' | 'h3';
}

export function ProductCard({ product, priority = false, className, headingLevel = 'h3' }: ProductCardProps) {
  const Heading = headingLevel;
  const discountPct =
    product.comparePrice && product.comparePrice > product.basePrice
      ? getDiscountPercentage(product.basePrice, product.comparePrice)
      : null;

  const primaryImage = product.images?.[0] ?? 'https://res.cloudinary.com/adzbklts/image/upload/v1791872431/aafreen-couture/products/shahi-sindoori-red-bridal-lehenga-0929.webp';
  const secondaryImage = product.images?.[1] && product.images[1] !== primaryImage ? product.images[1] : null;

  return (
    <article
      className={cn('group relative flex flex-col transition-all duration-300', className)}
    >
      {/* Image container — 9:16 aspect ratio to show full-length couture silhouettes and palazzo hemlines without cropping */}
      <div
        className={cn(
          'relative aspect-[9/16] overflow-hidden rounded-xl shadow-sm transition-all',
          typeof product.category === 'object' && product.category?.slug === 'indo-western'
            ? 'bg-[#160B0C]'
            : 'bg-[#FAF7F2]'
        )}
      >
        <Link href={ROUTES.PRODUCT(product.slug)} className="block w-full h-full relative">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 40em) 50vw, (max-width: 64em) 33vw, 25vw"
            priority={priority}
            quality={80}
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} — alternate view`}
              fill
              sizes="(max-width: 40em) 50vw, (max-width: 64em) 33vw, 25vw"
              quality={80}
              className="[@media(hover:none)]:hidden object-cover object-center opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105 pointer-events-none"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none">
          {discountPct && (
            <span className="bg-gold text-heading text-[0.59375rem] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md">
              {discountPct}% Off
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-heading text-surface text-[0.59375rem] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md">
              New
            </span>
          )}
        </div>

        {/* Wishlist heart: the only client-side piece of the card */}
        <WishlistHeartButton productId={product._id} />
      </div>

      {/* Info matching reference image */}
      <div className="pt-3 flex flex-col gap-1 text-center sm:text-left">
        <Link href={ROUTES.PRODUCT(product.slug)} className="hover:text-gold transition-colors">
          <Heading className="font-sans text-sm font-semibold text-heading line-clamp-1">
            {product.name}
          </Heading>
        </Link>

        {product.fabric && (
          <p className="text-[0.6875rem] text-text uppercase tracking-wider">{product.fabric}</p>
        )}

        <div className="flex items-baseline gap-2 mt-0.5 justify-center sm:justify-start">
          <span className="text-sm font-sans font-bold text-heading">
            {formatPrice(product.basePrice)}
          </span>
          {product.comparePrice && product.comparePrice > product.basePrice && (
            <span className="text-xs text-text line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
