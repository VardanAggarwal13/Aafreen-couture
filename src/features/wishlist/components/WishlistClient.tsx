'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Share2, Trash2, ArrowRight, Sparkles, MessageCircle, Phone, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '@/store/wishlist.store';
import { useCartStore } from '@/store/cart.store';
import { ProductCard } from '@/components/product/ProductCard';
import { api } from '@/utils/api';
import { ROUTES } from '@/constants/routes';
import { FALLBACK_PRODUCTS } from '@/data/products.data';
import type { IProduct } from '@/types';
import type { ApiResponse } from '@/types/api.types';

export function WishlistClient() {
  const ids = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const clearWishlist = useWishlistStore((s) => s.clear);
  const addToCart = useCartStore((s) => s.addItem);

  const [isCopied, setIsCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Fetch wishlisted products by ID
  const { data, isLoading } = useQuery<ApiResponse<IProduct[]>>({
    queryKey: ['wishlist-products', ids],
    queryFn: () => api.get<IProduct[]>(`/api/products?ids=${ids.join(',')}&limit=100`),
    enabled: ids.length > 0,
  });

  // Client-side fallback if API data is loading or filtered
  const rawProducts = data?.data ?? [];
  const products: IProduct[] = rawProducts.length > 0
    ? rawProducts
    : FALLBACK_PRODUCTS.filter((p) => ids.includes(p._id) || ids.includes(p.slug));

  // Handler: Move single item to bag
  const handleMoveToBag = (product: IProduct) => {
    const variant = product.variants?.[0];
    addToCart({
      productId: product._id,
      variantId: variant?._id,
      name: product.name,
      price: variant?.price ?? product.basePrice,
      image: product.images[0] ?? '',
      size: variant?.size ?? 'Standard Bespoke',
      color: variant?.color ?? 'Signature',
      quantity: 1,
      slug: product.slug,
    });
    removeItem(product._id);
    toast.success(`"${product.name}" moved to your shopping bag`);
  };

  // Handler: Move all items to bag
  const handleMoveAllToBag = () => {
    if (products.length === 0) return;
    products.forEach((product) => {
      const variant = product.variants?.[0];
      addToCart({
        productId: product._id,
        variantId: variant?._id,
        name: product.name,
        price: variant?.price ?? product.basePrice,
        image: product.images[0] ?? '',
        size: variant?.size ?? 'Standard Bespoke',
        color: variant?.color ?? 'Signature',
        quantity: 1,
        slug: product.slug,
      });
    });
    clearWishlist();
    toast.success('All curated pieces have been moved to your shopping bag');
  };

  // Handler: Share curation link
  const handleShareWishlist = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Aafreen Couture Wishlist',
          text: 'Explore my curated bridal and couture trousseau from Aafreen Couture.',
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success('Wishlist link copied to clipboard');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Empty state recommendations
  const recommendedProducts = FALLBACK_PRODUCTS.filter((p) => p.isFeatured || p.isNewArrival).slice(0, 4);

  // 1. EMPTY STATE
  if (ids.length === 0) {
    return (
      <div className="space-y-16 pb-16">
        {/* Luxury Empty Hero Banner */}
        <div className="relative overflow-hidden bg-surface border border-border/80 rounded-xs py-16 sm:py-20 px-6 text-center shadow-xs">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold shadow-xs">
              <Heart size={26} strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-gold uppercase font-sans">
                Private Atelier Curation
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-heading">
                Your Bridal Trousseau Awaits
              </h1>
              <p className="text-xs sm:text-sm text-text leading-relaxed max-w-md mx-auto">
                You haven&apos;t reserved any creations yet. Explore our handcrafted bridal lehengas,
                royal heritage suits, and bespoke jewels to curate your personal dream collection.
              </p>
            </div>

            {/* Quick Category Discovery Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {[
                { label: 'Bridal Lehengas', href: '/bridal' },
                { label: 'Luxury Suits', href: '/suits' },
                { label: 'Ready To Wear', href: '/collections/ready-to-wear' },
                { label: 'Royal Jewellery', href: '/jewellery' },
              ].map((pill) => (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className="px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-medium border border-border text-heading bg-background/50 hover:bg-gold hover:text-white hover:border-gold transition-all rounded-xs"
                >
                  {pill.label} →
                </Link>
              ))}
            </div>

            <div className="pt-3">
              <Link
                href={ROUTES.SHOP}
                className="inline-flex items-center gap-2 bg-heading text-surface text-xs font-semibold uppercase tracking-[0.18em] px-8 py-3.5 rounded-xs hover:bg-gold transition-colors shadow-xs"
              >
                Discover All Collections <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Curated Recommendations */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-[10.5px] font-semibold tracking-[0.2em] text-gold uppercase font-sans">
                Curator&apos;s Selection
              </p>
              <h2 className="text-xl sm:text-2xl font-serif text-heading mt-0.5">
                Trending Atelier Masterpieces
              </h2>
            </div>
            <Link
              href={ROUTES.SHOP}
              className="text-xs font-semibold text-gold hover:text-heading uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
            >
              View Full Catalog <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommendedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Breadcrumbs & Eyebrow */}
      <div className="pt-6 pb-2 border-b border-border/70">
        <nav className="flex items-center gap-2 text-[11px] text-text/80 uppercase tracking-widest mb-3">
          <Link href={ROUTES.HOME} className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-heading font-medium">My Wishlist</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
          <div>
            <div className="flex items-center gap-2 text-gold text-[10.5px] font-semibold tracking-[0.22em] uppercase mb-1">
              <span>✦</span> Atelier Curation
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-heading">
              Your Saved Masterpieces
            </h1>
            <p className="text-xs sm:text-sm text-text mt-1 max-w-xl">
              Handcrafted bridal silhouettes, heritage weaves, and royal jewellery reserved for your celebration.
            </p>
          </div>

          {/* Header Action Tools */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Share Button */}
            <button
              onClick={handleShareWishlist}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-border bg-surface text-heading hover:border-gold hover:text-gold text-xs font-medium uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-2xs"
              title="Share Wishlist Link"
            >
              {isCopied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
              <span>{isCopied ? 'Link Copied' : 'Share'}</span>
            </button>

            {/* Move All to Bag */}
            <button
              onClick={handleMoveAllToBag}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-heading text-surface hover:bg-gold text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-2xs"
            >
              <ShoppingBag size={14} />
              <span>Move All to Bag</span>
            </button>

            {/* Clear Wishlist */}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-2 border border-border bg-surface text-text hover:text-red-600 hover:border-red-300 text-xs rounded-xs transition-colors cursor-pointer shadow-2xs"
              title="Clear Wishlist"
              aria-label="Clear all items from wishlist"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Counter indicator */}
        <div className="flex items-center justify-between text-xs text-text pt-2">
          <span>
            Showing <strong className="text-heading font-semibold">{ids.length}</strong> {ids.length === 1 ? 'creation' : 'creations'} reserved
          </span>
          <span className="text-[11px] text-text/80 italic hidden sm:inline">
            Prices inclusive of all bespoke artisanal tailoring
          </span>
        </div>
      </div>

      {/* Confirmation Modal for Clear */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border max-w-sm w-full p-6 rounded-xs shadow-lg space-y-4"
            >
              <h3 className="font-serif text-lg text-heading">Clear your curation?</h3>
              <p className="text-xs text-text leading-relaxed">
                This will remove all {ids.length} saved pieces from your wishlist. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 text-xs font-medium text-heading hover:bg-background border border-border rounded-xs transition-colors cursor-pointer"
                >
                  Keep Saved
                </button>
                <button
                  onClick={() => {
                    clearWishlist();
                    setShowClearConfirm(false);
                    toast.info('Wishlist cleared');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xs transition-colors cursor-pointer"
                >
                  Yes, Clear All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading Skeleton */}
      {isLoading && products.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {ids.map((id) => (
            <div key={id} className="space-y-3">
              <div className="aspect-[3/4] bg-surface border border-border/70 animate-pulse rounded-xs" />
              <div className="h-4 bg-border/50 rounded-xs w-3/4 animate-pulse" />
              <div className="h-3 bg-border/40 rounded-xs w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        /* Product Cards Grid with Quick Actions */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div key={product._id} className="flex flex-col justify-between group">
              <ProductCard product={product} />

              {/* Quick Action Bar under Card */}
              <div className="mt-3 pt-2.5 border-t border-border/60 flex flex-col gap-2">
                <button
                  onClick={() => handleMoveToBag(product)}
                  className="w-full py-2.5 bg-heading hover:bg-gold text-surface text-[10.5px] font-semibold tracking-[0.14em] uppercase transition-colors flex items-center justify-center gap-1.5 rounded-xs cursor-pointer shadow-2xs"
                >
                  <ShoppingBag size={13} />
                  <span>Move to Bag</span>
                </button>

                <button
                  onClick={() => {
                    removeItem(product._id);
                    toast.info(`Removed "${product.name}" from wishlist`);
                  }}
                  className="text-[10.5px] text-text/70 hover:text-red-600 transition-colors flex items-center justify-center gap-1 cursor-pointer py-1"
                >
                  <Trash2 size={12} />
                  <span>Remove from Wishlist</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bridal Concierge Assistance Banner */}
      <div className="bg-surface border border-border/80 rounded-xs p-6 sm:p-8 lg:p-10 shadow-2xs mt-14">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-gold text-xs font-semibold tracking-widest uppercase">
              <Sparkles size={15} />
              <span>Bespoke Bridal Concierge</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-heading">
              Need Assistance Finalizing Your Trousseau?
            </h3>
            <p className="text-xs sm:text-sm text-text max-w-2xl leading-relaxed">
              Our master couturiers and bridal stylists offer private video consultations, custom measurement
              guidance, and bespoke fabric & dupatta personalization for your wedding festivities.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href={ROUTES.CONTACT}
              className="px-5 py-3 bg-heading hover:bg-gold text-surface text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2 shadow-xs"
            >
              <Phone size={14} />
              <span>Book Consultation</span>
            </Link>

            <a
              href="https://wa.me/919517901117?text=Hello%20Aafreen%20Couture,%20I%20need%20assistance%20with%20my%20wishlist%20trousseau."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 border border-border bg-background hover:border-gold hover:text-gold text-heading text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2"
            >
              <MessageCircle size={14} className="text-emerald-700" />
              <span>WhatsApp Atelier</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
