import type { Metadata } from 'next';
import { CoutureCatalogView } from '@/components/shop/CoutureCatalogView';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const info = OCCASIONS_SUB_INFO[subcategory];
  const title = info ? info.title : subcategory.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${title} | Occasions | Aafreen Couture`,
    description: info?.subtitle || `Discover handcrafted designer ensembles curated for ${title} by Aafreen Couture.`,
  };
}

export default async function OccasionSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const info = OCCASIONS_SUB_INFO[subcategory];
  const title = info ? info.title : subcategory.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const occasionSlug = info?.occasionSlug || subcategory;

  return (
    <CoutureCatalogView
      title={title}
      subtitle={info?.subtitle}
      occasionSlug={occasionSlug}
      breadcrumbs={[
        { label: 'Occasions', href: '/occasions' },
        { label: title },
      ]}
    />
  );
}
