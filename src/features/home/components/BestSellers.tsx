import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { ProductCard } from '@/components/product/ProductCard';
import { productService } from '@/server/services/product.service';
import type { IProduct } from '@/types';

function ProductCardSkeleton({ index }: { index: number }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="aspect-[3/4]"
        style={{ background: `hsl(${35 + index * 8}, 25%, ${85 - index}%)` }}
      />
      <div className="space-y-2">
        <div className="h-3.5 bg-[#EADDC8] rounded-sm w-3/4" />
        <div className="h-3 bg-[#EADDC8] rounded-sm w-1/2" />
        <div className="h-4 bg-[#EADDC8] rounded-sm w-1/3" />
      </div>
    </div>
  );
}

export async function BestSellers() {
  let products: IProduct[] = [];
  try {
    const raw = await productService.getBestSellers(4);
    products = JSON.parse(JSON.stringify(raw)) as IProduct[];
  } catch {
    // DB unavailable — show placeholders
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-[22px] sm:text-[28px] tracking-[0.02em] text-[#1A1A1A]">
            Best Sellers
          </h2>
          <Link
            href={`${ROUTES.SHOP}?sort=best-selling`}
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-[#1A1A1A] hover:text-brand-gold transition-colors"
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
          {products.length > 0
            ? products.map((product, i) => (
                <ProductCard key={product._id} product={product} priority={i < 4} />
              ))
            : Array.from({ length: 4 }, (_, i) => (
                <ProductCardSkeleton key={i} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
