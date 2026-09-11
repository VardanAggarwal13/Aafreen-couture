import Link from 'next/link';
import { CheckCircle2, MessageCircle, Phone, ArrowRight, ShieldCheck, Sparkles, Clock, Check } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { siteConfig } from '@/config/site.config';
import type { Metadata } from 'next';
import { orderRepository } from '@/server/repositories/order.repository';
import { paymentService } from '@/server/services/payment.service';
import { OrderPaymentReconcilePoller } from '@/features/checkout/components/OrderPaymentReconcilePoller';
import { formatPrice } from '@/utils/format';

export const metadata: Metadata = {
  title: `Order Confirmed — ${siteConfig.name}`,
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{ orderId?: string; orderNumber?: string; reconcile?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  let order = params.orderId ? await orderRepository.findById(params.orderId) : null;

  // Auto-reconcile server-side if Razorpay order is still marked pending
  if (
    order &&
    order.paymentMethod === 'razorpay' &&
    order.paymentStatus === 'pending' &&
    order.razorpayOrderId
  ) {
    try {
      const recResult = await paymentService.reconcilePayment(order._id.toString());
      if (recResult.reconciled) {
        order = recResult.order;
      }
    } catch (e) {
      console.warn('[OrderSuccessPage] Auto-reconciliation check error:', e);
    }
  }

  const isRazorpay = order?.paymentMethod === 'razorpay';
  const isPaid = order?.paymentStatus === 'paid';
  const orderNumber =
    order?.orderNumber ||
    params.orderNumber ||
    (params.orderId ? `AC-${params.orderId.slice(-6).toUpperCase()}` : 'AC-COUTURE');

  const whatsappMsg = encodeURIComponent(
    isRazorpay
      ? `Hello Aafreen Couture Concierge, I have placed Order #${orderNumber} via Online Payment (${
          isPaid ? 'Paid & Verified' : 'Payment Processing'
        }). Please confirm my order details.`
      : `Hello Aafreen Couture Concierge, I have placed Order #${orderNumber} via Cash on Delivery. Please confirm my order and sizing.`
  );

  return (
    <div className="min-h-[80vh] bg-background py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Main Confirmation Card */}
        <div className="bg-surface border border-border rounded-xs p-6 sm:p-10 shadow-2xs text-center relative overflow-hidden">
          {/* Subtle top gold accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/50 via-gold to-gold/50" />

          {/* Golden Seal Checkmark */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 size={38} className="text-gold" />
          </div>

          <span className="inline-block text-[10.5px] uppercase font-bold tracking-[0.35em] text-gold mb-2">
            Aafreen Atelier Confirmation
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-heading uppercase tracking-wide mb-3">
            {isRazorpay && !isPaid ? 'Payment In Verification' : 'Thank You · Order Placed!'}
          </h1>
          <p className="text-xs sm:text-sm text-text max-w-md mx-auto leading-relaxed mb-6">
            {isRazorpay && !isPaid
              ? 'We are verifying your transaction with the payment gateway. If money was debited from your account, your order will be confirmed automatically.'
              : 'Your couture reservation has been received. Our master atelier is preparing your heirloom ensemble with meticulous care.'}
          </p>

          {/* Client Auto-Reconcile Poller for pending online payments */}
          {order && (
            <OrderPaymentReconcilePoller
              orderId={order._id.toString()}
              initialPaymentStatus={order.paymentStatus}
              paymentMethod={order.paymentMethod}
            />
          )}

          {/* Order Reference & Payment Status Badge */}
          <div className="bg-background border border-border p-4 sm:p-5 rounded-xs mb-8 text-left space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-text/70 tracking-wider block">
                  Order Reference
                </span>
                <span className="text-base sm:text-lg font-serif font-bold text-heading tracking-wider">
                  #{orderNumber}
                </span>
              </div>
              {isRazorpay ? (
                isPaid ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider shadow-xs">
                    <ShieldCheck size={11} /> Online Payment Confirmed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 text-white text-[10px] uppercase font-bold tracking-wider shadow-xs">
                    <Clock size={11} /> Verifying Bank Payment
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-surface text-[10px] uppercase font-bold tracking-wider">
                  <Sparkles size={11} /> Cash on Delivery Confirmed
                </span>
              )}
            </div>

            <div className="text-xs text-text space-y-1.5">
              {isRazorpay ? (
                <>
                  {order?.razorpayPaymentId && (
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                      <span>
                        Razorpay Payment Ref:{' '}
                        <strong className="font-mono text-heading">{order.razorpayPaymentId}</strong>
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-gold shrink-0" />
                    <span>
                      {isPaid
                        ? '100% Payment Secured & Verified via Razorpay'
                        : 'If payment was deducted, your bank confirmation is being synchronized.'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-gold shrink-0" />
                  <span>Zero advance deducted · Pay cash or UPI upon doorstep delivery</span>
                </div>
              )}
              {order?.total && (
                <div className="flex items-center justify-between pt-1 font-medium text-heading">
                  <span>Total Order Amount:</span>
                  <span className="font-bold text-gold">{formatPrice(order.total)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 pt-1 border-t border-border/60">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                <span>All pieces pass a 48-point quality &amp; embroidery inspection before dispatch</span>
              </div>
            </div>
          </div>

          {/* Next Steps Flow */}
          <div className="text-left mb-8 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-heading pb-1 border-b border-border">
              What Happens Next
            </h2>
            <ol className="space-y-3 text-xs text-text">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-gold/10 border border-gold text-gold font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-heading block font-medium">Concierge Sizing Verification</strong>
                  <span>Our bridal concierge will reach out to confirm your exact sizing, blouse measurements, and dispatch window.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-gold/10 border border-gold text-gold font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-heading block font-medium">Archival Packaging &amp; Insured Dispatch</strong>
                  <span>Your ensemble is meticulously packaged in an archival garment protector and handed over to express courier.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-gold/10 border border-gold text-gold font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-heading block font-medium">Doorstep Delivery</strong>
                  <span>Inspect your parcel upon handover. {order?.paymentMethod === 'cod' ? 'Complete payment via Cash or UPI to courier.' : 'Your parcel is 100% pre-paid.'}</span>
                </div>
              </li>
            </ol>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3">
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#1B7F49] hover:bg-[#15673B] text-white py-3.5 px-6 text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle size={16} />
              <span>Confirm Instantly on WhatsApp (+91 95179 01117)</span>
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={`/track-order?orderId=${encodeURIComponent(orderNumber)}`}
                className="bg-heading hover:bg-gold text-surface py-3 px-4 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Track Order Live</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href={ROUTES.SHOP}
                className="border border-border text-heading hover:border-gold hover:text-gold py-3 px-4 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Concierge Help Strip */}
          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-text/70 space-y-1">
            <p>
              Need urgent sizing assistance or wedding date consultation?
            </p>
            <p className="flex items-center justify-center gap-4 text-heading font-medium pt-1">
              <a href={`tel:${siteConfig.phone}`} className="hover:text-gold flex items-center gap-1.5 transition-colors">
                <Phone size={12} className="text-gold" /> {siteConfig.phone}
              </a>
              <span>·</span>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-gold transition-colors">
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
