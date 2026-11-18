import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Mirrors <ProductCard> exactly (9:16 image, then name / fabric / price rows at the same row
 * heights), so the page does not jump when real products replace the placeholders.
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[9/16] rounded-xl" />
      <div className="pt-3 flex flex-col gap-1">
        <div className="flex h-5 items-center justify-center sm:justify-start">
          <Skeleton className="h-3.5 w-3/4" />
        </div>
        <div className="flex h-4 items-center justify-center sm:justify-start">
          <Skeleton className="h-2.5 w-1/3" />
        </div>
        <div className="flex h-5 items-center justify-center sm:justify-start">
          <Skeleton className="h-3.5 w-1/4" />
        </div>
      </div>
    </div>
  );
}

const DEFAULT_GRID = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6';

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn(className ?? DEFAULT_GRID)}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
