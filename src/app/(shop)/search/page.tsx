import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SearchPageClient } from '@/features/search/components/SearchPageClient';

export const metadata: Metadata = {
  title: 'Search | Aafreen Couture',
};

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <Suspense fallback={<div className="py-20 text-center text-brand-stone text-sm">Loading…</div>}>
          <SearchPageClient />
        </Suspense>
      </div>
    </main>
  );
}
