import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATALOG_SEO } from '@/config/catalog-seo.config';
import { CoutureCatalogServer } from '@/components/shop/CoutureCatalogServer';
import { siteConfig } from '@/config/site.config';

export const revalidate = 120;

interface Props {
  params: Promise<{ subcategory: string }>;
}

const OCCASIONS_SUB_INFO: Record<string, { title: string; subtitle: string; occasionSlug: string }> = {
  'engagement': {
    title: 'Engagement Edit',
    subtitle: 'Romantic pastels, glistening cutdana, and delicate shimmer ensembles designed for your ring ceremony.',
    occasionSlug: 'engagement',
  },
  'haldi': {
    title: 'Haldi Ceremony',
    subtitle: 'Sun-drenched yellow, marigold, and mustard hues in lightweight silks and organza for joyous rituals.',
    occasionSlug: 'haldi',
  },
  'mehendi': {
    title: 'Mehendi Soirée',
    subtitle: 'Vibrant lime greens, teals, and emeralds detailed with floral threadwork and mirror accents.',
    occasionSlug: 'mehendi',
  },
  'sangeet': {
    title: 'Sangeet Glamour',
    subtitle: 'Dazzling high-octane mirrorwork, metallic sequins, and flowing silhouettes made to dance the night away.',
    occasionSlug: 'sangeet',
  },
  'jago': {
    title: 'Jago Night',
    subtitle: 'Rich jewel tones and spirited traditional craftsmanship celebrate midnight Punjabi celebrations.',
    occasionSlug: 'jago',
  },
  'wedding': {
    title: 'The Wedding Day',
    subtitle: 'Majestic scarlet lehengas, heirloom zardozi velvets, and regal royal couture for the holy pheras.',
    occasionSlug: 'wedding',
  },
  'reception': {
    title: 'Reception Gala',
    subtitle: 'Opulent western-contemporary silhouettes, sculptural gowns, and dramatic trails for your grand evening finale.',
    occasionSlug: 'reception',
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(OCCASIONS_SUB_INFO).map((subcategory) => ({ subcategory }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const info = OCCASIONS_SUB_INFO[subcategory];
  if (!info) notFound();
  const seo = CATALOG_SEO['occasions/' + subcategory];
  const title = seo?.metaTitle ?? info.title;
  const description = seo?.metaDescription ?? info.subtitle;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/occasions/${subcategory}` },
    openGraph: { title: `${title} | ${siteConfig.name}`, description },
  };
}

export default async function OccasionSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const info = OCCASIONS_SUB_INFO[subcategory];
  if (!info) notFound();

  return (
    <CoutureCatalogServer
      title={info.title}
      subtitle={info.subtitle}
      occasionSlug={info.occasionSlug ?? subcategory}
      seoKey={`occasions/${subcategory}`}
      breadcrumbs={[
        { label: 'Occasions', href: '/occasions' },
        { label: info.title },
      ]}
    />
  );
}
