'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  orderId: string;
  currentStatus: string;
}

const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending Verification' },
  { value: 'confirmed', label: 'Confirmed & Sizing Logged' },
  { value: 'processing', label: 'In Artisan Tailoring' },
  { value: 'shipped', label: 'Dispatched via Air Express' },
  { value: 'out_for_delivery', label: 'Out for Doorstep Handover' },
  { value: 'delivered', label: 'Delivered to Customer' },
  { value: 'cancelled', label: 'Cancelled' },
];

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
        toast.success(`Order status updated to "${status.replace(/_/g, ' ')}"`);
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
        className="bg-[#1A1A1A] border border-white/10 rounded-xs px-3 py-2 text-xs text-white outline-none focus:border-brand-gold/50"
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
        className="bg-brand-gold text-white text-xs font-medium px-4 py-2 hover:bg-brand-gold/90 transition-colors rounded-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
      >
        {loading ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
        <span>{loading ? 'Updating…' : 'Update Status'}</span>
      </button>
    </div>
  );
}
