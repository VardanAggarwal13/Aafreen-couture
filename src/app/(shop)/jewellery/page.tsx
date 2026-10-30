import type { Metadata } from 'next';
import { CoutureCatalogServer } from '@/components/shop/CoutureCatalogServer';
import { siteConfig } from '@/config/site.config';
import { CATALOG_SEO } from '@/config/catalog-seo.config';

export const metadata: Metadata = {
  title: CATALOG_SEO['jewellery/main'].metaTitle,
  description: CATALOG_SEO['jewellery/main'].metaDescription,
  alternates: { canonical: `${siteConfig.url}/jewellery` },
};

export const revalidate = 120;

export default function JewelleryPage() {
  return (
    <CoutureCatalogServer
      seoKey="jewellery/main"
      title="Royal Jewellery"
      subtitle="Exquisite heirloom kundan, jadau, polki, and cultured pearl creations handcrafted to accompany your couture attire."
      categorySlug="jewellery"
      breadcrumbs={[{ label: 'Jewellery' }]}
    />
  );
}
