import { headers } from 'next/headers';
import Link from 'next/link';
import { Package, Heart, MapPin, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/auth';
import { orderService } from '@/server/services/order.service';
import { formatPrice, formatDate } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

export const metadata = { title: 'My Dashboard | Aafreen Couture' };

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const { items: recentOrders } = await orderService.getUserOrders(session!.user.id, 1);
  const latestOrders = recentOrders.slice(0, 3);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-brand-black">
          Welcome back, {session!.user.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-brand-stone mt-1">Manage your orders, profile, and preferences</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Package, label: 'Total Orders', value: recentOrders.length, href: ROUTES.ORDERS },
          { icon: Heart, label: 'Wishlist', value: '—', href: ROUTES.WISHLIST },
          { icon: MapPin, label: 'Saved Addresses', value: '—', href: ROUTES.ADDRESSES },
        ].map(({ icon: Icon, label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-brand-cream rounded-sm p-5 flex items-center gap-4 hover:border-brand-gold transition-colors group"
          >
            <div className="w-10 h-10 bg-brand-gold/10 rounded-full flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
              <Icon size={18} className="text-brand-gold" />
            </div>
            <div>
              <p className="text-xs text-brand-stone">{label}</p>
              <p className="text-lg font-semibold text-brand-black">{value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-serif text-brand-black">Recent Orders</h2>
          <Link href={ROUTES.ORDERS} className="text-xs text-brand-gold hover:underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {latestOrders.length === 0 ? (
          <div className="text-center py-12 bg-white border border-brand-cream rounded-sm">
            <Package size={36} className="text-brand-stone mx-auto mb-3" />
            <p className="text-sm text-brand-stone">No orders yet</p>
            <Link href={ROUTES.SHOP} className="mt-3 inline-block text-xs text-brand-gold hover:underline">
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {latestOrders.map((order) => (
              <Link
                key={String(order._id)}
                href={ROUTES.ORDER(String(order._id))}
                className="block bg-white border border-brand-cream rounded-sm p-4 hover:border-brand-gold transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-black">#{order.orderNumber}</p>
                    <p className="text-xs text-brand-stone mt-0.5">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand-black">{formatPrice(order.total)}</p>
                    <span className={`mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide ${statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
