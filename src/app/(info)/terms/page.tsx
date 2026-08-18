import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms & Conditions | Aafreen Couture' };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-brand-pearl border-b border-brand-cream py-14 text-center">
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-black">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-brand-stone">Last updated: July 2026</p>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-8 text-sm text-brand-stone leading-relaxed">
        <section>
          <h2 className="text-xl font-serif text-brand-black mb-3">Acceptance of Terms</h2>
          <p>By accessing and using aafreen-couture.com, you agree to be bound by these terms. If you do not agree, please do not use our website.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-brand-black mb-3">Products & Pricing</h2>
          <p>All prices are in Indian Rupees (INR) and include GST. We reserve the right to modify prices at any time. Product images are for reference; actual colours may vary slightly due to screen calibration differences.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-brand-black mb-3">Orders & Payment</h2>
          <p>An order is confirmed only after successful payment (or COD confirmation). We reserve the right to cancel any order due to pricing errors, stock unavailability, or fraudulent activity, with a full refund issued.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-brand-black mb-3">Intellectual Property</h2>
          <p>All content on this website — images, designs, text, logos — is the intellectual property of Aafreen Couture. Unauthorised reproduction or use is prohibited.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-brand-black mb-3">Limitation of Liability</h2>
          <p>Aafreen Couture is not liable for indirect, incidental, or consequential damages arising from your use of our website or products. Our liability is limited to the amount paid for the specific order in question.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-brand-black mb-3">Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
        </section>
      </article>
    </main>
  );
}
