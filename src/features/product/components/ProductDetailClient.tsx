'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  Share2,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Scissors,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatPrice, getDiscountPercentage } from '@/utils/format';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { ProductCard } from '@/components/product/ProductCard';
import { siteConfig } from '@/config/site.config';
import type { IProduct } from '@/types';

interface Props {
  product: IProduct;
  related: IProduct[];
}

export function ProductDetailClient({ product, related }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [accordionOpen, setAccordionOpen] = useState<string | null>('details');

  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isInWishlist(product._id as string));

  const activeVariant = product.variants?.[selectedVariantIdx];
  const price = activeVariant?.price ?? product.basePrice;
  const comparePrice = activeVariant?.comparePrice ?? product.comparePrice;
  const discountPct = comparePrice && comparePrice > price ? getDiscountPercentage(price, comparePrice) : null;
  const inStock = (activeVariant?.stock ?? 0) > 0;

  const allImages = [
    ...(product.images ?? []),
    ...(activeVariant?.images?.filter((img) => !product.images.includes(img)) ?? []),
  ];

  function handleAddToCart() {
    addItem({
      productId: product._id as string,
      variantId: activeVariant?._id?.toString(),
      name: product.name,
      slug: product.slug,
      image: allImages[0] ?? '/images/products/noor-e-ishq.webp',
      size: activeVariant?.size,
      color: activeVariant?.color,
      price,
      quantity,
    });
    toast.success('Added to cart', {
      description: product.name,
      action: { label: 'View Cart', onClick: () => (window.location.href = '/cart') },
    });
  }

  function handleBuyNow() {
    addItem({
      productId: product._id as string,
      variantId: activeVariant?._id?.toString(),
      name: product.name,
      slug: product.slug,
      image: allImages[0] ?? '/images/products/noor-e-ishq.webp',
      size: activeVariant?.size,
      color: activeVariant?.color,
      price,
      quantity,
    });
    window.location.href = '/checkout';
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  }

  const isGown =
    (typeof product.category === 'object' && product.category?.slug === 'gowns') ||
    (typeof product.collection === 'object' &&
      (product.collection?.slug === 'reception-gowns' || product.collection?.slug === 'reception')) ||
    product.tags?.includes('gowns');

  const isFreeSize =
    isGown ||
    Boolean(
      product.variants &&
      product.variants.length > 0 &&
      product.variants.every(
        (v) => !v.size || v.size.toLowerCase().includes('free') || v.size.toLowerCase().includes('one')
      )
    );

  const uniqueColors = Array.from(
    new Map(
      (product.variants ?? [])
        .filter((v) => v.color && v.colorHex)
        .map((v) => [v.color, v])
    ).values()
  );

  return (
    <>
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 text-xs text-text flex items-center gap-2">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="text-border">/</span>
        <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
        <span className="text-border">/</span>
        <span className="text-heading font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-12">
          {/* Image gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible sm:w-16 shrink-0 no-scrollbar pb-1 sm:pb-0">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'w-14 h-14 sm:w-16 sm:h-16 shrink-0 aspect-square overflow-hidden rounded-xs border-2 transition-all cursor-pointer',
                      i === selectedImage ? 'border-gold ring-1 ring-gold/40' : 'border-border hover:border-gold/50'
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
            {/* Main image */}
            <div className="flex-1 relative aspect-[3/4] overflow-hidden rounded-xs bg-background border border-border">
              {allImages[selectedImage] ? (
                <Image
                  src={allImages[selectedImage]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-background" />
              )}
              {discountPct && (
                <span className="absolute top-3 left-3 bg-gold text-surface text-[11px] font-semibold px-2.5 py-1 rounded-xs uppercase tracking-wider shadow-xs">
                  -{discountPct}%
                </span>
              )}
              {/* Overlay Wishlist Icon */}
              <button
                onClick={() => toggle(product._id as string)}
                className="absolute top-3 right-3 p-2 bg-surface/90 backdrop-blur-xs rounded-full text-heading hover:text-gold transition-colors shadow-xs cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-gold' : ''} />
              </button>
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold mb-1.5">
                {product.fabric || 'Luxury Ethnic Couture'}
              </p>
              <h1 className="text-3xl lg:text-4xl font-serif text-heading mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < Math.round(product.averageRating || 5) ? 'text-gold fill-gold' : 'text-border fill-border'}
                    />
                  ))}
                </div>
                <span className="text-xs text-text">({product.reviewCount || 48} client reviews)</span>
              </div>

              {/* Description summary */}
              <p className="text-xs sm:text-sm text-text leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2 border-t border-border">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-heading">
                  {formatPrice(price)}
                </span>
                {comparePrice && comparePrice > price && (
                  <span className="text-sm text-text line-through">
                    {formatPrice(comparePrice)}
                  </span>
                )}
                <span className="text-xs text-text font-normal">(Inclusive of all bespoke taxes)</span>
              </div>
            </div>

            {/* Variants — Color & Size */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {activeVariant?.color && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-heading mb-2">
                      Color: <span className="font-normal text-text">{activeVariant?.color}</span>
                    </p>
                    <div className="flex gap-2.5">
                      {uniqueColors.length > 1 ? (
                        uniqueColors.map((v, i) => {
                          const actualIdx = (product.variants ?? []).findIndex((pv) => pv.color === v.color);
                          const isSelected = activeVariant?.color === v.color;
                          return (
                            <button
                              key={v.color ?? i}
                              onClick={() => setSelectedVariantIdx(actualIdx !== -1 ? actualIdx : 0)}
                              title={v.color}
                              className={cn(
                                'w-8 h-8 rounded-full border-2 transition-all relative cursor-pointer',
                                isSelected ? 'border-gold scale-110 ring-2 ring-gold/30' : 'border-transparent hover:border-gold/50'
                              )}
                              style={{ backgroundColor: v.colorHex }}
                            />
                          );
                        })
                      ) : activeVariant?.colorHex ? (
                        <div
                          title={activeVariant.color}
                          className="w-8 h-8 rounded-full border-2 border-gold ring-2 ring-gold/20"
                          style={{ backgroundColor: activeVariant.colorHex }}
                        />
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Size */}
                {isFreeSize ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-heading">
                      Size: <span className="font-normal text-text">Free Size / Bespoke Fit Available</span>
                    </p>
                  </div>
                ) : (
                  product.variants[0]?.size && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-heading">
                          Size: <span className="font-normal text-text">{activeVariant?.size}</span>
                        </p>
                        <button className="text-xs text-gold underline underline-offset-2 hover:text-heading transition-colors cursor-pointer">
                          Size Guide
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedVariantIdx(i)}
                            disabled={!v.isActive || v.stock === 0}
                            className={cn(
                              'min-w-[42px] px-3.5 py-2 text-xs font-semibold tracking-wider uppercase border transition-all rounded-xs cursor-pointer',
                              !v.isActive || v.stock === 0
                                ? 'border-border text-text/40 line-through cursor-not-allowed bg-background/50'
                                : i === selectedVariantIdx
                                ? 'border-heading bg-heading text-surface'
                                : 'border-border bg-surface text-heading hover:border-gold'
                            )}
                          >
                            {v.size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-heading">Quantity</p>
              <div className="flex items-center w-32 border border-border bg-surface rounded-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-heading hover:text-gold transition-colors font-medium text-base cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="flex-1 py-2 text-xs font-semibold text-heading text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3.5 py-2 text-heading hover:text-gold transition-colors font-medium text-base cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dual CTAs: ADD TO CART & BUY NOW */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 bg-heading text-surface hover:bg-gold py-3 px-6 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-200 disabled:opacity-40 rounded-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={14} />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="flex-1 bg-gold text-white hover:bg-gold/90 py-3 px-6 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-200 disabled:opacity-40 rounded-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist & Share line links */}
            <div className="flex items-center justify-between pt-1 border-t border-border/60">
              <button
                onClick={() => toggle(product._id as string)}
                className="flex items-center gap-1.5 text-xs tracking-wider uppercase font-semibold text-heading hover:text-gold transition-colors cursor-pointer"
              >
                <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-gold' : ''} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 text-xs tracking-wider uppercase font-semibold text-text hover:text-heading transition-colors cursor-pointer"
                  aria-label="Share product"
                >
                  <Share2 size={13} /> Share
                </button>

                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=Hi! I'm interested in ${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold font-semibold uppercase tracking-wider hover:underline"
                >
                  WhatsApp Consultation
                </a>
              </div>
            </div>

            {/* PDP Trust Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3.5 border-y border-border bg-surface/80 p-3 text-center rounded-xs shadow-2xs">
              <div className="flex flex-col items-center gap-1">
                <Truck size={16} className="text-gold" />
                <p className="text-[10px] font-semibold text-heading uppercase tracking-wider">Free Shipping</p>
                <p className="text-[9px] text-text">Pan-India Express</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={16} className="text-gold" />
                <p className="text-[10px] font-semibold text-heading uppercase tracking-wider">Secure Payment</p>
                <p className="text-[9px] text-text">100% Encrypted</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw size={16} className="text-gold" />
                <p className="text-[10px] font-semibold text-heading uppercase tracking-wider">Easy Returns</p>
                <p className="text-[9px] text-text">7 Days Return</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Scissors size={16} className="text-gold" />
                <p className="text-[10px] font-semibold text-heading uppercase tracking-wider">Made To Order</p>
                <p className="text-[9px] text-text">Custom Tailored</p>
              </div>
            </div>

            {/* Accordions */}
            {[
              {
                key: 'details',
                label: 'PRODUCT DETAILS',
                content:
                  product.description ||
                  'A masterpiece of luxury craftsmanship featuring hand-woven zari embroidery, meticulous border finishings, and signature silk lining.',
              },
              {
                key: 'care',
                label: 'FABRIC & CARE',
                content: `Fabric: ${product.fabric || 'Pure Silk & Chanderi'}. Work: ${product.workType || 'Hand-embroidery & Zari'}. Dry clean only. Store in an archival muslin garment bag away from direct sunlight.`,
              },
              {
                key: 'shipping',
                label: 'SHIPPING & DISPATCH',
                content:
                  'Complimentary insured express shipping across India. Dispatch within 3-5 business days for ready styles. Bespoke made-to-measure orders ship within 10-14 days.',
              },
              {
                key: 'returns',
                label: 'RETURN & EXCHANGE POLICY',
                content:
                  'Hassle-free 7-day exchange window on standard sizes. Items must be unworn, undamaged, and with original tags intact.',
              },
            ].map(({ key, label, content }) => (
              <div key={key} className="border-b border-border pb-2.5">
                <button
                  onClick={() => setAccordionOpen(accordionOpen === key ? null : key)}
                  className="flex items-center justify-between w-full text-left py-1 cursor-pointer"
                >
                  <span className="text-xs font-semibold tracking-wider text-heading uppercase">{label}</span>
                  {accordionOpen === key ? (
                    <ChevronUp size={14} className="text-gold" />
                  ) : (
                    <ChevronDown size={14} className="text-text" />
                  )}
                </button>
                {accordionOpen === key && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-text mt-2 leading-relaxed"
                  >
                    {content}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-border">
            <h2 className="font-serif text-2xl text-heading uppercase tracking-wide mb-5 sm:mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
              {related.map((p) => (
                <ProductCard key={p._id as string} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
