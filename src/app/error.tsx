'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-serif text-brand-black mb-3">Something went wrong</h1>
      <p className="text-brand-stone text-sm max-w-sm mb-8">
        An unexpected error occurred. Please try again or contact us if the issue persists.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-brand-gold text-white px-6 py-2.5 text-sm font-medium hover:bg-brand-gold/90 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-brand-cream text-brand-black px-6 py-2.5 text-sm font-medium hover:border-brand-gold transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
