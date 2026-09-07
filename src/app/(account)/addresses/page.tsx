import type { Metadata } from 'next';
import { AddressBookClient } from '@/features/account/components/AddressBookClient';

export const metadata: Metadata = {
  title: 'My Addresses | Aafreen Couture',
  description: 'Manage your saved delivery addresses for expedited checkout.',
};

export default function AddressesPage() {
  return <AddressBookClient />;
}
