import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShopClientPage } from '@/features/shop/components/ShopClientPage';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: `Shop All — ${siteConfig.name}`,
  description: 'Browse our full collection of premium bridal lenghas, suits, sharara and accessories.',
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopClientPage />
    </Suspense>
  );
}
