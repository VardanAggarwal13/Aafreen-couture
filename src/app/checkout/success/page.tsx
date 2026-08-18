import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { siteConfig } from '@/config/site.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Order Confirmed — ${siteConfig.name}`,
  robots: { index: false },
};

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h1 className="text-3xl font-serif text-brand-black mb-3">Order Confirmed!</h1>
      <p className="text-brand-stone text-sm max-w-md mb-2">
        Thank you for shopping with {siteConfig.name}. Your order has been received and is being processed.
      </p>
      <p className="text-brand-stone text-sm mb-8">
        You will receive a confirmation email shortly.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href={ROUTES.ORDERS}
          className="bg-brand-gold text-white px-6 py-2.5 text-sm font-medium hover:bg-brand-gold/90 transition-colors"
        >
          Track My Order
        </Link>
        <Link
          href={ROUTES.SHOP}
          className="border border-brand-cream text-brand-black px-6 py-2.5 text-sm font-medium hover:border-brand-gold transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
