'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[RouteError]', error);
  }, [error]);

  return (
    <div role="alert" className="min-h-[70dvh] flex flex-col items-center justify-center px-4 text-center bg-background">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-gold-ink mb-3">Something went wrong</p>
      <h1 className="text-3xl sm:text-4xl font-serif text-heading mb-3">We couldn&apos;t load this page</h1>
      <p className="text-text text-sm max-w-sm mb-8 leading-relaxed">
        An unexpected error occurred. Please try again, or contact us if the problem continues.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className={buttonVariants({ variant: 'couture-gold', size: 'couture' })}>
          Try Again
        </button>
        <Link href="/" className={buttonVariants({ variant: 'couture-outline', size: 'couture' })}>
          Go Home
        </Link>
      </div>
      {error.digest && <p className="mt-8 text-[0.6875rem] text-text/80">Reference: {error.digest}</p>}
    </div>
  );
}
