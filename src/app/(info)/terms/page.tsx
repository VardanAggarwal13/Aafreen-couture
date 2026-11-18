import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { cmsRepository } from '@/server/repositories/cms.repository';
import { PolicySidebar, type TocItem } from '@/features/info/components/PolicySidebar';
import { InfoHeroBanner } from '@/features/info/components/InfoHeroBanner';
import { Scale, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions of Service',
  description:
    'Read the official Terms & Conditions governing orders, custom apparel, payments, intellectual property, and services at Aafreen Couture.',
  alternates: { canonical: `${siteConfig.url}/terms` },
};

const TOC: TocItem[] = [
  { id: 'sec-about', number: '01', title: 'About Aafreen Couture' },
  { id: 'sec-product-info', number: '02', title: 'Product Info & Variations' },
  { id: 'sec-availability', number: '03', title: 'Availability & Acceptance' },
  { id: 'sec-pricing', number: '04', title: 'Pricing & Taxes (INR)' },
  { id: 'sec-orders', number: '05', title: 'Placing an Order' },
  { id: 'sec-payments', number: '06', title: 'Payments & Gateway Security' },
  { id: 'sec-custom', number: '07', title: 'Custom & Made-to-Order' },
  { id: 'sec-measurements', number: '08', title: 'Measurements & Fittings' },
  { id: 'sec-cancellation', number: '09', title: 'Order Cancellation' },
  { id: 'sec-returns', number: '10', title: 'Returns & Exchange Terms' },
  { id: 'sec-damaged', number: '11', title: 'Damaged or Incorrect Items' },
  { id: 'sec-shipping', number: '12', title: 'Shipping & Customer Duty' },
  { id: 'sec-ip', number: '13', title: 'Intellectual Property & Use' },
  { id: 'sec-liability', number: '14', title: 'Liability & Force Majeure' },
  { id: 'sec-law', number: '15', title: 'Governing Law (India)' },
  { id: 'sec-contact', number: '16', title: 'Contact & Grievances' },
];

