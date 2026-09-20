import type { Metadata } from 'next';
import { CartClientPage } from '@/features/cart/components/CartClientPage';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Review Your Shopping Bag & Cart',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartClientPage />;
}
