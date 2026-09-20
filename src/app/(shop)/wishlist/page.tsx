import type { Metadata } from 'next';
import { WishlistClient } from '@/features/wishlist/components/WishlistClient';

export const metadata: Metadata = {
  title: 'My Saved Wishlist & Registry',
  description: 'View and curate your saved bespoke bridal lehengas, luxury suits, and heirloom jewellery.',
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-background">
      <WishlistClient />
    </main>
  );
}
