import { Suspense } from 'react';
import type { Metadata } from 'next';
import { TrackOrderClient } from '@/features/track-order/components/TrackOrderClient';
import { InfoNavHeader } from '@/features/info/components/InfoNavHeader';
import { InfoHeroBanner } from '@/features/info/components/InfoHeroBanner';
import { siteConfig } from '@/config/site.config';
import { ShieldCheck, Truck, Clock, Package, Phone, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Track Your Order | Aafreen Couture',
  description:
    'Track your luxury couture shipment in real-time. Enter your order reference number to view live courier transit milestones and estimated delivery date.',
};

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#221617]">
      {/* Sub-nav header */}
      <InfoNavHeader />

      {/* Luxury Editorial Hero */}
      <InfoHeroBanner
        badge="✦ Aafreen Logistics &amp; Dispatch Concierge"
        title="Track Your Order"
        italicTitle="Real-Time Milestones"
        subtitle="Monitor your bespoke bridal and ethnic couture order from master artisan hand-embroidery to fully insured white-glove doorstep delivery."
        metaInfo="Insured Pan-India &amp; Global Express · Blue Dart &amp; DHL Express · 100% Transit Coverage"
      />

      {/* Main 2-Column Responsive Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          {/* Left Column: Interactive Tracker */}
          <div className="lg:col-span-8">
            <Suspense
              fallback={
                <div className="bg-white border border-[#E8D8C8] p-12 rounded-xs text-center text-sm font-sans text-[#A67C52] shadow-[0_4px_16px_rgba(34,22,23,0.03)]">
                  Loading luxury shipment tracker…
                </div>
              }
            >
              <TrackOrderClient />
            </Suspense>
          </div>

          {/* Right Column: Atelier Transit Guarantees & Concierge Support */}
          <div className="lg:col-span-4 space-y-6">
            {/* Transit Guarantees Card */}
            <div className="bg-white border border-[#E8D8C8] p-6 rounded-xs shadow-[0_4px_16px_rgba(34,22,23,0.03)] space-y-5">
              <div className="border-b border-[#E8D8C8] pb-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A67C52] block mb-1">
                  Atelier Guarantee
                </span>
                <h3 className="font-serif text-lg text-[#221617] uppercase tracking-wide">
                  Transit Standards
                </h3>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0 mt-0.5">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#221617] text-xs uppercase tracking-wider">
                      100% Insured Transit
                    </h4>
                    <p className="text-[#6E6A66] mt-0.5 leading-relaxed text-[11.5px]">
                      Every handcrafted ensemble is covered by transit insurance up to full invoice value until handed over.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0 mt-0.5">
                    <Package size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#221617] text-xs uppercase tracking-wider">
                      Tamper-Evident Packaging
                    </h4>
                    <p className="text-[#6E6A66] mt-0.5 leading-relaxed text-[11.5px]">
                      Delivered in weather-resistant bespoke keepsake boxes with premium breathable muslin heirloom covers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0 mt-0.5">
                    <Truck size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#221617] text-xs uppercase tracking-wider">
                      Air Express Logistics
                    </h4>
                    <p className="text-[#6E6A66] mt-0.5 leading-relaxed text-[11.5px]">
                      Shipped pan-India within 5–7 business days and worldwide to 50+ countries in 10–15 business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0 mt-0.5">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#221617] text-xs uppercase tracking-wider">
                      Live AWB Notifications
                    </h4>
                    <p className="text-[#6E6A66] mt-0.5 leading-relaxed text-[11.5px]">
                      Direct SMS and WhatsApp notifications are shared once your parcel is scanned by the courier.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Concierge Card */}
            <div className="bg-[#221617] text-white p-6 rounded-xs border border-[#C49A5A]/30 space-y-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C49A5A] block">
                Direct Helpdesk
              </span>
              <h3 className="font-serif text-lg uppercase tracking-wider text-white">
                Boutique Logistics Desk
              </h3>
              <p className="text-white/70 text-xs leading-relaxed font-sans">
                Have an urgent delivery requirement or need to adjust your handover address? Connect with our dedicated concierge directly.
              </p>

              <div className="space-y-2.5 pt-2 font-sans text-xs">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-2.5 p-2.5 bg-white/5 hover:bg-white/10 rounded-xs border border-white/10 transition-colors text-white"
                >
                  <Phone size={14} className="text-[#C49A5A]" />
                  <span>Call: {siteConfig.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=Hello%20Aafreen%20Couture%2C%20I%20need%20assistance%20tracking%20my%20order.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#C49A5A] hover:bg-[#FAF7F2] text-[#1A1011] font-semibold uppercase tracking-wider text-[11px] rounded-xs transition-all shadow-xs"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Dispatch Team</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
