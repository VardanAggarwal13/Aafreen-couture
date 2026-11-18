'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getOrderStatusLabel, getStatusChoices } from '@/constants/order.constants';

interface Props {
  orderId: string;
  currentStatus: string;
  paymentMethod: string;
  paymentStatus: string;
}

/**
 * Only offers the statuses this order can legally move to right now (same rules the server enforces,
 * from order.constants.ts), so the admin can never pick a step the server would refuse.
 */
export function AdminOrderStatusUpdater({ orderId, currentStatus, paymentMethod, paymentStatus }: Props) {
  const router = useRouter();
  const { allowed, blockedByPayment } = getStatusChoices(currentStatus, paymentMethod, paymentStatus);
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const isFinal = allowed.length === 0 && blockedByPayment.length === 0;
  const options = [currentStatus, ...allowed].map((value) => ({ value, label: getOrderStatusLabel(value) }));

  async function handleUpdate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: `Status updated to ${status} by admin concierge.` }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Order status updated to "${getOrderStatusLabel(status)}"`);
        router.refresh();
      } else {
        toast.error(data.message || data.error || 'Failed to update order status');
      }
    } catch {
      toast.error('Network error updating status');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isFinal || (allowed.length === 0 && blockedByPayment.length > 0)}
          aria-label="Order status"
          className="bg-[#FAF7F2] border border-[#DDD2C5] rounded-lg px-3 py-2 text-xs text-[#2E221C] outline-none focus:border-[#C9A86A] shadow-xs disabled:opacity-60"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.value === currentStatus ? `${opt.label} (current)` : opt.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdate}
          disabled={loading || status === currentStatus}
          className="bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold px-3.5 py-2 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
        >
          {loading ? <RefreshCw size="0.8125rem" className="animate-spin text-[#C9A86A]" /> : <CheckCircle2 size="0.8125rem" className="text-[#C9A86A]" />}
          <span>{loading ? 'Updating…' : 'Update Status'}</span>
        </button>
      </div>

      {isFinal && (
        <p className="text-[0.6875rem] text-[#8A6A55]">This order is {getOrderStatusLabel(currentStatus).toLowerCase()}, so its status can no longer change.</p>
      )}
      {!isFinal && blockedByPayment.length > 0 && (
        <p className="max-w-xs text-[0.6875rem] text-amber-700 sm:text-right">
          {allowed.length > 0 ? 'Some steps are' : 'Next steps are'} locked until the online payment is confirmed as paid. Verify or reconcile the payment first.
        </p>
      )}
      {!isFinal && allowed.length > 0 && blockedByPayment.length === 0 && (
        <p className="text-[0.6875rem] text-[#8A6A55]">Next step: {allowed.map((s) => getOrderStatusLabel(s)).join(' or ')}.</p>
      )}
    </div>
  );
}
