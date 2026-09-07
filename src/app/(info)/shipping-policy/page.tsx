import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { PolicySidebar, type TocItem } from '@/features/info/components/PolicySidebar';
import { InfoHeroBanner } from '@/features/info/components/InfoHeroBanner';
import { Truck, Globe, PackageCheck, Clock, Mail, Phone, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Aafreen Couture',
  description:
    'Official Shipping & Delivery Policy for Aafreen Couture. Learn about domestic delivery timelines (5–7 days), international shipping to 50+ countries, free shipping thresholds, and real-time tracking.',
};

const TOC: TocItem[] = [
  { id: 'sec-pipeline', number: '01', title: 'Atelier Transit Pipeline' },
  { id: 'sec-dispatch', number: '02', title: 'Preparation & Dispatch' },
  { id: 'sec-domestic', number: '03', title: 'Domestic Delivery (Pan-India)' },
  { id: 'sec-international', number: '04', title: 'International Shipping' },
  { id: 'sec-tracking', number: '05', title: 'Real-Time Order Tracking' },
  { id: 'sec-damaged-shipments', number: '06', title: 'Damaged & Lost Protection' },
  { id: 'sec-refused-delivery', number: '07', title: 'Doorstep Refusal Refund' },
  { id: 'sec-shipping-support', number: '08', title: 'Logistics Concierge Desk' },
];

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#221617]">
      {/* Luxury Editorial Hero */}
      <InfoHeroBanner
        badge="✦ Aafreen Atelier Transit Protocols"
        title="Shipping &amp; Delivery"
        italicTitle="Global Logistics &amp; Care"
        subtitle="Delivering handcrafted Indian bridal couture with 100% transit insurance, white-glove packaging, and live milestone updates across India and 50+ countries."
        metaInfo="Effective Season 2026 · Compliant with Indian E-Commerce Consumer Protection Rules"
      />

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        {/* Visual 3-Card Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className="bg-white border border-[#E8D8C8] p-6 sm:p-7 rounded-xs shadow-[0_4px_16px_rgba(34,22,23,0.03)] flex flex-col justify-between transition-all hover:border-[#C49A5A]/60">
            <div>
              <div className="w-11 h-11 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/40 flex items-center justify-center text-[#C49A5A] mb-4">
                <Truck size={20} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#A67C52] block mb-1">
                Pan-India Express
              </span>
              <h3 className="font-serif text-lg uppercase tracking-wide text-[#221617] mb-2">
                Domestic Delivery
              </h3>
              <p className="text-xs sm:text-[13px] text-[#5C554E] leading-relaxed font-sans">
                <strong>5–7 Business Days</strong> across all serviceable Indian pincodes via Blue Dart, Delhivery, and express air networks.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8D8C8] flex items-center justify-between text-[11px] text-[#8C7A6B]">
              <span>Air Cargo Insured</span>
              <span className="font-semibold text-[#221617]">100% Covered</span>
            </div>
          </div>

          <div className="bg-white border border-[#E8D8C8] p-6 sm:p-7 rounded-xs shadow-[0_4px_16px_rgba(34,22,23,0.03)] flex flex-col justify-between transition-all hover:border-[#C49A5A]/60">
            <div>
              <div className="w-11 h-11 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/40 flex items-center justify-center text-[#C49A5A] mb-4">
                <Globe size={20} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#A67C52] block mb-1">
                50+ Global Destinations
              </span>
              <h3 className="font-serif text-lg uppercase tracking-wide text-[#221617] mb-2">
                Worldwide Shipping
              </h3>
              <p className="text-xs sm:text-[13px] text-[#5C554E] leading-relaxed font-sans">
                <strong>10–15 Business Days</strong> international transit via DHL Express &amp; FedEx Priority across USA, UK, Canada, UAE, and Europe.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8D8C8] flex items-center justify-between text-[11px] text-[#8C7A6B]">
              <span>Global Couriers</span>
              <span className="font-semibold text-[#221617]">DHL &amp; FedEx</span>
            </div>
          </div>

          <div className="bg-white border border-[#C49A5A]/50 p-6 sm:p-7 rounded-xs shadow-[0_4px_16px_rgba(34,22,23,0.04)] flex flex-col justify-between bg-gradient-to-b from-white via-[#FAF7F2]/40 to-white transition-all hover:border-[#C49A5A]">
            <div>
              <div className="w-11 h-11 rounded-full bg-[#221617] border border-[#C49A5A] flex items-center justify-center text-[#C49A5A] mb-4">
                <PackageCheck size={20} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C49A5A] block mb-1">
                Order Value Threshold
              </span>
              <h3 className="font-serif text-lg uppercase tracking-wide text-[#221617] mb-2">
                Complimentary Shipping
              </h3>
              <p className="text-xs sm:text-[13px] text-[#5C554E] leading-relaxed font-sans">
                Free standard insured shipping on all domestic orders above <strong>₹5,000</strong>. Flat ₹149 for orders below ₹5,000.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8D8C8] flex items-center justify-between text-[11px] text-[#8C7A6B]">
              <span>Domestic Prepaid</span>
              <span className="font-semibold text-[#221617]">Auto-Applied</span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Article Content */}
          <article className="lg:col-span-8 space-y-8 font-sans text-xs sm:text-[13px] text-[#5C554E] leading-relaxed">
            {/* Section 1: Visual Transit Pipeline */}
            <section id="sec-pipeline" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">01</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Transit Journey</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    Atelier Preparation &amp; Transit Pipeline
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { step: '01', title: 'Atelier Tailoring', desc: 'Handcrafted by karigars, steam finished & measured' },
                  { step: '02', title: '48-Point QC', desc: 'Seams, embroidery, zips & fabrics rigorously audited' },
                  { step: '03', title: 'Keepsake Pack', desc: 'Encased in breathable heirloom muslin with moisture barrier' },
                  { step: '04', title: 'Insured Delivery', desc: 'Dispatched via express air network with OTP handover' },
                ].map((s) => (
                  <div key={s.step} className="bg-[#FAF7F2] p-4 rounded-xs border border-[#E8D8C8] flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#A67C52] mb-1 block">{s.step}</span>
                      <h3 className="font-serif text-xs uppercase tracking-wider text-[#221617] mb-1">{s.title}</h3>
                      <p className="text-[11px] text-[#6E6A66] leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2 */}
            <section id="sec-dispatch" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">02</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Crafting Windows</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    Processing Timelines by Garment Type
                  </h2>
                </div>
              </div>
              <p className="mb-4">
                Every creation at Aafreen Couture is individually prepared to order. Depending on whether your ensemble is a curated unstitched suit, ready-to-ship silhouette, or custom bespoke bridal lehenga, dispatch timelines vary:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF7F2] p-5 border border-[#E8D8C8] rounded-xs">
                  <span className="font-serif text-[#221617] uppercase tracking-wide block mb-1.5 text-xs font-semibold">
                    Ready-to-Wear &amp; Unstitched Suits
                  </span>
                  <p className="text-xs text-[#5C554E] leading-relaxed">
                    Undergoes final press, verification, and signature packaging. Handed over to air couriers within <strong>1–2 business days</strong> of confirmed payment.
                  </p>
                </div>
                <div className="bg-[#FAF7F2] p-5 border border-[#E8D8C8] rounded-xs">
                  <span className="font-serif text-[#221617] uppercase tracking-wide block mb-1.5 text-xs font-semibold">
                    Bespoke Bridal &amp; Custom Sized
                  </span>
                  <p className="text-xs text-[#5C554E] leading-relaxed">
                    Individually hand-embroidered and customized to your exact posture measurements. Dispatched within <strong>15–25 business days</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="sec-domestic" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">03</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">India Delivery</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    Domestic Shipping Rules &amp; Timelines
                  </h2>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b border-[#E8D8C8]/60">
                  <CheckCircle2 size={16} className="text-[#C49A5A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#221617]">Delivery Duration:</strong> 5–7 business days post-dispatch across Indian state capitals, tier-1 metros, and tier-2/3 cities.
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-[#E8D8C8]/60">
                  <CheckCircle2 size={16} className="text-[#C49A5A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#221617]">Carrier Air Express:</strong> Handled by Blue Dart Express, Delhivery Air, and DTDC Express Air with insured transit.
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-[#E8D8C8]/60">
                  <CheckCircle2 size={16} className="text-[#C49A5A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#221617]">Free Shipping:</strong> Complimentary standard shipping on all prepaid orders exceeding ₹5,000. Flat ₹149 delivery applies to domestic orders below ₹5,000.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#C49A5A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#221617]">Cash on Delivery (COD):</strong> Available for orders up to ₹50,000 across all verified domestic delivery pincodes.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="sec-international" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">04</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Global Shipments</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    International Shipping &amp; Customs Duties
                  </h2>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 pb-3 border-b border-[#E8D8C8]/60">
                  <Globe size={16} className="text-[#C49A5A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#221617]">Worldwide Coverage:</strong> We ship to 50+ countries including the USA, Canada, United Kingdom, UAE, Saudi Arabia, Australia, New Zealand, and the European Union.
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-[#E8D8C8]/60">
                  <Clock size={16} className="text-[#C49A5A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#221617]">Transit Window:</strong> 10–15 business days via DHL Express Priority and FedEx International.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-[#A67C52] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#221617]">Customs Duties &amp; Taxes:</strong> Cross-border import duties and value-added taxes (VAT) are assessed by the destination country&apos;s customs authorities and are payable directly by the recipient upon clearance.
                  </div>
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="sec-tracking" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">05</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Live Tracking</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    Real-Time Order Tracking &amp; AWB
                  </h2>
                </div>
              </div>
              <p className="mb-4">
                The moment your package is verified and collected by our air logistics partner, an automated SMS and WhatsApp update with your live tracking AWB link is generated:
              </p>
              <div className="p-5 bg-[#FAF7F2] border border-[#E8D8C8] rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#221617] text-xs">Have an active order number?</p>
                  <p className="text-[11.5px] text-[#6E6A66] mt-0.5">Track live milestones on our dedicated portal with zero hassle.</p>
                </div>
                <Link
                  href="/track-order"
                  className="inline-flex items-center gap-2 bg-[#221617] text-[#C49A5A] hover:bg-[#3D2628] hover:text-[#FAF7F2] text-[11px] font-semibold tracking-[0.2em] uppercase px-5 py-2.5 transition-all rounded-xs shrink-0 shadow-xs"
                >
                  <span>Track Order Live</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </section>

            {/* Section 6 */}
            <section id="sec-damaged-shipments" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">06</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Protection</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    Damaged, Tampered, or Lost Consignments
                  </h2>
                </div>
              </div>
              <p className="mb-3">
                Every consignment from Aafreen Couture carries 100% transit insurance. To ensure rapid claim processing:
              </p>
              <ul className="space-y-2.5 pl-2 font-sans">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0 mt-1.5" />
                  <span>Do not accept visibly tampered, open, or severely crushed outer shipping cartons from courier personnel.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0 mt-1.5" />
                  <span>Notify our concierge within <strong>48 hours of delivery</strong> with unboxing photographs or uninterrupted video footage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0 mt-1.5" />
                  <span>Our atelier will immediately organize priority recreation, alterations, or a 100% full refund.</span>
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="sec-refused-delivery" className="bg-gradient-to-b from-[#FAF7F2] to-white border-2 border-[#C49A5A]/50 p-6 sm:p-8 rounded-xs shadow-xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#C49A5A] text-[#1A1011] text-xs flex items-center justify-center font-bold font-mono">07</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Doorstep Guarantee</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    Doorstep Refusal 100% Refund Guarantee
                  </h2>
                </div>
              </div>
              <p className="mb-3">
                If you choose not to accept delivery and the courier returns the unopened parcel intact to our atelier, we initiate a <strong>100% refund of your payment</strong> upon arrival and intake inspection.
              </p>
              <p className="text-xs text-[#5C554E] leading-relaxed">
                Refunds are processed back to your original source of payment within 24–48 hours of verification and reflect in your account within 5–7 banking days.
              </p>
            </section>

            {/* Section 8: Concierge Support */}
            <section id="sec-shipping-support" className="bg-[#221617] text-white border border-[#C49A5A]/40 p-6 sm:p-8 rounded-xs shadow-md scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                <span className="w-7 h-7 rounded-full bg-[#C49A5A] text-[#1A1011] text-xs flex items-center justify-center font-bold font-mono">08</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C49A5A] font-semibold block">Direct Concierge</span>
                  <h2 className="text-base sm:text-lg font-serif text-white uppercase tracking-wide">
                    Priority Dispatch &amp; Logistics Desk
                  </h2>
                </div>
              </div>
              <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed mb-6 font-sans">
                Need express delivery coordination for an upcoming wedding or international celebration? Connect with our dedicated logistics desk:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-white/5 p-4 rounded-xs border border-white/10">
                  <p className="text-[#C49A5A] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail size={13} /> Support Email
                  </p>
                  <a href={`mailto:${siteConfig.email}`} className="text-white hover:text-[#C49A5A] transition-colors font-sans">
                    {siteConfig.email}
                  </a>
                </div>

                <div className="bg-white/5 p-4 rounded-xs border border-white/10">
                  <p className="text-[#C49A5A] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone size={13} /> Phone &amp; WhatsApp Desk
                  </p>
                  <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C49A5A] transition-colors font-sans">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 font-sans">
                <p>Aafreen Couture By Pearl · Amritsar, Punjab — 143001</p>
                <Link
                  href="/contact"
                  className="bg-[#C49A5A] text-[#1A1011] hover:bg-[#FAF7F2] text-[10.5px] font-semibold uppercase tracking-[0.2em] px-5 py-2 transition-all rounded-xs shrink-0 shadow-xs"
                >
                  Contact Desk →
                </Link>
              </div>
            </section>
          </article>

          {/* Sticky Table of Contents Sidebar */}
          <div className="lg:col-span-4 hidden lg:block">
            <PolicySidebar toc={TOC} title="Shipping Policy Navigation" />
          </div>
        </div>
      </div>
    </main>
  );
}
