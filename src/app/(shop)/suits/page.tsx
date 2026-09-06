import type { Metadata } from 'next';
import { CategoryHubView } from '@/components/shop/CategoryHubView';

export const metadata: Metadata = {
  title: 'Suits & Kurta Sets | Aafreen Couture',
  description: 'Discover handcrafted luxury suits, cotton kurta sets, unstitched partywear, and contemporary co-ords by Aafreen Couture.',
};

const SUITS_CHAPTERS = [
  {
    id: 'cotton-kurta-sets',
    chapterNum: '01',
    title: 'Cotton Kurta Sets',
    subtitle: 'Breathable pure cottons and Chanderi suits crafted with delicate threadwork for effortless elegance.',
    categorySlug: 'cotton-kurta-sets',
    viewAllHref: '/suits/cotton-kurta-sets',
  },
  {
    id: 'co-ord-sets',
    chapterNum: '02',
    title: 'Co-ord Sets',
    subtitle: 'Signature contemporary coordinated sets tailored for modern festivities and chic soirees.',
    categorySlug: 'co-ord-sets',
    viewAllHref: '/suits/co-ord-sets',
  },
  {
    id: 'summer-essentials',
    chapterNum: '03',
    title: 'Summer Essentials',
    subtitle: 'Lightweight breezy suits in soothing pastel tones designed for effortless daytime poise.',
    categorySlug: 'summer-essentials',
    viewAllHref: '/suits/summer-essentials',
  },
  {
    id: 'partywear-unstitched',
    chapterNum: '04',
    title: 'Partywear Unstitched',
    subtitle: 'Opulent unstitched fabrics ready for your bespoke silhouette and royal customization.',
    categorySlug: 'partywear-unstitched',
    viewAllHref: '/suits/partywear-unstitched',
  },
  {
    id: 'handcrafted-luxury',
    chapterNum: '05',
    title: 'Handcrafted Luxury',
    subtitle: 'Artisanal suits with intricate zardozi, gotta patti, and resham hand embroidery.',
    categorySlug: 'custom-embroidered-suits',
    viewAllHref: '/suits/handcrafted-luxury',
  },
  {
    id: 'indo-western',
    chapterNum: '06',
    title: 'Indo-Western',
    subtitle: 'Where timeless Indian artistry meets contemporary structural draping.',
    categorySlug: 'indo-western',
    viewAllHref: '/suits/indo-western',
  },
];

export default function SuitsPage() {
  return (
    <CategoryHubView
      title="The Royal"
      italicTitle="Suit Atelier"
      badge="Aafreen Atelier · Fine Tailoring"
      heroSubtitle="Elegantly tailored suits, handcrafted anarkalis, and ceremonial silhouettes crafted in pure silks, fine mulmul, and breathable cottons. Adorned with delicate gotta patti, mirror embellishments, and artisanal threadwork."
      heroImage="/images/banners/suits-hero.webp"
      heroObjectPosition="object-[center_18%]"
      heroHighlights={[
        'Pure Mulmul, Chanderi, and Raw Silk fabrics',
        'Handcrafted gotta patti, resham and zardozi detailing',
        'Unstitched partywear & ready-to-wear luxury silhouettes',
      ]}
      consultationLink="https://wa.me/919876543210?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20inquire%20about%20the%20Suits%20Collection."
      chapters={SUITS_CHAPTERS}
      showOccasionsGrid={false}
    />
  );
}

