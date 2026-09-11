import type { Metadata } from 'next';
import { WishlistClient } from '@/features/wishlist/components/WishlistClient';

export const metadata: Metadata = {
  title: 'My Wishlist | Aafreen Couture',
  description: 'View and curate your saved bespoke bridal lehengas, luxury suits, and heirloom jewellery.',
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-background">
      <WishlistClient />
    </main>
  );
}
