import { cn } from '@/lib/utils';

/**
 * Placeholder block for content that is still loading. Colour comes from the theme `--border`
 * token (see `.skeleton` in globals.css), so it stays visible on every cream surface and
 * follows the palette automatically. Decorative: hidden from assistive tech, because the
 * surrounding <LoadingState> announces "loading" once.
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn('skeleton rounded-md', className)} {...props} />;
}
