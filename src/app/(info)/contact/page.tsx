import type { Metadata } from 'next';
import { ContactForm } from '@/features/contact/components/ContactForm';
import { siteConfig } from '@/config/site.config';
import { Mail, Phone, MessageCircle, Clock, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Contact Us | Aafreen Couture',
  description:
    'Get in touch with Aafreen Couture concierge for bridal appointments, custom measurements, order enquiries, and boutique consultations.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#221617]">
      {/* Header Banner */}
      <div className="bg-[#1A1011] text-[#FAF7F2] py-14 sm:py-20 border-b border-[#C49A5A]/30 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #C49A5A 0px, #C49A5A 1px, transparent 1px, transparent 14px)',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-[#C49A5A] mb-3">
            Atelier Concierge
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif uppercase tracking-wider text-white">
            Contact Us
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-white/70 font-sans max-w-xl mx-auto leading-relaxed">
            We are here to assist you with bespoke bridal consultations, sizing guidance, order tracking, and custom couture inquiries.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14">
          
          {/* Left Column: Contact Channels & Business Details */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs space-y-6 font-sans">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#A67C52] mb-1">
                  Connect Directly
                </p>
                <h2 className="text-xl font-serif text-[#1A1011] uppercase tracking-wide">
                  Boutique Concierge
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* Phone / WhatsApp */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-[#E8D8C8]/60">
                  <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0 mt-0.5">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1011] text-xs uppercase tracking-wider">
                      Phone &amp; WhatsApp
                    </p>
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="text-[#5C554E] hover:text-[#C49A5A] transition-colors block mt-0.5"
                    >
                      {siteConfig.phone}
                    </a>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#A67C52] font-semibold hover:underline mt-1"
                    >
                      <MessageCircle size={12} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-[#E8D8C8]/60">
                  <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0 mt-0.5">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1011] text-xs uppercase tracking-wider">
                      Official Email
                    </p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-[#5C554E] hover:text-[#C49A5A] transition-colors block mt-0.5"
                    >
                      {siteConfig.email}
                    </a>
                    <p className="text-[11px] text-[#7D756C] mt-0.5">
                      For orders, returns, alterations &amp; wholesale
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-[#E8D8C8]/60">
                  <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0 mt-0.5">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1011] text-xs uppercase tracking-wider">
                      Atelier Hours
                    </p>
                    <p className="text-[#5C554E] mt-0.5">
                      Monday &ndash; Saturday: 10:00 AM &ndash; 7:00 PM IST
                    </p>
                    <p className="text-[11px] text-[#7D756C] mt-0.5">
                      Sunday: By appointment only for bridal trials
                    </p>
                  </div>
                </div>

                {/* Registered Business / Atelier */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] shrink-0 mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1011] text-xs uppercase tracking-wider">
                      Registered Brand &amp; Atelier
                    </p>
                    <p className="text-[#5C554E] mt-0.5">
                      Aafreen Couture By Pearl
                    </p>
                    <p className="text-[11px] text-[#7D756C] mt-0.5">
                      India
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Turnaround Note */}
            <div className="bg-[#221617] text-white p-5 rounded-sm border border-[#C49A5A]/40 text-xs font-sans space-y-2">
              <div className="flex items-center gap-2 text-[#C49A5A] font-semibold text-xs uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Turnaround Commitment</span>
              </div>
              <p className="text-white/80 leading-relaxed">
                Our concierge team typically responds within <strong>4&ndash;6 hours</strong> during business hours. For urgent bridal alterations or dispatch inquiries, kindly ping our official WhatsApp.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E8D8C8] p-6 sm:p-10 rounded-sm shadow-xs">
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#A67C52] mb-1">
                  Send An Enquiry
                </p>
                <h2 className="text-xl sm:text-2xl font-serif text-[#1A1011] uppercase tracking-wide">
                  Write to Our Atelier
                </h2>
                <p className="text-xs text-[#7D756C] mt-1 font-sans">
                  Fill out the form below and our styling concierge will reach out promptly.
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
