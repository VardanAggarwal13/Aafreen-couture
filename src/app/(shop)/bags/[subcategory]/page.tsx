import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATALOG_SEO } from '@/config/catalog-seo.config';
import { CoutureCatalogServer } from '@/components/shop/CoutureCatalogServer';
import { siteConfig } from '@/config/site.config';

export const revalidate = 120;

interface Props {
  params: Promise<{ subcategory: string }>;
}

const BAGS_SUB_INFO: Record<string, { title: string; subtitle: string; categorySlug?: string }> = {
  'handbags': {
    title: 'Handbags',
    subtitle: 'Exquisitely structured designer handbags blending traditional embroidery with modern silhouettes.',
    categorySlug: 'handbags',
  },
  'potlis': {
    title: 'Potlis',
    subtitle: 'Classic silk and velvet drawstring potlis embellished with pearls, tassels, and zardozi embroidery.',
    categorySlug: 'potlis',
  },
  'clutches': {
    title: 'Clutches',
    subtitle: 'Sleek box clutches and minaudières detailed with crystals, pearls, and royal metallic hardware.',
    categorySlug: 'clutches',
  },
  'totes': {
    title: 'Totes',
    subtitle: 'Spacious artisanal totes featuring woven craftsmanship and heirloom motifs for effortless luxury.',
    categorySlug: 'totes',
  },
  'shoulder-bags': {
    title: 'Shoulder Bags',
    subtitle: 'Graceful shoulder bags designed with versatile chains and handcrafted textiles.',
    categorySlug: 'shoulder-bags',
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(BAGS_SUB_INFO).map((subcategory) => ({ subcategory }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const info = BAGS_SUB_INFO[subcategory];
  if (!info) notFound();
  const seo = CATALOG_SEO['bags/' + subcategory];
  const title = seo?.metaTitle ?? info.title;
  const description = seo?.metaDescription ?? info.subtitle;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/bags/${subcategory}` },
    openGraph: { title: `${title} | ${siteConfig.name}`, description },
  };
}

export default async function BagsSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const info = BAGS_SUB_INFO[subcategory];
  if (!info) notFound();

  return (
    <CoutureCatalogServer
      title={info.title}
      subtitle={info.subtitle}
      categorySlug={info.categorySlug ?? subcategory}
      seoKey={`bags/${subcategory}`}
      breadcrumbs={[
        { label: 'Bags', href: '/bags' },
        { label: info.title },
      ]}
    />
  );
}
