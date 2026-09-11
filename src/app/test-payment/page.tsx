'use client';

import { useState } from 'react';
import Script from 'next/script';
import { toast } from 'sonner';
import { ShieldCheck, CreditCard, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function TestPaymentPage() {
  const [amountInRupees, setAmountInRupees] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    orderId?: string;
    paymentId?: string;
    message?: string;
  } | null>(null);

  async function handlePay() {
    if (amountInRupees < 1) {
      toast.error('Minimum amount is ₹1.00 (100 paise)');
      return;
    }

    setLoading(true);
    setVerificationResult(null);

    try {
      // STEP 1: BACKEND - Create Order
      const amountInPaise = Math.round(amountInRupees * 100);
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now().toString().slice(-8)}`,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create Razorpay order');
      }

      // STEP 2: FRONTEND - Open Razorpay Modal
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK script not loaded yet. Please refresh and try again.');
      }

      const options = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Aafreen Couture',
        description: `Standard Checkout Test — ₹${amountInRupees}`,
        order_id: orderData.order_id,
        prefill: {
          name: 'Atelier Test User',
          email: 'test@aafreencouture.com',
          contact: '9999999999',
        },
        theme: {
          color: '#C49A5A',
        },
        // On success: receive payment_id, order_id, signature and send to verify endpoint
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // STEP 3: BACKEND - Verify Signature
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setVerificationResult({
                success: true,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                message: 'HMAC-SHA256 signature verified successfully! Payment is authentic.',
              });
              toast.success('Signature verified! Payment completed.');
            } else {
              setVerificationResult({
                success: false,
                message: verifyData.error || 'Signature mismatch! Payment was NOT verified.',
              });
              toast.error('Payment verification failed');
            }
          } catch (err: any) {
            setVerificationResult({
              success: false,
              message: err?.message || 'Network error verifying signature',
            });
            toast.error('Verification error');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info('Checkout modal was closed by user.');
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (resp: any) => {
        setLoading(false);
        const reason = resp?.error?.description || resp?.error?.reason || 'Transaction failed';
        setVerificationResult({
          success: false,
          message: `Payment failed: ${reason}`,
        });
        toast.error(`Payment failed: ${reason}`);
      });

      rzp.open();
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || 'Failed to initialize payment');
      setVerificationResult({
        success: false,
        message: err?.message,
      });
    }
  }

  return (
    <>
      {/* Razorpay Standard Web Checkout Script */}
      <Script
        id="razorpay-checkout"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="min-h-[75vh] bg-background py-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-xl mx-auto bg-surface border border-border p-6 sm:p-8 rounded-xs shadow-2xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-gold/10 text-gold border border-gold/30 flex items-center justify-center mx-auto mb-3">
              <CreditCard size={22} />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-gold">
              Integration Verification
            </span>
            <h1 className="text-xl sm:text-2xl font-serif text-heading">
              Razorpay Standard Web Checkout
            </h1>
            <p className="text-xs text-text max-w-sm mx-auto">
              Test creating an order, opening the Razorpay modal, and verifying the HMAC-SHA256 signature.
            </p>
          </div>

          <div className="bg-background border border-border p-4 rounded-xs space-y-3">
            <label className="block text-xs font-semibold text-heading uppercase tracking-wider">
              Test Amount (₹ INR)
            </label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-serif font-bold text-gold">₹</span>
              <input
                type="number"
                min="1"
                step="1"
                value={amountInRupees}
                onChange={(e) => setAmountInRupees(Math.max(1, Number(e.target.value)))}
                className="flex-1 bg-surface border border-border px-3 py-2 text-sm font-semibold text-heading rounded-xs focus:outline-none focus:border-gold"
              />
              <span className="text-xs text-text/70">
                ({Math.round(amountInRupees * 100)} paise)
              </span>
            </div>
            <p className="text-[11px] text-text/70">
              Minimum amount allowed by Razorpay is 100 paise (₹1.00).
            </p>
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-heading hover:bg-gold text-surface py-3.5 text-xs font-semibold uppercase tracking-[0.2em] rounded-xs shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Opening Razorpay Modal…</span>
              </>
            ) : (
              <>
                <ShieldCheck size={15} />
                <span>Pay ₹{amountInRupees} with Razorpay</span>
              </>
            )}
          </button>

          {verificationResult && (
            <div
              className={`p-4 rounded-xs border text-xs space-y-2 ${
                verificationResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold uppercase tracking-wider">
                {verificationResult.success ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-700" />
                    <span>Signature Verification Succeeded</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-rose-700" />
                    <span>Signature Verification Failed</span>
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed">{verificationResult.message}</p>
              {verificationResult.orderId && (
                <div className="pt-2 border-t border-emerald-200/60 font-mono text-[10px] space-y-1">
                  <p>Order ID: {verificationResult.orderId}</p>
                  <p>Payment ID: {verificationResult.paymentId}</p>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
            <Link href={ROUTES.CHECKOUT} className="text-gold hover:underline">
              &larr; Return to Checkout
            </Link>
            <span className="text-[11px] text-text/60">
              Key: {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.slice(0, 12)}…
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
