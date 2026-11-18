import type { Metadata } from 'next';
import { WishlistClient } from '@/features/wishlist/components/WishlistClient';

export const metadata: Metadata = {
  title: 'My Saved Wishlist & Registry',
  description: 'View and curate your saved bespoke bridal lehengas, luxury suits, and heirloom jewellery.',
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-12">
        <WishlistClient />
      </div>
    </div>
  );
}
