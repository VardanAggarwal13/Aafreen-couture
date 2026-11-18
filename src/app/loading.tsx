import { LoadingState } from '@/components/common/LoadingState';
import { ProductGridSkeleton } from '@/components/product/ProductCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

/** Fallback for any route without a more specific loading screen. */
export default function RootLoading() {
  return (
    <LoadingState label="Loading page" className="min-h-dvh bg-background animate-in fade-in duration-150 flex flex-col">
      <div aria-hidden="true" className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent animate-pulse" />

      <div className="max-w-[90rem] mx-auto w-full px-4 sm:px-6 lg:px-12 py-10 space-y-8 flex-1">
        <div className="space-y-3 text-center max-w-md mx-auto pt-6">
          <Skeleton className="h-3 w-28 mx-auto rounded-full" />
          <Skeleton className="h-8 w-60 max-w-full mx-auto" />
          <Skeleton className="h-3 w-72 max-w-full mx-auto" />
        </div>

        <ProductGridSkeleton count={4} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4" />
      </div>
    </LoadingState>
  );
}
