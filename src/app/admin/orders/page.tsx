import Link from 'next/link';
import { orderRepository } from '@/server/repositories/order.repository';
import { formatPrice, formatDate } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

export const metadata = { title: 'Orders | Admin' };

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  confirmed: 'bg-blue-500/15 text-blue-400',
  processing: 'bg-blue-500/15 text-blue-400',
  shipped: 'bg-purple-500/15 text-purple-400',
  out_for_delivery: 'bg-indigo-500/15 text-indigo-400',
  delivered: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
  return_requested: 'bg-orange-500/15 text-orange-400',
  returned: 'bg-gray-500/15 text-gray-400',
  refunded: 'bg-gray-500/15 text-gray-400',
};

export default async function AdminOrdersPage() {
  const { items: orders, total } = await orderRepository.findAll({ limit: 50 });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Orders</h1>
          <p className="text-xs text-white/40 mt-0.5">{total} total orders</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-[#1A1A1A] border border-white/8 rounded-sm px-3 py-2 text-xs text-white/50 outline-none">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {['Order #', 'Customer', 'Items', 'Total', 'Method', 'Payment', 'Fulfillment', 'Date', 'Action'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-white/25">No orders yet</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={String(order._id)} className="hover:bg-white/2 transition-colors group">
                    <td className="px-4 py-3.5 font-medium text-white">#{order.orderNumber}</td>
                    <td className="px-4 py-3.5 text-white/70 max-w-[140px] truncate">{order.shippingAddress.name}</td>
                    <td className="px-4 py-3.5 text-white/50">{order.items.length}</td>
                    <td className="px-4 py-3.5 font-medium text-white">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3.5 text-white/60">
                      {order.paymentMethod === 'cod' ? (
                        <span className="text-[11px] text-amber-300 font-medium">COD</span>
                      ) : (
                        <span className="text-[11px] text-sky-300 font-medium">Razorpay</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : order.paymentStatus === 'pending'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[order.status] ?? 'bg-gray-500/15 text-gray-400'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-white/40 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={ROUTES.ADMIN_ORDER(String(order._id))}
                        className="text-brand-gold hover:underline opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
