import type { Metadata } from 'next';
import { CoutureCatalogView } from '@/components/shop/CoutureCatalogView';

export const metadata: Metadata = {
  title: 'Jewellery | Royal Chokers & Necklaces | Aafreen Couture',
  description: 'Heritage kundan, polki, and pearl jewellery crafted to complement royal bridal and festive ensembles.',
};

export default function JewelleryPage() {
  return (
    <CoutureCatalogView
      title="Royal Jewellery"
      subtitle="Exquisite heirloom kundan, jadau, polki, and cultured pearl creations handcrafted to accompany your couture attire."
      categorySlug="jewellery"
      breadcrumbs={[{ label: 'Jewellery' }]}
    />
  );
}
