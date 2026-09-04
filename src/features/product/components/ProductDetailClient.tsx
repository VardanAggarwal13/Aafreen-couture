'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Share2, ShoppingBag, ChevronDown, ChevronUp, Star } from 'lucide-react';
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
  const [accordionOpen, setAccordionOpen] = useState<string | null>('description');

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
      toast.success('Link copied!');
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
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-[#6E6A66] flex items-center gap-2">
        <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-gold transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-[#221617] font-medium">{product.name}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image gallery */}
          <div className="flex gap-3">
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex flex-col gap-2 w-16 shrink-0">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'aspect-square overflow-hidden rounded-sm border-2 transition-colors',
                      i === selectedImage ? 'border-[#A67C52]' : 'border-transparent'
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
            <div className="flex-1 relative aspect-[3/4] overflow-hidden rounded-sm bg-[#FAF7F2] border border-[#E8D8C8]">
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
                <div className="w-full h-full bg-[#FAF7F2]" />
              )}
              {discountPct && (
                <span className="absolute top-3 left-3 bg-[#A67C52] text-white text-xs font-semibold px-2.5 py-1 rounded-xs uppercase tracking-wider">
                  -{discountPct}%
                </span>
              )}
              {/* Overlay Wishlist Icon */}
              <button
                onClick={() => toggle(product._id as string)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full text-[#221617] hover:text-[#A67C52] transition-colors shadow-xs"
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? '#A67C52' : 'none'} className={isWishlisted ? 'text-[#A67C52]' : ''} />
              </button>
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A67C52] mb-1.5">
                {product.fabric || 'Luxury Ethnic Wear'}
              </p>
              <h1 className="text-3xl lg:text-4xl font-serif text-[#221617] mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < Math.round(product.averageRating || 5) ? 'text-[#A67C52] fill-[#A67C52]' : 'text-[#E8D8C8] fill-[#E8D8C8]'}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#6E6A66]">({product.reviewCount || 48} reviews)</span>
              </div>

              {/* Description summary */}
              <p className="text-sm text-[#6E6A66] leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2 border-t border-[#E8D8C8]">
                <span className="text-2xl font-serif font-bold text-[#221617]">
                  {formatPrice(price)}
                </span>
                {comparePrice && comparePrice > price && (
                  <span className="text-sm text-[#6E6A66] line-through">
                    {formatPrice(comparePrice)}
                  </span>
                )}
                <span className="text-xs text-[#6E6A66] font-normal">(Inclusive of all taxes)</span>
              </div>
            </div>

            {/* Variants — Color & Size */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {activeVariant?.color && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#221617] mb-2">
                      Color: <span className="font-normal text-[#6E6A66]">{activeVariant?.color}</span>
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
                                'w-8 h-8 rounded-full border-2 transition-all relative',
                                isSelected ? 'border-[#A67C52] scale-110 ring-2 ring-[#A67C52]/30' : 'border-transparent hover:border-[#A67C52]/50'
                              )}
                              style={{ backgroundColor: v.colorHex }}
                            />
                          );
                        })
                      ) : activeVariant?.colorHex ? (
                        <div
                          title={activeVariant.color}
                          className="w-8 h-8 rounded-full border-2 border-[#A67C52] ring-2 ring-[#A67C52]/20"
                          style={{ backgroundColor: activeVariant.colorHex }}
                        />
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Size */}
                {isFreeSize ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#221617]">
                      Size: <span className="font-normal text-[#6E6A66]">Free Size</span>
                    </p>
                  </div>
                ) : (
                  product.variants[0]?.size && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#221617]">
                          Size: <span className="font-normal text-[#6E6A66]">{activeVariant?.size}</span>
                        </p>
                        <button className="text-xs text-[#A67C52] underline underline-offset-2 hover:text-[#221617] transition-colors">
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
                              'min-w-[40px] px-3.5 py-2 text-xs font-semibold tracking-wider uppercase border transition-all',
                              !v.isActive || v.stock === 0
                                ? 'border-[#E8D8C8] text-[#6E6A66]/40 line-through cursor-not-allowed'
                                : i === selectedVariantIdx
                                ? 'border-[#221617] bg-[#221617] text-white'
                                : 'border-[#E8D8C8] bg-white text-[#221617] hover:border-[#A67C52]'
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
              <p className="text-xs font-semibold uppercase tracking-wider text-[#221617]">Quantity</p>
              <div className="flex items-center w-32 border border-[#E8D8C8] bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-[#221617] hover:text-[#A67C52] transition-colors font-medium text-base"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="flex-1 py-2 text-xs font-semibold text-[#221617] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3.5 py-2 text-[#221617] hover:text-[#A67C52] transition-colors font-medium text-base"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dual CTAs matching reference mockup: ADD TO CART (Dark Maroon) & BUY NOW (Gold Tan) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3.5 px-6 text-xs font-semibold tracking-[0.18em] uppercase transition-all shadow-xs',
                  inStock
                    ? 'bg-[#221617] text-white hover:bg-[#3A2224]'
                    : 'bg-[#E8D8C8] text-[#6E6A66] cursor-not-allowed'
                )}
              >
                <ShoppingBag size={15} />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3.5 px-6 text-xs font-semibold tracking-[0.18em] uppercase transition-all shadow-xs',
                  inStock
                    ? 'bg-[#A67C52] text-white hover:bg-[#8F6841]'
                    : 'bg-[#E8D8C8] text-[#6E6A66] cursor-not-allowed'
                )}
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist & Share line links */}
            <div className="flex items-center justify-between pt-1 border-t border-[#E8D8C8]/60">
              <button
                onClick={() => toggle(product._id as string)}
                className="flex items-center gap-1.5 text-xs tracking-wider uppercase font-semibold text-[#221617] hover:text-[#A67C52] transition-colors"
              >
                <Heart size={14} fill={isWishlisted ? '#A67C52' : 'none'} className={isWishlisted ? 'text-[#A67C52]' : ''} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 text-xs tracking-wider uppercase font-semibold text-[#6E6A66] hover:text-[#221617] transition-colors"
                  aria-label="Share product"
                >
                  <Share2 size={13} /> Share
                </button>

                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=Hi! I'm interested in ${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#A67C52] font-semibold uppercase tracking-wider hover:underline"
                >
                  WhatsApp Enquiry
                </a>
              </div>
            </div>

            {/* PDP Trust Badges Bar matching reference image */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[#E8D8C8] bg-white/60 p-3 text-center">
              <div className="space-y-0.5">
                <span className="text-base">🚚</span>
                <p className="text-[10px] font-semibold text-[#221617] uppercase">Free Shipping</p>
                <p className="text-[9px] text-[#6E6A66]">On All Orders</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-base">🛡️</span>
                <p className="text-[10px] font-semibold text-[#221617] uppercase">Secure Payment</p>
                <p className="text-[9px] text-[#6E6A66]">100% Safe & Secure</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-base">🔄</span>
                <p className="text-[10px] font-semibold text-[#221617] uppercase">Easy Returns</p>
                <p className="text-[9px] text-[#6E6A66]">7 Days Return</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-base">✂️</span>
                <p className="text-[10px] font-semibold text-[#221617] uppercase">Made To Order</p>
                <p className="text-[9px] text-[#6E6A66]">Custom Tailored</p>
              </div>
            </div>

            {/* Accordions matching reference image */}
            {[
              { key: 'details', label: 'PRODUCT DETAILS', content: product.description || 'A masterpiece of luxury craftsmanship featuring hand-woven zari embroidery and fine silk detailing.' },
              { key: 'care', label: 'FABRIC & CARE', content: `Fabric: ${product.fabric || 'Pure Silk'}. Work: ${product.workType || 'Zari Embroidery'}. Dry clean only. Store in protective cotton bag.` },
              { key: 'shipping', label: 'SHIPPING & DELIVERY', content: 'Free express shipping across India. Standard dispatch within 3-5 business days. International shipping available.' },
              { key: 'returns', label: 'RETURN & EXCHANGE', content: 'Hassle-free 7-day return and exchange policy. Items must be unused and in original packaging.' },
            ].map(({ key, label, content }) => (
              <div key={key} className="border-b border-[#E8D8C8] pb-3">
                <button
                  onClick={() => setAccordionOpen(accordionOpen === key ? null : key)}
                  className="flex items-center justify-between w-full text-left py-1"
                >
                  <span className="text-xs font-semibold tracking-wider text-[#221617] uppercase">{label}</span>
                  {accordionOpen === key ? <ChevronUp size={14} className="text-[#A67C52]" /> : <ChevronDown size={14} className="text-[#6E6A66]" />}
                </button>
                {accordionOpen === key && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-[#6E6A66] mt-2 leading-relaxed"
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
          <section className="mt-16 pt-16 border-t border-brand-cream">
            <h2 className="text-2xl text-brand-black mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
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
