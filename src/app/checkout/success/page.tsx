import Link from 'next/link';
import { CheckCircle2, MessageCircle, Phone, ArrowRight, ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { siteConfig } from '@/config/site.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Order Confirmed — ${siteConfig.name}`,
  robots: { index: false },
};

import { orderRepository } from '@/server/repositories/order.repository';
import { paymentService } from '@/server/services/payment.service';

interface Props {
  searchParams: Promise<{ orderId?: string; orderNumber?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  let order = params.orderId ? await orderRepository.findById(params.orderId) : null;

  // Auto-reconcile if order is Razorpay and still marked pending
  if (order && order.paymentMethod === 'razorpay' && order.paymentStatus === 'pending' && order.razorpayOrderId) {
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
  const orderNumber = order?.orderNumber || params.orderNumber || (params.orderId ? `AC-${params.orderId.slice(-6).toUpperCase()}` : 'AC-COUTURE');
  
  const whatsappMsg = encodeURIComponent(
    isRazorpay
      ? `Hello Aafreen Couture Concierge, I have placed Order #${orderNumber} via Online Payment (${isPaid ? 'Paid' : 'Payment Processing'}). Please confirm my order details.`
      : `Hello Aafreen Couture Concierge, I have placed Order #${orderNumber} via Cash on Delivery. Please confirm my order and sizing.`
  );

  return (
    <div className="min-h-[80vh] bg-[#FAF7F2] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Main Confirmation Card */}
        <div className="bg-white border border-[#E8D8C8] rounded-xs p-6 sm:p-10 shadow-[0_4px_24px_rgba(34,22,23,0.04)] text-center relative overflow-hidden">
          {/* Subtle top gold accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C49A5A] via-[#E8D4BE] to-[#C49A5A]" />

          {/* Golden Seal Checkmark */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FAF5EE] border-2 border-[#C49A5A] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 size={38} className="text-[#C49A5A]" />
          </div>

          <span className="inline-block text-[10.5px] uppercase font-bold tracking-[0.35em] text-[#A67C52] mb-2">
            Aafreen Atelier Confirmation
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#221617] uppercase tracking-wide mb-3">
            {isRazorpay && !isPaid ? 'Payment In Verification' : 'Thank You · Order Placed!'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6A66] max-w-md mx-auto leading-relaxed mb-6">
            {isRazorpay && !isPaid
              ? 'We are verifying your transaction with the payment gateway. If money was deducted from your account, your order will be confirmed automatically.'
              : 'Your couture reservation has been received. Our master atelier is preparing your heirloom ensemble with meticulous care.'}
          </p>

          {/* Order Reference & Payment Status Badge */}
          <div className="bg-[#FAF5EE] border border-[#E8D8C8] p-4 sm:p-5 rounded-xs mb-8 text-left space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8D8C8] pb-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#8C7E72] tracking-wider block">
                  Order Reference
                </span>
                <span className="text-base sm:text-lg font-serif font-bold text-[#221617] tracking-wider">
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C49A5A] text-white text-[10px] uppercase font-bold tracking-wider">
                  <Sparkles size={11} /> Cash on Delivery Confirmed
                </span>
              )}
            </div>

            <div className="text-xs text-[#5C554E] space-y-1.5">
              {isRazorpay ? (
                <>
                  {order?.razorpayPaymentId && (
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                      <span>Razorpay Payment Ref: <strong className="font-mono text-[#221617]">{order.razorpayPaymentId}</strong></span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#A67C52] shrink-0" />
                    <span>
                      {isPaid
                        ? '100% Payment Secured & Verified via Razorpay'
                        : 'If payment was deducted, your bank confirmation is being synchronized.'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-[#A67C52] shrink-0" />
                  <span>No advance payment deducted · Pay cash or UPI upon delivery</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                <span>All pieces pass a 48-point quality &amp; embroidery inspection before dispatch</span>
              </div>
            </div>
          </div>

          {/* Next Steps Flow */}
          <div className="text-left mb-8 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#221617] pb-1 border-b border-[#E8D8C8]">
              What Happens Next
            </h2>
            <ol className="space-y-3 text-xs text-[#5C554E]">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FAF5EE] border border-[#C49A5A] text-[#A67C52] font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-[#221617] block font-medium">Concierge WhatsApp / Call Verification</strong>
                  <span>Our stylist will reach out at your provided phone number to re-verify sizing and blouse measurements.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FAF5EE] border border-[#C49A5A] text-[#A67C52] font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-[#221617] block font-medium">Tamper-Proof Packaging &amp; Dispatch</strong>
                  <span>Your ensemble is securely packed in an archival garment bag and handed over to insured express courier.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FAF5EE] border border-[#C49A5A] text-[#A67C52] font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-[#221617] block font-medium">Doorstep Handover &amp; Payment</strong>
                  <span>Inspect your parcel and make payment via Cash or UPI directly to the delivery personnel.</span>
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
                className="bg-[#221617] hover:bg-[#A67C52] text-white py-3 px-4 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Track Order Live</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href={ROUTES.SHOP}
                className="border border-[#E8D8C8] text-[#221617] hover:border-[#A67C52] hover:text-[#A67C52] py-3 px-4 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Concierge Help Strip */}
          <div className="mt-8 pt-6 border-t border-[#E8D8C8] text-center text-xs text-[#8C7E72] space-y-1">
            <p>
              Need urgent sizing assistance or wedding date consultation?
            </p>
            <p className="flex items-center justify-center gap-4 text-[#221617] font-medium pt-1">
              <a href={`tel:${siteConfig.phone}`} className="hover:text-[#A67C52] flex items-center gap-1.5 transition-colors">
                <Phone size={12} className="text-[#A67C52]" /> {siteConfig.phone}
              </a>
              <span>·</span>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-[#A67C52] transition-colors">
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
