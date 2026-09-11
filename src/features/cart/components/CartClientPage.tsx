'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';
import { useCartStore } from '@/store/cart.store';
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
  const { items, removeItem, updateQuantity, addItem, getSubtotal } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPct: number } | null>(null);

  const subtotal = getSubtotal();
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPct) / 100) : 0;
  const shippingCharge = subtotal >= siteConfig.freeShippingThreshold ? 0 : 25000;
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
    toast.success(`Added "${p.name}" to your shopping bag`);
  }

  function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'COUTURE10' || clean === 'ROYAL10' || clean === 'AAFREEN10') {
      setAppliedCoupon({ code: clean, discountPct: 10 });
      toast.success('Celebration Privilege applied: 10% Off');
    } else if (clean === 'WELCOME15') {
      setAppliedCoupon({ code: clean, discountPct: 15 });
      toast.success('Welcome Privilege applied: 15% Off');
    } else {
      toast.error('Invalid code. Try COUTURE10');
    }
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

  // EMPTY STATE
  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center font-sans space-y-12">
        <div className="bg-surface border border-border/80 rounded-xs p-10 sm:p-14 max-w-xl mx-auto shadow-xs space-y-5">
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold shadow-xs">
            <ShoppingBag size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <p className="text-[10.5px] font-semibold tracking-[0.22em] text-gold uppercase">Atelier Shopping Bag</p>
            <h1 className="text-2xl sm:text-3xl font-serif text-heading">Your Shopping Bag is Empty</h1>
            <p className="text-xs sm:text-sm text-text leading-relaxed max-w-md mx-auto">
              Discover our handcrafted bridal lehengas, royal heritage suits, and bespoke trousseau pieces.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href={ROUTES.SHOP}
              className="inline-flex items-center gap-2 bg-heading text-surface text-xs font-semibold uppercase tracking-[0.18em] px-8 py-3.5 rounded-xs hover:bg-gold transition-colors shadow-xs"
            >
              Explore Collections <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Empty state recommendations */}
        <section className="text-left space-y-6">
          <div className="border-b border-border pb-3">
            <p className="text-[10.5px] font-semibold tracking-[0.2em] text-gold uppercase">Atelier Highlights</p>
            <h2 className="text-xl sm:text-2xl font-serif text-heading mt-0.5">Most Coveted Bridal Masterpieces</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {recommendedProducts.map((p) => (
              <div key={p._id} className="bg-surface border border-border/80 rounded-xs p-3 flex flex-col justify-between group shadow-2xs">
                <Link href={ROUTES.PRODUCT(p.slug)} className="block aspect-[3/4] relative overflow-hidden bg-background rounded-xs mb-3">
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
                  <Link href={ROUTES.PRODUCT(p.slug)} className="text-xs font-semibold text-heading line-clamp-1 hover:text-gold transition-colors">
                    {p.name}
                  </Link>
                  <p className="text-xs font-bold text-heading">{formatPrice(p.basePrice)}</p>
                </div>
                <button
                  onClick={() => handleQuickAdd(p)}
                  className="mt-3 w-full py-2 bg-heading hover:bg-gold text-surface text-[10px] font-semibold tracking-wider uppercase transition-colors rounded-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Add to Bag</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-12">
      {/* Header */}
      <div className="pb-6 border-b border-border/80 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-serif text-heading">
          Your Cart ({items.length})
        </h1>
        <Link
          href={ROUTES.SHOP}
          className="text-xs font-semibold text-gold hover:text-heading uppercase tracking-wider underline underline-offset-4 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = productMap.get(item.productId) || productMap.get(item.slug) || productMap.get(item.name.toLowerCase().trim());
            const displayDesc = product?.shortDescription || product?.description;
            const fabric = product?.fabric;
            const workType = product?.workType;

            return (
              <div
                key={`${item.productId}-${item.variantId ?? ''}`}
                className="bg-surface border border-border/80 rounded-xs p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image */}
                <Link
                  href={ROUTES.PRODUCT(item.slug)}
                  className="w-24 sm:w-28 aspect-[3/4] shrink-0 relative overflow-hidden bg-background border border-border rounded-xs group"
                >
                  <Image
                    src={item.image || product?.images[0] || '/images/products/shahi-sindoori-red-bridal-lehenga-0929.webp'}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product?.images?.[1] && (
                    <Image
                      src={product.images[1]}
                      alt={`${item.name} alternate angle`}
                      fill
                      sizes="112px"
                      className="object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                    />
                  )}
                </Link>

                {/* Info & Editorial Summary */}
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-start gap-3">
                      <Link
                        href={ROUTES.PRODUCT(item.slug)}
                        className="font-serif font-medium text-heading text-base hover:text-gold transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => {
                          removeItem(item.productId, item.variantId);
                          toast.info(`Removed "${item.name}" from your cart`);
                        }}
                        className="text-text/50 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Variant specs */}
                    {(item.color || item.size) && (
                      <p className="text-xs text-text/80 mt-0.5">
                        {[item.color, item.size && `Size ${item.size}`].filter(Boolean).join(' • ')}
                      </p>
                    )}

                    {/* Clean Product Description */}
                    {displayDesc && (
                      <p className="text-xs text-text/90 leading-relaxed mt-1 line-clamp-2">
                        {displayDesc}
                      </p>
                    )}

                    {/* Fabric & Craft details */}
                    {(fabric || workType) && (
                      <p className="text-[11px] text-text/70 mt-1">
                        {[fabric && `Fabric: ${fabric}`, workType && `Craft: ${workType}`].filter(Boolean).join(' • ')}
                      </p>
                    )}
                  </div>

                  {/* Quantity Controller & Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <div className="flex items-center border border-border bg-background rounded-xs overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="px-2.5 py-1 text-heading hover:bg-surface hover:text-gold transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="px-3 text-xs font-semibold text-heading min-w-[1.8rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="px-2.5 py-1 text-heading hover:bg-surface hover:text-gold transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <div className="text-right font-serif text-base font-bold text-heading">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Clean, Minimalist Luxury Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-xs p-6 shadow-2xs sticky top-24 space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-heading pb-3 border-b border-border">
              Cart Totals
            </h2>

            {/* Clean Price Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-text">
                <span>Subtotal</span>
                <span className="text-heading font-semibold text-sm">{formatPrice(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Privilege ({appliedCoupon.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-text">
                <span>Shipping</span>
                <span className={shippingCharge === 0 ? 'text-emerald-700 font-medium' : 'text-heading font-medium'}>
                  {shippingCharge === 0 ? 'Free' : formatPrice(shippingCharge)}
                </span>
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-baseline">
                <span className="font-serif text-sm font-semibold text-heading">Total (Incl. Taxes)</span>
                <span className="font-serif text-xl sm:text-2xl font-bold text-heading">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Discreet Promo Code Input */}
            <div className="pt-2 border-t border-border/60">
              {!showPromoInput && !appliedCoupon ? (
                <button
                  type="button"
                  onClick={() => setShowPromoInput(true)}
                  className="text-xs text-gold hover:text-heading underline underline-offset-4 cursor-pointer transition-colors"
                >
                  Have a promotional code?
                </button>
              ) : !appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-1.5 text-xs uppercase tracking-wider border border-border rounded-xs bg-background text-heading focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-heading hover:bg-gold text-surface text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              ) : null}
            </div>

            {/* Primary Proceed to Checkout Button */}
            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full bg-heading hover:bg-gold text-surface py-4 text-xs font-semibold uppercase tracking-[0.2em] rounded-xs shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>

            {!session?.user && (
              <p className="text-[11px] text-gold text-center font-normal">
                Sign in or register to complete your order
              </p>
            )}

            {/* Minimal Single-Line Luxury Guarantee */}
            <p className="text-[10px] text-text/70 text-center uppercase tracking-wider pt-2 border-t border-border/60">
              100% Safe & Secure Checkout · Express Delivery
            </p>
          </div>
        </div>
      </div>

      {/* High-Converting Complementary Recommendations */}
      {recommendedProducts.length > 0 && (
        <section className="pt-10 border-t border-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-gold text-[10.5px] font-semibold tracking-[0.22em] uppercase">
                <Sparkles size={14} />
                <span>Atelier Styling Recommendations</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-heading mt-1">
                Complete Your Bridal Ensemble
              </h2>
              <p className="text-xs sm:text-sm text-text mt-0.5">
                Curated accessories and heirloom jewellery chosen to seamlessly pair with your selection.
              </p>
            </div>
            <Link
              href={ROUTES.SHOP}
              className="text-xs font-semibold text-gold hover:text-heading uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shrink-0"
            >
              Browse All Accessories <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {recommendedProducts.map((p) => {
              const fabric = p.fabric;
              return (
                <div
                  key={p._id}
                  className="bg-surface border border-border/80 rounded-xs p-3.5 flex flex-col justify-between group shadow-2xs hover:border-gold/60 transition-all"
                >
                  <Link
                    href={ROUTES.PRODUCT(p.slug)}
                    className="block aspect-[3/4] relative overflow-hidden bg-background rounded-xs mb-3"
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
                      className="text-xs font-semibold text-heading line-clamp-1 hover:text-gold transition-colors"
                    >
                      {p.name}
                    </Link>
                    {fabric && (
                      <p className="text-[10.5px] text-text/80 uppercase tracking-wider truncate">
                        {fabric}
                      </p>
                    )}
                    <p className="text-xs font-bold text-heading pt-0.5">
                      {formatPrice(p.basePrice)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleQuickAdd(p)}
                    className="mt-3 w-full py-2.5 bg-heading hover:bg-gold text-surface text-[10.5px] font-semibold tracking-wider uppercase transition-colors rounded-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus size={13} />
                    <span>Quick Add to Bag</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
