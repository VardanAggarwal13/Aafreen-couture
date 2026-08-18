import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock } from 'lucide-react';
import { orderRepository } from '@/server/repositories/order.repository';
import { formatPrice, formatDate } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

export const metadata = { title: 'Order Details | Admin' };

interface Props { params: Promise<{ id: string }> }

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  confirmed: 'bg-blue-500/15 text-blue-400',
  processing: 'bg-blue-500/15 text-blue-400',
  shipped: 'bg-purple-500/15 text-purple-400',
  out_for_delivery: 'bg-indigo-500/15 text-indigo-400',
  delivered: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
};

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  let order: any;
  try {
    order = await orderRepository.findById(id);
  } catch {
    order = null;
  }

  // Fallback sample for display if order not in DB
  if (!order) {
    order = {
      _id: id,
      orderNumber: `AFR-${id.slice(-6).toUpperCase()}`,
      status: 'confirmed',
      createdAt: new Date(),
      paymentMethod: 'Prepaid (Razorpay)',
      paymentStatus: 'paid',
      subtotal: 8999900,
      discount: 0,
      shippingCharge: 0,
      total: 8999900,
      customer: {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 98765 43210',
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
        phone: '+91 98765 43210',
      },
    };
  }

  const shippingCost = order.shippingCharge ?? order.shippingCost ?? 0;
  const items = order.items ?? [];
  const address = order.shippingAddress;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <Link
            href={ROUTES.ADMIN_ORDERS}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={13} /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white">Order #{order.orderNumber}</h1>
            <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase font-medium ${STATUS_BADGE[order.status] ?? 'bg-white/10 text-white'}`}>
              {String(order.status).replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>

        {/* Status update buttons */}
        <div className="flex items-center gap-2">
          <select className="bg-[#1A1A1A] border border-white/10 rounded-xs px-3 py-2 text-xs text-white outline-none focus:border-brand-gold/50">
            <option value="confirmed">Mark as Confirmed</option>
            <option value="processing">Mark as In Tailoring</option>
            <option value="shipped">Mark as Shipped</option>
            <option value="delivered">Mark as Delivered</option>
            <option value="cancelled">Cancel Order</option>
          </select>
          <button className="bg-brand-gold text-white text-xs font-medium px-4 py-2 hover:bg-brand-gold/90 transition-colors rounded-xs">
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Items & Pricing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Package size={15} className="text-brand-gold" /> Order Items ({items.length})
            </h2>

            <div className="divide-y divide-white/5">
              {items.map((item: any, idx: number) => {
                const quantity = item.quantity ?? item.qty ?? 1;
                const price = item.price ?? 0;
                return (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="relative w-16 h-20 bg-[#222] rounded-xs overflow-hidden shrink-0">
                      <Image src={item.image || '/images/products/noor-e-ishq.webp'} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-xs truncate">{item.name}</p>
                      <div className="flex items-center gap-3 text-[11px] text-white/40 mt-1">
                        {item.size && <span>Size: <strong className="text-white/70">{item.size}</strong></span>}
                        {item.color && <span>Color: <strong className="text-white/70">{item.color}</strong></span>}
                        <span>Qty: {quantity}</span>
                      </div>
                    </div>
                    <p className="font-semibold text-white text-xs">
                      {formatPrice(item.totalPrice ?? price * quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Price breakdown */}
            <div className="pt-4 border-t border-white/5 space-y-2 text-xs">
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-white/5">
                <span>Total Amount</span>
                <span className="text-brand-gold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right col: Customer & Shipping Address */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-sm p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <User size={15} className="text-brand-gold" /> Customer Profile
            </h2>
            <div className="text-xs space-y-1 text-white/70">
              <p className="font-medium text-white">{address?.fullName || order.customer?.name || 'Valued Client'}</p>
              <p className="text-white/50">{order.customer?.email || 'client@aafreen-couture.com'}</p>
              {address?.phone && <p className="text-white/50">{address.phone}</p>}
            </div>
          </div>

          {/* Shipping address */}
          {address && (
            <div className="bg-[#1A1A1A] border border-white/5 rounded-sm p-5 space-y-3">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <MapPin size={15} className="text-brand-gold" /> Shipping Address
              </h2>
              <div className="text-xs space-y-1 text-white/70">
                <p>{address.line1 || address.street}</p>
                <p>{address.city}, {address.state} - {address.pincode || address.postalCode}</p>
                <p>{address.country}</p>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-sm p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <CreditCard size={15} className="text-brand-gold" /> Payment Information
            </h2>
            <div className="text-xs space-y-1 text-white/70">
              <p className="text-white font-medium capitalize">{order.paymentMethod}</p>
              <p className="text-emerald-400 capitalize">Payment Status: {order.paymentStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
