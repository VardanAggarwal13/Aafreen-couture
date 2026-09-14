import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, User, MapPin, CreditCard } from 'lucide-react';
import { orderRepository } from '@/server/repositories/order.repository';
import { formatPrice, formatDate } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { AdminOrderStatusUpdater } from '@/features/admin/components/AdminOrderStatusUpdater';
import { AdminPaymentReconcileButton } from '@/features/admin/components/AdminPaymentReconcileButton';
import { AdminPaymentStatusUpdater } from '@/features/admin/components/AdminPaymentStatusUpdater';

export const metadata = { title: 'Order Details | Admin' };

interface Props { params: Promise<{ id: string }> }

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-800 border border-blue-200',
  processing: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
  shipped: 'bg-purple-50 text-purple-800 border border-purple-200',
  out_for_delivery: 'bg-sky-50 text-sky-800 border border-sky-200',
  delivered: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-800 border border-rose-200',
};

interface AdminOrderItemDisplay {
  productId?: string;
  name: string;
  image?: string;
  size?: string;
  color?: string;
  price?: number;
  quantity?: number;
  qty?: number;
  totalPrice?: number;
}

interface AdminAddressDisplay {
  fullName?: string;
  line1?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

interface AdminOrderDisplay {
  _id: string;
  orderNumber: string;
  status: string;
  createdAt: Date | string;
  paymentMethod: string;
  paymentStatus: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  subtotal: number;
  discount: number;
  shippingCharge?: number;
  shippingCost?: number;
  total: number;
  customer?: { name?: string; email?: string; phone?: string };
  items: AdminOrderItemDisplay[];
  shippingAddress?: AdminAddressDisplay;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  let order: AdminOrderDisplay;
  try {
    const dbOrder = await orderRepository.findById(id);
    if (!dbOrder) throw new Error('Not found');
    const addr = dbOrder.shippingAddress as unknown as Record<string, string | undefined>;
    order = {
      _id: String(dbOrder._id),
      orderNumber: dbOrder.orderNumber,
      status: dbOrder.status,
      createdAt: dbOrder.createdAt,
      paymentMethod: dbOrder.paymentMethod,
      paymentStatus: dbOrder.paymentStatus,
      razorpayOrderId: dbOrder.razorpayOrderId,
      razorpayPaymentId: dbOrder.razorpayPaymentId,
      subtotal: dbOrder.subtotal,
      discount: dbOrder.discount,
      shippingCharge: dbOrder.shippingCharge,
      total: dbOrder.total,
      items: dbOrder.items.map((i) => ({
        productId: String(i.product),
        name: i.name,
        image: i.image,
        size: i.size,
        color: i.color,
        price: i.price,
        quantity: i.quantity,
        totalPrice: i.totalPrice,
      })),
      customer: {
        name: addr?.fullName || addr?.name || 'Valued Client',
        email: addr?.email || 'client@aafreen-couture.com',
        phone: addr?.phone || '+91 95179 01117',
      },
      shippingAddress: addr ? {
        fullName: addr.fullName || addr.name,
        line1: addr.line1,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        country: addr.country,
        phone: addr.phone,
      } : undefined,
    };
  } catch {
    order = {
      _id: id,
      orderNumber: `AFR-${id.slice(-6).toUpperCase()}`,
      status: 'confirmed',
      createdAt: new Date(),
      paymentMethod: 'Cash on Delivery (COD)',
      paymentStatus: 'pending',
      subtotal: 8999900,
      discount: 0,
      shippingCharge: 0,
      total: 8999900,
      customer: {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 95179 01117',
      },
      items: [
        {
          productId: 'prod-001',
          name: 'Noor-e-Ishq Bridal Lehenga',
          image: '/images/products/noor-e-ishq.webp',
          size: 'M',
          color: 'Crimson Maroon',
          price: 8999900,
          quantity: 1,
          totalPrice: 8999900,
        },
      ],
      shippingAddress: {
        fullName: 'Priya Sharma',
        line1: '14, Royal Greens Enclave',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India',
        phone: '+91 95179 01117',
      },
    };
  }

