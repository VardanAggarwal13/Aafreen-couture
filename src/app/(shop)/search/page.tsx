import { Suspense } from 'react';
import { LoadingState } from '@/components/common/LoadingState';
import { ProductGridSkeleton } from '@/components/product/ProductCardSkeleton';
import type { Metadata } from 'next';
import { SearchPageClient } from '@/features/search/components/SearchPageClient';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Search Designer Couture',
  description:
    'Search our royal collection of Indian bridal wear, handcrafted lehengas, festive suits, and heirloom accessories at Aafreen Couture.',
  alternates: { canonical: `${siteConfig.url}/search` },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="min-h-dvh bg-white">
      <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <Suspense
          fallback={
            <LoadingState label="Loading search">
              <ProductGridSkeleton count={4} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" />
            </LoadingState>
          }
        >
          <SearchPageClient />
        </Suspense>
      </div>
    </div>
  );
}
