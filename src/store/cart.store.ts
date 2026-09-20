'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, IProduct } from '@/types';

export interface AppliedCoupon {
  code: string;
  discount: number; // paise, computed server-side by /api/coupons/validate
  freeShipping: boolean;
}

interface CartState {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  syncItemPrices: (liveProducts: IProduct[]) => void;
  clearCart: () => void;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

function isSameItem(a: CartItem, b: CartItem): boolean {
  const sameProduct =
    a.productId === b.productId ||
    (Boolean(a.slug) && Boolean(b.slug) && a.slug === b.slug);
  const sameVariant = (a.variantId ?? '') === (b.variantId ?? '');
  const sameSize = (a.size ?? '') === (b.size ?? '');
  return sameProduct && (sameVariant || sameSize);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      hasHydrated: false,

      setHasHydrated: (val) => set({ hasHydrated: val }),

      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex((i) => isSameItem(i, item));
          if (existingIndex >= 0) {
            const existing = state.items[existingIndex];
            const updatedItems = [...state.items];
            // Update existing item with latest prices, images, variant details, and increment quantity
            updatedItems[existingIndex] = {
              ...existing,
              ...item,
              quantity: Math.min(existing.quantity + item.quantity, 10),
            };
            return { items: updatedItems };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                (i.productId === productId || i.slug === productId) &&
                (i.variantId ?? '') === (variantId ?? '')
              )
          ),
        })),

      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            (i.productId === productId || i.slug === productId) &&
            (i.variantId ?? '') === (variantId ?? '')
              ? { ...i, quantity: Math.max(1, Math.min(quantity, 10)) }
              : i
          ),
        })),

      syncItemPrices: (liveProducts) =>
        set((state) => {
          let changed = false;
          const updatedItems = state.items.map((item) => {
            const p = liveProducts.find(
              (prod) =>
                String(prod._id) === item.productId ||
                prod.slug === item.slug ||
                prod.slug === item.productId
            );
            if (!p) return item;

            // Find matching variant by variantId or size
            const v = p.variants?.find(
              (variant) =>
                (item.variantId && String(variant._id) === item.variantId) ||
                (item.size && variant.size === item.size)
            );

            const livePrice = v?.price ?? p.basePrice;
            const liveVariantId = v?._id ? String(v._id) : item.variantId;
            const liveImage = v?.images?.[0] || p.images?.[0] || item.image;
            const liveName = p.name || item.name;

            if (
              typeof livePrice === 'number' &&
              livePrice > 0 &&
              (item.price !== livePrice ||
                item.variantId !== liveVariantId ||
                item.name !== liveName ||
                item.image !== liveImage)
            ) {
              changed = true;
              return {
                ...item,
                price: livePrice,
                variantId: liveVariantId,
                name: liveName,
                image: liveImage,
              };
            }
            return item;
          });
          return changed ? { items: updatedItems } : state;
        }),

      clearCart: () => set({ items: [], appliedCoupon: null }),

      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'aafreen-cart',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
