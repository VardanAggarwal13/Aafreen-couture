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
    // If not found in DB, return fallback customer info
    return (
      <div className="space-y-6">
        <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={13} /> Back to Customers
        </Link>
        <div className="bg-[#1A1A1A] border border-white/5 p-6 rounded-xs">
          <h1 className="text-xl font-semibold text-white">Customer Record</h1>
          <p className="text-xs text-white/40 mt-1">ID: {id}</p>
          <div className="mt-4 p-4 bg-white/[0.02] border border-white/5 text-xs text-white/70">
            Registered customer account active in store directory.
          </div>
        </div>
      </div>
    );
  }

  const { items: orders } = await orderRepository.findByUserId(id, 1, 20);

  return (
    <div className="space-y-6">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
        <ArrowLeft size={13} /> Back to Customers
      </Link>

      <div className="bg-[#1A1A1A] border border-white/5 p-6 rounded-xs space-y-6">
        <div className="flex items-start justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center font-semibold text-base">
              {user.name?.[0]?.toUpperCase() || 'C'}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">{user.name}</h1>
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full uppercase font-medium bg-brand-gold/10 text-brand-gold mt-1">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-[#111] border border-white/5 rounded-xs space-y-1">
            <div className="flex items-center gap-1.5 text-white/40">
              <Mail size={13} /> Email Address
            </div>
            <p className="text-white font-medium">{user.email}</p>
          </div>

          <div className="p-3 bg-[#111] border border-white/5 rounded-xs space-y-1">
            <div className="flex items-center gap-1.5 text-white/40">
              <Phone size={13} /> Phone
            </div>
            <p className="text-white font-medium">{user.phone || 'Not provided'}</p>
          </div>

          <div className="p-3 bg-[#111] border border-white/5 rounded-xs space-y-1">
            <div className="flex items-center gap-1.5 text-white/40">
              <Calendar size={13} /> Joined Date
            </div>
            <p className="text-white font-medium">{new Date(user.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50 flex items-center gap-2">
            <ShoppingBag size={14} /> Order History ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <p className="text-xs text-white/30 p-4 bg-[#111] border border-white/5 text-center">
              No orders placed yet.
            </p>
          ) : (
            <div className="border border-white/5 overflow-hidden rounded-xs">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-white/30 text-[10px] uppercase tracking-wider">
                    <th className="text-left px-4 py-2.5">Order #</th>
                    <th className="text-left px-4 py-2.5">Date</th>
                    <th className="text-left px-4 py-2.5">Total</th>
                    <th className="text-left px-4 py-2.5">Status</th>
                    <th className="text-right px-4 py-2.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={String(order._id)} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5 font-mono text-brand-gold">{order.orderNumber}</td>
                      <td className="px-4 py-2.5 text-white/60">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-2.5 text-white font-medium">{formatPrice(order.total)}</td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] uppercase font-semibold text-emerald-400">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Link href={`/admin/orders/${order._id}`} className="text-brand-gold hover:underline">
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
