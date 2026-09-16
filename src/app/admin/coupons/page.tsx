import { AdminCouponsClient } from '@/features/admin/components/AdminCouponsClient';
import { couponRepository } from '@/server/repositories/coupon.repository';

export const metadata = { title: 'Coupons | Admin' };

export default async function AdminCouponsPage() {
  const coupons = await couponRepository.findAll();
  const serialized = JSON.parse(JSON.stringify(coupons));

  return <AdminCouponsClient coupons={serialized} />;
}
