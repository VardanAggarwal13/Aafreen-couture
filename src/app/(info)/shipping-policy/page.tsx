import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Aafreen Couture',
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-brand-pearl border-b border-brand-cream py-14 text-center">
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-black">Shipping Policy</h1>
        <p className="mt-2 text-sm text-brand-stone">Last updated: July 2026</p>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16 prose prose-sm prose-neutral max-w-none">
        <div className="space-y-8 text-sm text-brand-stone leading-relaxed">
          <section>
            <h2 className="text-xl font-serif text-brand-black mb-3">Processing Time</h2>
            <p>Ready-to-ship items are dispatched within 1–2 business days of order confirmation. Made-to-order and custom items take 15–25 business days to prepare before dispatch.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-brand-black mb-3">Domestic Shipping (India)</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Standard delivery: 5–7 business days</li>
              <li>Expedited delivery: 2–3 business days (available in select cities)</li>
              <li>Free shipping on prepaid orders above ₹4,999</li>
              <li>Shipping fee for orders below ₹4,999: ₹149</li>
              <li>COD available for orders below ₹50,000</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-brand-black mb-3">International Shipping</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>International delivery: 10–15 business days</li>
              <li>Shipping charges calculated at checkout based on destination and weight</li>
              <li>Customs duties and import taxes are the buyer&apos;s responsibility</li>
              <li>We ship to 50+ countries via DHL and FedEx</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-brand-black mb-3">Tracking</h2>
            <p>Once your order is shipped, you will receive an email and SMS with the tracking number. You can track your order on our <a href="/track-order" className="text-brand-gold hover:underline">Track Order page</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-brand-black mb-3">Damaged / Lost Shipments</h2>
            <p>If your order arrives damaged or is lost in transit, please contact us within 48 hours of delivery with photos. We will arrange a replacement or full refund.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
