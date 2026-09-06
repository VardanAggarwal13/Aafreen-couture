import type { Metadata } from 'next';
import { CategoryHubView } from '@/components/shop/CategoryHubView';

export const metadata: Metadata = {
  title: 'The Bag Edit | Luxury Handbags & Potlis | Aafreen Couture',
  description: 'Handcrafted couture handbags, embroidered potlis, clutches, and totes designed to crown your festive look.',
};

const BAGS_CHAPTERS = [
  {
    id: 'handbags',
    chapterNum: '01',
    title: 'Handbags',
    subtitle: 'Exquisitely structured designer handbags blending traditional embroidery with modern silhouettes.',
    categorySlug: 'handbags',
    viewAllHref: '/bags/handbags',
  },
  {
    id: 'potlis',
    chapterNum: '02',
    title: 'Potlis',
    subtitle: 'Classic silk and velvet drawstring potlis embellished with pearls, tassels, and zardozi embroidery.',
    categorySlug: 'potlis',
    viewAllHref: '/bags/potlis',
  },
  {
    id: 'clutches',
    chapterNum: '03',
    title: 'Clutches',
    subtitle: 'Sleek box clutches and minaudières detailed with crystals, pearls, and royal metallic hardware.',
    categorySlug: 'clutches',
    viewAllHref: '/bags/clutches',
  },
  {
    id: 'totes',
    chapterNum: '04',
    title: 'Totes',
    subtitle: 'Spacious artisanal totes featuring woven craftsmanship and heirloom motifs for effortless luxury.',
    categorySlug: 'totes',
    viewAllHref: '/bags/totes',
  },
  {
    id: 'shoulder-bags',
    chapterNum: '05',
    title: 'Shoulder Bags',
    subtitle: 'Graceful shoulder bags designed with versatile chains and handcrafted textiles.',
    categorySlug: 'shoulder-bags',
    viewAllHref: '/bags/shoulder-bags',
  },
];

export default function BagsPage() {
  return (
    <CategoryHubView
      title="The Couture"
      italicTitle="Bag Edit"
      badge="Aafreen Atelier · Handcrafted Accessories"
      heroSubtitle="Handcrafted heirloom potlis, evening clutches, and structured bags adorned with delicate beadwork, gold tassels, and intricate silk embroidery."
      heroImage="/images/banners/bags-hero.webp"
      heroObjectPosition="object-center"
      heroHighlights={[
        'Heirloom handcrafted potlis with micro-pearl beadwork',
        'Opulent metallic and embroidered evening clutches',
        'Artisanal structured bags for weddings and celebrations',
      ]}
      consultationLink="https://wa.me/919876543210?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20inquire%20about%20the%20Bags%20Collection."
      chapters={BAGS_CHAPTERS}
      showOccasionsGrid={false}
    />
  );
}

