import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { PolicySidebar, type TocItem } from '@/features/info/components/PolicySidebar';
import { RefreshCw, ShieldCheck, Video, CheckCircle2, PackageCheck, Mail, Phone, ArrowRight, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Exchange, Cancellation & Refund Policy | Aafreen Couture',
  description:
    'Official Exchange, Cancellation, and Refund Policy for Aafreen Couture. Learn about eligible exchanges within 7 days, unboxing video recommendations, custom bridal apparel, and our 100% refund on unaccepted parcels.',
};

const TOC: TocItem[] = [
  { id: 'sec-overview', number: '01', title: 'Policy Overview' },
  { id: 'sec-no-returns', number: '02', title: 'No Standard Returns' },
  { id: 'sec-exchange-policy', number: '03', title: '7-Day Size Exchange' },
  { id: 'sec-unboxing-video', number: '04', title: 'Unboxing Video Advisory' },
  { id: 'sec-ineligible', number: '05', title: 'Non-Exchangeable Items' },
  { id: 'sec-refused-parcels', number: '06', title: '100% Refund on Refused Parcels' },
  { id: 'sec-cancellation', number: '07', title: 'Order Cancellation' },
  { id: 'sec-custom-bridal', number: '08', title: 'Custom & Bridal Pieces' },
  { id: 'sec-charges', number: '09', title: 'Exchange Shipping Fees' },
  { id: 'sec-request-flow', number: '10', title: 'Step-by-Step Request Flow' },
  { id: 'sec-refund-timelines', number: '11', title: 'Refund Turnaround (5–7 Days)' },
  { id: 'sec-cod-policy', number: '12', title: 'COD Order Refunds' },
  { id: 'sec-abuse', number: '13', title: 'Fair Use & Policy Updates' },
  { id: 'sec-concierge', number: '14', title: 'Contact Customer Concierge' },
];

