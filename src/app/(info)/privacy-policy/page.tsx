import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { PolicySidebar, type TocItem } from '@/features/info/components/PolicySidebar';
import { InfoHeroBanner } from '@/features/info/components/InfoHeroBanner';
import { Shield, Lock, Mail, Phone, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Aafreen Couture',
  description:
    'Official Privacy Policy for Aafreen Couture. Learn how we collect, use, protect, and process your personal and payment data in compliance with Indian IT and digital data protection laws.',
};

const TOC: TocItem[] = [
  { id: 'sec-privacy-commitment', number: '01', title: 'Privacy Commitment' },
  { id: 'sec-info-collected', number: '02', title: 'Information We Collect' },
  { id: 'sec-usage', number: '03', title: 'How We Use Your Data' },
  { id: 'sec-payment-security', number: '04', title: 'Razorpay & Payment Security' },
  { id: 'sec-sharing', number: '05', title: 'Third-Party Sharing' },
  { id: 'sec-cookies', number: '06', title: 'Cookies & Tracking' },
  { id: 'sec-retention-rights', number: '07', title: 'Data Retention & User Rights' },
  { id: 'sec-grievance', number: '08', title: 'Grievance Officer & Contact' },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#221617]">
      {/* Luxury Editorial Hero */}
      <InfoHeroBanner
        badge="✦ Data Protection &amp; Security"
        title="Privacy Policy"
        italicTitle="Client Confidentiality"
        subtitle="At Aafreen Couture, we value your trust. Learn how we collect, safeguard, and responsibly process your personal information with banking-grade security."
        metaInfo="Effective Season 2026 · Compliant with the Information Technology Act, 2000 &amp; Digital Personal Data Protection Norms, India"
      />

      {/* Main Container with 2-Column Responsive Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Article Content */}
          <article className="lg:col-span-8 space-y-8 font-sans text-xs sm:text-sm text-[#5C554E] leading-relaxed">
            
            {/* Section 1: Privacy Commitment */}
            <section id="sec-privacy-commitment" className="bg-white border-l-4 border-l-[#C49A5A] border-y border-r border-[#E8D8C8] p-6 sm:p-7 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0">
                  <Shield size={20} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                    01. Our Privacy Commitment
                  </h2>
                  <p>
                    Aafreen Couture (<strong>&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;</strong>) is dedicated to safeguarding your personal data in accordance with the <em>Information Technology Act, 2000</em>, the <em>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</em>, and applicable Indian data protection frameworks.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Info Collected */}
            <section id="sec-info-collected" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">02</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Information We Collect
                </h2>
              </div>
              <p className="mb-3">
                We collect personal information that you provide when creating an account, ordering a bridal ensemble, or connecting with our boutique concierge:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#C49A5A]">
                <li><strong>Identity &amp; Contact Information:</strong> Full name, email address, mobile number, billing address, and courier delivery destination.</li>
                <li><strong>Bespoke Couture Details:</strong> Sizing measurements, bespoke design preferences, custom color choices, and tailoring instructions.</li>
                <li><strong>Order &amp; Transaction Information:</strong> Products purchased, payment mode, transaction IDs, invoice records, and delivery status.</li>
                <li><strong>Browsing &amp; Technical Metrics:</strong> IP address, device type, browser specifications, cookies, and referral traffic.</li>
              </ul>
            </section>

            {/* Section 3: Usage */}
            <section id="sec-usage" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">03</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  How We Use Your Information
                </h2>
              </div>
              <p className="mb-3">We use your information exclusively for legitimate business and fulfillment purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-[#C49A5A]">
                <li>To tailor, pack, insure, and dispatch your luxury apparel orders</li>
                <li>To transmit automated order confirmations, AWB tracking links, and delivery updates via Email, SMS, and WhatsApp</li>
                <li>To coordinate bridal trials, virtual sizing consultations, and complimentary alterations</li>
                <li>To execute eligible size exchanges and 100% refund requests on verified refused parcels</li>
                <li>To maintain account security and prevent fraudulent transactions</li>
              </ul>
            </section>

            {/* Section 4: Payment Security (Razorpay) */}
            <section id="sec-payment-security" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">04</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Payment Security Standards (Razorpay Integration)
                </h2>
              </div>
              <div className="bg-[#FAF7F2] p-4 border border-[#C49A5A]/30 rounded-xs mb-4 flex items-start gap-3.5">
                <Lock className="text-[#C49A5A] shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-[#1A1011] text-xs uppercase tracking-wider mb-1">
                    PCI-DSS Level 1 Encrypted Payment Flow
                  </p>
                  <p className="text-xs text-[#5C554E] leading-relaxed">
                    All payment transactions on Aafreen Couture are securely routed through <strong>Razorpay</strong>, an RBI-regulated payment aggregator. Sensitive payment data is encrypted using 256-bit SSL technology.
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#7D756C]">
                Aafreen Couture <strong>does not capture, store, or view</strong> full credit/debit card numbers, CVVs, or online banking passwords on our servers.
              </p>
            </section>

            {/* Section 5: Sharing */}
            <section id="sec-sharing" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">05</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Sharing with Trusted Third Parties
                </h2>
              </div>
              <p className="mb-3">
                We strictly <strong>never sell, lease, or rent</strong> your personal data. We share relevant data only with vetted partners necessary for fulfilling our services:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-[#C49A5A]">
                <li><strong>Courier &amp; Logistics Partners:</strong> Blue Dart, Delhivery, DHL Express, and FedEx to deliver your garments safely.</li>
                <li><strong>Payment Aggregators:</strong> Razorpay for card, UPI, and netbanking processing.</li>
                <li><strong>Communication APIs:</strong> Official WhatsApp and SMS gateways for dispatch tracking.</li>
                <li><strong>Statutory Authorities:</strong> When required by Indian law, court order, or regulatory tax audits.</li>
              </ul>
            </section>

            {/* Section 6: Cookies */}
            <section id="sec-cookies" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">06</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Cookies &amp; Tracking Technologies
                </h2>
              </div>
              <p className="mb-3">
                We use necessary cookies and session tokens to remember your shopping cart, preserve your user login session, and analyze platform traffic. You can adjust your browser settings to disable non-essential cookies.
              </p>
            </section>

            {/* Section 7: Retention & Rights */}
            <section id="sec-retention-rights" className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1A1011] text-[#C49A5A] text-xs flex items-center justify-center font-bold font-mono">07</span>
                <h2 className="text-base sm:text-lg font-serif text-[#1A1011] uppercase tracking-wide">
                  Data Retention &amp; Your Legal Rights
                </h2>
              </div>
              <p className="mb-3">
                We retain personal records only for the period required to fulfill orders, provide lifetime alteration assistance, satisfy GST auditing regulations, and resolve disputes.
              </p>
              <p className="font-semibold text-[#1A1011] mb-2">You hold the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-[#C49A5A]">
                <li>Request access to your stored personal information</li>
                <li>Request correction or updating of outdated details</li>
                <li>Request deletion of your account and personal history (subject to legal compliance)</li>
                <li>Unsubscribe from promotional emails or newsletters at any time</li>
              </ul>
            </section>

            {/* Section 8: Grievance Officer */}
            <section id="sec-grievance" className="bg-[#221617] text-white border border-[#C49A5A]/40 p-6 sm:p-8 rounded-sm shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#C49A5A] text-[#1A1011] text-xs flex items-center justify-center font-bold font-mono">08</span>
                <h2 className="text-base sm:text-lg font-serif text-[#C49A5A] uppercase tracking-wide">
                  Grievance Officer &amp; Privacy Desk
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6 font-sans">
                In compliance with the <em>Information Technology Act, 2000</em>, if you have any questions or grievances regarding our privacy practices:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-[#2C1A1C] p-4 rounded-xs border border-[#C49A5A]/20">
                  <p className="text-[#C49A5A] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail size={13} /> Privacy Officer Email
                  </p>
                  <a href={`mailto:${siteConfig.email}`} className="text-white hover:text-[#C49A5A] transition-colors">
                    {siteConfig.email}
                  </a>
                </div>

                <div className="bg-[#2C1A1C] p-4 rounded-xs border border-[#C49A5A]/20">
                  <p className="text-[#C49A5A] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone size={13} /> Grievance Helpline
                  </p>
                  <a href={`tel:${siteConfig.phone}`} className="text-white hover:text-[#C49A5A] transition-colors">
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
            <PolicySidebar toc={TOC} title="Privacy Policy" />
          </div>

        </div>
      </div>
    </main>
  );
}
