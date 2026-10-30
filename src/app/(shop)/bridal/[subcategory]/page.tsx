import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BRIDAL_OCCASION_ALIASES, CATALOG_SEO } from '@/config/catalog-seo.config';
import { CoutureCatalogServer } from '@/components/shop/CoutureCatalogServer';
import { siteConfig } from '@/config/site.config';

export const revalidate = 120;

interface Props {
  params: Promise<{ subcategory: string }>;
}

interface BridalSubInfo {
  title: string;
  subtitle: string;
  categorySlug?: string;
  occasionSlug?: string;
}

const BRIDAL_SUB_TITLES: Record<string, BridalSubInfo> = {
  'bridal-lehengas': {
    title: 'Bridal Lehengas',
    subtitle: 'Heirloom bridal lehengas hand-embroidered with zardozi, dabka, and real silk threads.',
    categorySlug: 'bridal-lehengas',
  },
  'bridal-suits': {
    title: 'Bridal Suits',
    subtitle: 'Regal ceremonial suits and royal anarkalis crafted for intimate wedding rituals.',
    categorySlug: 'bridal-suits',
  },
  'bridesmaid-lehengas': {
    title: 'Bridesmaid Lehengas',
    subtitle: 'Coordinated luxury lehengas and graceful silhouettes curated for the bridal squad.',
    categorySlug: 'bridesmaid-lehengas',
  },
  'reception-gowns': {
    title: 'Reception Gowns',
    subtitle: 'Opulent evening couture ballgowns adorned with crystals, sequins, and dramatic capes.',
    categorySlug: 'reception-gowns',
  },
  'reception': {
    title: 'Reception Collection',
    subtitle: 'Grand couture designs tailored for unforgettable wedding receptions.',
    categorySlug: 'reception-gowns',
  },
  'engagement': {
    title: 'Engagement Collection',
    subtitle: 'Sparkling cocktail lehengas and modern silhouettes for your ring ceremony.',
    occasionSlug: 'engagement',
  },
  'mehendi': {
    title: 'Mehendi Collection',
    subtitle: 'Vibrant handcrafted ensembles bathed in festive greens, yellows, and mirror accents.',
    occasionSlug: 'mehendi',
  },
  'haldi': {
    title: 'Haldi Collection',
    subtitle: 'Sunshine hues, delicate gota patti, and playful silhouettes for the joyous haldi ceremony.',
    categorySlug: 'haldi',
  },
  'sangeet': {
    title: 'Sangeet Collection',
    subtitle: 'Dazzling shimmering lehengas designed for unforgettable dance and celebration.',
    occasionSlug: 'sangeet',
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(BRIDAL_SUB_TITLES).map((subcategory) => ({ subcategory }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const info = BRIDAL_SUB_TITLES[subcategory];
  if (!info) notFound();
  // /bridal/<occasion> repeats /occasions/<occasion>, so the occasion page is the canonical one.
  const alias = BRIDAL_OCCASION_ALIASES[subcategory];
  const seo = CATALOG_SEO[alias ? `occasions/${alias}` : `bridal/${subcategory}`];
  const title = seo?.metaTitle ?? info.title;
  const description = seo?.metaDescription ?? info.subtitle;
  const path = alias ? `/occasions/${alias}` : `/bridal/${subcategory}`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}${path}` },
    openGraph: { title: `${title} | ${siteConfig.name}`, description },
  };
}

export default async function BridalSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const info = BRIDAL_SUB_TITLES[subcategory];
  if (!info) notFound();
  const alias = BRIDAL_OCCASION_ALIASES[subcategory];

  return (
    <CoutureCatalogServer
      title={info.title}
      subtitle={info.subtitle}
      categorySlug={info.categorySlug ?? subcategory}
      occasionSlug={info.occasionSlug}
      seoKey={alias ? `occasions/${alias}` : `bridal/${subcategory}`}
      breadcrumbs={[
        { label: 'Bridal', href: '/bridal' },
        { label: info.title },
      ]}
    />
  );
}
