import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { PolicySidebar, type TocItem } from '@/features/info/components/PolicySidebar';
import { InfoHeroBanner } from '@/features/info/components/InfoHeroBanner';
import { RefreshCw, ShieldCheck, Video, CheckCircle2, PackageCheck, Mail, Phone, ArrowRight, Clock, AlertCircle, Scissors } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Exchange, Cancellation & Refund Policy | Aafreen Couture',
  description:
    'Official Exchange, Cancellation, and Refund Policy for Aafreen Couture. Learn about eligible exchanges within 7 days, unboxing video recommendations, custom bridal apparel, and our 100% refund on unaccepted parcels.',
};

const TOC: TocItem[] = [
  { id: 'sec-overview', number: '01', title: 'Policy Overview' },
  { id: 'sec-exchange-flow', number: '02', title: '3-Step Exchange Process' },
  { id: 'sec-exchange-policy', number: '03', title: '7-Day Size Exchange' },
  { id: 'sec-custom-bridal', number: '04', title: 'Custom Bridal Alterations' },
  { id: 'sec-unboxing-video', number: '05', title: 'Unboxing Video Advisory' },
  { id: 'sec-ineligible', number: '06', title: 'Non-Exchangeable Items' },
  { id: 'sec-refused-parcels', number: '07', title: '100% Refund on Refused Parcels' },
  { id: 'sec-cancellation', number: '08', title: 'Order Cancellation Windows' },
  { id: 'sec-refund-timelines', number: '09', title: 'Refund Turnaround (5–7 Days)' },
  { id: 'sec-concierge', number: '10', title: 'Contact Customer Concierge' },
];

