'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  orderId: string;
  hasRazorpayOrder: boolean;
  paymentStatus: string;
}

export function AdminPaymentReconcileButton({ orderId, hasRazorpayOrder, paymentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!hasRazorpayOrder) return null;

  async function handleReconcile() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/reconcile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const info = data.data;
        if (info.reconciled && info.status === 'paid') {
          toast.success(info.message || 'Payment successfully reconciled and confirmed with Razorpay!');
          router.refresh();
        } else if (info.status === 'failed') {
          toast.error(info.message || 'Payment attempt failed on Razorpay.');
          router.refresh();
        } else {
          toast.info(info.message || 'No captured payment found yet on Razorpay.');
        }
      } else {
        toast.error(data.error || data.message || 'Failed to reconcile payment with Razorpay');
      }
    } catch {
      toast.error('Network error checking Razorpay status');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleReconcile}
      disabled={loading}
      className="mt-2.5 w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#2E221C] bg-[#FAF7F2] border border-[#DDD2C5] hover:border-[#C9A86A] hover:bg-[#F4EFEA] transition-all rounded-lg disabled:opacity-50 cursor-pointer shadow-xs"
      title="Check Razorpay server for any captured payments for this order"
    >
      {loading ? (
        <RefreshCw size={13} className="animate-spin text-[#C9A86A]" />
      ) : (
        <ShieldCheck size={14} className="text-[#C9A86A]" />
      )}
      <span>{loading ? 'Verifying with Razorpay…' : 'Sync Live Razorpay Gateway Status'}</span>
    </button>
  );
}
