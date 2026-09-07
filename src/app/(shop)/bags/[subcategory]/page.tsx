import type { Metadata } from 'next';
import { CoutureCatalogView } from '@/components/shop/CoutureCatalogView';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const info = BAGS_SUB_INFO[subcategory];
  const title = info ? info.title : subcategory.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${title} | Luxury Bags | Aafreen Couture`,
    description: info?.subtitle || `Discover handcrafted ${title} by Aafreen Couture.`,
  };
}

export default async function BagsSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const info = BAGS_SUB_INFO[subcategory];
  const title = info ? info.title : subcategory.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const categorySlug = info?.categorySlug || subcategory;

  return (
    <CoutureCatalogView
      title={title}
      subtitle={info?.subtitle}
      categorySlug={categorySlug}
      breadcrumbs={[
        { label: 'Bags', href: '/bags' },
        { label: title },
      ]}
    />
  );
}
