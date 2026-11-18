import { LoadingState } from '@/components/common/LoadingState';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading screen for the text-style public pages (About, Contact, FAQ, policies):
 * a centred hero followed by a content card, matching the real layout instead of a product grid.
 */
export function InfoPageLoading() {
  return (
    <LoadingState label="Loading page" className="min-h-[70dvh] bg-background animate-in fade-in duration-150">
      <div className="border-b border-border bg-gradient-to-b from-navbar/50 via-background to-background py-12 sm:py-16 lg:py-20">
        <div className="mx-auto flex max-w-[75rem] flex-col items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-2.5 w-40" />
          <Skeleton className="h-6 w-44 rounded-full" />
          <Skeleton className="h-9 w-72 max-w-full sm:h-11 sm:w-[28rem]" />
          <Skeleton className="h-3.5 w-80 max-w-full sm:w-[34rem]" />
          <Skeleton className="h-3.5 w-56 max-w-full" />
        </div>
      </div>

      <div className="mx-auto max-w-[87.5rem] px-4 py-10 sm:px-6 sm:py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-6 lg:col-span-8">
            {[0, 1].map((i) => (
              <div key={i} className="space-y-4 rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="h-5 w-56 max-w-full" />
                </div>
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-11/12" />
                <Skeleton className="h-3.5 w-4/5" />
              </div>
            ))}
          </div>
          <div className="hidden space-y-3 rounded-2xl border border-border bg-surface p-5 lg:col-span-4 lg:block">
            <Skeleton className="h-3 w-32" />
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-7 w-full" />
            ))}
          </div>
        </div>
      </div>
    </LoadingState>
  );
}
