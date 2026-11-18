import { AdminCouponsClient } from '@/features/admin/components/AdminCouponsClient';
import { couponRepository } from '@/server/repositories/coupon.repository';
import { FEATURES } from '@/config/features.config';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Coupons | Admin' };

export default async function AdminCouponsPage() {
  if (!FEATURES.adminCoupons) notFound();
  const coupons = await couponRepository.findAll();
  const serialized = JSON.parse(JSON.stringify(coupons));

  return <AdminCouponsClient coupons={serialized} />;
}
