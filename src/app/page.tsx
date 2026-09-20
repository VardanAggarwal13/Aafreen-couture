import { HeroSection } from '@/features/home/components/HeroSection';
import { TrustBadges } from '@/features/home/components/TrustBadges';
import { CategoryGrid } from '@/features/home/components/CategoryGrid';
import { NewArrivals } from '@/features/home/components/NewArrivals';
import { ShopByOccasion } from '@/features/home/components/ShopByOccasion';
import { FeaturedCollections } from '@/features/home/components/FeaturedCollections';
import { BestSellers } from '@/features/home/components/BestSellers';
import { Testimonials } from '@/features/home/components/Testimonials';
import { siteConfig } from '@/config/site.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — Luxury Indian Bridal & Wedding Wear`,
  },
  description:
    'Shop luxury Indian bridal lehengas, bespoke designer suits, and handcrafted wedding wear at Aafreen Couture. Timeless royal elegance crafted for modern brides.',
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: `${siteConfig.name} — Luxury Indian Bridal & Wedding Wear`,
    description:
      'Shop luxury Indian bridal lehengas, bespoke designer suits, and handcrafted wedding wear at Aafreen Couture.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: `${siteConfig.url}/images/og-home.jpg`, width: 1200, height: 630, alt: `${siteConfig.name} — Luxury Indian Bridal Wear` }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Luxury Indian Bridal & Wedding Wear`,
    description:
      'Shop luxury Indian bridal lehengas, bespoke designer suits, and handcrafted wedding wear at Aafreen Couture.',
    images: [`${siteConfig.url}/images/og-home.jpg`],
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. Full-screen hero */}
      <HeroSection />

      {/* 2. Trust strip */}
      <TrustBadges />

      {/* 3. Category circles */}
      <CategoryGrid />

      {/* 4. New arrivals grid */}
      <NewArrivals />

      {/* 5. Shop by occasion */}
      <ShopByOccasion />

      {/* 6. Featured collections editorial tiles */}
      <FeaturedCollections />

      {/* 7. Best sellers */}
      <BestSellers />

      {/* 8. Testimonials */}
      <Testimonials />
    </>
  );
}
