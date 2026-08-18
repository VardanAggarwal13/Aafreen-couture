'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { formatPrice } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { siteConfig } from '@/config/site.config';

export function CartClientPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shippingCharge = subtotal >= siteConfig.freeShippingThreshold ? 0 : 25000; // ₹250
  const total = subtotal + shippingCharge;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={40} className="text-[#A67C52] mx-auto mb-4" />
        <h1 className="text-2xl font-serif text-[#221617] mb-3">YOUR CART IS EMPTY</h1>
        <p className="text-[#6E6A66] text-sm mb-8">
          Discover our bridal & luxury couture collections and add your favorites.
        </p>
        <Link
          href={ROUTES.SHOP}
          className="inline-flex items-center gap-2 bg-[#221617] text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#A67C52] transition-colors"
        >
          Shop Now <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-[#E8D8C8] mb-8">
        <h1 className="text-2xl lg:text-3xl font-serif uppercase tracking-wider text-[#221617]">
          YOUR CART ({items.length})
        </h1>
        <Link href={ROUTES.SHOP} className="text-xs font-semibold text-[#A67C52] hover:text-[#221617] uppercase tracking-wider underline underline-offset-4">
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId ?? ''}`}
              className="flex gap-4 bg-white border border-[#E8D8C8] p-4 rounded-xs shadow-2xs"
            >
              {/* Image */}
              <Link href={ROUTES.PRODUCT(item.slug)} className="w-24 h-32 shrink-0 relative overflow-hidden bg-[#FAF7F2] border border-[#E8D8C8] rounded-xs">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <Link href={ROUTES.PRODUCT(item.slug)} className="font-serif font-medium text-[#221617] text-base hover:text-[#A67C52] transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-[#6E6A66] hover:text-red-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {(item.color || item.size) && (
                    <p className="text-xs text-[#6E6A66] mt-1">
                      {[item.color, item.size].filter(Boolean).join(' / ')}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-2 border-t border-[#E8D8C8]/60">
                  {/* Quantity Controller */}
                  <div className="flex items-center border border-[#E8D8C8] bg-[#FAF7F2]">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="px-2.5 py-1 text-[#221617] hover:text-[#A67C52] transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 text-xs font-semibold text-[#221617] min-w-[1.8rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="px-2.5 py-1 text-[#221617] hover:text-[#A67C52] transition-colors"
                      aria-label="Increase"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <span className="text-base font-serif font-bold text-[#221617]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary & Coupon panel matching reference image */}
        <div className="lg:col-span-1 space-y-6">
          {/* Coupon box */}
          <div className="bg-white border border-[#E8D8C8] rounded-xs p-5 shadow-2xs">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#221617] mb-2.5">
              Have a Coupon?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="flex-1 bg-[#FAF7F2] border border-[#E8D8C8] px-3 py-2 text-xs uppercase tracking-wider text-[#221617] focus:outline-none focus:border-[#A67C52]"
              />
              <button className="bg-[#221617] text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#A67C52] transition-colors">
                Apply
              </button>
            </div>
          </div>

          {/* Cart Totals Box */}
          <div className="bg-white border border-[#E8D8C8] rounded-xs p-6 shadow-2xs sticky top-24">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#221617] pb-4 border-b border-[#E8D8C8]">
              CART TOTALS
            </h2>

            <div className="space-y-3 py-4 text-xs">
              <div className="flex justify-between text-[#6E6A66]">
                <span>Subtotal</span>
                <span className="text-[#221617] font-semibold text-sm">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6E6A66]">
                <span>Shipping</span>
                <span className={shippingCharge === 0 ? 'text-green-700 font-semibold' : 'text-[#221617] font-semibold'}>
                  {shippingCharge === 0 ? 'Free' : formatPrice(shippingCharge)}
                </span>
              </div>
              <div className="border-t border-[#E8D8C8] pt-3 flex justify-between font-serif text-base font-bold text-[#221617]">
                <span>Total (Incl. Taxes)</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href={ROUTES.CHECKOUT}
              className="mt-4 flex items-center justify-center gap-2 w-full bg-[#A67C52] text-white py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#8F6841] transition-all shadow-md"
            >
              PROCEED TO CHECKOUT <ArrowRight size={14} />
            </Link>

            <p className="text-[10px] text-[#6E6A66] text-center mt-3 uppercase tracking-wider">
              100% Safe & Secure Checkout · Express Delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
