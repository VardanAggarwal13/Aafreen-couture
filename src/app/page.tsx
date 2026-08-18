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
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: 'Discover premium bridal lehengas, designer suits, and luxury ethnic wear by Aafreen Couture. Timeless elegance crafted for your most celebrated moments.',
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: 'Premium bridal lehengas, designer suits, and luxury ethnic wear.',
    images: [{ url: `${siteConfig.url}/images/og-home.jpg`, width: 1200, height: 630 }],
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
