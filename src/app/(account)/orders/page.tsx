import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Package } from 'lucide-react';
import { auth } from '@/lib/auth';
import { orderService } from '@/server/services/order.service';
import { formatPrice, formatDate } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

export const metadata = { title: 'My Orders | Aafreen Couture' };

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-800 border border-amber-200',
  confirmed: 'bg-blue-50 text-blue-800 border border-blue-200',
  processing: 'bg-blue-50 text-blue-800 border border-blue-200',
  shipped: 'bg-purple-50 text-purple-800 border border-purple-200',
  out_for_delivery: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  cancelled: 'bg-red-50 text-red-800 border border-red-200',
  return_requested: 'bg-orange-50 text-orange-800 border border-orange-200',
  returned: 'bg-stone-100 text-stone-700 border border-stone-200',
  refunded: 'bg-stone-100 text-stone-700 border border-stone-200',
};

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/login?redirect=%2Forders');
  }

  let orders: any[] = [];
  try {
    const res = await orderService.getUserOrders(session.user.id, 1, session.user.email);
    orders = res.items || [];
  } catch (err) {
    console.error('Failed to load user orders:', err);
  }

  return (
    <div className="space-y-6 font-sans">
      <h1 className="text-2xl sm:text-3xl font-serif text-heading">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-xs shadow-2xs">
          <Package size={44} className="text-text/60 mx-auto mb-3" />
          <p className="text-base text-heading font-semibold mb-1">No orders yet</p>
          <p className="text-xs text-text mb-4">Your placed orders and delivery trackers will appear here</p>
          <Link
            href={ROUTES.SHOP}
            className="inline-block bg-heading text-surface text-xs font-semibold uppercase tracking-wider px-6 py-2.5 rounded-xs hover:bg-gold transition-colors"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusKey = (order.status || 'pending').toLowerCase();
            return (
              <Link
                key={String(order._id)}
                href={ROUTES.ORDER(String(order._id))}
                className="block bg-surface border border-border rounded-xs p-5 hover:border-gold transition-colors group shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <p className="text-sm font-semibold text-heading">#{order.orderNumber}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${STATUS_COLORS[statusKey] ?? 'bg-stone-100 text-stone-700'}`}>
                        {(order.status || 'pending').replace('_', ' ')}
                      </span>
                      {order.paymentStatus === 'paid' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Paid
                        </span>
                      ) : order.paymentMethod === 'cod' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider bg-gold/10 text-gold border border-gold/30">
                          Due on Delivery (COD)
                        </span>
                      ) : order.paymentStatus === 'failed' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
                          Payment Declined
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                          Verifying Payment
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text">
                      {order.items?.length ?? 1} item{(order.items?.length ?? 1) !== 1 ? 's' : ''} · Placed {formatDate(order.createdAt)}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {order.items?.slice(0, 3).map((item: any, i: number) => (
                        <span key={i} className="text-xs text-text truncate max-w-[160px] bg-background px-2 py-0.5 rounded-xs border border-border">
                          {item.name}
                        </span>
                      ))}
                      {(order.items?.length ?? 0) > 3 && (
                        <span className="text-xs text-text self-center">+{order.items.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-base font-bold text-heading">{formatPrice(order.total)}</p>
                    <p className="text-xs text-text mt-0.5">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid Online (Razorpay)'}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
