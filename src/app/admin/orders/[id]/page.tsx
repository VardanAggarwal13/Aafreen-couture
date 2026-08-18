import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { orderRepository } from '@/server/repositories/order.repository';
import { AdminOrderDetail } from '@/features/admin/components/AdminOrderDetail';

export const metadata: Metadata = { title: 'Order Detail | Admin' };

interface Props { params: Promise<{ id: string }> }

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await orderRepository.findById(id);
  if (!order) notFound();

  const serialized = JSON.parse(JSON.stringify(order));

  return (
    <div className="p-6 lg:p-8">
      <AdminOrderDetail order={serialized} />
    </div>
  );
}
