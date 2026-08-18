'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IOrder, IOrderItem } from '@/types/order.types';

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-500/15 text-amber-400',
  confirmed:  'bg-blue-500/15 text-blue-400',
  processing: 'bg-indigo-500/15 text-indigo-400',
  shipped:    'bg-purple-500/15 text-purple-400',
  delivered:  'bg-emerald-500/15 text-emerald-400',
  cancelled:  'bg-red-500/15 text-red-400',
  returned:   'bg-orange-500/15 text-orange-400',
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

  const statusColor = STATUS_COLORS[order.status] ?? 'bg-white/10 text-white/40';
  const shippingAddress = order.shippingAddress;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-serif text-white">Order #{order.orderNumber}</h1>
          <p className="text-sm text-white/40 mt-1">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span className={`text-[11px] font-semibold px-3 py-1 ${statusColor}`}>
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1A1A1A] border border-white/5 p-5">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((item: IOrderItem, i: number) => (
                <div key={i} className="flex items-center gap-4 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="w-12 h-14 bg-white/5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{item.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {item.size ? `Size: ${item.size}` : ''} {item.color ? `· ${item.color}` : ''} · Qty: {item.qty}
                    </p>
                  </div>
                  <p className="text-sm text-white font-medium shrink-0">
                    ₹{(item.price / 100).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Subtotal</span>
                <span className="text-white">₹{(order.subtotal / 100).toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Discount</span>
                  <span className="text-emerald-400">– ₹{(order.discount / 100).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Shipping</span>
                <span className="text-white">{order.shippingCost === 0 ? 'Free' : `₹${(order.shippingCost / 100).toLocaleString('en-IN')}`}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-white/10 pt-2">
                <span className="text-white">Total</span>
                <span className="text-brand-gold">₹{(order.total / 100).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Status update */}
          <div className="bg-[#1A1A1A] border border-white/5 p-5">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Update Status</h2>
            {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
            <div className="flex gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as typeof order.status)}
                className="flex-1 bg-[#111111] border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-brand-gold/50"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === order.status}
                className="bg-brand-gold text-white text-[11px] font-semibold tracking-wider uppercase px-5 py-2 hover:bg-[#b8893f] transition-colors disabled:opacity-50"
              >
                {updating ? 'Updating…' : 'Update'}
              </button>
            </div>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2 w-full bg-[#111111] border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-brand-gold/50 placeholder:text-white/25"
              placeholder="Optional note (e.g. tracking number)"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-[#1A1A1A] border border-white/5 p-5">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Customer</h2>
            <p className="text-sm text-white font-medium">{order.userId ?? 'Guest'}</p>
          </div>

          {/* Shipping address */}
          {shippingAddress && (
            <div className="bg-[#1A1A1A] border border-white/5 p-5">
              <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Delivery Address</h2>
              <div className="text-xs text-white/60 space-y-1">
                <p className="text-white text-sm font-medium">{shippingAddress.fullName}</p>
                <p>{shippingAddress.line1}{shippingAddress.line2 ? `, ${shippingAddress.line2}` : ''}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} – {shippingAddress.pincode}</p>
                <p>{shippingAddress.phone}</p>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-[#1A1A1A] border border-white/5 p-5">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Payment</h2>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">Method</span>
                <span className="text-white uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Status</span>
                <span className={order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}>
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
