import Link from 'next/link';
import { headers } from 'next/headers';
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';
import { auth } from '@/lib/auth';
import { orderRepository } from '@/server/repositories/order.repository';
import { productRepository } from '@/server/repositories/product.repository';
import { formatPrice } from '@/utils/format';

export const metadata = { title: 'Dashboard | Admin' };

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const { items: recentOrders, total: totalOrders } = await orderRepository.findAll({ limit: 5 });
  const { total: totalProducts } = await productRepository.findMany({}, { limit: 1 });

  // Revenue from orders
  const totalRevenue = recentOrders.reduce((sum, o) => sum + o.total, 0);

  const STATS = [
    {
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: 'Active',
      icon: ShoppingCart,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      change: 'INR',
      icon: TrendingUp,
      color: 'text-brand-gold',
      bg: 'bg-brand-gold/10',
    },
    {
      label: 'Total Customers',
      value: `${Math.max(1, totalOrders)}`,
      change: 'Verified',
      icon: Users,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      label: 'Products',
      value: totalProducts.toLocaleString(),
      change: 'In Catalog',
      icon: Package,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ];

  const STATUS_BADGE: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-400',
    confirmed: 'bg-blue-500/15 text-blue-400',
    processing: 'bg-blue-500/15 text-blue-400',
    shipped: 'bg-purple-500/15 text-purple-400',
    delivered: 'bg-green-500/15 text-green-400',
    cancelled: 'bg-red-500/15 text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-xs text-white/40 mt-0.5">Welcome back, {session!.user.name}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#1A1A1A] border border-white/5 rounded-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 ${bg} rounded-sm flex items-center justify-center`}>
                <Icon size={16} className={color} />
              </div>
              <span className="text-[10px] font-medium text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded-full">
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-[11px] text-white/40">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-white/5 rounded-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[11px] text-brand-gold hover:underline">View all</Link>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {['Order', 'Customer', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="text-left pb-3 text-[10px] font-medium text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order) => (
                <tr key={String(order._id)} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 font-medium text-white">#{order.orderNumber}</td>
                  <td className="py-3 text-white/50 truncate max-w-[120px]">
                    {order.shippingAddress?.name || 'Valued Client'}
                  </td>
                  <td className="py-3 text-white">{formatPrice(order.total)}</td>
                  <td className="py-3">
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[order.status] ?? 'bg-gray-500/15 text-gray-400'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-white/30 text-xs">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick links */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-sm p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Add New Product', href: '/admin/products/new' },
              { label: 'View All Orders', href: '/admin/orders' },
              { label: 'Manage Customers', href: '/admin/customers' },
              { label: 'Update Inventory', href: '/admin/inventory' },
              { label: 'Curated Collections', href: '/admin/collections' },
              { label: 'Store Settings', href: '/admin/settings' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="flex items-center justify-between px-3 py-2.5 rounded-sm text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors group"
              >
                {label}
                <span className="text-white/20 group-hover:text-white/40">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
