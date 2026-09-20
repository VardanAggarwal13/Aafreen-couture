import type { Metadata } from 'next';
import { CheckoutClientPage } from '@/features/checkout/components/CheckoutClientPage';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Secure Luxury Checkout',
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutClientPage />;
}
