import type { Metadata } from 'next';
import { WishlistClient } from '@/features/wishlist/components/WishlistClient';

export const metadata: Metadata = {
  title: 'Wishlist | Aafreen Couture',
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-brand-pearl">
      <div className="bg-white border-b border-brand-cream py-14 text-center">
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-black">My Wishlist</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <WishlistClient />
      </div>
    </main>
  );
}
