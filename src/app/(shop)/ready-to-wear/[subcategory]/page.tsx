import type { Metadata } from 'next';
import { CoutureCatalogView } from '@/components/shop/CoutureCatalogView';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const info = RTW_SUB_INFO[subcategory];
  const title = info ? info.title : subcategory.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${title} | Ready To Wear | Aafreen Couture`,
    description: info?.subtitle || `Discover ready-to-wear luxury ${title} by Aafreen Couture.`,
  };
}

export default async function ReadyToWearSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const info = RTW_SUB_INFO[subcategory];
  const title = info ? info.title : subcategory.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const categorySlug = info?.categorySlug || subcategory;

  return (
    <CoutureCatalogView
      title={title}
      subtitle={info?.subtitle}
      categorySlug={categorySlug}
      breadcrumbs={[
        { label: 'Ready To Wear', href: '/ready-to-wear' },
        { label: title },
      ]}
    />
  );
}
