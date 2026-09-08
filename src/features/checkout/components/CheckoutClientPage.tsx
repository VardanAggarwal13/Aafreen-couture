'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { Check, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
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
  const { data: session } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('Address');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('cod');
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

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

  useEffect(() => {
    if (items.length === 0) {
      router.replace(ROUTES.CART);
    }
  }, [items.length, router]);

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

  if (items.length === 0) {
    return null;
  }

  async function handleAddressNext(data: AddressInput) {
    try {
      // If user opted to save new address to account
      if (saveToAccount && session?.user && selectedAddressId === 'new') {
        fetch('/api/users/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, isDefault: savedAddresses.length === 0 }),
        }).catch(() => {});
      }

      // Create the order server-side
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
      setStep('Payment');
    } catch {
      toast.error('Could not create order. Please try again.');
    }
  }

  async function handlePlaceOrder() {
    if (!orderId) return;
    setIsPlacing(true);

    try {
      if (paymentMethod === 'cod') {
        clearCart();
        const numParam = orderNumber ? `&orderNumber=${encodeURIComponent(orderNumber)}` : '';
        router.push(`${ROUTES.CHECKOUT_SUCCESS}?orderId=${orderId}${numParam}`);
        return;
      }

      // Razorpay flow
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Could not load payment gateway. Please try again.');
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
        description: `Order — ${orderId}`,
        order_id: rzpData.razorpayOrderId ?? '',
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: { color: '#C49A5A' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await api.post('/api/payments/verify', {
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            router.push(`${ROUTES.CHECKOUT_SUCCESS}?orderId=${orderId}`);
          } catch {
            toast.error('Payment verification failed. Contact support if amount was deducted.');
          }
        },
        modal: {
          ondismiss: () => {
            setIsPlacing(false);
            toast.info('Payment was cancelled.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        const errorMsg =
          response?.error?.description ||
          response?.error?.reason ||
          'Payment failed. Please try again with another method.';
        toast.error(errorMsg);
        setIsPlacing(false);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong. Please try again.');
      setIsPlacing(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Stepper */}
      <div className="flex items-center gap-4 mb-10">
        {STEPS.map((s, i) => {
          const isActive = s === step;
          const isDone = STEPS.indexOf(step) > i;
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors ${
                  isDone
                    ? 'border-brand-gold bg-brand-gold text-white'
                    : isActive
                    ? 'border-brand-gold text-brand-gold bg-white'
                    : 'border-brand-cream text-brand-stone bg-white'
                }`}
              >
                {isDone ? <Check size={12} /> : i + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  isActive ? 'text-brand-black' : 'text-brand-stone'
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`w-12 h-px mx-2 ${isDone ? 'bg-brand-gold' : 'bg-brand-cream'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main column */}
        <div className="lg:col-span-2">
          {step === 'Address' && (
            <form onSubmit={handleSubmit(handleAddressNext)} className="space-y-5">
              {/* Patron login / session indicator */}
              {session?.user ? (
                <div className="p-4 bg-[#FAF7F2] border border-[#E8D8C8] rounded-xs flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#A67C52]/10 text-[#A67C52] border border-[#E8D8C8] flex items-center justify-center font-serif text-xs font-semibold">
                      {session.user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#221617]">Signed in as {session.user.name}</p>
                      <p className="text-[11px] text-[#6E6A66]">{session.user.email}</p>
                    </div>
                  </div>
                  <Link
                    href={ROUTES.PROFILE}
                    className="text-[11px] font-semibold text-[#A67C52] hover:text-[#221617] uppercase tracking-wider transition-colors"
                  >
                    My Profile
                  </Link>
                </div>
              ) : (
                <div className="p-4 bg-[#FAF7F2] border border-[#E8D8C8] rounded-xs flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-[#221617]">Already an Atelier Patron?</p>
                    <p className="text-[11px] text-[#6E6A66] mt-0.5">
                      Sign in to use your saved delivery addresses and track this order in your account dashboard.
                    </p>
                  </div>
                  <Link
                    href={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CHECKOUT)}`}
                    className="shrink-0 ml-4 px-3.5 py-1.5 bg-[#221617] text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-[#A67C52] transition-colors rounded-xs"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Saved Addresses quick-selector */}
              {savedAddresses.length > 0 && (
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#221617]">
                      Saved Delivery Addresses
                    </h3>
                    <span className="text-[11px] text-[#A67C52] font-medium">Click to use</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => applyAddress(addr)}
                        className={`p-3 text-left border rounded-xs transition-all ${
                          selectedAddressId === addr._id
                            ? 'border-[#A67C52] bg-[#FAF7F2] ring-1 ring-[#A67C52]/20'
                            : 'border-[#E8D8C8] bg-white hover:border-[#A67C52]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-[#221617]">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-[#FAF7F2] text-[#A67C52] border border-[#E8D8C8] font-bold rounded-xs">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#6E6A66] line-clamp-1">{addr.line1}</p>
                        <p className="text-[11px] text-[#6E6A66]">
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
                      className={`p-3 text-center border border-dashed rounded-xs transition-colors flex items-center justify-center gap-1.5 text-xs ${
                        selectedAddressId === 'new'
                          ? 'border-[#A67C52] text-[#A67C52] bg-[#FAF7F2]'
                          : 'border-[#E8D8C8] text-[#6E6A66] hover:border-[#A67C52]'
                      }`}
                    >
                      <span>+ Enter a Different Address</span>
                    </button>
                  </div>
                </div>
              )}

              <h2 className="text-lg font-serif text-brand-black mb-4">
                {selectedAddressId !== 'new' ? 'Delivery Details' : 'Shipping Address'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1.5">Full Name *</label>
                  <input
                    {...register('name')}
                    className="w-full border border-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1.5">Phone Number *</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full border border-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-1.5">
                  Email Address <span className="text-brand-stone font-normal">(optional · for tracking & dispatch receipts)</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full border border-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-1.5">Address Line 1 *</label>
                <input
                  {...register('line1')}
                  className="w-full border border-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="House/Flat no., Street, Area"
                />
                {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-1.5">
                  Address Line 2 <span className="text-brand-stone font-normal">(optional)</span>
                </label>
                <input
                  {...register('line2')}
                  className="w-full border border-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="Landmark, Colony"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1.5">City *</label>
                  <input
                    {...register('city')}
                    className="w-full border border-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="City"
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1.5">State *</label>
                  <select
                    {...register('state')}
                    className="w-full border border-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors bg-white"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1.5">Pincode *</label>
                  <input
                    {...register('pincode')}
                    className="w-full border border-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                </div>
              </div>

              {/* Save Address to Account Checkbox */}
              {session?.user && selectedAddressId === 'new' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="saveToAccount"
                    checked={saveToAccount}
                    onChange={(e) => setSaveToAccount(e.target.checked)}
                    className="rounded-xs border-[#E8D8C8] text-[#A67C52] focus:ring-[#A67C52]"
                  />
                  <label htmlFor="saveToAccount" className="text-xs text-[#221617] cursor-pointer font-sans">
                    Save this address to my account for faster future checkout
                  </label>
                </div>
              )}

              {/* Payment method selection */}
              <div className="mt-6 pt-6 border-t border-brand-cream">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-brand-black">Payment Method</h3>
                  <span className="text-[11px] text-[#A67C52] font-semibold bg-[#A67C52]/10 px-2.5 py-0.5 rounded-full">
                    Instant Placement
                  </span>
                </div>
                <div className="space-y-3">
                  <label className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all rounded-xs ${paymentMethod === 'cod' ? 'border-[#C49A5A] bg-[#C49A5A]/6 ring-1 ring-[#C49A5A]' : 'border-brand-cream hover:border-brand-gold/50'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#C49A5A] mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-brand-black">Cash on Delivery (COD)</p>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#C49A5A] text-white">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-brand-stone mt-1 leading-relaxed">
                        Pay with cash or UPI directly to the courier when your parcel arrives. Concierge will call or message to confirm measurements before dispatch.
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all rounded-xs ${paymentMethod === 'razorpay' ? 'border-[#C49A5A] bg-[#C49A5A]/6 ring-1 ring-[#C49A5A]' : 'border-brand-cream hover:border-brand-gold/50 opacity-85'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-[#C49A5A] mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-brand-black">Pay Online (UPI / Card / NetBanking)</p>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                          Gateway Setup
                        </span>
                      </div>
                      <p className="text-xs text-brand-stone mt-1 leading-relaxed">
                        Online payment gateway currently in scheduled setup. Please choose Cash on Delivery for instant order dispatch.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-gold text-white py-3.5 text-sm font-medium hover:bg-brand-gold/90 transition-colors mt-2"
              >
                Continue to Order Review
              </button>
            </form>
          )}

          {step === 'Payment' && (
            <div className="space-y-5">
              <h2 className="text-lg font-serif text-brand-black mb-4">Confirm & Reserve Order</h2>
              
              {paymentMethod === 'cod' ? (
                <div className="p-5 bg-white border border-[#C49A5A]/40 rounded-xs space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-sm font-semibold text-brand-black">Cash on Delivery (COD) Selected</p>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#C49A5A] text-white ml-auto">
                      Zero Advance
                    </span>
                  </div>
                  <p className="text-xs text-brand-stone leading-relaxed">
                    No online payment needed today. Your couture ensemble will be reserved in our atelier. Our bridal concierge team will contact you via phone or WhatsApp at your registered mobile number to confirm sizing, custom alterations, and your dispatch window.
                  </p>
                  <div className="pt-2 border-t border-brand-cream/60 flex items-center justify-between text-xs text-brand-black font-medium">
                    <span>Payable on delivery to courier:</span>
                    <span className="text-base text-[#A67C52] font-semibold">{formatPrice(total)}</span>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-brand-pearl border border-brand-cream rounded-xs space-y-2">
                  <p className="text-sm font-semibold text-brand-black">Online Payment via Razorpay</p>
                  <p className="text-xs text-brand-stone leading-relaxed">
                    You will be redirected to the secure Razorpay payment gateway to complete your payment with UPI, Debit/Credit Card, or NetBanking.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-brand-stone">
                <ShieldCheck size={14} className="text-green-600" />
                100% verified order · Tamper-proof insured packaging · Atelier customer care
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('Address')}
                  className="flex-1 border border-brand-cream text-brand-black py-3.5 text-sm font-medium hover:border-brand-gold transition-colors"
                >
                  Edit Address
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing}
                  className="flex-1 bg-brand-gold text-white py-3.5 text-sm font-medium hover:bg-brand-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPlacing ? (
                    'Reserving Order…'
                  ) : paymentMethod === 'cod' ? (
                    `Place Order via COD (${formatPrice(total)})`
                  ) : (
                    `Pay Now — ${formatPrice(total)}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-pearl border border-brand-cream rounded-sm p-5 sticky top-24">
            <h3 className="text-base font-serif text-brand-black mb-4">
              Order Summary ({items.length} items)
            </h3>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId ?? ''}`} className="flex justify-between gap-2 text-xs">
                  <span className="text-brand-black line-clamp-1 flex-1">
                    {item.name}
                    {item.size && <span className="text-brand-stone"> ({item.size})</span>}
                    {' '}× {item.quantity}
                  </span>
                  <span className="text-brand-black shrink-0 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-brand-cream pt-3">
              <div className="flex justify-between text-brand-stone">
                <span>Subtotal</span>
                <span className="text-brand-black font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-stone">
                <span>Shipping</span>
                <span className={shippingCharge === 0 ? 'text-green-600 font-medium' : 'text-brand-black font-medium'}>
                  {shippingCharge === 0 ? 'Free' : formatPrice(shippingCharge)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-brand-black pt-1 border-t border-brand-cream">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
