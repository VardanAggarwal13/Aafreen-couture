'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site.config';

interface RazorpayButtonProps {
  amount: number; // in paise (e.g. 10000 = ₹100.00)
  currency?: string;
  receipt?: string;
  buttonText?: string;
  className?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess?: (data: {
    order_id: string;
    payment_id: string;
    signature: string;
  }) => void;
  onError?: (error: Error | string) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayButton({
  amount,
  currency = 'INR',
  receipt,
  buttonText,
  className = '',
  prefill = {},
  notes = {},
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (loading || disabled) return;

    if (!amount || amount < 100) {
      toast.error('Payment amount must be at least 100 paise (₹1.00)');
      return;
    }

    setLoading(true);

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay checkout script. Please check your internet connection.');
      }

      // 2. Call backend order creation endpoint
      const createRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          notes,
        }),
      });

      const orderData = await createRes.json();
      if (!createRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || 'Failed to initialize payment order');
      }

      // 3. Configure Razorpay modal options
      const keyId =
        orderData.key_id ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        'rzp_test_TZC01S5GNjkMcZ';

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: siteConfig.name,
        description: `Purchase — ${receipt || orderData.order_id}`,
        order_id: orderData.order_id,
        prefill: {
          name: prefill.name || '',
          email: prefill.email || '',
          contact: prefill.contact || '',
        },
        theme: {
          color: '#C49A5A',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info('Payment was cancelled.');
            onCancel?.();
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Send payment signature to backend verification endpoint
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }

            toast.success('Payment completed successfully!');
            setLoading(false);

            onSuccess?.({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          } catch (err: any) {
            setLoading(false);
            const errMsg = err?.message || 'Payment verification failed.';
            toast.error(errMsg);
            onError?.(errMsg);
          }
        },
      };

      const rzp = new window.Razorpay(options);

      // 5. Handle payment.failed event
      rzp.on('payment.failed', (response: any) => {
        setLoading(false);
        const failReason =
          response?.error?.description ||
          response?.error?.reason ||
          'Payment failed. Please try with another card or UPI.';
        toast.error(failReason);
        onError?.(failReason);
      });

      rzp.open();
    } catch (err: any) {
      setLoading(false);
      const msg = err?.message || 'An error occurred while launching payment.';
      toast.error(msg);
      onError?.(msg);
    }
  };

  const defaultText = buttonText || `Pay ₹${(amount / 100).toLocaleString('en-IN')}`;

  return (
    <button
      type="button"
      id="razorpay-checkout-button"
      onClick={handleCheckout}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
        className ||
        'bg-[#1C1A17] text-white hover:bg-[#C49A5A] hover:text-white border border-[#1C1A17] hover:border-[#C49A5A] shadow-sm'
      }`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </span>
      ) : (
        defaultText
      )}
    </button>
  );
}
