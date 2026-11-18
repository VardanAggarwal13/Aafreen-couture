import { cn } from '@/lib/utils';

interface LoadingStateProps {
  /** Spoken to screen-reader users, e.g. "Loading products". */
  label?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps a skeleton so assistive tech announces a single polite "loading" message and knows the
 * region is busy, instead of reading out dozens of empty placeholder blocks.
 */
export function LoadingState({ label = 'Loading content', className, children }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={cn(className)}>
      <span className="sr-only">{label}…</span>
      {children}
    </div>
  );
}
