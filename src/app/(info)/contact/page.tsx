import type { Metadata } from 'next';
import { ContactForm } from '@/features/contact/components/ContactForm';
import { siteConfig } from '@/config/site.config';
import { InfoHeroBanner } from '@/features/info/components/InfoHeroBanner';
import { Mail, Phone, MessageCircle, Clock, MapPin, Sparkles } from 'lucide-react';
import { cmsRepository } from '@/server/repositories/cms.repository';

export const metadata: Metadata = {
  title: 'Contact Us & Bridal Concierge',
  description:
    'Get in touch with Aafreen Couture concierge for bridal appointments, custom measurements, order enquiries, and boutique consultations.',
  alternates: { canonical: `${siteConfig.url}/contact` },
};

export default async function ContactPage() {
  const cms = await cmsRepository.findBySlug('contact');
  return (
    <div className="min-h-dvh bg-background text-heading">
      {/* Luxury Editorial Hero */}
      <InfoHeroBanner
        badge={cms?.heroBadge ?? 'Aafreen Boutique Concierge'}
        title={cms?.heroTitle ?? 'Contact & Concierge'}
        italicTitle={cms?.heroItalicTitle ?? 'Personal Styling & Trials'}
        subtitle={
          cms?.heroSubtitle ??
          'Whether you seek custom bridal alterations, virtual sizing guidance, or wedding trousseau consultations, our master stylists are dedicated to assisting you.'
        }
        metaInfo={cms?.heroMetaInfo ?? 'Amritsar Atelier Studio · Pan-India & Worldwide Virtual Appointments'}
      />

      <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Atelier Coordinates */}
          <div className="lg:col-span-5 space-y-6 font-sans">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              <div className="border-b border-border pb-4">
                <span className="text-[0.625rem] font-semibold uppercase tracking-[0.25em] text-gold-ink block mb-1">
                  Connect Directly
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-heading tracking-tight">
                  Atelier Concierge
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-[0.8125rem]">
                {/* Phone & WhatsApp */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-border/60">
                  <div className="w-10 h-10 rounded-full bg-background border border-gold/30 flex items-center justify-center text-gold-ink shrink-0 mt-0.5">
                    <Phone size="1.0625rem" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-heading text-xs uppercase tracking-wider block">
                      Phone &amp; WhatsApp Desk
                    </span>
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="text-text hover:text-heading transition-colors font-medium block mt-0.5"
                    >
                      {siteConfig.phone}
                    </a>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20connect%20with%20the%20concierge.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[0.6875rem] text-gold-ink hover:text-heading font-semibold tracking-wider uppercase mt-1.5"
                    >
                      <MessageCircle size="0.75rem" />
                      <span>Chat on WhatsApp →</span>
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-border/60">
                  <div className="w-10 h-10 rounded-full bg-background border border-gold/30 flex items-center justify-center text-gold-ink shrink-0 mt-0.5">
                    <Mail size="1.0625rem" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-heading text-xs uppercase tracking-wider block">
                      Official Inquiries &amp; Orders
                    </span>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-text hover:text-heading transition-colors font-medium block mt-0.5"
                    >
                      {siteConfig.email}
                    </a>
                    <p className="text-[0.6875rem] text-text mt-0.5">
                      Monitored daily for orders, sizing &amp; alteration updates
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-border/60">
                  <div className="w-10 h-10 rounded-full bg-background border border-gold/30 flex items-center justify-center text-gold-ink shrink-0 mt-0.5">
                    <Clock size="1.0625rem" />
                  </div>
                  <div>
                    <span className="font-semibold text-heading text-xs uppercase tracking-wider block">
                      Atelier Operating Hours
                    </span>
                    <p className="text-text mt-0.5">
                      Monday &ndash; Saturday: 10:30 AM &ndash; 7:30 PM IST
                    </p>
                    <p className="text-[0.6875rem] text-text mt-0.5">
                      Sunday: By private appointment for bridal fittings
                    </p>
                  </div>
                </div>

                {/* Physical Studio */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-background border border-gold/30 flex items-center justify-center text-gold-ink shrink-0 mt-0.5">
                    <MapPin size="1.0625rem" />
                  </div>
                  <div>
                    <span className="font-semibold text-heading text-xs uppercase tracking-wider block">
                      Flagship Boutique Studio
                    </span>
                    <p className="text-heading mt-0.5 font-medium">
                      Aafreen Couture By Pearl
                    </p>
                    <p className="text-[0.6875rem] text-text mt-0.5 leading-relaxed">
                      SCO No. 43, 1st Floor, B-Block Market, New Amritsar, Amritsar, Punjab — 143001, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Turnaround Commitment Card */}
            <div className="bg-navbar text-heading border border-border border-t-2 border-t-gold p-5 sm:p-6 rounded-2xl text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-gold-ink font-semibold text-xs uppercase tracking-wider">
                <Sparkles size="0.875rem" />
                <span>Concierge Response Time</span>
              </div>
              <p className="text-text leading-relaxed text-[0.71875rem]">
                Our dedicated stylists reply during business hours (<strong>Monday &ndash; Saturday, 10:30 AM &ndash; 7:30 PM IST</strong>). For urgent bridal alteration requests, upcoming wedding dispatches, or private appointments, kindly contact our WhatsApp concierge directly.
              </p>
            </div>
          </div>

          {/* Right Column: Contact & Appointment Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm">
              <div className="border-b border-border pb-4 mb-6">
                <span className="text-[0.625rem] font-semibold uppercase tracking-[0.25em] text-gold-ink block mb-1">
                  Send An Enquiry
                </span>
                <h2 className="text-xl sm:text-2xl font-serif text-heading tracking-tight">
                  Write to Our Atelier
                </h2>
                <p className="text-xs sm:text-[0.8125rem] text-text mt-1 leading-relaxed">
                  Share your enquiry, bridal celebration date, or sizing questions below. Our styling desk will reach out promptly.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
