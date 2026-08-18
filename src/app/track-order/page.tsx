import type { Metadata } from 'next';
import { TrackOrderClient } from '@/features/track-order/components/TrackOrderClient';

export const metadata: Metadata = {
  title: 'Track Your Order | Aafreen Couture',
  description: 'Enter your order number to get real-time shipping updates.',
};

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen bg-brand-pearl">
      <div className="bg-brand-pearl border-b border-brand-cream py-14 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-gold mb-3">Shipping Updates</p>
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-black">Track Your Order</h1>
        <p className="mt-3 text-sm text-brand-stone">Enter your order number to see real-time delivery status.</p>
      </div>
      <div className="max-w-xl mx-auto px-4 py-16">
        <TrackOrderClient />
      </div>
    </main>
  );
}
