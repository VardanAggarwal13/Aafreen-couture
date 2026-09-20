import type { Metadata } from 'next';
import { CategoryHubView } from '@/components/shop/CategoryHubView';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Designer Dresses, Co-Ords & Sharara Sets',
  description:
    'Shop luxury ready-to-wear Indian designer wear, chic co-ord sets, shararas, and festive party dresses crafted for weddings and gala celebrations.',
  alternates: { canonical: `${siteConfig.url}/ready-to-wear` },
};

export const revalidate = 120;

const RTW_CHAPTERS = [
  {
    id: 'new-arrivals',
    chapterNum: '01',
    title: 'New Arrivals',
    subtitle: 'The latest couture creations fresh from our master atelier, ready for immediate delivery.',
    categorySlug: 'new-arrivals',
    viewAllHref: '/ready-to-wear/new-arrivals',
  },
  {
    id: 'signature-co-ords',
    chapterNum: '02',
    title: 'Signature Co-Ords',
    subtitle: 'Sculptural matching sets crafted in pure silks and organza for modern celebratory gatherings.',
    categorySlug: 'co-ord-sets',
    viewAllHref: '/ready-to-wear/signature-co-ords',
  },
  {
    id: 'dresses',
    chapterNum: '03',
    title: 'Dresses & Gowns',
    subtitle: 'Floor-sweeping designer gowns and festive dresses tailored with signature Indian finesse.',
    categorySlug: 'dresses',
    viewAllHref: '/ready-to-wear/dresses',
  },
  {
    id: 'sharara-sets',
    chapterNum: '04',
    title: 'Sharara Sets',
    subtitle: 'Voluminous tiered shararas paired with delicately embroidered kurtas and organza dupattas.',
    categorySlug: 'sharara-sets',
    viewAllHref: '/ready-to-wear/sharara-sets',
  },
  {
    id: 'occasion-lehengas',
    chapterNum: '05',
    title: 'Occasion Lehengas',
    subtitle: 'Lightweight, jewel-toned celebratory lehengas tailored for bridesmaids and festive celebrations.',
    categorySlug: 'occasion-lehengas',
    viewAllHref: '/ready-to-wear/occasion-lehengas',
  },
];

export default function ReadyToWearPage() {
  return (
    <CategoryHubView
      title="The Contemporary"
      italicTitle="Ready To Wear"
      badge="Aafreen Atelier · Instant Couture"
      heroSubtitle="Effortless luxury ready for your grandest moments. High-impact designer creations finished to perfection and ready for immediate shipping worldwide."
      heroImage="/images/banners/rtw-hero.webp"
      heroObjectPosition="object-[center_20%]"
      heroHighlights={[
        'Immediate dispatch on all ready-to-wear pieces',
        'Flawlessly proportioned contemporary silhouettes',
        'Sculpted co-ords, sharara sets & festive floor-sweepers',
      ]}
      consultationLink="https://wa.me/919517901117?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20inquire%20about%20the%20Ready%20To%20Wear%20Collection."
      chapters={RTW_CHAPTERS}
      showOccasionsGrid={false}
    />
  );
}

