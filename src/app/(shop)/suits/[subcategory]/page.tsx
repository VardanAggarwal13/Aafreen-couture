import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATALOG_SEO } from '@/config/catalog-seo.config';
import { CoutureCatalogServer } from '@/components/shop/CoutureCatalogServer';
import { siteConfig } from '@/config/site.config';

export const revalidate = 120;

interface Props {
  params: Promise<{ subcategory: string }>;
}

const SUITS_SUB_TITLES: Record<string, { title: string; subtitle: string; categorySlug?: string }> = {
  'cotton-kurta-sets': {
    title: 'Cotton Kurta Sets',
    subtitle: 'Breathable pure cottons and Chanderi suits crafted with delicate threadwork for effortless elegance.',
    categorySlug: 'cotton-kurta-sets',
  },
  'co-ord-sets': {
    title: 'Co-ord Sets',
    subtitle: 'Signature contemporary coordinated sets tailored for modern festivities and chic soirees.',
    categorySlug: 'co-ord-sets',
  },
  'summer-essentials': {
    title: 'Summer Essentials',
    subtitle: 'Lightweight breezy suits in soothing pastel tones designed for effortless daytime poise.',
    categorySlug: 'summer-essentials',
  },
  'partywear-unstitched': {
    title: 'Partywear Unstitched',
    subtitle: 'Opulent unstitched fabrics ready for your bespoke silhouette and royal customization.',
    categorySlug: 'partywear-unstitched',
  },
  'handcrafted-luxury': {
    title: 'Handcrafted Luxury',
    subtitle: 'Artisanal suits with intricate zardozi, gotta patti, and resham hand embroidery.',
    categorySlug: 'custom-embroidered-suits',
  },
  'indo-western': {
    title: 'Indo-Western',
    subtitle: 'Where timeless Indian artistry meets contemporary structural draping.',
    categorySlug: 'indo-western',
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SUITS_SUB_TITLES).map((subcategory) => ({ subcategory }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const info = SUITS_SUB_TITLES[subcategory];
  if (!info) notFound();
  const seo = CATALOG_SEO['suits/' + subcategory];
  const title = seo?.metaTitle ?? info.title;
  const description = seo?.metaDescription ?? info.subtitle;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/suits/${subcategory}` },
    openGraph: { title: `${title} | ${siteConfig.name}`, description },
  };
}

export default async function SuitsSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const info = SUITS_SUB_TITLES[subcategory];
  if (!info) notFound();

  return (
    <CoutureCatalogServer
      title={info.title}
      subtitle={info.subtitle}
      categorySlug={info.categorySlug ?? subcategory}
      seoKey={`suits/${subcategory}`}
      breadcrumbs={[
        { label: 'Suits', href: '/suits' },
        { label: info.title },
      ]}
    />
  );
}
