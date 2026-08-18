import type { Metadata } from 'next';
import { ContactForm } from '@/features/contact/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Aafreen Couture',
  description: 'Reach out to Aafreen Couture for customisation enquiries, order help, or general questions.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand-pearl border-b border-brand-cream py-14 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-gold mb-3">Get In Touch</p>
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-black">Contact Us</h1>
        <p className="mt-3 text-sm text-brand-stone max-w-sm mx-auto">
          We&apos;re here to help with orders, customisation, and anything else.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* Info */}
        <div>
          <h2 className="text-xl font-serif text-brand-black mb-6">Reach Us</h2>
          <div className="space-y-5 text-sm">
            <div>
              <p className="font-semibold text-brand-black mb-1">WhatsApp / Phone</p>
              <a href="tel:+919999999999" className="text-brand-stone hover:text-brand-gold transition-colors">
                +91 99999 99999
              </a>
            </div>
            <div>
              <p className="font-semibold text-brand-black mb-1">Email</p>
              <a href="mailto:hello@aafreen-couture.com" className="text-brand-stone hover:text-brand-gold transition-colors">
                hello@aafreen-couture.com
              </a>
            </div>
            <div>
              <p className="font-semibold text-brand-black mb-1">Instagram</p>
              <a href="https://instagram.com/aafreen__couture" target="_blank" rel="noopener noreferrer" className="text-brand-stone hover:text-brand-gold transition-colors">
                @aafreen__couture
              </a>
            </div>
            <div>
              <p className="font-semibold text-brand-black mb-1">Business Hours</p>
              <p className="text-brand-stone">Monday – Saturday: 10 AM – 7 PM IST</p>
            </div>
          </div>

          {/* Response time note */}
          <div className="mt-10 p-4 bg-brand-pearl border border-brand-cream text-sm text-brand-stone">
            <strong className="text-brand-black block mb-1">Response Time</strong>
            We typically respond within 4–6 hours during business hours. For urgent queries, please WhatsApp us directly.
          </div>
        </div>

        {/* Form */}
        <div>
          <h2 className="text-xl font-serif text-brand-black mb-6">Send a Message</h2>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
