import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { cmsRepository } from '@/server/repositories/cms.repository';
import { PolicySidebar, type TocItem } from '@/features/info/components/PolicySidebar';
import { InfoHeroBanner } from '@/features/info/components/InfoHeroBanner';
import { Truck, Globe, PackageCheck, Clock, Mail, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy',
  description:
    'Discover shipping timelines, delivery charges, worldwide express transit, secure packaging, and live order tracking details at Aafreen Couture.',
  alternates: { canonical: `${siteConfig.url}/shipping-policy` },
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

export default async function ShippingPolicyPage() {
  const cms = await cmsRepository.findBySlug('shipping-policy');
  return (
    <div className="min-h-dvh bg-background text-heading">
      {/* Luxury Editorial Hero */}
      <InfoHeroBanner
        badge={cms?.heroBadge ?? 'Aafreen Atelier Transit Protocols'}
        title={cms?.heroTitle ?? 'Shipping & Delivery'}
        italicTitle={cms?.heroItalicTitle ?? 'Global Logistics & Care'}
        subtitle={
          cms?.heroSubtitle ??
          'Delivering handcrafted Indian bridal couture with white-glove packaging and live milestone updates across India and 50+ countries.'
        }
        metaInfo={cms?.heroMetaInfo ?? 'Effective Season 2026 · Compliant with Indian E-Commerce Consumer Protection Rules'}
      />

      {/* Main Container */}
      <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        {/* Visual 3-Card Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className="bg-white p-6 sm:p-7 rounded-xl shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
            <div>
              <div className="w-11 h-11 rounded-full bg-background border border-gold/40 flex items-center justify-center text-gold-ink mb-4">
                <Truck size="1.25rem" />
              </div>
              <span className="text-[0.625rem] uppercase tracking-[0.25em] font-semibold text-gold-ink block mb-1">
                Pan-India Express
              </span>
              <h3 className="font-serif font-semibold text-lg text-heading mb-2">
                Domestic Delivery
              </h3>
              <p className="text-sm sm:text-base text-text leading-relaxed font-sans">
                <strong>5–7 Business Days</strong> across all serviceable Indian pincodes via Blue Dart, Delhivery, and express air networks.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-[0.6875rem] text-text">
              <span>Courier partners</span>
              <span className="font-semibold text-heading">Blue Dart &amp; Delhivery</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-xl shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
            <div>
              <div className="w-11 h-11 rounded-full bg-background border border-gold/40 flex items-center justify-center text-gold-ink mb-4">
                <Globe size="1.25rem" />
              </div>
              <span className="text-[0.625rem] uppercase tracking-[0.25em] font-semibold text-gold-ink block mb-1">
                50+ Global Destinations
              </span>
              <h3 className="font-serif font-semibold text-lg text-heading mb-2">
                Worldwide Shipping
              </h3>
              <p className="text-sm sm:text-base text-text leading-relaxed font-sans">
                <strong>10–15 Business Days</strong> international transit via DHL Express &amp; FedEx Priority across USA, UK, Canada, UAE, and Europe.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-[0.6875rem] text-text">
              <span>Global Couriers</span>
              <span className="font-semibold text-heading">DHL &amp; FedEx</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-xl shadow-md flex flex-col justify-between bg-gradient-to-b from-white via-background/40 to-white transition-all hover:shadow-lg">
            <div>
              <div className="w-11 h-11 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold-ink mb-4">
                <PackageCheck size="1.25rem" />
              </div>
              <span className="text-[0.625rem] uppercase tracking-[0.25em] font-semibold text-gold-ink block mb-1">
                Delivery Charges
              </span>
              <h3 className="font-serif font-semibold text-lg text-heading mb-2">
                Delivery Charges
              </h3>
              <p className="text-sm sm:text-base text-text leading-relaxed font-sans">
                Delivery charges are applicable on all orders and are shown to you before you pay. The charge depends on your delivery location and the order.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-[0.6875rem] text-text">
              <span>Domestic Prepaid</span>
              <span className="font-semibold text-heading">Auto-Applied</span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Article Content */}
          <article className="lg:col-span-8 space-y-8 font-sans text-sm sm:text-base text-text leading-relaxed">
            {/* Section 1: Visual Transit Pipeline */}
            <section id="sec-pipeline" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">01</span>
                <div>
                  <span className="text-[0.625rem] uppercase tracking-[0.25em] text-gold-ink font-semibold block">Transit Journey</span>
                  <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                    Atelier Preparation &amp; Transit Pipeline
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { step: '01', title: 'Atelier Tailoring', desc: 'Handcrafted by karigars, steam finished & measured' },
                  { step: '02', title: '48-Point QC', desc: 'Seams, embroidery, zips & fabrics rigorously audited' },
                  { step: '03', title: 'Keepsake Pack', desc: 'Encased in breathable heirloom muslin with moisture barrier' },
                  { step: '04', title: 'Express Delivery', desc: 'Dispatched via express air network with OTP handover' },
                ].map((s) => (
                  <div key={s.step} className="bg-background p-4 rounded-lg border border-border flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-gold-ink mb-1 block">{s.step}</span>
                      <h3 className="font-serif font-semibold text-xs text-heading mb-1">{s.title}</h3>
                      <p className="text-[0.6875rem] text-text leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2 */}
            <section id="sec-dispatch" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">02</span>
                <div>
                  <span className="text-[0.625rem] uppercase tracking-[0.25em] text-gold-ink font-semibold block">Crafting Windows</span>
                  <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                    Processing Timelines by Garment Type
                  </h2>
                </div>
              </div>
              <p className="mb-4">
                Every creation at Aafreen Couture is individually prepared to order. Depending on whether your ensemble is a curated unstitched suit, ready-to-ship silhouette, or custom bespoke bridal lehenga, dispatch timelines vary:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-background p-5 border border-border rounded-lg">
                  <span className="font-sans text-heading block mb-1.5 text-xs font-semibold">
                    Ready-to-Wear &amp; Unstitched Suits
                  </span>
                  <p className="text-xs text-text leading-relaxed">
                    Undergoes final press, verification, and signature packaging. Handed over to air couriers within <strong>1–2 business days</strong> of confirmed payment.
                  </p>
                </div>
                <div className="bg-background p-5 border border-border rounded-lg">
                  <span className="font-sans text-heading block mb-1.5 text-xs font-semibold">
                    Bespoke Bridal &amp; Custom Sized
                  </span>
                  <p className="text-xs text-text leading-relaxed">
                    Individually hand-embroidered and customized to your exact posture measurements. Dispatched within <strong>15–25 business days</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="sec-domestic" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">03</span>
                <div>
                  <span className="text-[0.625rem] uppercase tracking-[0.25em] text-gold-ink font-semibold block">India Delivery</span>
                  <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                    Domestic Shipping Rules &amp; Timelines
                  </h2>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b border-border/60">
                  <CheckCircle2 size="1rem" className="text-gold-ink shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-heading">Delivery Duration:</strong> 5–7 business days post-dispatch across Indian state capitals, tier-1 metros, and tier-2/3 cities.
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-border/60">
                  <CheckCircle2 size="1rem" className="text-gold-ink shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-heading">Carrier Air Express:</strong> Handled by Blue Dart Express, Delhivery Air, and DTDC Express Air.
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-border/60">
                  <CheckCircle2 size="1rem" className="text-gold-ink shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-heading">Delivery Charges:</strong> Delivery charges are applicable on domestic orders and are displayed before payment.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size="1rem" className="text-gold-ink shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-heading">Cash on Delivery (COD):</strong> Available for orders up to ₹50,000 across all verified domestic delivery pincodes.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="sec-international" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">04</span>
                <div>
                  <span className="text-[0.625rem] uppercase tracking-[0.25em] text-gold-ink font-semibold block">Global Shipments</span>
                  <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                    International Shipping &amp; Customs Duties
                  </h2>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 pb-3 border-b border-border/60">
                  <Globe size="1rem" className="text-gold-ink shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-heading">Worldwide Coverage:</strong> We ship to 50+ countries including the USA, Canada, United Kingdom, UAE, Saudi Arabia, Australia, New Zealand, and the European Union.
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-border/60">
                  <Clock size="1rem" className="text-gold-ink shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-heading">Transit Window:</strong> 10–15 business days via DHL Express Priority and FedEx International.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle size="1rem" className="text-gold-ink shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-heading">Customs Duties &amp; Taxes:</strong> Cross-border import duties and value-added taxes (VAT) are assessed by the destination country&apos;s customs authorities and are payable directly by the recipient upon clearance.
                  </div>
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="sec-tracking" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">05</span>
                <div>
                  <span className="text-[0.625rem] uppercase tracking-[0.25em] text-gold-ink font-semibold block">Live Tracking</span>
                  <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                    Real-Time Order Tracking &amp; AWB
                  </h2>
                </div>
              </div>
              <p className="mb-4">
                The moment your package is verified and collected by our air logistics partner, an automated SMS and WhatsApp update with your live tracking AWB link is generated:
              </p>
            </section>

            {/* Section 6 */}
            <section id="sec-damaged-shipments" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">06</span>
                <div>
                  <span className="text-[0.625rem] uppercase tracking-[0.25em] text-gold-ink font-semibold block">Protection</span>
                  <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                    Damaged, Tampered, or Lost Consignments
                  </h2>
                </div>
              </div>
              <p className="mb-3">
                If your parcel arrives damaged, tampered with, or goes missing, the following helps us process your claim quickly:
              </p>
              <ul className="space-y-2.5 pl-2 font-sans">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0 mt-1.5" />
                  <span>Do not accept visibly tampered, open, or severely crushed outer shipping cartons from courier personnel.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0 mt-1.5" />
                  <span>Notify our concierge within <strong>48 hours of delivery</strong> with unboxing photographs or uninterrupted video footage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0 mt-1.5" />
                  <span>Our atelier will immediately organize priority recreation, alterations, or a 100% full refund.</span>
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="sec-refused-delivery" className="bg-gradient-to-b from-background to-white p-6 sm:p-8 rounded-2xl shadow-md scroll-mt-36">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
                <span className="w-7 h-7 rounded-full bg-gold text-heading text-xs flex items-center justify-center font-bold font-mono">07</span>
                <div>
                  <span className="text-[0.625rem] uppercase tracking-[0.25em] text-gold-ink font-semibold block">Doorstep Guarantee</span>
                  <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                    Doorstep Refusal 100% Refund Guarantee
                  </h2>
                </div>
              </div>
              <p className="mb-3">
                If you choose not to accept delivery and the courier returns the unopened parcel intact to our atelier, we initiate a <strong>100% refund of your payment</strong> upon arrival and intake inspection.
              </p>
              <p className="text-xs text-text leading-relaxed">
                Refunds are processed back to your original source of payment within 24–48 hours of verification and reflect in your account within 5–7 banking days.
              </p>
            </section>

            {/* Section 8: Concierge Support */}
            <section id="sec-shipping-support" className="bg-navbar text-heading border border-border border-t-2 border-t-gold p-6 sm:p-8 rounded-2xl scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <span className="w-7 h-7 rounded-full bg-gold text-heading text-xs flex items-center justify-center font-bold font-mono">08</span>
                <div>
                  <span className="text-[0.625rem] uppercase tracking-[0.25em] text-gold-ink font-semibold block">Direct Concierge</span>
                  <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                    Priority Dispatch &amp; Logistics Desk
                  </h2>
                </div>
              </div>
              <p className="text-xs sm:text-[0.8125rem] text-text leading-relaxed mb-6 font-sans">
                Need express delivery coordination for an upcoming wedding or international celebration? Connect with our dedicated logistics desk:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-surface p-4 rounded-lg border border-border">
                  <p className="text-gold-ink font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail size="0.8125rem" /> Support Email
                  </p>
                  <a href={`mailto:${siteConfig.email}`} className="text-heading hover:text-gold-ink transition-colors font-sans">
                    {siteConfig.email}
                  </a>
                </div>

                <div className="bg-surface p-4 rounded-lg border border-border">
                  <p className="text-gold-ink font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone size="0.8125rem" /> Phone &amp; WhatsApp Desk
                  </p>
                  <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-heading hover:text-gold-ink transition-colors font-sans">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text/80 font-sans">
                <p>Aafreen Couture By Pearl · Amritsar, Punjab — 143001</p>
                <Link
                  href="/contact"
                  className="bg-gold text-heading hover:bg-gold-hover text-[0.65625rem] font-semibold uppercase tracking-[0.2em] px-5 py-2 transition-all rounded-lg shrink-0 shadow-xs"
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
    </div>
  );
}
