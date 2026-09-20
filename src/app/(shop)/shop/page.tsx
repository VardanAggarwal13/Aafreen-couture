import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShopClientPage } from '@/features/shop/components/ShopClientPage';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Luxury Bridal Lehengas, Suits & Festive Wear',
  description:
    'Explore the complete luxury collection of handcrafted bridal lehengas, designer suits, shararas, and accessories with complimentary express delivery across India.',
  alternates: { canonical: `${siteConfig.url}/shop` },
  openGraph: {
    title: `Shop All Luxury Bridal Lehengas & Suits | ${siteConfig.name}`,
    description:
      'Explore handcrafted luxury bridal lehengas, designer suits, shararas, and accessories with complimentary shipping across India by Aafreen Couture.',
    url: `${siteConfig.url}/shop`,
    siteName: siteConfig.name,
    images: [{ url: `${siteConfig.url}/images/og-image.jpg`, width: 1200, height: 630, alt: 'Aafreen Couture Collection' }],
  },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopClientPage />
    </Suspense>
  );
}
