import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package } from 'lucide-react';
import { auth } from '@/lib/auth';
import { orderService } from '@/server/services/order.service';
import { formatPrice, formatDate } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import type { OrderStatus } from '@/models/Order';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Order #${id.slice(-8).toUpperCase()} | Aafreen Couture` };
}

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];


const STATUS_COLOR: Record<string, string> = {
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

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  let order;
  try {
    order = await orderService.getOrderById(id, session!.user.id);
  } catch {
    notFound();
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status as OrderStatus);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.ORDERS} className="text-brand-stone hover:text-brand-black transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-serif text-brand-black">Order #{order.orderNumber}</h1>
          <p className="text-xs text-brand-stone mt-0.5">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={`ml-auto text-[10px] px-3 py-1 rounded-full font-medium uppercase tracking-wide ${STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
          {order.status.replace('_', ' ')}
        </span>
      </div>

      {/* Progress tracker */}
      {!isCancelled && (
        <div className="bg-white border border-brand-cream rounded-sm p-5">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-px bg-brand-cream z-0" />
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStepIndex;
              const active = i === currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center gap-1 z-10 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all ${done ? 'border-brand-gold bg-brand-gold text-white' : 'border-brand-cream bg-white text-brand-stone'} ${active ? 'scale-110' : ''}`}>
                    {i + 1}
                  </div>
                  <span className="text-[10px] text-center text-brand-stone capitalize hidden sm:block">
                    {step.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Items */}
        <div className="sm:col-span-2 bg-white border border-brand-cream rounded-sm p-5">
          <h2 className="text-sm font-semibold text-brand-black mb-4">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="relative w-16 h-20 shrink-0 bg-brand-cream/30 rounded-sm overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <Package size={20} className="absolute inset-0 m-auto text-brand-stone" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={ROUTES.PRODUCT(item.slug)} className="text-sm font-medium text-brand-black hover:text-brand-gold transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  {(item.size || item.color) && (
                    <p className="text-xs text-brand-stone mt-0.5">
                      {[item.size, item.color].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <p className="text-xs text-brand-stone mt-0.5">Qty: {item.quantity}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-brand-black">{formatPrice(item.totalPrice)}</p>
                  <p className="text-xs text-brand-stone">{formatPrice(item.price)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white border border-brand-cream rounded-sm p-5">
          <h2 className="text-sm font-semibold text-brand-black mb-3">Shipping Address</h2>
          <address className="not-italic text-sm text-brand-stone space-y-0.5">
            <p className="text-brand-black font-medium">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
            <p>{order.shippingAddress.country}</p>
            <p className="pt-1">{order.shippingAddress.phone}</p>
          </address>
        </div>

        {/* Price summary */}
        <div className="bg-white border border-brand-cream rounded-sm p-5">
          <h2 className="text-sm font-semibold text-brand-black mb-3">Price Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-brand-stone">
              <span>Subtotal</span>
              <span className="text-brand-black">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-brand-stone">
              <span>Shipping</span>
              <span className={order.shippingCharge === 0 ? 'text-green-600' : 'text-brand-black'}>
                {order.shippingCharge === 0 ? 'Free' : formatPrice(order.shippingCharge)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-brand-black pt-2 border-t border-brand-cream">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between text-xs text-brand-stone pt-1">
              <span>Payment</span>
              <span className="capitalize">{order.paymentMethod} · {order.paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking */}
      {order.trackingNumber && (
        <div className="bg-white border border-brand-cream rounded-sm p-5">
          <h2 className="text-sm font-semibold text-brand-black mb-2">Tracking</h2>
          <p className="text-sm text-brand-stone">
            Tracking #: <span className="font-medium text-brand-black">{order.trackingNumber}</span>
          </p>
          {order.trackingUrl && (
            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-gold hover:underline mt-1 inline-block">
              Track shipment →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
