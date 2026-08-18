import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Returns & Exchange Policy | Aafreen Couture',
  description: 'Our policy on returns, exchanges, alterations, and refunds for luxury couture and ethnic wear.',
};

export default function ReturnsPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#FAF7F2] border-b border-[#E8D8C8] py-14 text-center">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.4em] text-[#A67C52] mb-3">
          Customer Care
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#221617] uppercase tracking-wider">
          Returns & Exchange Policy
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#6E6A66] font-sans">
          Last updated: August 2026
        </p>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-8 text-xs sm:text-sm text-[#6E6A66] leading-relaxed font-sans">
          <section>
            <h2 className="text-lg sm:text-xl font-serif text-[#221617] uppercase tracking-wide mb-3">
              1. 7-Day Return Window
            </h2>
            <p>
              We want you to treasure every piece you receive from Aafreen Couture. Unaltered, standard ready-to-wear pieces may be returned or exchanged within <strong>7 days</strong> of delivery, provided they are in original condition with all tags, dust bags, and authenticity certificates intact.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif text-[#221617] uppercase tracking-wide mb-3">
              2. Custom Made & Bridal Wear
            </h2>
            <p>
              Because bespoke bridal lehengas, custom-stitched suits, and personalized ensembles are handcrafted to your exact body measurements and preferences, they are <strong>non-returnable</strong>. However, we offer complimentary fit alterations on all bridal pieces.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif text-[#221617] uppercase tracking-wide mb-3">
              3. Complimentary Alterations
            </h2>
            <p>
              If your garment requires minor size adjustments, our master tailoring team will alter it free of charge within 10 days of delivery. Reach out to our concierge team at <a href="mailto:support@aafreen-couture.com" className="text-[#A67C52] hover:underline">support@aafreen-couture.com</a> to arrange reverse pickup.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif text-[#221617] uppercase tracking-wide mb-3">
              4. Refund Process
            </h2>
            <p>
              Once your returned item is received and inspected at our atelier, refunds will be initiated to your original payment method within <strong>5–7 business days</strong>. For Cash on Delivery orders, refunds are processed via secure bank transfer.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif text-[#221617] uppercase tracking-wide mb-3">
              5. How to Initiate a Return
            </h2>
            <p className="mb-3">
              You can initiate a return directly from your customer account dashboard:
            </p>
            <Link
              href="/returns"
              className="inline-block bg-[#221617] text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-[#A67C52] transition-colors rounded-xs"
            >
              Go to Return Requests →
            </Link>
          </section>
        </div>
      </article>
    </main>
  );
}
