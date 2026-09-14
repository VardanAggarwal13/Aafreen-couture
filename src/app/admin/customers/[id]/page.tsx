import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { userRepository } from '@/server/repositories/user.repository';
import { orderRepository } from '@/server/repositories/order.repository';
import { formatPrice } from '@/utils/format';

export const metadata: Metadata = { title: 'Customer Profile | Admin' };

interface Props { params: Promise<{ id: string }> }

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await userRepository.findById(id);

  if (!user) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-xs text-[#8A6A55] hover:text-[#2E221C] transition-colors font-medium">
          <ArrowLeft size={13} /> Back to Customer Directory
        </Link>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h1 className="text-xl font-serif text-[#2E221C]">Customer Record</h1>
          <p className="text-xs text-[#8A6A55] mt-1 font-mono">ID: {id}</p>
          <div className="mt-3 p-4 bg-[#FAF7F2] border border-[#DDD2C5] text-xs text-[#8A6A55] rounded-lg">
            Registered customer account active in store directory.
          </div>
        </div>
      </div>
    );
  }

  const { items: orders } = await orderRepository.findByUserId(id, 1, 20);

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-xs text-[#8A6A55] hover:text-[#2E221C] transition-colors font-medium">
        <ArrowLeft size={13} /> Back to Customer Directory
      </Link>

      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm space-y-4">
        <div className="flex items-start justify-between pb-5 border-b border-[#DDD2C5]">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2] text-[#2E221C] border border-[#DDD2C5] flex items-center justify-center font-serif font-bold text-xl shadow-xs">
              {user.name?.[0]?.toUpperCase() || 'C'}
            </div>
            <div>
              <h1 className="text-2xl font-serif text-[#2E221C]">{user.name}</h1>
              <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold mt-1.5 ${
                user.role === 'admin'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-[#FAF7F2] text-[#8A6A55] border border-[#DDD2C5]'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-[#FAF7F2] border border-[#DDD2C5] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-[#8A6A55]">
              <Mail size={14} /> Email Address
            </div>
            <p className="text-[#2E221C] font-semibold text-sm truncate">{user.email}</p>
          </div>

          <div className="p-4 bg-[#FAF7F2] border border-[#DDD2C5] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-[#8A6A55]">
              <Phone size={14} /> Phone Number
            </div>
            <p className="text-[#2E221C] font-semibold text-sm">{user.phone || 'Not provided'}</p>
          </div>

          <div className="p-4 bg-[#FAF7F2] border border-[#DDD2C5] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-[#8A6A55]">
              <Calendar size={14} /> Member Since
            </div>
            <p className="text-[#2E221C] font-semibold text-sm">{new Date(user.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-serif font-semibold text-[#2E221C] flex items-center gap-2">
            <ShoppingBag size={15} className="text-[#C9A86A]" /> Client Order Portfolio ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <p className="text-xs text-[#8A6A55] p-4 bg-[#FAF7F2] border border-[#DDD2C5] rounded-xl text-center">
              No bespoke orders placed yet.
            </p>
          ) : (
            <div className="border border-[#DDD2C5] overflow-hidden rounded-xl">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5] text-[#8A6A55] text-[10px] uppercase tracking-wider font-semibold">
                    <th className="text-left px-5 py-2.5">Order #</th>
                    <th className="text-left px-5 py-2.5">Date</th>
                    <th className="text-left px-5 py-2.5">Total Amount</th>
                    <th className="text-left px-5 py-2.5">Fulfillment Status</th>
                    <th className="text-right px-5 py-2.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D7]">
                  {orders.map((order) => (
                    <tr key={String(order._id)} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="px-5 py-2.5 font-mono font-semibold text-[#2E221C]">#{order.orderNumber}</td>
                      <td className="px-5 py-2.5 text-[#8A6A55]">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-2.5 text-[#2E221C] font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-5 py-2.5">
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <Link href={`/admin/orders/${order._id}`} className="text-[#C9A86A] hover:text-[#B89350] hover:underline font-semibold">
                          View Order
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
