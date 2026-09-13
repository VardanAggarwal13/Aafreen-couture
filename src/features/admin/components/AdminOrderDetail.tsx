'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IOrder, IOrderItem } from '@/types/order.types';

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-50 text-yellow-800 border border-yellow-200',
  confirmed:  'bg-blue-50 text-blue-800 border border-blue-200',
  processing: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
  shipped:    'bg-purple-50 text-purple-800 border border-purple-200',
  delivered:  'bg-emerald-50 text-emerald-800 border border-emerald-200',
  cancelled:  'bg-rose-50 text-rose-800 border border-rose-200',
  returned:   'bg-neutral-100 text-neutral-700 border border-neutral-300',
};

const ALL_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'] as const;

interface Props { order: IOrder }

export function AdminOrderDetail({ order }: Props) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  async function handleStatusUpdate() {
    setUpdating(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/orders/${order._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      router.refresh();
    } catch {
      setError('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  }

  const statusColor = STATUS_COLORS[order.status] ?? 'bg-[#FAF7F2] text-[#8A6A55] border border-[#DDD2C5]';
  const shippingAddress = order.shippingAddress;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-[#DDD2C5]">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-wide">Order #{order.orderNumber}</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-serif">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span className={`text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${statusColor}`}>
          {order.status.replace(/_/g, ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#DDD2C5] rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-semibold text-[#8A6A55] uppercase tracking-wider mb-4">Items</h2>
            <div className="divide-y divide-[#EAE2D7]">
              {order.items.map((item: IOrderItem, i: number) => (
                <div key={i} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                  <div className="w-12 h-14 bg-[#FAF7F2] border border-[#DDD2C5] rounded-md shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#2E221C] font-serif font-medium truncate">{item.name}</p>
                    <p className="text-xs text-[#8A6A55] mt-0.5">
                      {item.size ? `Size: ${item.size}` : ''} {item.color ? `· ${item.color}` : ''} · Qty: {item.qty}
                    </p>
                  </div>
                  <p className="text-sm text-[#2E221C] font-semibold shrink-0">
                    ₹{(item.price / 100).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-[#EAE2D7] space-y-2">
              <div className="flex justify-between text-sm text-[#8A6A55]">
                <span>Subtotal</span>
                <span className="text-[#2E221C] font-medium">₹{(order.subtotal / 100).toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-[#8A6A55]">
                  <span>Discount</span>
                  <span className="text-emerald-700 font-medium">– ₹{(order.discount / 100).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-[#8A6A55]">
                <span>Shipping</span>
                <span className="text-[#2E221C] font-medium">{order.shippingCost === 0 ? 'Free' : `₹${(order.shippingCost / 100).toLocaleString('en-IN')}`}</span>
              </div>
              <div className="flex justify-between font-serif font-semibold border-t border-[#EAE2D7] pt-2 text-base text-[#2E221C]">
                <span>Total</span>
                <span className="text-[#C9A86A] text-lg">₹{(order.total / 100).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Status update */}
          <div className="bg-white border border-[#DDD2C5] rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-semibold text-[#8A6A55] uppercase tracking-wider mb-4">Update Status</h2>
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <div className="flex gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as typeof order.status)}
                className="flex-1 bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] text-sm px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C9A86A]"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === order.status}
                className="bg-[#2E221C] text-[#F8F5F1] text-[11px] font-semibold tracking-wider uppercase px-6 py-2.5 rounded-lg hover:bg-[#1A1410] transition-all shadow-sm disabled:opacity-50"
              >
                {updating ? 'Updating…' : 'Update'}
              </button>
            </div>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2.5 w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] text-sm px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C9A86A] placeholder-[#8A6A55]/50"
              placeholder="Optional note (e.g. tracking number, tailoring note)"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-white border border-[#DDD2C5] rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-semibold text-[#8A6A55] uppercase tracking-wider mb-2">Customer</h2>
            <p className="text-sm text-[#2E221C] font-medium">{order.userId ?? 'Guest Client'}</p>
          </div>

          {/* Shipping address */}
          {shippingAddress && (
            <div className="bg-white border border-[#DDD2C5] rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-[#8A6A55] uppercase tracking-wider mb-2">Delivery Address</h2>
              <div className="text-xs text-[#8A6A55] space-y-1">
                <p className="text-[#2E221C] text-sm font-medium">{shippingAddress.fullName}</p>
                <p>{shippingAddress.line1}{shippingAddress.line2 ? `, ${shippingAddress.line2}` : ''}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} – {shippingAddress.pincode}</p>
                <p>{shippingAddress.phone}</p>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white border border-[#DDD2C5] rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-semibold text-[#8A6A55] uppercase tracking-wider mb-2">Payment</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#8A6A55]">
                <span>Method</span>
                <span className="text-[#2E221C] font-semibold uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[#8A6A55]">
                <span>Status</span>
                <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
