'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Check, ShieldCheck } from 'lucide-react';
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

declare global {
  interface Window {
    Razorpay: new (options: unknown) => { open(): void };
  }
}

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
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('Address');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const shippingCharge = subtotal >= siteConfig.freeShippingThreshold ? 0 : 25000;
  const total = subtotal + shippingCharge;

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<AddressInput>({ resolver: zodResolver(AddressSchema), defaultValues: { country: 'India' } });

  if (items.length === 0) {
    router.replace(ROUTES.CART);
    return null;
  }

  async function handleAddressNext(data: AddressInput) {
    try {
      // Create the order server-side
      const res = await api.post<{ _id: string }>('/api/orders', {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        shippingAddress: { ...data, country: data.country ?? 'India' },
        paymentMethod,
      });
      setOrderId(res.data?._id ?? null);
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
        router.push(`${ROUTES.CHECKOUT_SUCCESS}?orderId=${orderId}`);
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
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error('Something went wrong. Please try again.');
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
              <h2 className="text-lg font-serif text-brand-black mb-4">Shipping Address</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1.5">Full Name</label>
                  <input
                    {...register('name')}
                    className="w-full border border-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1.5">Phone Number</label>
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
                <label className="block text-sm font-medium text-brand-black mb-1.5">Address Line 1</label>
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
                  <label className="block text-sm font-medium text-brand-black mb-1.5">City</label>
                  <input
                    {...register('city')}
                    className="w-full border border-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="City"
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1.5">State</label>
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
                  <label className="block text-sm font-medium text-brand-black mb-1.5">Pincode</label>
                  <input
                    {...register('pincode')}
                    className="w-full border border-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                </div>
              </div>

              {/* Payment method selection */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-brand-black mb-3">Payment Method</h3>
                <div className="space-y-2">
                  {[
                    { value: 'razorpay', label: 'Pay Online', desc: 'UPI, Card, Net Banking via Razorpay' },
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives (₹50 charge)' },
                  ].map(({ value, label, desc }) => (
                    <label key={value} className={`flex items-center gap-3 p-3.5 border cursor-pointer transition-colors ${paymentMethod === value ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-cream hover:border-brand-gold/50'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={value}
                        checked={paymentMethod === value}
                        onChange={() => setPaymentMethod(value as 'razorpay' | 'cod')}
                        className="accent-brand-gold"
                      />
                      <div>
                        <p className="text-sm font-medium text-brand-black">{label}</p>
                        <p className="text-xs text-brand-stone">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-gold text-white py-3.5 text-sm font-medium hover:bg-brand-gold/90 transition-colors mt-2"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {step === 'Payment' && (
            <div className="space-y-5">
              <h2 className="text-lg font-serif text-brand-black mb-4">Confirm Order</h2>
              <div className="p-4 bg-brand-pearl border border-brand-cream rounded-sm">
                <p className="text-sm font-medium text-brand-black mb-1">
                  {paymentMethod === 'razorpay' ? 'Online Payment via Razorpay' : 'Cash on Delivery'}
                </p>
                <p className="text-xs text-brand-stone">
                  {paymentMethod === 'razorpay'
                    ? 'You will be redirected to Razorpay to complete your payment securely.'
                    : 'Please keep the exact cash amount ready at time of delivery.'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-brand-stone">
                <ShieldCheck size={14} className="text-green-600" />
                100% secure · SSL encrypted · Your data is safe
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('Address')}
                  className="flex-1 border border-brand-cream text-brand-black py-3 text-sm font-medium hover:border-brand-gold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing}
                  className="flex-1 bg-brand-gold text-white py-3 text-sm font-medium hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
                >
                  {isPlacing ? 'Processing…' : `Place Order — ${formatPrice(total)}`}
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
