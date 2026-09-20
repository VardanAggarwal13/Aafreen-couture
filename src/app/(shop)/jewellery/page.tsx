import type { Metadata } from 'next';
import { CoutureCatalogView } from '@/components/shop/CoutureCatalogView';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Royal Bridal Jewellery, Chokers & Polki Sets',
  description:
    'Explore heritage kundan, polki, jadau, and cultured pearl jewellery handcrafted to crown royal bridal lehengas and festive Indian couture ensembles.',
  alternates: { canonical: `${siteConfig.url}/jewellery` },
};

export const revalidate = 120;

export default function JewelleryPage() {
  return (
    <CoutureCatalogView
      title="Royal Jewellery"
      subtitle="Exquisite heirloom kundan, jadau, polki, and cultured pearl creations handcrafted to accompany your couture attire."
      categorySlug="jewellery"
      breadcrumbs={[{ label: 'Jewellery' }]}
    />
  );
}
