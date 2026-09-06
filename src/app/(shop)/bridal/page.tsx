import type { Metadata } from 'next';
import { CategoryHubView } from '@/components/shop/CategoryHubView';

export const metadata: Metadata = {
  title: 'The Royal Bridal Edit | Aafreen Couture',
  description: 'Handcrafted luxury royal bridal lehengas, bridal suits, bridesmaid lehengas, and reception gowns by Aafreen Couture.',
};

const BRIDAL_CHAPTERS = [
  {
    id: 'bridal-lehengas',
    chapterNum: '01',
    title: 'Bridal Lehengas',
    subtitle: 'Heirloom bridal lehengas hand-embroidered with zardozi, dabka, and real silk threads.',
    categorySlug: 'bridal-lehengas',
    viewAllHref: '/bridal/bridal-lehengas',
  },
  {
    id: 'bridal-suits',
    chapterNum: '02',
    title: 'Bridal Suits',
    subtitle: 'Regal ceremonial suits and royal anarkalis crafted for intimate wedding rituals and royal celebrations.',
    categorySlug: 'bridal-suits',
    viewAllHref: '/bridal/bridal-suits',
  },
  {
    id: 'bridesmaid-lehengas',
    chapterNum: '03',
    title: 'Bridesmaid Lehengas',
    subtitle: 'Coordinated luxury lehengas and graceful silhouettes curated for the bridal squad.',
    categorySlug: 'bridesmaid-lehengas',
    viewAllHref: '/bridal/bridesmaid-lehengas',
  },
  {
    id: 'reception-gowns',
    chapterNum: '04',
    title: 'Reception Gowns',
    subtitle: 'Opulent evening couture ballgowns adorned with crystals, sequins, and dramatic capes.',
    categorySlug: 'reception-gowns',
    viewAllHref: '/bridal/reception-gowns',
  },
];

export default function BridalPage() {
  return (
    <CategoryHubView
      title="The Royal"
      italicTitle="Bridal Edit"
      badge="Aafreen Atelier · Royal Heritage"
      heroSubtitle="An ode to the timeless majesty of royal Indian weddings. Each masterpiece is individually hand-embroidered by master artisans in pure silks, velvets, and heirloom organza, adorned with authentic zardozi, dabka, cutdana, and micro-pearl craftsmanship."
      heroImage="/images/banners/bridal-hero-wide.webp"
      heroObjectPosition="object-bottom"
      heroHighlights={[
        '200+ hours of painstaking hand embroidery per ensemble',
        'Pure raw silks, heritage velvets & sheer organza dupattas',
        'Personalized made-to-measure couture consultation',
      ]}
      consultationLink="https://wa.me/919876543210?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20inquire%20about%20the%20Royal%20Bridal%20Collection."
      chapters={BRIDAL_CHAPTERS}
      showOccasionsGrid={true}
    />
  );
}

