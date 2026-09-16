'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getOrderStatusLabel } from '@/constants/order.constants';

interface Props {
  orderId: string;
  currentStatus: string;
}

// The status the admin picks here is validated server-side against the allowed transitions
// for the order's current status and payment method (see order.service.ts#ALLOWED_TRANSITIONS) —
// this list is every reachable operational status, not necessarily all legal from here.
const ORDER_STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
].map((value) => ({ value, label: getOrderStatusLabel(value) }));

export function AdminOrderStatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

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
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-[#FAF7F2] border border-[#DDD2C5] rounded-lg px-3 py-2 text-xs text-[#2E221C] outline-none focus:border-[#C9A86A] shadow-xs"
      >
        {ORDER_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold px-3.5 py-2 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
      >
        {loading ? <RefreshCw size={13} className="animate-spin text-[#C9A86A]" /> : <CheckCircle2 size={13} className="text-[#C9A86A]" />}
        <span>{loading ? 'Updating…' : 'Update Status'}</span>
      </button>
    </div>
  );
}
