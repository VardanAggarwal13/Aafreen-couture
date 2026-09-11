'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  orderId: string;
  paymentStatus: string;
}

export function CustomerPaymentReconcileButton({ orderId, paymentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (paymentStatus === 'paid') {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-200">
        <CheckCircle2 size={13} />
        <span>Payment Verified & Confirmed</span>
      </div>
    );
  }

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
          toast.success('Your payment was successfully received and your order is confirmed!');
          router.refresh();
        } else {
          toast.info(
            'We checked with the payment network: No money was deducted from your account. You may safely retry.',
            { duration: 5000 }
          );
        }
      } else {
        toast.error('Unable to verify with payment network. Please contact concierge support.');
      }
    } catch {
      toast.error('Network error checking payment status');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans">
      <div className="flex items-center gap-1.5 text-xs text-text/80">
        <ShieldAlert size={14} className="text-gold shrink-0" />
        <span>Money debited from your bank but status shows pending?</span>
      </div>
      <button
        onClick={handleReconcile}
        disabled={loading}
        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold border border-gold/40 hover:bg-gold/10 transition-colors rounded-xs disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <RefreshCw size={12} className="animate-spin text-gold" />
        ) : (
          <RefreshCw size={12} className="text-gold" />
        )}
        <span>{loading ? 'Checking with Bank…' : 'Verify Bank Status'}</span>
      </button>
    </div>
  );
}
