import { LoadingState } from '@/components/common/LoadingState';
import { Skeleton } from '@/components/ui/skeleton';

/** Product page loading screen: gallery on the left, details on the right (not a listing grid). */
export default function ProductLoading() {
  return (
    <LoadingState label="Loading product" className="bg-background min-h-dvh animate-in fade-in duration-150">
      <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3 flex items-center gap-2">
        <Skeleton className="h-2.5 w-10" />
        <Skeleton className="h-2.5 w-10" />
        <Skeleton className="h-2.5 w-24" />
      </div>

      <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">
          {/* Gallery */}
          <div className="lg:col-span-7 flex gap-3">
            <div className="hidden sm:flex flex-col gap-3 w-16 shrink-0">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
              ))}
            </div>
            <Skeleton className="flex-1 aspect-[4/5] rounded-xl" />
          </div>

          {/* Details */}
          <div className="lg:col-span-5 space-y-5">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-9 w-4/5" />
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-8 w-40" />
            <div className="flex gap-2 pt-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-10 w-12 rounded-lg" />
              ))}
            </div>
            <div className="flex gap-3 pt-3">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
            <div className="space-y-3 pt-4">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-11 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </LoadingState>
  );
}
