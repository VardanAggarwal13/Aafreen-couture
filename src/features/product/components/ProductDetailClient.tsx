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
  ChevronLeft,
  ChevronRight,
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
  const inStock = (activeVariant?.stock ?? 1) > 0;
  const price = activeVariant?.price ?? product.basePrice;
  const comparePrice = activeVariant?.comparePrice ?? product.comparePrice;
  const discountPct = comparePrice && comparePrice > price ? getDiscountPercentage(price, comparePrice) : null;

  // Determine images to display:
  // If active variant has dedicated multi-image gallery (e.g. Zeenat colorways), use activeVariant.images.
  // Otherwise, use product.images (which contains all 3-6 editorial views & closeups!)
  const allImages = (() => {
    if (activeVariant?.images && activeVariant.images.length > 1) {
      return activeVariant.images;
    }
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    if (activeVariant?.images && activeVariant.images.length > 0) {
      return activeVariant.images;
    }
    return ['/images/products/noor-e-ishq.webp'];
  })();

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
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3 text-xs text-text flex items-center gap-2">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="text-border">/</span>
        <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
        <span className="text-border">/</span>
        {typeof product.category === 'object' && product.category?.name && (
          <>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-gold transition-colors">
              {product.category.name}
            </Link>
            <span className="text-border">/</span>
          </>
        )}
        <span className="text-heading font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">
          {/* Gallery: Left Thumbnails Rail + Main Stage Image */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col-reverse sm:flex-row gap-3.5 sm:gap-4 lg:gap-5 items-start">
            {/* Left Vertical Thumbnail Rail */}
            {allImages.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 sm:w-20 lg:w-24 shrink-0 overflow-x-auto sm:overflow-y-auto max-h-[620px] lg:max-h-[660px] no-scrollbar pb-1 sm:pb-0 pr-0.5">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'w-16 sm:w-full aspect-[4/5] shrink-0 rounded-xs overflow-hidden border-2 transition-all cursor-pointer bg-[#FAF7F2] relative group',
                      i === selectedImage
                        ? 'border-gold ring-1 ring-gold/40 shadow-xs'
                        : 'border-border/80 hover:border-gold/60 opacity-65 hover:opacity-100'
                    )}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 w-full relative aspect-[4/5] max-h-[620px] lg:max-h-[660px] rounded-xs overflow-hidden bg-[#FAF7F2] border border-[#E8D8C8]/60 shadow-xs group">
              {allImages[selectedImage] ? (
                <Image
                  src={allImages[selectedImage]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-background" />
              )}

              {/* Discount Badge */}
              {discountPct && (
                <span className="absolute top-3.5 left-3.5 bg-gold text-surface text-[11px] font-semibold px-2.5 py-1 rounded-xs uppercase tracking-wider shadow-xs pointer-events-none">
                  -{discountPct}%
                </span>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggle(product._id as string)}
                className="absolute top-3.5 right-3.5 p-2.5 bg-surface/90 backdrop-blur-xs rounded-full text-heading hover:text-gold transition-colors shadow-xs cursor-pointer z-10"
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-gold' : ''} />
              </button>

              {/* Photo Counter Overlay */}
              {allImages.length > 1 && (
                <div className="absolute bottom-3.5 right-3.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium tracking-widest px-2.5 py-1 rounded-xs pointer-events-none">
                  {selectedImage + 1} / {allImages.length}
                </div>
              )}

              {/* Quick Prev / Next Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 hover:bg-white text-heading hover:text-gold opacity-0 group-hover:opacity-100 transition-all shadow-xs cursor-pointer z-10"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 hover:bg-white text-heading hover:text-gold opacity-0 group-hover:opacity-100 transition-all shadow-xs cursor-pointer z-10"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Product info - Sticky Column */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-5 lg:sticky lg:top-24">
            <div>
              {/* Category & Stock Status */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                  {typeof product.category === 'object' && product.category?.name
                    ? product.category.name
                    : product.fabric?.split(',')[0] || 'Luxury Couture'}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-xs tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {inStock ? 'Ready to Dispatch' : 'Made to Order'}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-serif text-heading font-medium leading-snug tracking-tight mb-2.5">
                {product.name}
              </h1>

              {/* Rating & Social Proof */}
              <div className="flex items-center gap-2.5 mb-3 text-xs text-text">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < Math.round(product.averageRating || 5) ? 'text-gold fill-gold' : 'text-border fill-border'}
                    />
                  ))}
                </div>
                <span className="font-medium text-heading">5.0</span>
                <span className="text-border">·</span>
                <span>{product.reviewCount || 24} client reviews</span>
                <span className="text-border">·</span>
                <span className="text-gold font-medium">Bespoke Couture</span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-3 pb-2 border-t border-border">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-heading">
                  {formatPrice(price)}
                </span>
                {comparePrice && comparePrice > price && (
                  <>
                    <span className="text-sm text-text line-through">
                      {formatPrice(comparePrice)}
                    </span>
                    <span className="text-[11px] font-semibold text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-xs uppercase tracking-wider">
                      Save {formatPrice(comparePrice - price)} ({discountPct}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-text/80 mb-3">
                Inclusive of all taxes · Complimentary express insured delivery across India
              </p>

              {/* Curated Editorial Excerpt */}
              <p className="text-xs sm:text-sm text-text leading-relaxed bg-[#FAF7F2] p-3 rounded-xs border border-border/70 mb-1">
                {product.shortDescription || (product.description.length > 180 ? product.description.slice(0, 180) + '...' : product.description)}
              </p>
            </div>

            {/* Variants — Color & Size */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 pt-1 border-t border-border/60">
                {/* Color */}
                {activeVariant?.color && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-heading">
                        Color: <span className="font-normal text-text">{activeVariant?.color}</span>
                      </p>
                      <span className="text-[11px] text-gold font-medium">
                        {uniqueColors.length > 1 ? `${uniqueColors.length} Shades Available` : 'Signature Colorway'}
                      </span>
                    </div>
                    <div className="flex gap-2.5">
                      {uniqueColors.length > 1 ? (
                        uniqueColors.map((v, i) => {
                          const actualIdx = (product.variants ?? []).findIndex((pv) => pv.color === v.color);
                          const isSelected = activeVariant?.color === v.color;
                          return (
                            <button
                              key={v.color ?? i}
                              onClick={() => {
                                setSelectedVariantIdx(actualIdx !== -1 ? actualIdx : 0);
                                setSelectedImage(0);
                              }}
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
                        <button
                          onClick={() => setAccordionOpen('details')}
                          className="text-xs text-gold underline underline-offset-2 hover:text-heading transition-colors cursor-pointer"
                        >
                          Size & Fit Guide
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
                                ? 'border-heading bg-heading text-surface shadow-xs'
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
            <div className="flex items-center gap-4 pt-1 border-t border-border/60">
              <p className="text-xs font-semibold uppercase tracking-wider text-heading">Quantity</p>
              <div className="flex items-center w-28 border border-border bg-surface rounded-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-heading hover:text-gold transition-colors font-medium text-base cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="flex-1 py-1.5 text-xs font-semibold text-heading text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3 py-1.5 text-heading hover:text-gold transition-colors font-medium text-base cursor-pointer"
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

            {/* Wishlist & Share & WhatsApp Consultation Links */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <button
                onClick={() => toggle(product._id as string)}
                className="flex items-center gap-1.5 text-xs tracking-wider uppercase font-semibold text-heading hover:text-gold transition-colors cursor-pointer"
              >
                <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-gold' : ''} />
                {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
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
                  Stylist Consult
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Luxury Trust & Concierge Strip */}
        <div className="my-10 sm:my-12 py-5 px-6 border-y border-border bg-[#FAF7F2] rounded-xs shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Truck size={18} className="text-gold" />
              <p className="text-[11px] font-semibold text-heading uppercase tracking-wider">Free Express Delivery</p>
              <p className="text-[10px] text-text">Pan-India insured shipping</p>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck size={18} className="text-gold" />
              <p className="text-[11px] font-semibold text-heading uppercase tracking-wider">Secure Payment</p>
              <p className="text-[10px] text-text">100% Encrypted transactions</p>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Scissors size={18} className="text-gold" />
              <p className="text-[11px] font-semibold text-heading uppercase tracking-wider">Bespoke Tailoring</p>
              <p className="text-[10px] text-text">Custom made-to-measure fit</p>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RotateCcw size={18} className="text-gold" />
              <p className="text-[11px] font-semibold text-heading uppercase tracking-wider">7-Day Size Exchange</p>
              <p className="text-[10px] text-text">Hassle-free boutique service</p>
            </div>
          </div>
        </div>

        {/* Artisanal Craftsmanship, Specifications & Policies Section */}
        <div className="py-8 sm:py-12 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-start">
            {/* Left Column: The Artisan Story & Detailed Specifications */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-1.5">
                  Artisanal Heritage
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-heading font-medium tracking-tight mb-3">
                  Craftsmanship & Design Story
                </h2>
                <p className="text-xs sm:text-sm text-text leading-relaxed">
                  {product.description ||
                    'An extraordinary royal couture ensemble fashioned from lustrous pure silk, adorned with authentic hand-embroidered tilla zari and resham motifs. Each piece reflects centuries of traditional Indian artisan mastery, tailored to create a regal silhouette.'}
                </p>
              </div>

              {/* Garment Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="bg-[#FAF7F2] p-3.5 rounded-xs border border-border/70 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">Pure Fabric & Weave</p>
                  <p className="text-xs text-heading font-medium">{product.fabric || 'Pure Raw Silk & Chanderi Lining'}</p>
                </div>
                <div className="bg-[#FAF7F2] p-3.5 rounded-xs border border-border/70 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">Embroidery & Workmanship</p>
                  <p className="text-xs text-heading font-medium">{product.workType || 'Handcrafted Zardozi, Tilla & Gota Patti'}</p>
                </div>
                {product.occasion && product.occasion.length > 0 && (
                  <div className="bg-[#FAF7F2] p-3.5 rounded-xs border border-border/70 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">Ideal For</p>
                    <p className="text-xs text-heading font-medium">{product.occasion.join(', ')}</p>
                  </div>
                )}
                <div className="bg-[#FAF7F2] p-3.5 rounded-xs border border-border/70 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">Fitting & Cut</p>
                  <p className="text-xs text-heading font-medium">Bespoke Custom Tailored / Standard Size</p>
                </div>
              </div>
            </div>

            {/* Right Column: Policies & Garment Care Accordions */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-1">
                Boutique Services
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-heading font-medium tracking-tight mb-3">
                Care & Guarantee
              </h3>

              {[
                {
                  key: 'care',
                  label: 'FABRIC, LINING & CARE INSTRUCTIONS',
                  content: `Fabric: ${product.fabric || 'Pure Silk & Chanderi'}. Work: ${product.workType || 'Hand-embroidery & Zari'}. Dry clean only. Store in an archival muslin garment bag away from moisture and direct sunlight.`,
                },
                {
                  key: 'shipping',
                  label: 'COMPLIMENTARY SHIPPING & DISPATCH TIMELINE',
                  content:
                    'Complimentary insured express shipping across India. Dispatch within 3-5 business days for ready styles. Bespoke made-to-measure orders ship within 10-14 business days. Real-time SMS & WhatsApp tracking provided.',
                },
                {
                  key: 'returns',
                  label: '7-DAY EXCHANGE & BESPOKE GUARANTEE',
                  content:
                    'Hassle-free 7-day exchange window on standard sizes. Items must be unworn, undamaged, with original tags intact. Custom made-to-measure outfits include complimentary minor fitting adjustments by our master tailors.',
                },
              ].map(({ key, label, content }) => (
                <div key={key} className="border border-border rounded-xs bg-surface/90 overflow-hidden">
                  <button
                    onClick={() => setAccordionOpen(accordionOpen === key ? null : key)}
                    className="flex items-center justify-between w-full text-left p-3.5 cursor-pointer hover:bg-[#FAF7F2] transition-colors"
                  >
                    <span className="text-xs font-semibold tracking-wider text-heading uppercase">{label}</span>
                    {accordionOpen === key ? (
                      <ChevronUp size={14} className="text-gold shrink-0 ml-2" />
                    ) : (
                      <ChevronDown size={14} className="text-text shrink-0 ml-2" />
                    )}
                  </button>
                  {accordionOpen === key && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-3.5 pb-3.5 pt-1 text-xs text-text leading-relaxed border-t border-border/50 bg-[#FAF7F2]/40"
                    >
                      {content}
                    </motion.div>
                  )}
                </div>
              ))}

              {/* Stylist Concierge Banner */}
              <div className="mt-4 p-4 rounded-xs border border-gold/30 bg-gold/5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-heading uppercase tracking-wider">Need Styling Advice?</p>
                  <p className="text-[11px] text-text">Chat with our bridal & couture stylists directly</p>
                </div>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=Hi! I need styling consultation for ${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 bg-gold text-white text-[11px] font-semibold uppercase tracking-wider px-3.5 py-2 rounded-xs hover:bg-gold/90 transition-colors shadow-xs"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-border">
            <h2 className="font-serif text-2xl sm:text-3xl text-heading uppercase tracking-wide mb-6 sm:mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
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
