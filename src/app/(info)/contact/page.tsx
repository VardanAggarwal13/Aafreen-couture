import type { Metadata } from 'next';
import { ContactForm } from '@/features/contact/components/ContactForm';
import { siteConfig } from '@/config/site.config';
import { InfoHeroBanner } from '@/features/info/components/InfoHeroBanner';
import { Mail, Phone, MessageCircle, Clock, MapPin, Sparkles, Calendar, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us & Concierge | Aafreen Couture',
  description:
    'Get in touch with Aafreen Couture concierge for bridal appointments, custom measurements, order enquiries, and boutique consultations.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#221617]">
      {/* Luxury Editorial Hero */}
      <InfoHeroBanner
        badge="✦ Aafreen Boutique Concierge"
        title="Contact &amp; Concierge"
        italicTitle="Personal Styling &amp; Trials"
        subtitle="Whether you seek custom bridal alterations, virtual sizing guidance, or wedding trousseau consultations, our master stylists are dedicated to assisting you."
        metaInfo="Amritsar Atelier Studio · Pan-India &amp; Worldwide Virtual Appointments"
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Atelier Coordinates */}
          <div className="lg:col-span-5 space-y-6 font-sans">
            <div className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-[0_4px_16px_rgba(34,22,23,0.03)] space-y-6">
              <div className="border-b border-[#E8D8C8] pb-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A67C52] block mb-1">
                  Connect Directly
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-[#221617] uppercase tracking-wide">
                  Atelier Concierge
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-[13px]">
                {/* Phone & WhatsApp */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-[#E8D8C8]/60">
                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0 mt-0.5">
                    <Phone size={17} />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-[#221617] text-xs uppercase tracking-wider block">
                      Phone &amp; WhatsApp Desk
                    </span>
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="text-[#5C554E] hover:text-[#221617] transition-colors font-medium block mt-0.5"
                    >
                      {siteConfig.phone}
                    </a>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20connect%20with%20the%20concierge.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-[#A67C52] hover:text-[#221617] font-semibold tracking-wider uppercase mt-1.5"
                    >
                      <MessageCircle size={12} />
                      <span>Chat on WhatsApp →</span>
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-[#E8D8C8]/60">
                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0 mt-0.5">
                    <Mail size={17} />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-[#221617] text-xs uppercase tracking-wider block">
                      Official Inquiries &amp; Orders
                    </span>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-[#5C554E] hover:text-[#221617] transition-colors font-medium block mt-0.5"
                    >
                      {siteConfig.email}
                    </a>
                    <p className="text-[11px] text-[#7D756C] mt-0.5">
                      Monitored daily for orders, sizing &amp; alteration updates
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-[#E8D8C8]/60">
                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0 mt-0.5">
                    <Clock size={17} />
                  </div>
                  <div>
                    <span className="font-semibold text-[#221617] text-xs uppercase tracking-wider block">
                      Atelier Operating Hours
                    </span>
                    <p className="text-[#5C554E] mt-0.5">
                      Monday &ndash; Saturday: 10:30 AM &ndash; 7:30 PM IST
                    </p>
                    <p className="text-[11px] text-[#7D756C] mt-0.5">
                      Sunday: By private appointment for bridal fittings
                    </p>
                  </div>
                </div>

                {/* Physical Studio */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0 mt-0.5">
                    <MapPin size={17} />
                  </div>
                  <div>
                    <span className="font-semibold text-[#221617] text-xs uppercase tracking-wider block">
                      Flagship Boutique Studio
                    </span>
                    <p className="text-[#221617] mt-0.5 font-medium">
                      Aafreen Couture By Pearl
                    </p>
                    <p className="text-[11px] text-[#6E6A66] mt-0.5 leading-relaxed">
                      SCO No. 43, 1st Floor, B-Block Market, New Amritsar, Amritsar, Punjab — 143001, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Turnaround Commitment Card */}
            <div className="bg-[#221617] text-white p-5 sm:p-6 rounded-xs border border-[#C49A5A]/40 text-xs space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-[#C49A5A] font-semibold text-xs uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Concierge Response Commitment</span>
              </div>
              <p className="text-white/80 leading-relaxed text-[11.5px]">
                Our dedicated stylists respond within <strong>4&ndash;6 hours</strong> during business hours. For urgent bridal alteration requests, upcoming wedding dispatches, or private appointments, kindly contact our WhatsApp concierge directly.
              </p>
            </div>
          </div>

          {/* Right Column: Contact & Appointment Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E8D8C8] p-6 sm:p-10 rounded-xs shadow-[0_4px_16px_rgba(34,22,23,0.03)]">
              <div className="border-b border-[#E8D8C8] pb-4 mb-6">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A67C52] block mb-1">
                  Send An Enquiry
                </span>
                <h2 className="text-xl sm:text-2xl font-serif text-[#221617] uppercase tracking-wide">
                  Write to Our Atelier
                </h2>
                <p className="text-xs sm:text-[13px] text-[#5C554E] mt-1 leading-relaxed">
                  Share your enquiry, bridal celebration date, or sizing questions below. Our styling desk will reach out promptly.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
