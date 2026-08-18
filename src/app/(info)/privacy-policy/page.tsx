import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy | Aafreen Couture' };

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-brand-pearl border-b border-brand-cream py-14 text-center">
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-black">Privacy Policy</h1>
        <p className="mt-2 text-sm text-brand-stone">Last updated: July 2026</p>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-8 text-sm text-brand-stone leading-relaxed">
        <section>
          <h2 className="text-xl font-serif text-brand-black mb-3">Information We Collect</h2>
          <p>We collect information you provide directly — name, email, phone number, delivery address — when you create an account, place an order, or contact us. We also collect usage data and device information automatically.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-brand-black mb-3">How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To process and fulfil your orders</li>
            <li>To send order confirmations and shipping updates</li>
            <li>To respond to your enquiries</li>
            <li>To improve our website and services</li>
            <li>To send promotional emails (you may opt out at any time)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-serif text-brand-black mb-3">Data Sharing</h2>
          <p>We do not sell your personal data. We share it only with trusted service providers (payment processors, shipping partners, email providers) necessary to fulfil your order, and only to the extent required.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-brand-black mb-3">Cookies</h2>
          <p>We use cookies to maintain your session, remember your cart, and understand how you use our website. You can disable cookies in your browser settings, though some features may not function properly.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-brand-black mb-3">Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time. Contact us at <a href="mailto:hello@aafreen-couture.com" className="text-brand-gold hover:underline">hello@aafreen-couture.com</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-brand-black mb-3">Contact</h2>
          <p>For privacy-related queries, email us at <a href="mailto:hello@aafreen-couture.com" className="text-brand-gold hover:underline">hello@aafreen-couture.com</a>.</p>
        </section>
      </article>
    </main>
  );
}
