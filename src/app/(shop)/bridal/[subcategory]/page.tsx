import type { Metadata } from 'next';
import { CoutureCatalogView } from '@/components/shop/CoutureCatalogView';

interface Props {
  params: Promise<{ subcategory: string }>;
}

const BRIDAL_SUB_TITLES: Record<string, { title: string; subtitle: string; isOccasion?: boolean }> = {
  'bridal-lehengas': {
    title: 'Bridal Lehengas',
    subtitle: 'Heirloom bridal lehengas hand-embroidered with zardozi, dabka, and real silk threads.',
  },
  'bridal-suits': {
    title: 'Bridal Suits',
    subtitle: 'Regal ceremonial suits and royal anarkalis crafted for intimate wedding rituals.',
  },
  'bridesmaid-lehengas': {
    title: 'Bridesmaid Lehengas',
    subtitle: 'Coordinated luxury lehengas and graceful silhouettes curated for the bridal squad.',
  },
  'reception-gowns': {
    title: 'Reception Gowns',
    subtitle: 'Opulent evening couture ballgowns adorned with crystals, sequins, and dramatic capes.',
  },
  'reception': {
    title: 'Reception Collection',
    subtitle: 'Grand couture designs tailored for unforgettable wedding receptions.',
    isOccasion: true,
  },
  'engagement': {
    title: 'Engagement Collection',
    subtitle: 'Sparkling cocktail lehengas and modern silhouettes for your ring ceremony.',
    isOccasion: true,
  },
  'mehendi': {
    title: 'Mehendi Collection',
    subtitle: 'Vibrant handcrafted ensembles bathed in festive greens, yellows, and mirror accents.',
    isOccasion: true,
  },
  'haldi': {
    title: 'Haldi Collection',
    subtitle: 'Sunshine hues, delicate gota patti, and playful silhouettes for the joyous haldi ceremony.',
    isOccasion: true,
  },
  'sangeet': {
    title: 'Sangeet Collection',
    subtitle: 'Dazzling shimmering lehengas designed for unforgettable dance and celebration.',
    isOccasion: true,
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
  const isOccasion = info?.isOccasion || ['reception', 'engagement', 'mehendi', 'haldi', 'sangeet'].includes(subcategory);

  return (
    <CoutureCatalogView
      title={title}
      subtitle={info?.subtitle}
      categorySlug={isOccasion ? undefined : subcategory}
      occasionSlug={isOccasion ? subcategory : undefined}
      breadcrumbs={[
        { label: 'Bridal', href: '/bridal' },
        { label: title },
      ]}
    />
  );
}
