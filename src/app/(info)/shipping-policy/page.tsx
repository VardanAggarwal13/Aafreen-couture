import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { PolicySidebar, type TocItem } from '@/features/info/components/PolicySidebar';
import { Truck, Globe, PackageCheck, Clock, Mail, Phone, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Aafreen Couture',
  description:
    'Official Shipping & Delivery Policy for Aafreen Couture. Learn about domestic delivery timelines (5–7 days), international shipping to 50+ countries, free shipping thresholds, and real-time tracking.',
};

const TOC: TocItem[] = [
  { id: 'sec-dispatch', number: '01', title: 'Processing & Dispatch' },
  { id: 'sec-domestic', number: '02', title: 'Domestic Delivery (5–7 Days)' },
  { id: 'sec-international', number: '03', title: 'International Shipping' },
  { id: 'sec-tracking', number: '04', title: 'Real-Time Order Tracking' },
  { id: 'sec-damaged-shipments', number: '05', title: 'Damaged or Lost Shipments' },
  { id: 'sec-refused-delivery', number: '06', title: 'Refused Delivery Refund Guarantee' },
  { id: 'sec-shipping-support', number: '07', title: 'Logistics Concierge' },
];

export default function ShippingPolicyPage() {
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
            <span>✦ Atelier Logistics &amp; Transit</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif uppercase tracking-wider text-white">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-white/75 font-sans max-w-2xl mx-auto leading-relaxed">
            Delivering handcrafted Indian luxury couture safely to your doorstep across India and worldwide.
          </p>
          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-white/60 font-sans">
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-[#C49A5A]" />
              <span>Effective Date: August 31, 2026</span>
            </span>
            <span>·</span>
            <span>Est. Reading Time: 4 mins</span>
          </div>
        </div>
      </div>

      {/* Main Container with 2-Column Responsive Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        
        {/* Visual 3-Card Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          
          <div className="bg-white border border-[#E8D8C8] p-6 rounded-sm shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/40 flex items-center justify-center text-[#C49A5A] mb-4">
                <Truck size={20} />
              </div>
              <h3 className="font-serif text-base uppercase tracking-wide text-[#1A1011] mb-2">
                Domestic Delivery
              </h3>
              <p className="text-xs text-[#5C554E] leading-relaxed font-sans">
                <strong>5–7 Business Days</strong> across all Indian serviceable pincodes via insured express air cargo.
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A67C52] mt-5 block border-t border-[#E8D8C8] pt-3">
              Pan-India Air Express
            </span>
          </div>

          <div className="bg-white border border-[#E8D8C8] p-6 rounded-sm shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/40 flex items-center justify-center text-[#C49A5A] mb-4">
                <Globe size={20} />
              </div>
              <h3 className="font-serif text-base uppercase tracking-wide text-[#1A1011] mb-2">
                Worldwide Shipping
              </h3>
              <p className="text-xs text-[#5C554E] leading-relaxed font-sans">
                <strong>10–15 Business Days</strong> international transit to 50+ countries via DHL Express &amp; FedEx.
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A67C52] mt-5 block border-t border-[#E8D8C8] pt-3">
              Global Couture Access
            </span>
          </div>

          <div className="bg-white border-2 border-[#C49A5A]/50 p-6 rounded-sm shadow-xs flex flex-col justify-between bg-gradient-to-b from-white to-[#FAF7F2] transition-transform hover:-translate-y-0.5">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#221617] border border-[#C49A5A] flex items-center justify-center text-[#C49A5A] mb-4">
                <PackageCheck size={20} />
              </div>
              <h3 className="font-serif text-base uppercase tracking-wide text-[#1A1011] mb-2">
                Complimentary Shipping
              </h3>
              <p className="text-xs text-[#5C554E] leading-relaxed font-sans">
                Free standard shipping on all prepaid domestic orders above <strong>₹4,999</strong>.
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A67C52] mt-5 block border-t border-[#E8D8C8] pt-3">
              Prepaid Orders
            </span>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Article Content */}
          <article className="lg:col-span-8 space-y-8 font-sans text-xs sm:text-sm text-[#5C554E] leading-relaxed">
            
            {/* Section 1 */}
            <section id="sec-dispatch" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">01</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Order Processing &amp; Atelier Preparation
                </h2>
              </div>
              <p className="mb-4">
                Every garment at Aafreen Couture undergoes rigorous quality inspection, steam finishing, and signature protective packaging prior to dispatch:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF7F2] p-4 border border-[#E8D8C8] rounded-xs">
                  <span className="font-serif text-[#1A1011] uppercase tracking-wide block mb-1 text-xs">
                    Ready-to-Ship Pieces
                  </span>
                  <p className="text-xs text-[#5C554E]">
                    Dispatched from our atelier within <strong>1–2 business days</strong> of payment verification.
                  </p>
                </div>
                <div className="bg-[#FAF7F2] p-4 border border-[#E8D8C8] rounded-xs">
                  <span className="font-serif text-[#1A1011] uppercase tracking-wide block mb-1 text-xs">
                    Bespoke &amp; Made-to-Order
                  </span>
                  <p className="text-xs text-[#5C554E]">
                    Handcrafted to your measurements and dispatched within <strong>15–25 business days</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="sec-domestic" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">02</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Domestic Shipping (India)
                </h2>
              </div>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#C49A5A]">
                <li><strong>Delivery Timeline:</strong> 5–7 business days post-dispatch across major metros and tier-2/3 cities.</li>
                <li><strong>Carrier Partners:</strong> Handled by premium air networks (Blue Dart, Delhivery, DTDC).</li>
                <li><strong>Free Shipping:</strong> Complimentary delivery on all prepaid orders exceeding ₹4,999. A flat shipping fee of ₹149 applies to orders below ₹4,999.</li>
                <li><strong>Cash on Delivery (COD):</strong> Available for domestic orders up to ₹50,000 across serviceable pincodes.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="sec-international" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">03</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  International Shipping &amp; Customs Duties
                </h2>
              </div>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#C49A5A]">
                <li><strong>Global Coverage:</strong> We ship worldwide to 50+ countries (USA, UK, Canada, UAE, Australia, Europe, Singapore).</li>
                <li><strong>Transit Timeline:</strong> 10–15 business days via DHL Express and FedEx International Priority.</li>
                <li><strong>Dynamic Freight Calculation:</strong> Shipping costs are calculated at checkout based on destination country and parcel weight.</li>
                <li><strong>Import Tariffs:</strong> Customs duties and local import taxes are governed by the destination country and are payable by the recipient upon customs clearance.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="sec-tracking" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">04</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Real-Time Order Tracking
                </h2>
              </div>
              <p className="mb-3">
                Upon handover to the courier, an automated email and WhatsApp notification with your live tracking AWB will be shared.
              </p>
              <p className="mb-4">
                You can track shipment milestones directly on our tracking portal:
              </p>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-2 bg-[#1A1011] text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-[#C49A5A] hover:text-[#1A1011] transition-colors rounded-xs"
              >
                <span>Track Your Order Live</span>
                <ArrowRight size={13} />
              </Link>
            </section>

            {/* Section 5 */}
            <section id="sec-damaged-shipments" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">05</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Damaged, Tampered or Lost Consignments
                </h2>
              </div>
              <p className="mb-3">
                Every consignment from Aafreen Couture is insured in transit. If your parcel shows visible tampering upon arrival:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-[#C49A5A] mb-4">
                <li>Do not accept open, crushed, or visibly damaged parcels from the delivery executive.</li>
                <li>Notify our team within <strong>48 hours of delivery</strong> with unboxing photographs or video proof.</li>
                <li>We will immediately arrange a priority replacement or full refund.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="sec-refused-delivery" className="bg-[#FAF7F2] border-2 border-[#C49A5A]/50 p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-[#C49A5A] text-[#1A1011] text-xs flex items-center justify-center font-bold font-mono">06</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Doorstep Refusal 100% Refund Guarantee
                </h2>
              </div>
              <p className="mb-3">
                If you choose not to accept delivery and the courier returns the unopened parcel to our atelier intact, we refund <strong>100% of your payment</strong> upon receipt and verification.
              </p>
              <p className="text-xs text-[#5C554E]">
                Refunds are initiated to your original payment method within 24–48 hours of verification and reflect in your account in 5–7 business days.
              </p>
            </section>

            {/* Section 7: Contact */}
            <section id="sec-shipping-support" className="bg-[#221617] text-white border border-[#C49A5A]/40 p-6 sm:p-8 rounded-sm shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#C49A5A] text-[#1A1011] text-xs flex items-center justify-center font-bold font-mono">07</span>
                <h2 className="text-base sm:text-lg font-serif text-[#C49A5A] uppercase tracking-wide">
                  Priority Dispatch &amp; Logistics Desk
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6 font-sans">
                Need urgent express delivery for an upcoming wedding or international event? Connect with our logistics desk:
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
                    <Phone size={13} /> WhatsApp Dispatch Desk
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
                  className="bg-[#C49A5A] text-[#1A1011] hover:bg-white text-[10.5px] font-semibold uppercase tracking-[0.2em] px-5 py-2 transition-colors rounded-xs"
                >
                  Contact Desk →
                </Link>
              </div>
            </section>

          </article>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 hidden lg:block">
            <PolicySidebar toc={TOC} title="Shipping Policy" />
          </div>

        </div>
      </div>
    </main>
  );
}
