import type { Metadata } from 'next';
import { CartClientPage } from '@/features/cart/components/CartClientPage';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: `Your Bag — ${siteConfig.name}`,
};

export default function CartPage() {
  return <CartClientPage />;
}
