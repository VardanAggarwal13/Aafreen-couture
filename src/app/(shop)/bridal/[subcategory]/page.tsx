import type { Metadata } from 'next';
import { CoutureCatalogView } from '@/components/shop/CoutureCatalogView';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const info = BRIDAL_SUB_TITLES[subcategory];
  const title = info ? info.title : subcategory.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${title} | Aafreen Couture Bridal`,
    description: info?.subtitle || `Explore authentic luxury ${title} by Aafreen Couture.`,
  };
}

export default async function BridalSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const info = BRIDAL_SUB_TITLES[subcategory];
  const title = info ? info.title : subcategory.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const categorySlug = info?.categorySlug ?? subcategory;
  const occasionSlug = info?.occasionSlug;

  return (
    <CoutureCatalogView
      title={title}
      subtitle={info?.subtitle}
      categorySlug={categorySlug}
      occasionSlug={occasionSlug}
      breadcrumbs={[
        { label: 'Bridal', href: '/bridal' },
        { label: title },
      ]}
    />
  );
}
