import { headers } from 'next/headers';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { auth } from '@/lib/auth';
import { orderService } from '@/server/services/order.service';
import { formatPrice, formatDate } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

export const metadata = { title: 'My Orders | Aafreen Couture' };

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  return_requested: 'bg-orange-100 text-orange-800',
  returned: 'bg-gray-100 text-gray-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const { items: orders } = await orderService.getUserOrders(session!.user.id, 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-brand-black">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-brand-cream rounded-sm">
          <Package size={48} className="text-brand-stone mx-auto mb-4" />
          <p className="text-base text-brand-black font-medium mb-1">No orders yet</p>
          <p className="text-sm text-brand-stone mb-4">Your placed orders will appear here</p>
          <Link
            href={ROUTES.SHOP}
            className="inline-block bg-brand-gold text-white px-6 py-2.5 text-sm font-medium hover:bg-brand-gold/90 transition-colors"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={String(order._id)}
              href={ROUTES.ORDER(String(order._id))}
              className="block bg-white border border-brand-cream rounded-sm p-5 hover:border-brand-gold transition-colors group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-semibold text-brand-black">#{order.orderNumber}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-brand-stone">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} · Placed {formatDate(order.createdAt)}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-xs text-brand-stone truncate max-w-[150px]">{item.name}</span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-brand-stone">+{order.items.length - 3} more</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-semibold text-brand-black">{formatPrice(order.total)}</p>
                  <p className="text-xs text-brand-stone mt-0.5 capitalize">{order.paymentMethod}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
