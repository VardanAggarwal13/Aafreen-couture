import { LoadingState } from '@/components/common/LoadingState';
import { ProductGridSkeleton } from '@/components/product/ProductCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

/** Listing-style loading screen (shop, collections, category pages, wishlist, search). */
export default function ShopLoading() {
  return (
    <LoadingState label="Loading products" className="min-h-dvh bg-background animate-in fade-in duration-150">
      {/* Heading */}
      <div className="w-full border-b border-border">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Skeleton className="h-2.5 w-12" />
            <Skeleton className="h-2.5 w-20" />
          </div>
          <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mx-auto my-2" />
          <Skeleton className="h-3 w-64 sm:w-96 max-w-full mx-auto mt-2" />
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[var(--header-h)] z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>
      </div>

      {/* Grid: same columns and gaps as the real listing */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12">
        <ProductGridSkeleton count={8} />
      </div>
    </LoadingState>
  );
}
