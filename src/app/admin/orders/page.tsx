import Link from 'next/link';
import { orderRepository } from '@/server/repositories/order.repository';
import { formatPrice, formatDate } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { AdminPagination } from '@/features/admin/components/AdminPagination';

export const metadata = { title: 'Orders | Admin' };

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface Props {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-800 border border-blue-200',
  processing: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
  shipped: 'bg-purple-50 text-purple-800 border border-purple-200',
  out_for_delivery: 'bg-sky-50 text-sky-800 border border-sky-200',
  delivered: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-800 border border-rose-200',
  return_requested: 'bg-orange-50 text-orange-800 border border-orange-200',
  returned: 'bg-neutral-100 text-neutral-700 border border-neutral-300',
  refunded: 'bg-neutral-100 text-neutral-700 border border-neutral-300',
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = PAGE_SIZE_OPTIONS.includes(Number(params.limit)) ? Number(params.limit) : DEFAULT_PAGE_SIZE;
  const { items: orders, total } = await orderRepository.findAll({ limit, page });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Client Orders</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-sans">{total} registered haute couture orders</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white border border-[#DDD2C5] rounded-lg px-3.5 py-2 text-xs text-[#2E221C] outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] shadow-xs">
            <option value="">All Fulfillment Statuses</option>
            <option value="pending">Pending Verification</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">In Tailoring</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Order #', 'Customer', 'Items', 'Total', 'Method', 'Payment', 'Fulfillment', 'Date', 'Action'].map((h) => (
                  <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-[#8A6A55]">No client orders placed yet.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={String(order._id)} className="hover:bg-[#FAF7F2]/60 transition-colors group">
                    <td className="px-5 py-2.5 font-mono font-semibold text-[#2E221C]">#{order.orderNumber}</td>
                    <td className="px-5 py-2.5 text-[#2E221C] font-medium max-w-[150px] truncate">{order.shippingAddress.name}</td>
                    <td className="px-5 py-2.5 text-[#8A6A55]">{order.items.length}</td>
                    <td className="px-5 py-2.5 font-semibold text-[#2E221C]">{formatPrice(order.total)}</td>
                    <td className="px-5 py-2.5">
                      {order.paymentMethod === 'cod' ? (
                        <span className="inline-block text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">COD</span>
                      ) : (
                        <span className="inline-block text-[10px] bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded font-semibold">Razorpay</span>
                      )}
                    </td>
                    <td className="px-5 py-2.5">
                      <span
                        className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.paymentStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-2.5">
                      <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[order.status] ?? 'bg-[#FAF7F2] text-[#8A6A55] border border-[#DDD2C5]'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-[#8A6A55] whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-2.5">
                      <Link
                        href={ROUTES.ADMIN_ORDER(String(order._id))}
                        className="inline-flex items-center text-xs font-semibold text-[#C9A86A] hover:text-[#B89350] hover:underline"
                      >
                        Manage &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination
          page={page}
          totalPages={totalPages}
          hrefForPage={(p) => `/admin/orders?page=${p}&limit=${limit}`}
          pageSize={limit}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
        />
      </div>
    </div>
  );
}
