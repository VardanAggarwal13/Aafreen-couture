import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { ProductCard } from '@/components/product/ProductCard';
import { productService } from '@/server/services/product.service';
import type { IProduct } from '@/types';

const PLACEHOLDER_HUES = [35, 40, 28, 32, 38, 25, 42, 30];

function ProductCardSkeleton({ index }: { index: number }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="aspect-[3/4]"
        style={{ background: `hsl(${PLACEHOLDER_HUES[index] ?? 32}, 25%, 88%)` }}
      />
      <div className="space-y-2">
        <div className="h-3.5 bg-[#EADDC8] rounded-sm w-3/4" />
        <div className="h-3 bg-[#EADDC8] rounded-sm w-1/2" />
        <div className="h-4 bg-[#EADDC8] rounded-sm w-1/3" />
      </div>
    </div>
  );
}

import { FALLBACK_PRODUCTS } from '@/data/products.data';

export async function NewArrivals() {
  let products: IProduct[] = [];
  try {
    const raw = await productService.getNewArrivals(8);
    products = JSON.parse(JSON.stringify(raw)) as IProduct[];
  } catch {
    products = FALLBACK_PRODUCTS.filter((p) => p.isNewArrival && p.isActive).slice(0, 8);
  }

  if (products.length === 0) {
    products = FALLBACK_PRODUCTS.filter((p) => p.isNewArrival && p.isActive).slice(0, 8);
  }

  return (
    <section className="py-10 sm:py-12 lg:py-14 bg-white border-b border-[#E8D8C8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-wide text-[#221617] uppercase">
              New Arrivals
            </h2>
            <p className="text-xs text-[#6E6A66] mt-1 font-sans">
              Handcrafted luxury pieces just added to our collection
            </p>
          </div>
          <Link
            href={`${ROUTES.SHOP}?filter=new`}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.16em] uppercase text-[#221617] hover:text-[#A67C52] transition-colors underline underline-offset-4"
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {products.length > 0
            ? products.map((product, i) => (
                <ProductCard key={product._id} product={product} priority={i < 4} />
              ))
            : Array.from({ length: 8 }, (_, i) => (
                <ProductCardSkeleton key={i} index={i} />
              ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href={`${ROUTES.SHOP}?filter=new`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.16em] uppercase text-[#221617] hover:text-[#A67C52] transition-colors underline underline-offset-4"
          >
            View All New Arrivals <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