export default function ReturnsPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#221617]">
      {/* Luxury Editorial Hero */}
      <InfoHeroBanner
        badge="✦ Aafreen Atelier Fitting Protocols"
        title="Exchange &amp; Returns"
        italicTitle="Client Care &amp; Fitting Guarantee"
        subtitle="Dedicated to ensuring every heirloom ensemble fits you flawlessly. Learn about our 7-day size exchanges, complimentary bridal alterations, and full refund guarantees."
        metaInfo="Effective Season 2026 · Compliant with Consumer Protection (E-Commerce) Rules"
      />

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        {/* Visual 3-Card Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className="bg-white border border-[#E8D8C8] p-6 sm:p-7 rounded-xs shadow-[0_4px_16px_rgba(34,22,23,0.03)] flex flex-col justify-between transition-all hover:border-[#C49A5A]/60">
            <div>
              <div className="w-11 h-11 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/40 flex items-center justify-center text-[#C49A5A] mb-4">
                <RefreshCw size={20} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#A67C52] block mb-1">
                Standard Ensembles
              </span>
              <h3 className="font-serif text-lg uppercase tracking-wide text-[#221617] mb-2">
                7-Day Size Exchange
              </h3>
              <p className="text-xs sm:text-[13px] text-[#5C554E] leading-relaxed font-sans">
                Eligible ready-to-wear pieces can be exchanged for size or fit within <strong>7 days of delivery</strong>, provided original tags remain attached.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8D8C8] flex items-center justify-between text-[11px] text-[#8C7A6B]">
              <span>Ready-To-Wear</span>
              <span className="font-semibold text-[#221617]">Free Size Swap</span>
            </div>
          </div>

          <div className="bg-white border border-[#E8D8C8] p-6 sm:p-7 rounded-xs shadow-[0_4px_16px_rgba(34,22,23,0.03)] flex flex-col justify-between transition-all hover:border-[#C49A5A]/60">
            <div>
              <div className="w-11 h-11 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/40 flex items-center justify-center text-[#C49A5A] mb-4">
                <Scissors size={20} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#A67C52] block mb-1">
                Bespoke &amp; Bridal
              </span>
              <h3 className="font-serif text-lg uppercase tracking-wide text-[#221617] mb-2">
                Complimentary Alterations
              </h3>
              <p className="text-xs sm:text-[13px] text-[#5C554E] leading-relaxed font-sans">
                Custom bridal creations tailored to personal body measurements receive <strong>complimentary studio alterations</strong> to achieve a perfect drape.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8D8C8] flex items-center justify-between text-[11px] text-[#8C7A6B]">
              <span>Couture Bridal</span>
              <span className="font-semibold text-[#221617]">Studio Fit Guarantee</span>
            </div>
          </div>

          <div className="bg-white border border-[#C49A5A]/50 p-6 sm:p-7 rounded-xs shadow-[0_4px_16px_rgba(34,22,23,0.04)] flex flex-col justify-between bg-gradient-to-b from-white via-[#FAF7F2]/40 to-white transition-all hover:border-[#C49A5A]">
            <div>
              <div className="w-11 h-11 rounded-full bg-[#221617] border border-[#C49A5A] flex items-center justify-center text-[#C49A5A] mb-4">
                <ShieldCheck size={20} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C49A5A] block mb-1">
                Transparent Assurance
              </span>
              <h3 className="font-serif text-lg uppercase tracking-wide text-[#221617] mb-2">
                100% Refund On Refusal
              </h3>
              <p className="text-xs sm:text-[13px] text-[#5C554E] leading-relaxed font-sans">
                If you choose not to accept delivery and the unopened consignment returns intact, we refund <strong>100% of your payment</strong> upon verification.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8D8C8] flex items-center justify-between text-[11px] text-[#8C7A6B]">
              <span>Unaccepted Parcels</span>
              <span className="font-semibold text-[#221617]">Full Refund</span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Article Content */}
          <article className="lg:col-span-8 space-y-8 font-sans text-xs sm:text-[13px] text-[#5C554E] leading-relaxed">
            {/* Section 1: Overview */}
            <section id="sec-overview" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">01</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Craftsmanship Principle</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    Atelier Policy Overview
                  </h2>
                </div>
              </div>
              <p className="mb-3">
                At <strong>Aafreen Couture By Pearl</strong>, each bridal lehenga, embellished suit, and couture silhouette is handcrafted with pure silks, fine zari, and hundreds of karigari hours. Because these pieces are prepared specifically for each client, we maintain a dedicated size exchange and tailoring policy rather than impersonal bulk returns.
              </p>
              <p>
                Our master tailors and concierge team work closely with you from initial sizing consultation to post-delivery alterations to guarantee you look radiant on your momentous day.
              </p>
            </section>

            {/* Section 2: 3-Step Exchange Process */}
            <section id="sec-exchange-flow" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">02</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Simple Steps</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    3-Step Hassle-Free Exchange Process
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#FAF7F2] p-5 rounded-xs border border-[#E8D8C8] flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#A67C52] mb-1 block">Step 01</span>
                    <h3 className="font-serif text-xs uppercase tracking-wider text-[#221617] mb-1.5 font-semibold">Notify Concierge</h3>
                    <p className="text-[11.5px] text-[#6E6A66] leading-relaxed">
                      Message our team on WhatsApp (<code className="text-[#221617] font-semibold">{siteConfig.phone}</code>) within 7 days of delivery with your order ID.
                    </p>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-5 rounded-xs border border-[#E8D8C8] flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#A67C52] mb-1 block">Step 02</span>
                    <h3 className="font-serif text-xs uppercase tracking-wider text-[#221617] mb-1.5 font-semibold">Reverse Pickup</h3>
                    <p className="text-[11.5px] text-[#6E6A66] leading-relaxed">
                      Our air logistics partner arrives at your doorstep to inspect packaging and collect the parcel securely.
                    </p>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-5 rounded-xs border border-[#E8D8C8] flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#A67C52] mb-1 block">Step 03</span>
                    <h3 className="font-serif text-xs uppercase tracking-wider text-[#221617] mb-1.5 font-semibold">Alteration or Swap</h3>
                    <p className="text-[11.5px] text-[#6E6A66] leading-relaxed">
                      Our master atelier completes the size adjustment or dispatches your replacement piece with priority transit.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: 7-Day Size Exchange */}
            <section id="sec-exchange-policy" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">03</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Ready-To-Wear</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    7-Day Size &amp; Fit Exchange Conditions
                  </h2>
                </div>
              </div>
              <ul className="space-y-3 font-sans">
                <li className="flex items-start gap-3 pb-3 border-b border-[#E8D8C8]/60">
                  <CheckCircle2 size={16} className="text-[#C49A5A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#221617]">Original Condition:</strong> Garments must be unwashed, unworn, and unaltered with all atelier tags and barcode seals attached.
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-[#E8D8C8]/60">
                  <CheckCircle2 size={16} className="text-[#C49A5A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#221617]">Keepsake Packaging:</strong> The item must be repacked in the original keepsake box with heirloom muslin dust cover and accessories.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#C49A5A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#221617]">Single Free Exchange:</strong> The first size exchange on eligible domestic orders carries zero reverse pickup or reshipment charge.
                  </div>
                </li>
              </ul>
            </section>

            {/* Section 4: Custom Bridal Pieces */}
            <section id="sec-custom-bridal" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">04</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Bespoke Couture</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    Custom Made-to-Measure Bridal Garments
                  </h2>
                </div>
              </div>
              <p className="mb-4">
                Ensembles commissioned to bespoke body measurements (such as bridal lehengas with custom blouse necklines, sleeve lengths, and skirt flares) cannot be returned for cash refund, as they cannot be restocked for another client.
              </p>
              <div className="bg-[#FAF7F2] p-5 border-l-3 border-[#C49A5A] rounded-xs space-y-2">
                <span className="font-serif text-[#221617] uppercase tracking-wide block text-xs font-semibold">
                  ✦ Complimentary Atelier Alteration Guarantee
                </span>
                <p className="text-xs text-[#5C554E] leading-relaxed">
                  If your bespoke piece requires micro-adjustments around the bust, waist, or sleeve hem, our studio provides <strong>complimentary alterations within 10 days of delivery</strong>. You may also arrange a virtual fitting with our master drape stylist.
                </p>
              </div>
            </section>

            {/* Section 5: Unboxing Video */}
            <section id="sec-unboxing-video" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">05</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Transit Verification</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    Unboxing Video Advisory
                  </h2>
                </div>
              </div>
              <p className="mb-4">
                To protect against counterfeit swaps and ensure transparent transit insurance claims with air couriers, we encourage clients to record an unboxing video:
              </p>
              <div className="space-y-2.5 bg-[#FAF7F2] p-5 border border-[#E8D8C8] rounded-xs text-xs">
                <div className="flex items-start gap-2.5">
                  <Video size={15} className="text-[#C49A5A] shrink-0 mt-0.5" />
                  <span>Record an uninterrupted 360° video beginning with the sealed outer shipping carton and AWB label.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Video size={15} className="text-[#C49A5A] shrink-0 mt-0.5" />
                  <span>Capture the unbroken security tape before opening the keepsake box.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Video size={15} className="text-[#C49A5A] shrink-0 mt-0.5" />
                  <span>Unbox the garment and inspect embroidery, zips, and trims on camera.</span>
                </div>
              </div>
            </section>

            {/* Section 6: Ineligible Items */}
            <section id="sec-ineligible" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">06</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Exceptions</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    Non-Exchangeable Categories
                  </h2>
                </div>
              </div>
              <p className="mb-3">For hygiene, security, and custom craftsmanship reasons, the following are final sale:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#FAF7F2] p-3.5 border border-[#E8D8C8] rounded-xs">
                  <strong className="text-[#221617] block mb-0.5">Heritage Jewellery:</strong>
                  <span>Earrings, maang tikkas, passas, and necklaces (hygiene protocols).</span>
                </div>
                <div className="bg-[#FAF7F2] p-3.5 border border-[#E8D8C8] rounded-xs">
                  <strong className="text-[#221617] block mb-0.5">Custom Embroidered Bridal:</strong>
                  <span>Personalized monograms, customized blouse silhouettes, dyed-to-order silks.</span>
                </div>
                <div className="bg-[#FAF7F2] p-3.5 border border-[#E8D8C8] rounded-xs">
                  <strong className="text-[#221617] block mb-0.5">Worn or Altered Apparel:</strong>
                  <span>Any item showing perfume, deodorant, stains, or third-party tailoring.</span>
                </div>
                <div className="bg-[#FAF7F2] p-3.5 border border-[#E8D8C8] rounded-xs">
                  <strong className="text-[#221617] block mb-0.5">Final Sale &amp; Sample Pieces:</strong>
                  <span>Items purchased during sample sales marked with final sale tags.</span>
                </div>
              </div>
            </section>

            {/* Section 7: 100% Refund on Refused Parcels */}
            <section id="sec-refused-parcels" className="bg-gradient-to-b from-[#FAF7F2] to-white border-2 border-[#C49A5A]/50 p-6 sm:p-8 rounded-xs shadow-xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#C49A5A] text-[#1A1011] text-xs flex items-center justify-center font-bold font-mono">07</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Full Reimbursement</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    100% Refund On Refused Parcels
                  </h2>
                </div>
              </div>
              <p className="mb-3">
                If you choose not to accept delivery and the air courier returns the unopened package to our atelier intact, we initiate a <strong>100% refund of your payment</strong> upon arrival and intake inspection.
              </p>
              <p className="text-xs text-[#5C554E] leading-relaxed">
                Refunds are processed to your original payment method (Credit card, Debit card, UPI, Netbanking) within 24–48 hours of verification and reflect in your account within 5–7 banking days.
              </p>
            </section>

            {/* Section 8: Cancellation */}
            <section id="sec-cancellation" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">08</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Pre-Dispatch</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    Order Cancellation Windows
                  </h2>
                </div>
              </div>
              <p className="mb-3">
                Orders may be cancelled before handcrafting, fabric cutting, or dispatch commences:
              </p>
              <ul className="space-y-2 font-sans pl-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0 mt-1.5" />
                  <span><strong>Ready-to-Ship Pieces:</strong> Cancellations accepted within <strong>12 hours</strong> of placement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0 mt-1.5" />
                  <span><strong>Custom Bridal Lehengas:</strong> Cancellations accepted within <strong>24 hours</strong> of order placement before raw silk sourcing and karigari frame setup.</span>
                </li>
              </ul>
            </section>

            {/* Section 9: Refund Timelines */}
            <section id="sec-refund-timelines" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-2xs scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8D8C8]">
                <span className="w-7 h-7 rounded-full bg-[#221617] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">09</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C52] font-semibold block">Banking Turnaround</span>
                  <h2 className="text-base sm:text-lg font-serif text-[#221617] uppercase tracking-wide">
                    Refund Turnaround Timelines (5–7 Days)
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="bg-[#FAF7F2] p-4 rounded-xs border border-[#E8D8C8]">
                  <strong className="text-[#221617] block mb-1">UPI &amp; Wallets:</strong>
                  <span className="text-[#6E6A66]">Reflects within 24–48 banking hours.</span>
                </div>
                <div className="bg-[#FAF7F2] p-4 rounded-xs border border-[#E8D8C8]">
                  <strong className="text-[#221617] block mb-1">Cards &amp; Netbanking:</strong>
                  <span className="text-[#6E6A66]">Reflects within 5–7 business days per bank cycles.</span>
                </div>
                <div className="bg-[#FAF7F2] p-4 rounded-xs border border-[#E8D8C8]">
                  <strong className="text-[#221617] block mb-1">COD Orders:</strong>
                  <span className="text-[#6E6A66]">Reimbursed via direct NEFT/IMPS bank transfer.</span>
                </div>
              </div>
            </section>

            {/* Section 10: Concierge Support */}
            <section id="sec-concierge" className="bg-[#221617] text-white border border-[#C49A5A]/40 p-6 sm:p-8 rounded-xs shadow-md scroll-mt-36">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                <span className="w-7 h-7 rounded-full bg-[#C49A5A] text-[#1A1011] text-xs flex items-center justify-center font-bold font-mono">10</span>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C49A5A] font-semibold block">Direct Assistance</span>
                  <h2 className="text-base sm:text-lg font-serif text-white uppercase tracking-wide">
                    Contact Atelier Fitting Concierge
                  </h2>
                </div>
              </div>
              <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed mb-6 font-sans">
                Need to discuss size alterations, exchange eligibility, or verify parcel tracking with our master stylists?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-white/5 p-4 rounded-xs border border-white/10">
                  <p className="text-[#C49A5A] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail size={13} /> Concierge Email
                  </p>
                  <a href={`mailto:${siteConfig.email}`} className="text-white hover:text-[#C49A5A] transition-colors font-sans">
                    {siteConfig.email}
                  </a>
                </div>

                <div className="bg-white/5 p-4 rounded-xs border border-white/10">
                  <p className="text-[#C49A5A] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone size={13} /> Phone &amp; WhatsApp Concierge
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
            <PolicySidebar toc={TOC} title="Returns Policy Navigation" />
          </div>
        </div>
      </div>
    </main>
  );
}
