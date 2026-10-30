import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATALOG_SEO } from '@/config/catalog-seo.config';
import { CoutureCatalogServer } from '@/components/shop/CoutureCatalogServer';
import { siteConfig } from '@/config/site.config';

export const revalidate = 120;

interface Props {
  params: Promise<{ subcategory: string }>;
}

const RTW_SUB_INFO: Record<string, { title: string; subtitle: string; categorySlug?: string }> = {
  'new-arrivals': {
    title: 'New Arrivals',
    subtitle: 'The latest couture creations fresh from our master atelier, ready for immediate delivery.',
    categorySlug: 'new-arrivals',
  },
  'signature-co-ords': {
    title: 'Signature Co-Ords',
    subtitle: 'Sculptural matching sets crafted in pure silks and organza for modern celebratory gatherings.',
    categorySlug: 'co-ord-sets',
  },
  'dresses': {
    title: 'Dresses',
    subtitle: 'Floor-sweeping designer gowns and festive dresses tailored with signature Indian finesse.',
    categorySlug: 'dresses',
  },
  'sharara-sets': {
    title: 'Sharara Sets',
    subtitle: 'Voluminous tiered shararas paired with delicately embroidered kurtas and organza dupattas.',
    categorySlug: 'sharara-sets',
  },
  'occasion-lehengas': {
    title: 'Occasion Lehengas',
    subtitle: 'Lightweight, jewel-toned celebratory lehengas tailored for bridesmaids and festive celebrations.',
    categorySlug: 'occasion-lehengas',
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(RTW_SUB_INFO).map((subcategory) => ({ subcategory }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const info = RTW_SUB_INFO[subcategory];
  if (!info) notFound();
  const seo = CATALOG_SEO['ready-to-wear/' + subcategory];
  const title = seo?.metaTitle ?? info.title;
  const description = seo?.metaDescription ?? info.subtitle;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/ready-to-wear/${subcategory}` },
    openGraph: { title: `${title} | ${siteConfig.name}`, description },
  };
}

export default async function ReadyToWearSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const info = RTW_SUB_INFO[subcategory];
  if (!info) notFound();

  return (
    <CoutureCatalogServer
      title={info.title}
      subtitle={info.subtitle}
      categorySlug={info.categorySlug ?? subcategory}
      seoKey={`ready-to-wear/${subcategory}`}
      breadcrumbs={[
        { label: 'Ready To Wear', href: '/ready-to-wear' },
        { label: info.title },
      ]}
    />
  );
}