export default async function TermsPage() {
  const cms = await cmsRepository.findBySlug('terms');
  return (
    <div className="min-h-dvh bg-background text-heading">
      {/* Luxury Editorial Hero */}
      <InfoHeroBanner
        badge={cms?.heroBadge ?? 'Legal & Compliance Hub'}
        title={cms?.heroTitle ?? 'Terms & Conditions'}
        italicTitle={cms?.heroItalicTitle ?? 'Atelier Service Principles'}
        subtitle={
          cms?.heroSubtitle ??
          'These Terms & Conditions govern your use of our boutique website, bespoke made-to-order bridal couture, and international orders.'
        }
        metaInfo={cms?.heroMetaInfo ?? 'Effective Season 2026 · Compliant with the Information Technology Act & Consumer Protection Rules, India'}
      />

      {/* Main Container with 2-Column Responsive Layout */}
      <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Article Content */}
          <article className="lg:col-span-8 space-y-8 font-sans text-sm sm:text-base text-text leading-relaxed">
            
            {/* Agreement Notice Box */}
            <div className="bg-white border-l-4 border-l-gold p-6 sm:p-7 rounded-2xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-background border border-gold/30 flex items-center justify-center text-gold-ink shrink-0">
                  <Scale size="1.25rem" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                    User Agreement &amp; Acceptance
                  </h2>
                  <p>
                    By accessing our website (<strong>aafreen-couture.com</strong>), placing an order, scheduling a bridal appointment, or engaging our bespoke atelier services, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms &amp; Conditions.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <section id="sec-about" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">01</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  About Aafreen Couture
                </h2>
              </div>
              <p className="mb-3">
                Aafreen Couture is an Indian luxury couture and bridal brand specializing in handcrafted lehengas, bespoke suits, designer shararas, and authentic artisanal accessories.
              </p>
              <p>
                All product imagery, descriptions, fabric compositions, embroidery details, availability, and pricing displayed across our channels are provided for general customer guidance and may be updated periodically to maintain quality standards.
              </p>
            </section>

            {/* Section 2 */}
            <section id="sec-product-info" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">02</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Product Information &amp; Artisanal Variations
                </h2>
              </div>
              <p className="mb-4">
                We make every reasonable effort to accurately display the true colors, textures, and silhouettes of our garments. However, slight variations are an intrinsic hallmark of handcrafted luxury:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-gold-ink">
                <li><strong>Display Calibration:</strong> Variations across device screens, color gamuts, and ambient viewing brightness.</li>
                <li><strong>Artisanal Handwork:</strong> Nuances in hand zardozi, dabka, resham, gota patti, and stone embellishments crafted by master karigars.</li>
                <li><strong>Textile Characteristics:</strong> Natural weave textures in pure silks, handloom organza, velvet, and georgette.</li>
                <li><strong>Artisanal Dyeing:</strong> Subtle batch variations in natural vegetable or hand-dyed fabric vats.</li>
              </ul>
              <div className="mt-4 p-3 bg-background border-l-2 border-gold text-xs text-text">
                <em>Note: Such minor handcrafted variations reflect authentic human craftsmanship and do not constitute manufacturing defects.</em>
              </div>
            </section>

            {/* Section 3 */}
            <section id="sec-availability" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">03</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Product Availability &amp; Order Acceptance
                </h2>
              </div>
              <p className="mb-3">
                All collections are subject to stock and artisan availability. Aafreen Couture reserves the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-gold-ink mb-4">
                <li>Limit order quantities per client or household</li>
                <li>Discontinue specific fabrics, collections, or motifs without prior notification</li>
                <li>Correct clerical, typographic, or pricing errors before order processing</li>
                <li>Refuse or cancel an order in instances of unauthorized or suspicious activity</li>
              </ul>
              <p>
                If an order is cancelled by Aafreen Couture after payment has been verified, 100% of the amount received will be refunded through the original payment method.
              </p>
            </section>

            {/* Section 4 */}
            <section id="sec-pricing" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">04</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Pricing &amp; Applicable Taxes (INR)
                </h2>
              </div>
              <p className="mb-3">
                All prices on our domestic store are denominated in <strong>Indian Rupees (INR)</strong> and are inclusive of Goods and Services Tax (GST), unless specified otherwise during international checkout.
              </p>
              <p>
                The final payable amount will include the agreed garment cost, any requested custom modification surcharges, and applicable delivery fees clearly summarized prior to payment completion.
              </p>
            </section>

            {/* Section 5 */}
            <section id="sec-orders" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">05</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Placing an Order &amp; Accuracy of Information
                </h2>
              </div>
              <p className="mb-3">
                When completing an order, you agree to supply authentic, current, and complete personal, delivery, and contact information.
              </p>
              <p>
                You will receive an electronic confirmation receipt via Email, SMS, or WhatsApp upon successful placement. Aafreen Couture reserves the right to verify customer details prior to dispatching high-value bridal ensembles.
              </p>
            </section>

            {/* Section 6 */}
            <section id="sec-payments" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">06</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Payment Processing &amp; Gateway Security (Razorpay)
                </h2>
              </div>
              <p className="mb-4">
                Orders must be prepaid at checkout (or confirmed via authorized advance/COD terms where available). We partner with RBI-regulated payment aggregator <strong>Razorpay</strong> to process transactions securely:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-background p-4 border border-border rounded-lg">
                  <span className="font-semibold text-heading block mb-1">Supported Modes</span>
                  <p className="text-xs text-text">Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), UPI (GPay, PhonePe, Paytm), Netbanking, and Wallets.</p>
                </div>
                <div className="bg-background p-4 border border-border rounded-lg">
                  <span className="font-semibold text-heading block mb-1">PCI-DSS 256-Bit SSL</span>
                  <p className="text-xs text-text">Zero card storage on our servers. All sensitive credentials are tokenized and encrypted by the gateway.</p>
                </div>
              </div>
              <p className="text-xs text-text">
                Aafreen Couture is not liable for gateway server timeouts or bank authorization delays beyond our direct control.
              </p>
            </section>

            {/* Section 7 */}
            <section id="sec-custom" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">07</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Custom, Bridal &amp; Made-to-Order Pieces
                </h2>
              </div>
              <p className="mb-3">
                Bespoke bridal lehengas, gowns, tailored sherwanis, and made-to-measure ensembles involve individual artisan pattern development:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-gold-ink">
                <li>Artisan handwork commences upon final confirmation of measurements and color swatch selection.</li>
                <li>Made-to-order creations require dedicated crafting timelines (typically 15–25 business days).</li>
                <li>Modifications requested after pattern cutting has started may incur surcharge fees or delivery extensions.</li>
                <li>Because custom pieces are personalized for an individual, they are strictly non-returnable.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="sec-measurements" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">08</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Measurements, Sizing &amp; Fitting Adjustments
                </h2>
              </div>
              <p className="mb-3">
                Customers are responsible for providing accurate body measurements. We provide bespoke measurement charts and virtual concierge consultations to assist you.
              </p>
              <p>
                Minor size adjustments may be needed due to body posture or personal drape preferences.
              </p>
            </section>

            {/* Section 9 */}
            <section id="sec-cancellation" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">09</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Order Cancellation Guidelines
                </h2>
              </div>
              <p className="mb-3">
                Cancellation requests must be submitted as early as possible. Orders can only be cancelled before they enter fabric procurement, tailoring, packing, or dispatch.
              </p>
              <p>
                For bespoke bridal and custom pieces, cancellation cannot be accommodated once artisan work has commenced. Eligible cancellations will be refunded 100% via the original payment mode.
              </p>
            </section>

            {/* Section 10 */}
            <section id="sec-returns" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">10</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Returns &amp; Exchange Policy Summary
                </h2>
              </div>
              <p className="mb-3">
                Aafreen Couture does not accept standard returns on accepted deliveries. However, eligible ready-to-wear items may be exchanged for size/fit within <strong>7 days of delivery</strong>.
              </p>
              <p>
                For complete step-by-step instructions, view our official{' '}
                <Link href="/returns-policy" className="text-gold-ink font-semibold underline hover:text-heading transition-colors">
                  Exchange, Cancellation &amp; Refund Policy
                </Link>.
              </p>
            </section>

            {/* Section 11 */}
            <section id="sec-damaged" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">11</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Damaged, Defective or Incorrect Items
                </h2>
              </div>
              <p className="mb-3">
                If your parcel arrives damaged in transit or differs from your order, please notify us within <strong>48 hours of delivery</strong> with unboxing photographs or video documentation.
              </p>
              <p>
                Upon verification, we will promptly provide an immediate replacement, complimentary alteration, or full refund.
              </p>
            </section>

            {/* Section 12 */}
            <section id="sec-shipping" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">12</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Shipping, Transit &amp; Customer Obligations
                </h2>
              </div>
              <p className="mb-3">
                We deliver pan-India in 5–7 business days and internationally across 50+ countries in 10–15 business days. Customers must supply accurate addresses and phone numbers.
              </p>
              <p>
                Learn more in our comprehensive{' '}
                <Link href="/shipping-policy" className="text-gold-ink font-semibold underline hover:text-heading transition-colors">
                  Shipping Policy
                </Link>.
              </p>
            </section>

            {/* Section 13 */}
            <section id="sec-ip" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">13</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Intellectual Property &amp; Brand Rights
                </h2>
              </div>
              <p className="mb-3">
                All visual assets, garment designs, embroidery motifs, brand trademarks, logos, photographs, video lookbooks, and website copy belong exclusively to Aafreen Couture and are protected under Indian Copyright and Trademark laws.
              </p>
              <p>
                Unauthorized copying, reproduction, or commercial duplication is strictly prohibited.
              </p>
            </section>

            {/* Section 14 */}
            <section id="sec-liability" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">14</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Limitation of Liability &amp; Force Majeure
                </h2>
              </div>
              <p className="mb-3">
                Aafreen Couture’s aggregate liability for any order claim is strictly limited to the actual amount paid by the customer for that order.
              </p>
              <p>
                Neither party shall be held liable for delays caused by Force Majeure circumstances beyond reasonable control, including natural disasters, transportation strikes, supply chain crises, or telecommunications outages.
              </p>
            </section>

            {/* Section 15 */}
            <section id="sec-law" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold-ink text-xs flex items-center justify-center font-bold font-mono">15</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-heading">
                  Governing Law &amp; Dispute Jurisdiction
                </h2>
              </div>
              <p className="mb-3">
                These Terms &amp; Conditions shall be interpreted and governed in accordance with the substantive laws of the Republic of India.
              </p>
              <p>
                Any legal actions, suits, or proceedings shall be subject to the exclusive jurisdiction of the competent courts in India.
              </p>
            </section>

            {/* Section 16: Contact Card */}
            <section id="sec-contact" className="bg-navbar text-heading border border-border border-t-2 border-t-gold p-6 sm:p-8 rounded-2xl scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold text-heading text-xs flex items-center justify-center font-bold font-mono">16</span>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-gold-ink">
                  Contact &amp; Customer Grievances
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-text leading-relaxed mb-6 font-sans">
                For order consultations, bespoke bridal sizing, or legal inquiries, connect directly with our atelier team:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-surface p-4 rounded-lg border border-border">
                  <p className="text-gold-ink font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail size="0.8125rem" /> Official Email
                  </p>
                  <a href={`mailto:${siteConfig.email}`} className="text-heading hover:text-gold-ink transition-colors">
                    {siteConfig.email}
                  </a>
                </div>

                <div className="bg-surface p-4 rounded-lg border border-border">
                  <p className="text-gold-ink font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone size="0.8125rem" /> Concierge &amp; WhatsApp
                  </p>
                  <a href={`tel:${siteConfig.phone}`} className="text-heading hover:text-gold-ink transition-colors">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text/80 font-sans">
                <p>Aafreen Couture By Pearl · SCO No. 43, 1st Floor, B-Block Market, New Amritsar, Amritsar, Punjab — 143001</p>
                <Link
                  href="/contact"
                  className="bg-gold text-heading hover:bg-gold-hover whitespace-nowrap shrink-0 text-[0.65625rem] font-semibold uppercase tracking-[0.2em] px-5 py-2 transition-colors rounded-lg"
                >
                  Open Contact Desk →
                </Link>
              </div>
            </section>

          </article>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 hidden lg:block">
            <PolicySidebar toc={TOC} title="Terms & Conditions" />
          </div>

        </div>
      </div>
    </div>
  );
}
