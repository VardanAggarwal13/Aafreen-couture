'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ImageOff, Pencil, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

/** Product-level details shown in the inventory "view" modal. */
export interface InventoryProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  images: string[];
  shortDescription: string;
  fabric: string;
  occasions: string[];
  basePrice: number;
  comparePrice: number;
  isActive: boolean;
  // Optional extras (shown when a page provides them, e.g. the Products page).
  description?: string;
  workType?: string;
  tags?: string[];
  /** Labels such as "Featured", "New arrival", "Best seller". */
  badges?: string[];
  soldCount?: number;
}

/** The slice of an inventory row the modal needs (kept minimal to avoid a circular import). */
export interface InventoryVariantRow {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  price: number;
}

interface Props {
  product: InventoryProduct;
  /** Every variant of this product, with live (possibly unsaved) stock figures. */
  variants: InventoryVariantRow[];
  /** The row the admin clicked; it is highlighted in the variant list. */
  activeVariantId: string;
  onClose: () => void;
}

function stockTone(stock: number): { label: string; cls: string; text: string } {
  if (stock === 0) return { label: 'Out of stock', cls: 'bg-red-50 text-red-700 border-red-200', text: 'text-red-600' };
  if (stock <= 5) return { label: 'Low stock', cls: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-600' };
  return { label: 'In stock', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-700' };
}

export function InventoryProductModal({ product, variants, activeVariantId, onClose }: Props) {
  const [selected, setSelected] = useState(0);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const image = product.images[selected] ?? product.images[0];
  const imageLoading = Boolean(image) && loadedSrc !== image;
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
  const overall = stockTone(totalStock);

  // Close on Escape and stop the page behind from scrolling while the modal is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 backdrop-blur-xs sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Product details: ${product.name}`}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#8A6A55] shadow-sm transition-colors hover:text-[#2E221C]"
        >
          <X size="1.0625rem" />
        </button>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto sm:grid-cols-[17rem_1fr]">
          {/* Picture(s) */}
          <div className="bg-[#FAF7F2] p-4 sm:p-5">
            <div className={cn('relative mx-auto aspect-[9/16] w-full max-w-[15rem] overflow-hidden rounded-xl bg-[#EFE8DD] sm:max-w-none', imageLoading && 'animate-pulse')}>
              {image ? (
                <Image
                  key={image}
                  src={image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 40em) 15rem, 17rem"
                  onLoad={() => setLoadedSrc(image)}
                  className={cn('object-contain transition-opacity duration-300', imageLoading ? 'opacity-0' : 'opacity-100')}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#8A6A55]">
                  <ImageOff size="1.5rem" />
                  <span className="text-xs">No picture added</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-label={`Show picture ${i + 1}`}
                    aria-current={i === selected}
                    className={cn(
                      'relative h-14 w-9 cursor-pointer overflow-hidden rounded-md border-2 bg-[#EFE8DD] transition-opacity',
                      i === selected ? 'border-[#C9A86A]' : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                  >
                    <Image src={src} alt="" fill sizes="3rem" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 space-y-4 p-4 sm:p-6">
            <div className="pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#DDD2C5] bg-[#FAF7F2] px-2.5 py-0.5 text-[0.6875rem] font-medium text-[#6B4F3A]">
                  {product.category}
                </span>
                <span
                  className={cn(
                    'rounded-full border px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider',
                    product.isActive
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-stone-300 bg-stone-100 text-stone-600'
                  )}
                >
                  {product.isActive ? 'Live on store' : 'Hidden (inactive)'}
                </span>
              </div>
              <h2 className="mt-2 font-serif text-xl leading-snug text-[#2E221C]">{product.name}</h2>
              <p className="mt-1 text-sm font-semibold text-[#2E221C]">
                {formatPrice(product.basePrice)}
                {product.comparePrice > product.basePrice && (
                  <span className="ml-2 text-xs font-normal text-[#8A6A55] line-through">{formatPrice(product.comparePrice)}</span>
                )}
              </p>
            </div>

            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.badges.map((b) => (
                  <span key={b} className="rounded-full border border-[#C9A86A]/50 bg-[#C9A86A]/10 px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-[#9E7B3A]">
                    {b}
                  </span>
                ))}
              </div>
            )}

            {product.shortDescription && (
              <p className="text-xs leading-relaxed text-[#6B5A4E]">{product.shortDescription}</p>
            )}
            {product.description && product.description !== product.shortDescription && (
              <div>
                <h3 className="mb-1 text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55]">About this piece</h3>
                <p className="max-h-28 overflow-y-auto whitespace-pre-line pr-1 text-xs leading-relaxed text-[#6B5A4E]">{product.description}</p>
              </div>
            )}

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <dt className="text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55]">Fabric</dt>
                <dd className="mt-0.5 text-[#2E221C]">{product.fabric || '—'}</dd>
              </div>
              <div>
                <dt className="text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55]">Occasions</dt>
                <dd className="mt-0.5 text-[#2E221C]">{product.occasions.length ? product.occasions.join(', ') : '—'}</dd>
              </div>
              <div>
                <dt className="text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55]">Total stock</dt>
                <dd className="mt-0.5 flex items-center gap-2 text-[#2E221C]">
                  <span className="font-semibold">{totalStock} units</span>
                  <span className={cn('rounded-full border px-2 py-0.5 text-[0.5625rem] font-medium uppercase tracking-wider', overall.cls)}>
                    {overall.label}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55]">Variants</dt>
                <dd className="mt-0.5 text-[#2E221C]">{variants.length}</dd>
              </div>
              {product.workType && (
                <div>
                  <dt className="text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55]">Work</dt>
                  <dd className="mt-0.5 text-[#2E221C]">{product.workType}</dd>
                </div>
              )}
              {typeof product.soldCount === 'number' && (
                <div>
                  <dt className="text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55]">Sold</dt>
                  <dd className="mt-0.5 text-[#2E221C]">{product.soldCount}</dd>
                </div>
              )}
            </dl>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((t) => (
                  <span key={t} className="rounded-md bg-[#F3EDE3] px-2 py-0.5 text-[0.625rem] text-[#6B4F3A]">#{t}</span>
                ))}
              </div>
            )}

            <div>
              <h3 className="mb-1.5 text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55]">Sizes &amp; stock</h3>
              <div className="overflow-hidden rounded-lg border border-[#EAE2D7]">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-[#EAE2D7]">
                    {variants.length === 0 && (
                      <tr>
                        <td className="px-3 py-3 text-center text-[#8A6A55]">No size variants added yet</td>
                      </tr>
                    )}
                    {variants.map((v) => {
                      const tone = stockTone(v.stock);
                      return (
                        <tr key={v.id} className={cn(v.id === activeVariantId && 'bg-[#C9A86A]/10')}>
                          <td className="px-3 py-2">
                            <span className="font-medium text-[#2E221C]">{v.size || 'Free Size'}</span>
                            {v.color && <span className="text-[#8A6A55]"> · {v.color}</span>}
                            <span className="block font-mono text-[0.625rem] text-[#8A6A55]">{v.sku}</span>
                          </td>
                          <td className="px-3 py-2 text-right text-[#2E221C]">{formatPrice(v.price)}</td>
                          <td className="px-3 py-2 text-right">
                            <span className={cn('font-semibold', tone.text)}>{v.stock}</span>
                            <span className={cn('ml-2 hidden whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.5625rem] font-medium uppercase tracking-wider md:inline-block', tone.cls)}>
                              {tone.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href={ROUTES.ADMIN_PRODUCT(product.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2E221C] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#F8F5F1] transition-colors hover:bg-[#1A1410]"
              >
                <Pencil size="0.8125rem" /> Edit product
              </Link>
              {product.isActive && (
                <Link
                  href={`/product/${product.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDD2C5] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#2E221C] transition-colors hover:border-[#C9A86A]"
                >
                  <ExternalLink size="0.8125rem" /> View on store
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
