'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { Check, ShieldCheck, CheckCircle2, Lock, ArrowLeft, RefreshCw, CreditCard, Banknote } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useCartStore } from '@/store/cart.store';
import { formatPrice } from '@/utils/format';
import { siteConfig } from '@/config/site.config';
import { ROUTES } from '@/constants/routes';
import { api } from '@/utils/api';
import { AddressSchema, type AddressInput } from '@/validators/order.validators';

const STEPS = ['Address', 'Payment'] as const;
type Step = (typeof STEPS)[number];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutClientPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('Address');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('cod');
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [savedAddresses, setSavedAddresses] = useState<Array<{
    _id: string;
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    isDefault?: boolean;
  }>>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [saveToAccount, setSaveToAccount] = useState(false);

  const subtotal = getSubtotal();
  const shippingCharge = subtotal >= siteConfig.freeShippingThreshold ? 0 : 25000;
  const total = subtotal + shippingCharge;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AddressInput>({ resolver: zodResolver(AddressSchema), defaultValues: { country: 'India' } });

  // Redirect to cart if cart is empty and no active order
  useEffect(() => {
    if (items.length === 0 && !orderId) {
      router.replace(ROUTES.CART);
    }
  }, [items.length, orderId, router]);

  // Client-side authentication guard: redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CHECKOUT)}`);
    }
  }, [isPending, session, router]);

  // When session becomes active, pre-fill user info & fetch saved addresses
  useEffect(() => {
    if (session?.user) {
      const cur = getValues();
      if (!cur.name && session.user.name) setValue('name', session.user.name);
      if (!cur.email && session.user.email) setValue('email', session.user.email);

      fetch('/api/users/addresses')
        .then((r) => r.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setSavedAddresses(data.data);
            const defaultAddr = data.data.find((a: { isDefault?: boolean }) => a.isDefault) || data.data[0];
            if (defaultAddr) {
              applyAddress(defaultAddr);
            }
          }
        })
        .catch(() => {});
    }
  }, [session, setValue, getValues]);

  function applyAddress(addr: {
    _id: string;
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  }) {
    setSelectedAddressId(addr._id);
    setValue('name', addr.name);
    setValue('phone', addr.phone);
    setValue('line1', addr.line1);
    setValue('line2', addr.line2 || '');
    setValue('city', addr.city);
    setValue('state', addr.state);
    setValue('pincode', addr.pincode);
    setValue('country', addr.country || 'India');
  }

  if (isPending || !session?.user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 font-sans bg-background">
        <div className="w-9 h-9 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
          Verifying Your Account…
        </p>
      </div>
    );
  }

  if (items.length === 0 && !orderId) {
    return null;
  }

  async function handleAddressNext(data: AddressInput) {
    try {
      if (saveToAccount && session?.user && selectedAddressId === 'new') {
        fetch('/api/users/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, isDefault: savedAddresses.length === 0 }),
        }).catch(() => {});
      }

      // Create or re-create order server-side
      const res = await api.post<{ _id: string; orderNumber?: string }>('/api/orders', {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        shippingAddress: { ...data, country: data.country ?? 'India' },
        paymentMethod,
      });

      setOrderId(res.data?._id ?? null);
      setOrderNumber(res.data?.orderNumber ?? null);
      setPaymentError(null);
      setStep('Payment');
    } catch (err: any) {
      toast.error(err?.message || 'Could not create order. Please check your details and try again.');
    }
  }

  async function handlePlaceOrder() {
    if (!orderId) return;
    setIsPlacing(true);
    setPaymentError(null);

    try {
      // 1. CASH ON DELIVERY (COD) FLOW
      if (paymentMethod === 'cod') {
        const codRes = await fetch(`/api/orders/${orderId}/confirm-cod`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const codData = await codRes.json();

        if (codRes.ok && codData.success) {
          clearCart();
          const numParam = orderNumber ? `&orderNumber=${encodeURIComponent(orderNumber)}` : '';
          toast.success('Order confirmed with Cash on Delivery!');
          router.push(`${ROUTES.CHECKOUT_SUCCESS}?orderId=${orderId}${numParam}`);
          return;
        } else {
          throw new Error(codData.error || codData.message || 'Failed to confirm COD reservation.');
        }
      }

      // 2. RAZORPAY ONLINE PAYMENT FLOW
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Could not connect to secure payment gateway. Please check your connection.');
        setIsPlacing(false);
        return;
      }

      const rzpRes = await api.post<{
        razorpayOrderId: string;
        amount: number;
        currency: string;
        keyId: string;
      }>('/api/payments/create-order', { orderId });
      const rzpData = rzpRes.data!;

      const address = getValues();

      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: siteConfig.name,
        description: `Bespoke Order #${orderNumber || orderId.slice(-6)}`,
        order_id: rzpData.razorpayOrderId ?? '',
        prefill: {
          name: address.name,
          contact: address.phone,
          email: address.email || session?.user?.email || '',
        },
        theme: { color: '#C49A5A' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Attempt client-side signature verification
            await api.post('/api/payments/verify', {
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            toast.success('Payment received and order confirmed!');
            router.push(`${ROUTES.CHECKOUT_SUCCESS}?orderId=${orderId}`);
          } catch (verifyErr) {
            // EDGE-CASE RESOLUTION: Client network drop or verification glitch
            // Money was deducted from user bank! Route to success with reconcile flag
            // so server auto-reconciles directly with Razorpay API.
            console.warn('[Checkout] Client verify glitch, routing to server auto-reconciliation:', verifyErr);
            clearCart();
            toast.info('Payment received by gateway. Synchronizing confirmation with atelier...');
            router.push(`${ROUTES.CHECKOUT_SUCCESS}?orderId=${orderId}&reconcile=true`);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPlacing(false);
            toast.info('Payment window closed. Your items remain safely in your bag. You can retry or choose Cash on Delivery.');
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response: any) => {
        const errorDesc =
          response?.error?.description ||
          response?.error?.reason ||
          'Payment declined by your bank or card issuer. No money was deducted.';
        setPaymentError(errorDesc);
        toast.error(`Payment failed: ${errorDesc}`);
        setIsPlacing(false);
      });

      rzp.open();
    } catch (err: any) {
      setPaymentError(err?.message || 'Something went wrong processing your order. Please try again.');
      toast.error(err?.message || 'Something went wrong. Please try again.');
      setIsPlacing(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-text">
      {/* Luxury Minimal Stepper */}
      <div className="flex items-center gap-4 mb-10 pb-4 border-b border-border">
        {STEPS.map((s, i) => {
          const isActive = s === step;
          const isDone = STEPS.indexOf(step) > i;
          return (
            <div key={s} className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  isDone
                    ? 'border-2 border-gold bg-gold text-surface'
                    : isActive
                    ? 'border-2 border-gold text-gold bg-surface ring-2 ring-gold/20'
                    : 'border border-border text-text/60 bg-surface'
                }`}
              >
                {isDone ? <Check size={12} strokeWidth={2.5} /> : i + 1}
              </div>
              <span
                className={`text-xs uppercase tracking-widest font-semibold ${
                  isActive ? 'text-heading' : 'text-text/70'
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`w-12 h-px mx-2 ${isDone ? 'bg-gold' : 'bg-border'}`} />
              )}
            </div>
          );
        })}

        <div className="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-gold font-medium">
          <Lock size={13} />
          <span>256-Bit Encrypted Secure Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main interactive column */}
        <div className="lg:col-span-2 space-y-6">
          {step === 'Address' && (
            <form onSubmit={handleSubmit(handleAddressNext)} className="space-y-6">
              {/* Verified Account Indicator */}
              <div className="p-4 bg-surface border border-border rounded-xs flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 text-gold border border-gold/30 flex items-center justify-center font-serif text-xs font-bold">
                    {session.user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-heading">{session.user.name}</p>
                    <p className="text-[11px] text-text/80">{session.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                  <Link
                    href={ROUTES.PROFILE}
                    className="text-[11px] font-semibold text-gold hover:text-heading uppercase tracking-wider transition-colors"
                  >
                    Profile
                  </Link>
                </div>
              </div>

              {/* Saved Addresses quick-selector */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-heading">
                      Saved Delivery Addresses
                    </h3>
                    <span className="text-[11px] text-gold font-medium">Click to select</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => applyAddress(addr)}
                        className={`p-3.5 text-left border rounded-xs transition-all cursor-pointer ${
                          selectedAddressId === addr._id
                            ? 'border-gold bg-gold/5 ring-1 ring-gold/30 shadow-xs'
                            : 'border-border bg-surface hover:border-gold/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-heading">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-surface text-gold border border-gold/30 font-bold rounded-xs">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text/80 line-clamp-1">{addr.line1}</p>
                        <p className="text-[11px] text-text/80">
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAddressId('new');
                        setValue('line1', '');
                        setValue('line2', '');
                        setValue('city', '');
                        setValue('pincode', '');
                      }}
                      className={`p-3 text-center border border-dashed rounded-xs transition-colors flex items-center justify-center gap-1.5 text-xs cursor-pointer ${
                        selectedAddressId === 'new'
                          ? 'border-gold text-gold bg-gold/5'
                          : 'border-border text-text hover:border-gold hover:text-gold'
                      }`}
                    >
                      <span>+ Enter a Different Address</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Delivery Details Form */}
              <div className="bg-surface border border-border p-6 rounded-xs space-y-4 shadow-2xs">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-heading pb-2 border-b border-border">
                  {selectedAddressId !== 'new' ? 'Delivery Details' : 'Shipping Address'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      {...register('name')}
                      className="w-full border border-border px-3.5 py-2.5 text-xs text-heading bg-background focus:outline-none focus:border-gold transition-colors rounded-xs"
                      placeholder="Receiver's full name"
                    />
                    {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full border border-border px-3.5 py-2.5 text-xs text-heading bg-background focus:outline-none focus:border-gold transition-colors rounded-xs"
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heading mb-1 uppercase tracking-wider">
                    Email Address <span className="text-text/70 font-normal lowercase">(for dispatch tracking receipts)</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full border border-border px-3.5 py-2.5 text-xs text-heading bg-background focus:outline-none focus:border-gold transition-colors rounded-xs"
                    placeholder="name@example.com"
                  />
                  {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heading mb-1 uppercase tracking-wider">
                    Address Line 1 *
                  </label>
                  <input
                    {...register('line1')}
                    className="w-full border border-border px-3.5 py-2.5 text-xs text-heading bg-background focus:outline-none focus:border-gold transition-colors rounded-xs"
                    placeholder="House/Flat no., Street, Area"
                  />
                  {errors.line1 && <p className="text-[11px] text-rose-600 mt-1">{errors.line1.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heading mb-1 uppercase tracking-wider">
                    Address Line 2 <span className="text-text/70 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    {...register('line2')}
                    className="w-full border border-border px-3.5 py-2.5 text-xs text-heading bg-background focus:outline-none focus:border-gold transition-colors rounded-xs"
                    placeholder="Landmark, Apartment, Colony"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1 uppercase tracking-wider">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      className="w-full border border-border px-3.5 py-2.5 text-xs text-heading bg-background focus:outline-none focus:border-gold transition-colors rounded-xs"
                      placeholder="City"
                    />
                    {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1 uppercase tracking-wider">
                      State *
                    </label>
                    <select
                      {...register('state')}
                      className="w-full border border-border px-3.5 py-2.5 text-xs text-heading bg-background focus:outline-none focus:border-gold transition-colors rounded-xs"
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-[11px] text-rose-600 mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1 uppercase tracking-wider">
                      Pincode *
                    </label>
                    <input
                      {...register('pincode')}
                      className="w-full border border-border px-3.5 py-2.5 text-xs text-heading bg-background focus:outline-none focus:border-gold transition-colors rounded-xs"
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                    {errors.pincode && <p className="text-[11px] text-rose-600 mt-1">{errors.pincode.message}</p>}
                  </div>
                </div>

                {/* Save Address to Account Checkbox */}
                {session?.user && selectedAddressId === 'new' && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="saveToAccount"
                      checked={saveToAccount}
                      onChange={(e) => setSaveToAccount(e.target.checked)}
                      className="rounded-xs border-border text-gold focus:ring-gold"
                    />
                    <label htmlFor="saveToAccount" className="text-xs text-text cursor-pointer">
                      Save this address to my account for faster future checkout
                    </label>
                  </div>
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="bg-surface border border-border p-6 rounded-xs space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-heading">
                    Select Payment Preference
                  </h3>
                  <span className="text-[10px] text-gold font-bold uppercase tracking-wider bg-gold/10 px-2.5 py-0.5 rounded-full">
                    Buyer Protection
                  </span>
                </div>

                <div className="space-y-3">
                  {/* COD Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 border rounded-xs cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-gold bg-gold/5 ring-1 ring-gold/30 shadow-xs'
                        : 'border-border bg-background hover:border-gold/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-gold mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Banknote size={15} className="text-gold" />
                        <p className="text-xs font-semibold text-heading uppercase tracking-wider">
                          Cash on Delivery (COD)
                        </p>
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold text-surface">
                          Zero Advance
                        </span>
                      </div>
                      <p className="text-xs text-text/80 mt-1.5 leading-relaxed">
                        Pay with cash or UPI directly to the courier when your parcel arrives. Atelier concierge will contact you to confirm sizing and custom measurements before dispatch.
                      </p>
                    </div>
                  </label>

                  {/* Razorpay Online Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 border rounded-xs cursor-pointer transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-gold bg-gold/5 ring-1 ring-gold/30 shadow-xs'
                        : 'border-border bg-background hover:border-gold/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-gold mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <CreditCard size={15} className="text-gold" />
                        <p className="text-xs font-semibold text-heading uppercase tracking-wider">
                          Pay Online (UPI / Card / NetBanking)
                        </p>
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Instant Verification
                        </span>
                      </div>
                      <p className="text-xs text-text/80 mt-1.5 leading-relaxed">
                        Pay securely with Google Pay, PhonePe, Paytm, Credit/Debit Cards, or NetBanking. Instant reservation with 100% money-back guarantee.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-heading hover:bg-gold text-surface py-4 text-xs font-semibold uppercase tracking-[0.2em] rounded-xs shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Order Review</span>
              </button>
            </form>
          )}

          {step === 'Payment' && (
            <div className="space-y-6">
              {paymentError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xs text-xs text-rose-800 space-y-1">
                  <p className="font-semibold uppercase tracking-wider">Payment Interrupted</p>
                  <p>{paymentError}</p>
                  <p className="text-[11px] text-rose-600 pt-1">
                    Your cart items are completely preserved. You can retry with a different card/UPI, or switch to Cash on Delivery below.
                  </p>
                </div>
              )}

              <div className="bg-surface border border-border p-6 rounded-xs space-y-4 shadow-2xs">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-heading pb-2 border-b border-border">
                  Confirm & Reserve Order
                </h2>

                {paymentMethod === 'cod' ? (
                  <div className="p-5 bg-background border border-gold/40 rounded-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-xs font-semibold text-heading uppercase tracking-wider">
                        Cash on Delivery Selected
                      </p>
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-gold text-surface ml-auto">
                        Zero Advance Required
                      </span>
                    </div>
                    <p className="text-xs text-text/80 leading-relaxed">
                      No online payment required today. Your couture ensemble will be reserved in our atelier. Our bridal concierge team will contact you at your registered phone number to confirm sizing, custom alterations, and dispatch schedule.
                    </p>
                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-heading font-semibold">
                      <span>Payable on delivery to courier:</span>
                      <span className="text-base text-gold font-bold">{formatPrice(total)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-background border border-gold/40 rounded-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard size={15} className="text-gold" />
                      <p className="text-xs font-semibold text-heading uppercase tracking-wider">
                        Online Payment via Razorpay
                      </p>
                    </div>
                    <p className="text-xs text-text/80 leading-relaxed">
                      A secure Razorpay checkout window will open. You can pay with any UPI app (GPay, PhonePe, Paytm), Credit/Debit Card, or NetBanking. If your network disconnects after debit, our auto-reconciliation engine will confirm your order automatically.
                    </p>
                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-heading font-semibold">
                      <span>Total Amount to Pay:</span>
                      <span className="text-base text-gold font-bold">{formatPrice(total)}</span>
                    </div>
                  </div>
                )}

                {/* Quick Toggle if payment failed */}
                {paymentError && (
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className="text-xs text-gold hover:text-heading underline underline-offset-4 cursor-pointer"
                    >
                      Switch to Cash on Delivery (Zero Advance)
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-text/80 pt-2">
                  <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
                  <span>100% Insured Shipping · Complimentary Alterations · Atelier Concierge Care</span>
                </div>

                <div className="flex gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setStep('Address')}
                    className="flex-1 border border-border text-heading py-3.5 text-xs font-semibold uppercase tracking-wider hover:border-gold transition-colors rounded-xs cursor-pointer"
                  >
                    Edit Delivery Details
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="flex-1 bg-heading hover:bg-gold text-surface py-3.5 text-xs font-semibold uppercase tracking-[0.2em] rounded-xs shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPlacing ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Processing Order…</span>
                      </>
                    ) : paymentMethod === 'cod' ? (
                      `Place Order via COD (${formatPrice(total)})`
                    ) : (
                      `Pay Online — ${formatPrice(total)}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Sticky Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-xs p-6 shadow-2xs sticky top-24 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-heading pb-3 border-b border-border">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId ?? ''}`} className="flex justify-between gap-2 text-xs">
                  <span className="text-heading line-clamp-1 flex-1">
                    {item.name}
                    {item.size && <span className="text-text/70"> ({item.size})</span>}
                    {' '}× {item.quantity}
                  </span>
                  <span className="text-heading shrink-0 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs border-t border-border pt-3">
              <div className="flex justify-between text-text">
                <span>Subtotal</span>
                <span className="text-heading font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text">
                <span>Shipping</span>
                <span className={shippingCharge === 0 ? 'text-emerald-700 font-medium' : 'text-heading font-medium'}>
                  {shippingCharge === 0 ? 'Complimentary' : formatPrice(shippingCharge)}
                </span>
              </div>
              <div className="flex justify-between font-serif text-sm font-bold text-heading pt-2 border-t border-border">
                <span>Total Payable</span>
                <span className="text-base text-gold">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="p-3 bg-background border border-border rounded-xs space-y-1 text-[11px] text-text/80">
              <div className="flex items-center gap-1.5 text-gold font-semibold">
                <Lock size={12} />
                <span>Atelier Guarantee</span>
              </div>
              <p>
                Insured express delivery with handcrafted tamper-proof packaging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
