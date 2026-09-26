'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Heart,
  Lock, Gift, Truck, Scissors, RefreshCw,
  ChevronRight, Check, Crown
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { formatPrice } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { siteConfig } from '@/config/site.config';
import { api } from '@/utils/api';
import { FALLBACK_PRODUCTS } from '@/data/products.data';
import type { IProduct } from '@/types';
import type { ApiResponse } from '@/types/api.types';

export function CartClientPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    removeItem,
    updateQuantity,
    addItem,
    getSubtotal,
    appliedCoupon,
    setAppliedCoupon,
    syncItemPrices,
  } = useCartStore();

  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  const [couponCode, setCouponCode] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [isTrousseauPackaging, setIsTrousseauPackaging] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  const subtotal = getSubtotal();
  const discountAmount = appliedCoupon?.discount ?? 0;
  const shippingCharge = 0; // Complimentary express shipping across India
  const total = Math.max(0, subtotal - discountAmount + shippingCharge);

  useEffect(() => {
    router.prefetch(ROUTES.CHECKOUT);
    router.prefetch(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CHECKOUT)}`);
  }, [router]);

  // Fetch full details for the products in cart to display descriptions, fabric, & craft
  const productIds = useMemo(() => items.map((i) => i.productId), [items]);
  const { data: productsData } = useQuery<ApiResponse<IProduct[]>>({
    queryKey: ['cart-products-details', productIds],
    queryFn: () => api.get<IProduct[]>(`/api/products?ids=${productIds.join(',')}&limit=100`),
    enabled: productIds.length > 0,
  });

  useEffect(() => {
    if (productsData?.data && Array.isArray(productsData.data)) {
      syncItemPrices(productsData.data);
    }
  }, [productsData, syncItemPrices]);

  // Fast dictionary for quick product details lookup
  const productMap = useMemo(() => {
    const map = new Map<string, IProduct>();
    FALLBACK_PRODUCTS.forEach((p) => {
      map.set(String(p._id), p);
      map.set(p.slug, p);
      map.set(p.name.toLowerCase().trim(), p);
    });
    if (productsData?.data) {
      productsData.data.forEach((p) => {
        map.set(String(p._id), p);
        map.set(p.slug, p);
        map.set(p.name.toLowerCase().trim(), p);
      });
    }
    return map;
  }, [productsData]);

  // High-converting complementary recommendations (potlis, jewellery, companion pieces)
  const recommendedProducts = useMemo(() => {
    const inCartIds = new Set(items.map((i) => i.productId));
    const inCartSlugs = new Set(items.map((i) => i.slug));

    return FALLBACK_PRODUCTS.filter((p) => !inCartIds.has(p._id) && !inCartSlugs.has(p.slug))
      .sort((a, b) => {
        const catA = (typeof a.category === 'object' && a.category?.slug) || '';
        const catB = (typeof b.category === 'object' && b.category?.slug) || '';
        const aIsAcc = catA === 'the-bag-edit' || catA === 'jewellery' || catA === 'potlis' ? -1 : 1;
        const bIsAcc = catB === 'the-bag-edit' || catB === 'jewellery' || catB === 'potlis' ? -1 : 1;
        return aIsAcc - bIsAcc;
      })
      .slice(0, 4);
  }, [items]);

  function handleQuickAdd(p: IProduct) {
    const variant = p.variants?.[0];
    addItem({
      productId: p._id,
      variantId: variant?._id,
      name: p.name,
      slug: p.slug,
      image: p.images[0] ?? '/images/products/shahi-sindoori-red-bridal-lehenga-0929.webp',
      size: variant?.size ?? 'Standard Bespoke',
      color: variant?.color ?? 'Signature',
      price: variant?.price ?? p.basePrice,
      quantity: 1,
    });
    toast.success(`Added "${p.name}" to your shopping bag`, {
      description: 'Handcrafted accessory paired with your ensemble.',
    });
  }

  function handleMoveToWishlist(item: (typeof items)[number]) {
    addToWishlist(item.productId);
    removeItem(item.productId, item.variantId);
    toast.success(`Saved "${item.name}" to your Wishlist`, {
      description: 'You can revisit this bespoke piece anytime.',
    });
  }

  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    if (!session?.user) {
      toast.error('Please sign in to apply privilege code');
      return;
    }

    setApplyingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean, subtotal }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Invalid or expired privilege code');

      setAppliedCoupon({
        code: json.data.code,
        discount: json.data.discount,
        freeShipping: json.data.freeShipping,
      });
      toast.success(`Privilege Code ${json.data.code} applied successfully!`);
      setShowPromoInput(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Invalid or expired privilege code');
    } finally {
      setApplyingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Privilege code removed');
  }

  function handleProceedToCheckout() {
    if (items.length === 0) return;
    if (!session?.user) {
      toast.info('Please sign in or register to complete your order.');
      router.push(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CHECKOUT)}`);
      return;
    }
    router.push(ROUTES.CHECKOUT);
  }

  // =========================================================================
  // EMPTY CART STATE (Ultra-Luxury Editorial Presentation)
  // =========================================================================
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-16 sm:py-24 text-[#221617]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="bg-white border border-[#EADCC9] rounded-3xl p-10 sm:p-16 max-w-xl mx-auto text-center shadow-[0_12px_40px_rgba(46,34,28,0.06)] space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#FAF5EC] border border-[#E0D0BC] flex items-center justify-center mx-auto text-[#C49A5A] shadow-xs">
              <ShoppingBag size={34} strokeWidth={1.2} />
            </div>

            <div className="space-y-3">
              <span className="inline-block text-[11px] font-semibold tracking-[0.25em] text-[#C49A5A] uppercase">
                Atelier Shopping Bag
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif text-[#221617]">
                Your Shopping Bag is Empty
              </h1>
              <p className="text-xs sm:text-sm text-[#735A4A] leading-relaxed max-w-md mx-auto">
                Discover our royal heirloom bridal lehengas, pure silk handcrafted suits, and bespoke trousseau jewellery.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/bridal"
                className="bg-[#221617] hover:bg-[#C49A5A] text-white text-xs font-semibold uppercase tracking-[0.18em] px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span>Bridal Lehengas</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/suits"
                className="bg-white hover:bg-[#FAF5EC] border border-[#DDD2C5] text-[#221617] text-xs font-semibold uppercase tracking-[0.18em] px-6 py-3.5 rounded-xl transition-all"
              >
                <span>Ceremonial Suits</span>
              </Link>
            </div>
          </div>

          {/* Coveted Masterpieces Section */}
          <section className="space-y-8">
            <div className="text-center space-y-1">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-[#C49A5A] uppercase">
                Atelier Highlights
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#221617]">
                Most Coveted Bridal Masterpieces
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {recommendedProducts.map((p) => (
                <div
                  key={p._id}
                  className="bg-white border border-[#EADCC9] rounded-2xl p-3 sm:p-4 flex flex-col justify-between group shadow-sm hover:shadow-md transition-all"
                >
                  <Link
                    href={ROUTES.PRODUCT(p.slug)}
                    className="block aspect-[3/4] relative overflow-hidden bg-[#F5ECE1] rounded-xl mb-3"
                  >
                    <Image
                      src={p.images[0] ?? '/images/products/shahi-sindoori-red-bridal-lehenga-0929.webp'}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {p.images[1] && (
                      <Image
                        src={p.images[1]}
                        alt={`${p.name} alternate view`}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                      />
                    )}
                  </Link>

                  <div className="space-y-1">
                    <Link
                      href={ROUTES.PRODUCT(p.slug)}
                      className="text-xs font-serif font-medium text-[#221617] line-clamp-1 hover:text-[#C49A5A] transition-colors"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs font-bold text-[#221617]">{formatPrice(p.basePrice)}</p>
                  </div>

                  <button
                    onClick={() => handleQuickAdd(p)}
                    className="mt-3 w-full py-2.5 bg-[#221617] hover:bg-[#C49A5A] text-white text-[10px] font-semibold tracking-wider uppercase transition-colors rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Quick Add</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ACTIVE CART STATE (Full Luxury Editorial Architecture)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#221617] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs & Atelier Status Header */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#8A6A55]">
            <Link href="/" className="hover:text-[#C49A5A] transition-colors">Home</Link>
            <ChevronRight size={11} className="text-[#C49A5A]" />
            <span className="text-[#221617] font-semibold">Atelier Bag ({items.length})</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#EADCC9]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#C49A5A] text-[10.5px] font-semibold tracking-[0.25em] uppercase">
                <Crown size={13} className="text-[#C49A5A]" />
                <span>Atelier Registry &amp; Selection</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-[#221617] flex items-baseline gap-3">
                <span>Your Curated Selection</span>
                <span className="text-sm font-sans font-normal text-[#8A6A55] tracking-normal">
                  ({items.length} {items.length === 1 ? 'creation' : 'creations'})
                </span>
              </h1>
            </div>

            <Link
              href={ROUTES.SHOP}
              className="text-xs font-semibold text-[#8A6A55] hover:text-[#C49A5A] uppercase tracking-[0.18em] transition-colors inline-flex items-center gap-1.5 shrink-0 underline underline-offset-4"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Main Grid: Left Items + Right Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-2 space-y-5">
            {items.map((item) => {
              const product = productMap.get(item.productId) || productMap.get(item.slug) || productMap.get(item.name.toLowerCase().trim());
              const displayDesc = product?.shortDescription || product?.description;
              const fabric = product?.fabric;
              const workType = product?.workType;
              const isWishlisted = isInWishlist(item.productId);

              return (
                <div
                  key={`${item.productId}-${item.variantId ?? ''}`}
                  className="bg-white border border-[#EADCC9] rounded-2xl p-4 sm:p-6 shadow-[0_4px_20px_rgba(46,34,28,0.03)] hover:shadow-[0_8px_30px_rgba(46,34,28,0.06)] transition-all flex flex-col sm:flex-row gap-5 relative group"
                >
                  {/* Product Image Thumbnail */}
                  <Link
                    href={ROUTES.PRODUCT(item.slug)}
                    className="w-28 sm:w-36 aspect-[3/4] shrink-0 relative overflow-hidden bg-[#F5ECE1] border border-[#E0D0BC] rounded-xl group/img"
                  >
                    <Image
                      src={item.image || product?.images[0] || '/images/products/shahi-sindoori-red-bridal-lehenga-0929.webp'}
                      alt={item.name}
                      fill
                      sizes="144px"
                      className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                    />
                    {product?.images?.[1] && (
                      <Image
                        src={product.images[1]}
                        alt={`${item.name} alternate angle`}
                        fill
                        sizes="144px"
                        className="object-cover opacity-0 group-hover/img:opacity-100 transition-all duration-700 group-hover/img:scale-105"
                      />
                    )}
                    <div className="absolute top-2 left-2 bg-[#221617]/85 backdrop-blur-xs text-[9px] font-semibold text-white px-2 py-0.5 rounded tracking-widest uppercase">
                      Couture
                    </div>
                  </Link>

                  {/* Garment Details & Editorial Breakdown */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C49A5A]">
                            Atelier Made-To-Order
                          </span>
                          <Link
                            href={ROUTES.PRODUCT(item.slug)}
                            className="block font-serif font-medium text-lg sm:text-xl text-[#221617] hover:text-[#C49A5A] transition-colors leading-snug mt-0.5"
                          >
                            {item.name}
                          </Link>
                        </div>

                        {/* Top Right Quick Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveToWishlist(item)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isWishlisted
                                ? 'bg-rose-50 border-rose-200 text-rose-600'
                                : 'border-[#EADCC9] text-[#8A6A55] hover:text-rose-600 hover:border-rose-200'
                            }`}
                            title="Save for Later / Wishlist"
                            aria-label="Save for later"
                          >
                            <Heart size={14} className={isWishlisted ? 'fill-current' : ''} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              removeItem(item.productId, item.variantId);
                              toast.info(`Removed "${item.name}" from your bag`);
                            }}
                            className="p-1.5 rounded-lg border border-[#EADCC9] text-[#8A6A55] hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
                            title="Remove from bag"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Specification Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {item.color && (
                          <span className="bg-[#FAF5EC] border border-[#E5D7C3] text-[#735A4A] px-2.5 py-0.5 rounded-md text-[11px] font-medium">
                            {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="bg-[#FAF5EC] border border-[#E5D7C3] text-[#735A4A] px-2.5 py-0.5 rounded-md text-[11px] font-medium">
                            Size: {item.size}
                          </span>
                        )}
                        {fabric && (
                          <span className="bg-[#FAF5EC] border border-[#E5D7C3] text-[#735A4A] px-2.5 py-0.5 rounded-md text-[11px] font-medium truncate max-w-[220px]">
                            {fabric}
                          </span>
                        )}
                        {workType && (
                          <span className="bg-[#FAF5EC] border border-[#E5D7C3] text-[#735A4A] px-2.5 py-0.5 rounded-md text-[11px] font-medium truncate max-w-[220px]">
                            {workType}
                          </span>
                        )}
                      </div>

                      {/* Clean Product Description */}
                      {displayDesc && (
                        <p className="text-xs text-[#735A4A] leading-relaxed line-clamp-2 pt-0.5">
                          {displayDesc}
                        </p>
                      )}

                      {/* Bridal Reassurance Pill */}
                      <div className="flex items-center gap-2 text-[11px] text-[#8A6A55] bg-[#FAF7F2] border border-[#EADCC9] px-3 py-1.5 rounded-lg mt-1">
                        <Scissors size={12} className="text-[#C49A5A] shrink-0" />
                        <span>Includes matching dupatta &amp; cancan · Complimentary master blouse fitting consultation</span>
                      </div>
                    </div>

                    {/* Stepper & Price Line */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#EADCC9]/80">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[#DDD2C5] bg-[#FAF7F2] rounded-lg overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="px-3 py-1.5 text-[#221617] hover:bg-[#C49A5A] hover:text-white transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-3.5 text-xs font-semibold text-[#221617] min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="px-3 py-1.5 text-[#221617] hover:bg-[#C49A5A] hover:text-white transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <span className="text-[11px] text-[#8A6A55] hidden sm:inline">
                          Qty: {item.quantity}
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="font-serif text-lg sm:text-xl font-bold text-[#221617]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-[10px] text-[#8A6A55]">
                          (Incl. all taxes &amp; duties)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 4-Pillar Luxury Reassurance Bar */}
            <div className="bg-white border border-[#EADCC9] rounded-2xl p-5 sm:p-6 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="flex items-start gap-2.5">
                <Crown size={18} className="text-[#C49A5A] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-[#221617]">Authentic Karigari</p>
                  <p className="text-[11px] text-[#735A4A] mt-0.5">Certified pure silks &amp; real zardozi.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Scissors size={18} className="text-[#C49A5A] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-[#221617]">Custom Fitting</p>
                  <p className="text-[11px] text-[#735A4A] mt-0.5">Virtual trial with master couturiers.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Truck size={18} className="text-[#C49A5A] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-[#221617]">Insured Transit</p>
                  <p className="text-[11px] text-[#735A4A] mt-0.5">Sealed bridal box delivered safely.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <RefreshCw size={18} className="text-[#C49A5A] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-[#221617]">7-Day Exchange</p>
                  <p className="text-[11px] text-[#735A4A] mt-0.5">Hassle-free size adjustment care.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Conversion Order Summary (Sticky) */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white border border-[#EADCC9] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(46,34,28,0.06)] sticky top-24 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EADCC9]">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-[#C49A5A]" />
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#221617]">
                    Atelier Summary
                  </h2>
                </div>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  SSL Secured
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between text-[#735A4A]">
                  <span>Bag Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)</span>
                  <span className="text-[#221617] font-semibold text-sm">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-[#735A4A]">
                  <span>Estimated Duties &amp; Taxes</span>
                  <span className="text-[#221617] font-medium">Included (GST)</span>
                </div>

                <div className="flex justify-between text-[#735A4A]">
                  <span>Insured Express Shipping</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check size={12} />
                    <span>Free</span>
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-emerald-800 bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-xl font-medium">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-emerald-700" />
                      <span>Privilege ({appliedCoupon.code})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>-{formatPrice(discountAmount)}</span>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[10px] text-emerald-900 underline hover:text-red-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Trousseau Packaging Option Toggle */}
                <div className="pt-2 border-t border-[#EADCC9]/70 space-y-2.5">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isTrousseauPackaging}
                      onChange={(e) => setIsTrousseauPackaging(e.target.checked)}
                      className="mt-0.5 rounded border-[#DDD2C5] text-[#C49A5A] focus:ring-[#C49A5A]"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-[#221617] flex items-center gap-1.5">
                        <Gift size={13} className="text-[#C49A5A]" />
                        <span>Royal Trousseau Box &amp; Note</span>
                        <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                          Free
                        </span>
                      </span>
                      <p className="text-[11px] text-[#735A4A] mt-0.5 leading-tight">
                        Presented in heirloom velvet-lined box with handwritten calligraphy card.
                      </p>
                    </div>
                  </label>

                  {isTrousseauPackaging && (
                    <div className="pl-6 pt-1 animate-in fade-in duration-300">
                      <textarea
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        placeholder="Enter recipient's name or personal bridal greeting note (optional)..."
                        rows={2}
                        className="w-full text-xs p-2.5 border border-[#DDD2C5] rounded-lg bg-[#FAF7F2] focus:outline-none focus:border-[#C49A5A] text-[#221617]"
                      />
                    </div>
                  )}
                </div>

                {/* Promotional Privilege Code */}
                <div className="pt-2 border-t border-[#EADCC9]/70">
                  {!showPromoInput && !appliedCoupon ? (
                    <button
                      type="button"
                      onClick={() => setShowPromoInput(true)}
                      className="text-xs text-[#C49A5A] hover:text-[#221617] underline underline-offset-4 cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles size={12} />
                      <span>Have an atelier privilege or coupon code?</span>
                    </button>
                  ) : !appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="flex gap-1.5 pt-1">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="ENTER CODE (E.G. BRIDAL10)"
                        className="flex-1 px-3 py-2 text-xs uppercase tracking-wider border border-[#DDD2C5] rounded-xl bg-[#FAF7F2] text-[#221617] focus:outline-none focus:border-[#C49A5A]"
                      />
                      <button
                        type="submit"
                        disabled={applyingCoupon}
                        className="px-4 py-2 bg-[#221617] hover:bg-[#C49A5A] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {applyingCoupon ? 'Checking…' : 'Apply'}
                      </button>
                    </form>
                  ) : null}
                </div>

                {/* Total Line */}
                <div className="border-t border-[#EADCC9] pt-4 flex justify-between items-baseline">
                  <div>
                    <span className="font-serif text-base font-semibold text-[#221617]">
                      Grand Total
                    </span>
                    <p className="text-[10px] text-[#735A4A]">All duties &amp; express courier included</p>
                  </div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#221617]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[#221617] hover:bg-[#C49A5A] text-white py-4 px-6 text-xs font-semibold uppercase tracking-[0.22em] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group/btn"
                >
                  <Lock size={13} className="text-[#C49A5A] group-hover/btn:text-white transition-colors" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {!session?.user && (
                  <p className="text-[11px] text-[#8A6A55] text-center font-normal">
                    Guest checkout supported · Sign in to earn bridal loyalty privileges
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* High-Converting Complementary Recommendations */}
        {recommendedProducts.length > 0 && (
          <section className="pt-12 border-t border-[#EADCC9] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[#C49A5A] text-[10.5px] font-semibold tracking-[0.25em] uppercase">
                  <Sparkles size={13} />
                  <span>Atelier Styling Pairing</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#221617] mt-1">
                  Complete Your Bridal Ensemble
                </h2>
                <p className="text-xs sm:text-sm text-[#735A4A] mt-0.5">
                  Curated heirloom potlis, kundan jewellery, and companion pieces designed to crown your look.
                </p>
              </div>

              <Link
                href={ROUTES.SHOP}
                className="text-xs font-semibold text-[#8A6A55] hover:text-[#C49A5A] uppercase tracking-[0.18em] transition-colors inline-flex items-center gap-1.5 shrink-0"
              >
                <span>Browse All Accessories</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {recommendedProducts.map((p) => {
                const fabric = p.fabric;
                return (
                  <div
                    key={p._id}
                    className="bg-white border border-[#EADCC9] rounded-2xl p-3 sm:p-4 flex flex-col justify-between group shadow-sm hover:shadow-md transition-all relative"
                  >
                    <span className="absolute top-5 left-5 z-10 bg-[#221617]/80 backdrop-blur-xs text-[9px] font-semibold text-white px-2 py-0.5 rounded tracking-widest uppercase">
                      Pairing
                    </span>

                    <Link
                      href={ROUTES.PRODUCT(p.slug)}
                      className="block aspect-[3/4] relative overflow-hidden bg-[#F5ECE1] rounded-xl mb-3"
                    >
                      <Image
                        src={p.images[0] ?? '/images/products/shahi-sindoori-red-bridal-lehenga-0929.webp'}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {p.images[1] && (
                        <Image
                          src={p.images[1]}
                          alt={`${p.name} alternate view`}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                        />
                      )}
                    </Link>

                    <div className="space-y-1">
                      <Link
                        href={ROUTES.PRODUCT(p.slug)}
                        className="text-xs font-serif font-medium text-[#221617] line-clamp-1 hover:text-[#C49A5A] transition-colors"
                      >
                        {p.name}
                      </Link>
                      {fabric && (
                        <p className="text-[10px] text-[#8A6A55] uppercase tracking-wider truncate">
                          {fabric}
                        </p>
                      )}
                      <p className="text-xs font-bold text-[#221617] pt-0.5">
                        {formatPrice(p.basePrice)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(p)}
                      className="mt-3 w-full py-2.5 bg-[#221617] hover:bg-[#C49A5A] text-white text-[10px] font-semibold tracking-wider uppercase transition-colors rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Plus size={12} />
                      <span>Quick Add</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Floating Bottom Sticky Checkout Bar on Mobile Screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EADCC9] p-4 shadow-[0_-8px_24px_rgba(46,34,28,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#8A6A55] uppercase tracking-wider block">Total</span>
            <span className="font-serif text-lg font-bold text-[#221617]">{formatPrice(total)}</span>
          </div>

          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="flex-1 bg-[#221617] hover:bg-[#C49A5A] text-white py-3 px-5 text-xs font-semibold uppercase tracking-[0.18em] rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Lock size={12} className="text-[#C49A5A]" />
            <span>Proceed to Checkout</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