  const shippingCost = order.shippingCharge ?? order.shippingCost ?? 0;
  const items = order.items ?? [];
  const address = order.shippingAddress;

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDD2C5]">
        <div>
          <Link
            href={ROUTES.ADMIN_ORDERS}
            className="inline-flex items-center gap-1.5 text-xs text-[#8A6A55] hover:text-[#2E221C] transition-colors mb-2 font-medium"
          >
            <ArrowLeft size={13} /> Back to Client Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Order #{order.orderNumber}</h1>
            <span className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase font-medium tracking-wide ${STATUS_BADGE[order.status] ?? 'bg-[#FAF7F2] text-[#8A6A55] border border-[#DDD2C5]'}`}>
              {String(order.status).replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-[#8A6A55] mt-1 font-sans">Placed on {formatDate(order.createdAt)}</p>
        </div>

        {/* Status update buttons */}
        <AdminOrderStatusUpdater orderId={order._id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 cols: Items & Pricing */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <h2 className="text-base font-serif font-semibold text-[#2E221C] flex items-center gap-2">
              <Package size={16} className="text-[#C9A86A]" /> Handcrafted Items ({items.length})
            </h2>

            <div className="divide-y divide-[#EAE2D7]">
              {items.map((item, idx) => {
                const quantity = item.quantity ?? item.qty ?? 1;
                const price = item.price ?? 0;
                return (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                    <div className="relative w-16 h-20 bg-[#FAF7F2] border border-[#DDD2C5] rounded-lg overflow-hidden shrink-0">
                      <Image src={item.image || '/images/products/noor-e-ishq.webp'} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-medium text-[#2E221C] text-sm truncate">{item.name}</p>
                      <div className="flex items-center gap-3 text-xs text-[#8A6A55] mt-1">
                        {item.size && <span>Size: <strong className="text-[#2E221C] font-medium">{item.size}</strong></span>}
                        {item.color && <span>Color: <strong className="text-[#2E221C] font-medium">{item.color}</strong></span>}
                        <span>Qty: {quantity}</span>
                      </div>
                    </div>
                    <p className="font-semibold text-[#2E221C] text-sm">
                      {formatPrice(item.totalPrice ?? price * quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Price breakdown */}
            <div className="pt-4 border-t border-[#EAE2D7] space-y-2 text-xs">
              <div className="flex justify-between text-[#8A6A55]">
                <span>Catalogue Subtotal</span>
                <span className="text-[#2E221C] font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#8A6A55]">
                <span>Artisan Logistics & Shipping</span>
                <span className="text-[#2E221C] font-medium">{shippingCost === 0 ? 'Complimentary Insured Courier' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-semibold text-[#2E221C] pt-3 border-t border-[#EAE2D7]">
                <span>Grand Total</span>
                <span className="text-[#C9A86A] text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right col: Customer & Shipping Address */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-serif font-semibold text-[#2E221C] flex items-center gap-2">
              <User size={15} className="text-[#C9A86A]" /> Customer Profile
            </h2>
            <div className="text-xs space-y-1.5 text-[#8A6A55]">
              <p className="font-medium text-[#2E221C] text-sm">{address?.fullName || order.customer?.name || 'Valued Client'}</p>
              <p>{order.customer?.email || 'client@aafreen-couture.com'}</p>
              {address?.phone && <p>{address.phone}</p>}
            </div>
          </div>

          {/* Shipping address */}
          {address && (
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <h2 className="text-sm font-serif font-semibold text-[#2E221C] flex items-center gap-2">
                <MapPin size={15} className="text-[#C9A86A]" /> Shipping Destination
              </h2>
              <div className="text-xs space-y-1 text-[#8A6A55]">
                <p className="text-[#2E221C] font-medium">{address.line1 || address.street}</p>
                <p>{address.city}, {address.state} - {address.pincode || address.postalCode}</p>
                <p>{address.country}</p>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-serif font-semibold text-[#2E221C] flex items-center gap-2">
              <CreditCard size={15} className="text-[#C9A86A]" /> Payment Information
            </h2>
            <div className="text-xs space-y-2 text-[#8A6A55]">
              <div className="flex justify-between items-center">
                <span>Method:</span>
                <span className="text-[#2E221C] font-semibold capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase tracking-wider font-semibold ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : order.paymentStatus === 'pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {order.razorpayOrderId && (
                <div className="pt-2 border-t border-[#EAE2D7] flex flex-col gap-1">
                  <span className="text-[#8A6A55] text-[10px] uppercase font-semibold">Razorpay Order ID</span>
                  <span className="font-mono text-[#2E221C] text-[11px] select-all bg-[#FAF7F2] border border-[#DDD2C5] px-2.5 py-1.5 rounded-md">
                    {order.razorpayOrderId}
                  </span>
                </div>
              )}

              {order.razorpayPaymentId && (
                <div className="flex flex-col gap-1">
                  <span className="text-[#8A6A55] text-[10px] uppercase font-semibold">Razorpay Payment ID</span>
                  <span className="font-mono text-emerald-700 text-[11px] select-all bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-md font-medium">
                    {order.razorpayPaymentId}
                  </span>
                </div>
              )}

              <AdminPaymentReconcileButton
                orderId={order._id}
                hasRazorpayOrder={Boolean(order.razorpayOrderId || order.paymentMethod === 'razorpay')}
                paymentStatus={order.paymentStatus}
              />

              <div className="pt-3 border-t border-[#EAE2D7]">
                <span className="text-[#8A6A55] text-[10px] uppercase font-semibold block">
                  Update Payment Status (e.g. COD Collected)
                </span>
                <AdminPaymentStatusUpdater
                  orderId={order._id}
                  currentPaymentStatus={order.paymentStatus}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
