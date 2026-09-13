'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  orderId: string;
  currentPaymentStatus: string;
}

const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending / Due on Delivery' },
  { value: 'paid', label: 'Paid & Verified' },
  { value: 'failed', label: 'Payment Failed / Declined' },
  { value: 'refunded', label: 'Refunded to Customer' },
];

export function AdminPaymentStatusUpdater({ orderId, currentPaymentStatus }: Props) {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus,
          note: `Payment status manually updated to ${paymentStatus} by store admin.`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Payment status updated to "${paymentStatus}"`);
        router.refresh();
      } else {
        toast.error(data.message || data.error || 'Failed to update payment status');
      }
    } catch {
      toast.error('Network error updating payment status');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <select
        value={paymentStatus}
        onChange={(e) => setPaymentStatus(e.target.value)}
        className="bg-[#FAF7F2] border border-[#DDD2C5] rounded-lg px-2.5 py-2 text-xs text-[#2E221C] outline-none focus:border-[#C9A86A] flex-1 shadow-xs"
      >
        {PAYMENT_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || paymentStatus === currentPaymentStatus}
        className="bg-[#2E221C] hover:bg-[#1A1410] text-[#F8F5F1] text-[11px] font-semibold px-3.5 py-2 transition-all rounded-lg shadow-sm disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shrink-0"
      >
        {loading ? <RefreshCw size={11} className="animate-spin text-[#C9A86A]" /> : <CheckCircle2 size={11} className="text-[#C9A86A]" />}
        <span>Save</span>
      </button>
    </div>
  );
}
