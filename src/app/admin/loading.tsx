import { LoadingState } from '@/components/common/LoadingState';
import { Skeleton } from '@/components/ui/skeleton';

/** Admin area loading screen: a dashboard-shaped placeholder instead of the storefront one. */
export default function AdminLoading() {
  return (
    <LoadingState label="Loading admin page" className="space-y-6 p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-3.5 w-80 max-w-full" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-lg" />
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </LoadingState>
  );
}
