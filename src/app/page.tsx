import { HeroSection } from '@/features/home/components/HeroSection';
import { TrustBadges } from '@/features/home/components/TrustBadges';
import { CategoryGrid } from '@/features/home/components/CategoryGrid';
import { NewArrivals } from '@/features/home/components/NewArrivals';
import { ShopByOccasion } from '@/features/home/components/ShopByOccasion';
import { FeaturedCollections } from '@/features/home/components/FeaturedCollections';
import { BestSellers } from '@/features/home/components/BestSellers';
import { CustomerReviews } from '@/features/home/components/CustomerReviews';
import { Testimonials } from '@/features/home/components/Testimonials';
import { siteConfig } from '@/config/site.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: `Bridal Lehengas Online India | ${siteConfig.name}, Amritsar`,
  },
  description:
    'Handcrafted bridal lehengas, designer suits and wedding couture from our Amritsar atelier. Made-to-measure pieces, shipped across India and worldwide.',
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

export const revalidate = 120;

export default function HomePage() {
  return (
    <>
      {/* 1. Full-screen hero */}
      <HeroSection />

      {/* Everything below the hero skips layout/paint until it nears the viewport */}
      <div className="cv-auto"><TrustBadges /></div>
      <div className="cv-auto"><CategoryGrid /></div>
      <div className="cv-auto"><NewArrivals /></div>
      <div className="cv-auto"><ShopByOccasion /></div>
      <div className="cv-auto"><FeaturedCollections /></div>
      <div className="cv-auto"><BestSellers /></div>
      <div className="cv-auto"><CustomerReviews fallback={<Testimonials />} /></div>
    </>
  );
}
