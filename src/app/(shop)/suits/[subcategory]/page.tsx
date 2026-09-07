import type { Metadata } from 'next';
import { CoutureCatalogView } from '@/components/shop/CoutureCatalogView';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const info = SUITS_SUB_TITLES[subcategory];
  const title = info ? info.title : subcategory.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${title} | Aafreen Couture Suits`,
    description: info?.subtitle || `Discover handcrafted luxury ${title} by Aafreen Couture.`,
  };
}

export default async function SuitsSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const info = SUITS_SUB_TITLES[subcategory];
  const title = info ? info.title : subcategory.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const categorySlug = info?.categorySlug || subcategory;

  return (
    <CoutureCatalogView
      title={title}
      subtitle={info?.subtitle}
      categorySlug={categorySlug}
      breadcrumbs={[
        { label: 'Suits', href: '/suits' },
        { label: title },
      ]}
    />
  );
}
