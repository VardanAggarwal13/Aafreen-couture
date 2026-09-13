import Link from 'next/link';
import { TrendingUp, ShoppingCart, Users, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { orderRepository } from '@/server/repositories/order.repository';
import { productRepository } from '@/server/repositories/product.repository';
import { userRepository } from '@/server/repositories/user.repository';
import { formatPrice } from '@/utils/format';

export const metadata = { title: 'Dashboard Overview | Admin Atelier' };

export default async function AdminDashboardPage() {
  const [
    { items: recentOrders, total: totalOrders },
    { total: totalProducts },
    totalUsers,
    totalAdmins,
    { totalRevenue },
  ] = await Promise.all([
    orderRepository.findAll({ limit: 6 }),
    productRepository.findMany({}, { limit: 1 }),
    userRepository.count(),
    userRepository.count({ role: 'admin' }),
    orderRepository.getRevenueStats(),
  ]);

  const STATS = [
    {
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      badge: 'Active Store',
      icon: ShoppingCart,
      iconColor: 'text-[#9E7B3A]',
      iconBg: 'bg-[#C9A86A]/15',
    },
    {
      label: 'Atelier Revenue',
      value: formatPrice(totalRevenue),
      badge: 'INR (₹)',
      icon: TrendingUp,
      iconColor: 'text-[#9E7B3A]',
      iconBg: 'bg-[#C9A86A]/20',
    },
    {
      label: 'Registered Users',
      value: totalUsers.toLocaleString(),
      badge: `${totalAdmins} Admins`,
      icon: Users,
      iconColor: 'text-[#2E221C]',
      iconBg: 'bg-[#EAE2D7]',
    },
    {
      label: 'Ensembles in Catalog',
      value: totalProducts.toLocaleString(),
      badge: 'Live Products',
      icon: Package,
      iconColor: 'text-[#9E7B3A]',
      iconBg: 'bg-[#C9A86A]/15',
    },
  ];

  const STATUS_BADGE: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD2C5]/70 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#2E221C] tracking-tight">
            Atelier Executive Dashboard
          </h1>
          <p className="text-xs text-[#8A6A55] mt-1 font-sans">
            Welcome back, <span className="font-semibold text-[#2E221C]">Administrator</span>. Here is the operational overview of your couture house.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 bg-[#C9A86A] hover:bg-[#B58E52] text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-xs transition-colors shadow-xs"
          >
            + Add New Ensemble
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, badge, icon: Icon, iconColor, iconBg }) => (
          <div
            key={label}
            className="bg-white border border-[#DDD2C5]/80 rounded-xs p-5 shadow-xs hover:border-[#C9A86A]/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${iconBg} rounded-xs flex items-center justify-center`}>
                <Icon size={18} className={iconColor} />
              </div>
              <span className="text-[10.5px] font-semibold text-[#9E7B3A] bg-[#C9A86A]/10 border border-[#C9A86A]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {badge}
              </span>
            </div>
            <p className="text-2xl font-serif font-bold text-[#2E221C] mb-1">{value}</p>
            <p className="text-xs text-[#8A6A55] font-sans font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid: Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white border border-[#DDD2C5]/80 rounded-xs shadow-xs p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAE2D7]">
            <div>
              <h2 className="text-sm font-serif font-semibold text-[#2E221C]">Recent Boutique Orders</h2>
              <p className="text-[11px] text-[#8A6A55]">Latest client purchases and bespoke reservations</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-[#9E7B3A] hover:text-[#2E221C] font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View All Orders</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5] text-[#8A6A55] uppercase tracking-wider text-[10px] font-semibold">
                  <th className="px-3.5 py-2.5">Order</th>
                  <th className="px-3.5 py-2.5">Client</th>
                  <th className="px-3.5 py-2.5">Total Amount</th>
                  <th className="px-3.5 py-2.5">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D7]">
                {recentOrders.map((order) => (
                  <tr key={String(order._id)} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="px-3.5 py-3 font-semibold text-[#2E221C]">
                      <Link href={`/admin/orders/${order._id}`} className="hover:text-[#C9A86A] transition-colors">
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-3.5 py-3 text-[#2E221C] truncate max-w-[140px]">
                      {order.shippingAddress?.name || 'Valued Client'}
                    </td>
                    <td className="px-3.5 py-3 font-medium text-[#2E221C]">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-3.5 py-3">
                      <span
                        className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${
                          STATUS_BADGE[order.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-[#8A6A55]/70 text-xs">
                      No customer orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Atelier Actions & Admin Directory */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quick Actions Card */}
          <div className="bg-white border border-[#DDD2C5]/80 rounded-xs shadow-xs p-5">
            <h2 className="text-sm font-serif font-semibold text-[#2E221C] mb-1">Quick Atelier Controls</h2>
            <p className="text-[11px] text-[#8A6A55] mb-4">Direct shortcuts to critical storefront controls</p>

            <div className="space-y-1.5 font-sans">
              {[
                { label: 'Add New Ensemble', href: '/admin/products/new' },
                { label: 'Manage Products & Suits', href: '/admin/products' },
                { label: 'Users & Staff Permissions', href: '/admin/customers' },
                { label: 'Inventory & Stock Levels', href: '/admin/inventory' },
                { label: 'Banners & Hero Visuals', href: '/admin/banners' },
                { label: 'Discount Codes & Coupons', href: '/admin/coupons' },
                { label: 'Store & Payment Settings', href: '/admin/settings' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-medium text-[#2E221C] bg-[#FAF7F2] hover:bg-[#C9A86A]/15 hover:text-[#9E7B3A] transition-all border border-[#DDD2C5]/60 group"
                >
                  <span>{label}</span>
                  <ArrowRight size={12} className="text-[#8A6A55] group-hover:text-[#9E7B3A] transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Administrators Security Badge */}
          <div className="bg-gradient-to-br from-[#FAF7F2] to-[#EAE2D7]/60 border border-[#C9A86A]/40 rounded-xs p-4 text-xs font-sans">
            <div className="flex items-center gap-2 text-[#9E7B3A] font-semibold text-xs mb-1">
              <ShieldCheck size={16} />
              <span>Client Confidential Access</span>
            </div>
            <p className="text-[#8A6A55] text-[11px] leading-relaxed">
              All administrative operations are protected. You can grant or revoke staff administrator access directly from the <Link href="/admin/customers" className="text-[#2E221C] font-semibold underline">Users &amp; Admins</Link> panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
