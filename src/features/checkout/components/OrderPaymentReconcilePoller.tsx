'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RefreshCw, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';

interface Props {
  orderId: string;
  initialPaymentStatus: string;
  paymentMethod: string;
}

export function OrderPaymentReconcilePoller({
  orderId,
  initialPaymentStatus,
  paymentMethod,
}: Props) {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState<string>(initialPaymentStatus);
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  // Guarantee cart is cleared once on confirmation page
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (paymentMethod !== 'razorpay' || initialPaymentStatus === 'paid') {
      return;
    }

    let isMounted = true;
    setIsPolling(true);

    async function checkReconciliation(attempt: number) {
      if (!isMounted) return;
      try {
        const res = await fetch(`/api/orders/${orderId}/reconcile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (data.success && data.data?.reconciled && data.data?.status === 'paid') {
          if (isMounted) {
            setStatus('paid');
            setIsPolling(false);
            toast.success('Payment verified with your bank! Order confirmed.');
            router.refresh();
          }
          return true;
        }
      } catch (e) {
        console.warn('[AutoReconcile] Attempt failed:', e);
      }

      if (isMounted) {
        setPollCount(attempt);
      }
      return false;
    }

    const t1 = setTimeout(async () => {
      const ok = await checkReconciliation(1);
      if (!ok && isMounted) {
        const t2 = setTimeout(async () => {
          const ok2 = await checkReconciliation(2);
          if (!ok2 && isMounted) {
            const t3 = setTimeout(async () => {
              await checkReconciliation(3);
              if (isMounted) setIsPolling(false);
            }, 3500);
            return () => clearTimeout(t3);
          }
        }, 3000);
        return () => clearTimeout(t2);
      }
    }, 1200);

    return () => {
      isMounted = false;
      clearTimeout(t1);
    };
  }, [orderId, paymentMethod, initialPaymentStatus, router]);

  async function handleManualCheck() {
    setIsPolling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/reconcile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.reconciled && data.data.status === 'paid') {
          setStatus('paid');
          toast.success('Payment verified with your bank! Order is confirmed.');
          router.refresh();
        } else {
          toast.info(
            'We checked Razorpay & your bank: No confirmed payment captured yet. If amount was debited, it will auto-confirm or refund within 24 hours.',
            { duration: 6000 }
          );
        }
      } else {
        toast.error('Could not reach payment gateway. Please message Concierge on WhatsApp.');
      }
    } catch {
      toast.error('Network error checking payment status');
    } finally {
      setIsPolling(false);
    }
  }

  if (status === 'paid') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xs p-4 mb-6 text-left flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
              Payment Confirmed & Verified
            </p>
            <p className="text-[11px] text-emerald-800">
              Your transaction was successfully authorized & captured via Razorpay.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
          <ShieldCheck size={12} /> 100% Secured
        </span>
      </div>
    );
  }

  if (paymentMethod === 'razorpay') {
    return (
      <div className="bg-amber-50/80 border border-amber-200 rounded-xs p-4 mb-6 text-left space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isPolling ? (
              <RefreshCw size={15} className="animate-spin text-amber-700 shrink-0" />
            ) : (
              <Clock size={15} className="text-amber-700 shrink-0" />
            )}
            <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
              {isPolling ? 'Verifying Live Bank Confirmation…' : 'Payment Status Pending Verification'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleManualCheck}
            disabled={isPolling}
            className="text-[11px] font-semibold text-amber-900 hover:text-gold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
          >
            <RefreshCw size={11} className={isPolling ? 'animate-spin' : ''} />
            <span>Check Bank Status</span>
          </button>
        </div>

        <p className="text-[11px] text-amber-800 leading-relaxed">
          If your bank debited the amount, our system automatically synchronizes with Razorpay and confirms your reservation. You do not need to pay twice.
        </p>
      </div>
    );
  }

  return null;
}
