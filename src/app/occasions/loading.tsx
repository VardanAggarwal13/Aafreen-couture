import { LoadingState } from '@/components/common/LoadingState';
import { Skeleton } from '@/components/ui/skeleton';

/** Matches the light two-column Occasions hero (text left, photo right) and the occasion cards. */
export default function OccasionsLoading() {
  return (
    <LoadingState label="Loading occasions" className="min-h-dvh bg-background animate-in fade-in duration-150">
      <div className="w-full border-b border-border">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2">
          <Skeleton className="h-2.5 w-10" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#F5EFE6] border-b border-[#E8D4BE]">
        <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-5 lg:gap-10 px-6 sm:px-10 lg:px-12 py-6 sm:py-7 lg:py-8">
          <div className="order-2 lg:order-1 max-w-xl space-y-3">
            <Skeleton className="h-3 w-48 rounded-full" />
            <Skeleton className="h-10 sm:h-12 w-72 max-w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-11/12" />
            <Skeleton className="h-3.5 w-3/5" />
            <div className="flex gap-3 pt-3">
              <Skeleton className="h-10 w-44 rounded-lg" />
              <Skeleton className="h-10 w-40 rounded-lg" />
            </div>
          </div>
          <div className="order-1 lg:order-2 mx-auto w-full max-w-[34rem]">
            <Skeleton className="aspect-[4/3] lg:aspect-[34/25] rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Occasion cards */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <Skeleton className="h-3 w-28 mx-auto" />
          <Skeleton className="h-7 w-64 max-w-full mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-[3/4] rounded-xl" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </LoadingState>
  );
}