export default function ReturnsPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#221617]">
      {/* Luxury Hero Banner */}
      <div className="bg-[#1A1011] text-[#FAF7F2] py-14 sm:py-20 border-b border-[#C49A5A]/30 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #C49A5A 0px, #C49A5A 1px, transparent 1px, transparent 14px)',
          }}
        />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#2C1A1C] border border-[#C49A5A]/30 px-3.5 py-1 rounded-full text-[10.5px] text-[#C49A5A] uppercase tracking-[0.3em] font-semibold mb-4">
            <span>✦ Client Care &amp; Guarantees</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif uppercase tracking-wider text-white">
            Exchange, Cancellation &amp; Refund Policy
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-white/75 font-sans max-w-2xl mx-auto leading-relaxed">
            Every piece at Aafreen Couture is handcrafted with utmost dedication. Please explore our transparent exchange, cancellation, and refund principles.
          </p>
          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-white/60 font-sans">
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-[#C49A5A]" />
              <span>Effective Date: August 31, 2026</span>
            </span>
            <span>·</span>
            <span>Est. Reading Time: 5 mins</span>
          </div>
        </div>
      </div>

      {/* Main Container with 2-Column Responsive Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        
        {/* Visual 3-Card Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          
          <div className="bg-white border border-[#E8D8C8] p-6 rounded-sm shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/40 flex items-center justify-center text-[#C49A5A] mb-4">
                <RefreshCw size={20} />
              </div>
              <h3 className="font-serif text-base uppercase tracking-wide text-[#1A1011] mb-2">
                7-Day Size Exchange
              </h3>
              <p className="text-xs text-[#5C554E] leading-relaxed font-sans">
                Eligible ready-to-wear pieces can be exchanged for size/fit within <strong>7 days of delivery</strong>, provided tags and original packaging remain intact.
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A67C52] mt-5 block border-t border-[#E8D8C8] pt-3">
              Standard Apparel
            </span>
          </div>

          <div className="bg-white border-2 border-[#C49A5A]/50 p-6 rounded-sm shadow-xs flex flex-col justify-between bg-gradient-to-b from-white to-[#FAF7F2] transition-transform hover:-translate-y-0.5">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#221617] border border-[#C49A5A] flex items-center justify-center text-[#C49A5A] mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-serif text-base uppercase tracking-wide text-[#1A1011] mb-2">
                100% Refund On Refused Parcels
              </h3>
              <p className="text-xs text-[#5C554E] leading-relaxed font-sans">
                If you choose not to accept delivery and the parcel returns intact, we refund <strong>100% of your payment</strong> once verified at our atelier.
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A67C52] mt-5 block border-t border-[#E8D8C8] pt-3">
              Transparent Assurance
            </span>
          </div>

          <div className="bg-white border border-[#E8D8C8] p-6 rounded-sm shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/40 flex items-center justify-center text-[#C49A5A] mb-4">
                <PackageCheck size={20} />
              </div>
              <h3 className="font-serif text-base uppercase tracking-wide text-[#1A1011] mb-2">
                Custom Bridal Wear
              </h3>
              <p className="text-xs text-[#5C554E] leading-relaxed font-sans">
                Bespoke bridal lehengas and customized orders are made to personal measurements and non-returnable, backed by complimentary tailoring adjustments.
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A67C52] mt-5 block border-t border-[#E8D8C8] pt-3">
              Bespoke Couture
            </span>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Article Content */}
          <article className="lg:col-span-8 space-y-8 font-sans text-xs sm:text-sm text-[#5C554E] leading-relaxed">
            
            {/* Section 1: Overview */}
            <section id="sec-overview" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">01</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Policy Overview &amp; Brand Philosophy
                </h2>
              </div>
              <p className="mb-3">
                At <strong>Aafreen Couture</strong>, every piece is carefully selected, prepared, and packed to uphold the standards of our brand.
              </p>
              <p className="mb-3">
                As our collections may include premium, limited, customised, and made-to-order pieces, we follow a carefully defined Exchange, Cancellation &amp; Refund Policy to ensure a fair experience for both our customers and our brand.
              </p>
              <p className="text-xs font-semibold text-[#1A1011]">
                By placing an order with Aafreen Couture, you acknowledge and agree to the terms outlined below.
              </p>
            </section>

            {/* Section 2: No Standard Returns */}
            <section id="sec-no-returns" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">02</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  No Standard Returns on Accepted Orders
                </h2>
              </div>
              <p className="mb-3">
                Aafreen Couture does not offer standard returns on delivered and accepted orders.
              </p>
              <p>
                Once an order has been delivered and accepted by the customer, it cannot be returned simply because the customer has changed their mind or no longer wishes to keep the product. However, eligible products may be exchanged in accordance with our Exchange Policy below.
              </p>
            </section>

            {/* Section 3: 7-Day Size Exchange */}
            <section id="sec-exchange-policy" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">03</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  7-Day Exchange Policy &amp; Size Exchanges
                </h2>
              </div>
              <p className="mb-3">
                We offer an exchange facility on eligible products. An exchange request must be raised within <strong>7 days from the date of delivery</strong>.
              </p>
              <p className="font-semibold text-[#1A1011] mb-2">To qualify for an exchange, the product must:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-[#C49A5A] mb-4">
                <li>Be unused, unworn, and unwashed</li>
                <li>Be completely unaltered and free from sizing changes</li>
                <li>Have all original designer tags, barcodes, and dust bags intact</li>
                <li>Be in its original brand box and packaging</li>
                <li>Be free from makeup stains, perfume odors, body oils, snags, or signs of wear</li>
                <li>Be returned in a condition suitable for resale</li>
              </ul>
              <div className="bg-[#FAF7F2] p-4 border-l-2 border-[#C49A5A] rounded-xs text-xs text-[#5C554E]">
                <strong>Exchange Due to Size or Fit:</strong> If the size of an eligible ready-to-wear product is not suitable, you may request an exchange for another available size. Where the requested size is unavailable in our inventory, our styling team will assist with an alternative solution or credit note. An exchange does not automatically entitle the customer to a cash refund.
              </div>
            </section>

            {/* Section 4: Unboxing Video */}
            <section id="sec-unboxing-video" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">04</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Damaged Items &amp; Continuous Unboxing Video Advisory
                </h2>
              </div>
              <p className="mb-3">
                If you receive a product that is damaged, defective, or materially different from what was ordered, please contact Aafreen Couture within <strong>48 hours of delivery</strong>.
              </p>
              
              <div className="bg-[#FAF7F2] border border-[#C49A5A]/40 p-4 rounded-xs mb-4 flex items-start gap-3.5">
                <Video className="text-[#C49A5A] shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-[#1A1011] text-xs uppercase tracking-wider mb-1">
                    Continuous Unboxing Video Requirement
                  </p>
                  <p className="text-xs text-[#5C554E] leading-relaxed">
                    For damaged, defective, missing, or incorrect-product claims, customers are strongly encouraged to record a continuous, unedited unboxing video beginning from the sealed outer courier parcel and continuing until the garment is fully inspected. This provides definitive proof to resolve logistics and carrier issues immediately.
                  </p>
                </div>
              </div>

              <p className="font-semibold text-[#1A1011] mb-2">After assessing the issue, Aafreen Couture will provide:</p>
              <ul className="list-disc pl-5 space-y-1 marker:text-[#C49A5A]">
                <li>An immediate replacement of the identical ensemble</li>
                <li>An exchange for another piece of equivalent value</li>
                <li>Complimentary repair or master artisan alteration</li>
                <li>A full refund where replacement cannot be provided</li>
              </ul>
            </section>

            {/* Section 5: Ineligible Products */}
            <section id="sec-ineligible" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">05</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Products Not Eligible for Exchange
                </h2>
              </div>
              <p className="mb-3 font-semibold text-[#1A1011]">The following products are strictly non-exchangeable:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-[#C49A5A]">
                <li>Customised and personalized products crafted to specific measurements</li>
                <li>Made-to-order couture and bespoke bridal lehengas</li>
                <li>Garments altered or stitched according to custom client instructions</li>
                <li>Items that have been worn, washed, perfume-scented, or damaged</li>
                <li>Garments missing original price tags, designer security seals, or dust bags</li>
                <li>Clearance and special promotional sale items marked non-exchangeable</li>
                <li>Requests submitted beyond the 7-day delivery window</li>
              </ul>
            </section>

            {/* Section 6: Refused Parcels (100% Refund) */}
            <section id="sec-refused-parcels" className="bg-[#FAF7F2] border-2 border-[#C49A5A]/50 p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="text-[#C49A5A] shrink-0" size={22} />
                <div>
                  <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                    06. If You Do Not Want to Accept Your Parcel (100% Full Refund)
                  </h2>
                  <p className="text-xs text-[#A67C52] uppercase tracking-wider font-semibold">
                    Doorstep Delivery Refusal Terms
                  </p>
                </div>
              </div>
              
              <p className="mb-3">
                We understand that circumstances may change after an order has been placed. If you no longer wish to receive your parcel, you may refuse delivery at your doorstep or notify our customer support team prior to delivery.
              </p>
              <p className="mb-3 font-semibold text-[#1A1011]">
                If the parcel is returned to Aafreen Couture and is successfully received in its original unopened condition, we will refund 100% of the payment received for the order.
              </p>
              <p className="text-xs text-[#5C554E]">
                The refund will be initiated immediately after the returned parcel reaches our atelier and is verified by our team.
              </p>
            </section>

            {/* Section 7 & 8 */}
            <section id="sec-cancellation" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">07</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Order Cancellation Guidelines
                </h2>
              </div>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#C49A5A]">
                <li>Cancellation requests should be submitted as soon as possible after placing an order.</li>
                <li>An order may be cancelled before it has entered processing, fabric cutting, customisation, packing, or dispatch.</li>
                <li>Once an order has been dispatched or handed to the courier, cancellation is no longer possible.</li>
                <li>If an eligible cancellation is approved, the applicable 100% refund will be credited through the original payment method.</li>
              </ul>
            </section>

            {/* Section 8: Custom Bridal */}
            <section id="sec-custom-bridal" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">08</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Custom &amp; Made-to-Order Bridal Pieces
                </h2>
              </div>
              <p className="mb-3">
                Certain Aafreen Couture pieces are prepared specifically according to customer measurements and bespoke preferences. Because these involve individual artisan allocation, they are subject to stricter terms:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-[#C49A5A]">
                <li>Customers are responsible for providing accurate measurements and fitting details.</li>
                <li>Once embroidery or fabric cutting has commenced, order cancellation is not permitted.</li>
                <li>We provide complimentary alteration support on bridal pieces within 10 days of delivery.</li>
              </ul>
            </section>

            {/* Section 9: Exchange Charges */}
            <section id="sec-charges" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">09</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Shipping &amp; Exchange Handling Charges
                </h2>
              </div>
              <p className="mb-3">
                Where an exchange is requested for size adjustment or personal preference, reverse pickup and reshipping fees (typically ₹150–₹250 for domestic couriers) may apply and will be communicated prior to processing.
              </p>
              <p>
                For products confirmed to be damaged, defective, or incorrectly supplied by Aafreen Couture, all return and replacement shipping charges are 100% borne by us.
              </p>
            </section>

            {/* Section 10: Step-by-Step Flow */}
            <section id="sec-request-flow" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">10</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Step-by-Step: How to Request an Exchange
                </h2>
              </div>
              <p className="mb-4">
                To request an exchange, contact our customer concierge with the following four details:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-[#FAF7F2] p-3.5 border border-[#E8D8C8] rounded-xs">
                  <span className="font-semibold text-[#1A1011] text-xs block mb-0.5">1. Order Number</span>
                  <p className="text-xs text-[#6E6A66]">e.g., #AC-10294</p>
                </div>
                <div className="bg-[#FAF7F2] p-3.5 border border-[#E8D8C8] rounded-xs">
                  <span className="font-semibold text-[#1A1011] text-xs block mb-0.5">2. Customer Name &amp; Phone</span>
                  <p className="text-xs text-[#6E6A66]">Your registered mobile / WhatsApp number</p>
                </div>
                <div className="bg-[#FAF7F2] p-3.5 border border-[#E8D8C8] rounded-xs">
                  <span className="font-semibold text-[#1A1011] text-xs block mb-0.5">3. Product Details</span>
                  <p className="text-xs text-[#6E6A66]">Garment name and delivered size</p>
                </div>
                <div className="bg-[#FAF7F2] p-3.5 border border-[#E8D8C8] rounded-xs">
                  <span className="font-semibold text-[#1A1011] text-xs block mb-0.5">4. Reason &amp; Replacement Size</span>
                  <p className="text-xs text-[#6E6A66]">Target size or photos for inspection</p>
                </div>
              </div>

              <p className="text-xs text-[#7D756C] italic">
                Please do not ship any parcel back without receiving prior written approval from Aafreen Couture. Unauthorised return packages will not be accepted.
              </p>
            </section>

            {/* Section 11 & 12: Refund Turnaround (Razorpay) */}
            <section id="sec-refund-timelines" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">11</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Refund Processing &amp; Bank Timelines (5–7 Business Days)
                </h2>
              </div>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#C49A5A] mb-4">
                <li>
                  Approved refunds are initiated through your <strong>original payment method</strong> (Razorpay payment gateway: Cards, UPI, Netbanking).
                </li>
                <li>
                  Our atelier initiates the refund transfer within <strong>24–48 hours</strong> of returned item verification.
                </li>
                <li>
                  The funds typically reflect in your bank account or card statement within <strong>5–7 business days</strong>, depending on your financial institution.
                </li>
              </ul>

              <div id="sec-cod-policy" className="mt-4 pt-4 border-t border-[#E8D8C8] text-xs text-[#5C554E]">
                <strong className="text-[#1A1011] block mb-1">Cash-on-Delivery (COD) Orders:</strong>
                For eligible COD refunds, our concierge team will request verified bank account details (Account Name, Account Number, IFSC Code) to execute a secure NEFT/IMPS bank transfer.
              </div>
            </section>

            {/* Section 13: Abuse */}
            <section id="sec-abuse" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">13</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Fair Use, Policy Abuse &amp; Updates
                </h2>
              </div>
              <p className="mb-3">
                Aafreen Couture reserves the right to restrict future orders where there is evidence of repeated unjustified parcel refusals, fraudulent claims, or misuse of exchange privileges.
              </p>
              <p>
                We may revise this policy periodically. The updated version will always be published on this page with the effective date.
              </p>
            </section>

            {/* Section 14: Concierge Contact */}
            <section id="sec-concierge" className="bg-[#221617] text-white border border-[#C49A5A]/40 p-6 sm:p-8 rounded-sm shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#C49A5A] text-[#1A1011] text-xs flex items-center justify-center font-bold font-mono">14</span>
                <h2 className="text-base sm:text-lg font-serif text-[#C49A5A] uppercase tracking-wide">
                  Contact Concierge for Exchanges &amp; Refunds
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6 font-sans">
                Our customer concierge team is available to assist you with sizing questions, exchanges, or returns:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-[#2C1A1C] p-4 rounded-xs border border-[#C49A5A]/20">
                  <p className="text-[#C49A5A] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail size={13} /> Support Email
                  </p>
                  <a href={`mailto:${siteConfig.email}`} className="text-white hover:text-[#C49A5A] transition-colors">
                    {siteConfig.email}
                  </a>
                </div>

                <div className="bg-[#2C1A1C] p-4 rounded-xs border border-[#C49A5A]/20">
                  <p className="text-[#C49A5A] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone size={13} /> WhatsApp Concierge
                  </p>
                  <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C49A5A] transition-colors">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#C49A5A]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 font-sans">
                <p>Aafreen Couture By Pearl · SCO No. 43, 1st Floor, B-Block Market, New Amritsar, Amritsar, Punjab — 143001</p>
                <Link
                  href="/contact"
                  className="bg-[#C49A5A] text-[#1A1011] hover:bg-white text-[10.5px] font-semibold uppercase tracking-[0.2em] px-5 py-2 transition-colors flex items-center gap-1.5 rounded-xs"
                >
                  <span>Contact Concierge Desk</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </section>

          </article>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 hidden lg:block">
            <PolicySidebar toc={TOC} title="Exchange & Refund Policy" />
          </div>

        </div>
      </div>
    </main>
  );
}
