import type { Metadata } from 'next';
import { FaqAccordion } from '@/features/faq/components/FaqAccordion';

export const metadata: Metadata = {
  title: 'FAQs | Aafreen Couture',
  description: 'Answers to common questions about orders, shipping, returns, and customisation.',
};

const FAQS = [
  {
    category: 'Orders',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse our collections, select your preferred product and size, add it to your cart, and proceed to checkout. We accept online payments via Razorpay and Cash on Delivery.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Orders can be modified or cancelled within 24 hours of placement. After that, the order enters processing and cannot be changed. Please contact us immediately via WhatsApp.',
      },
      {
        q: 'Do you offer Cash on Delivery?',
        a: 'Yes! We offer COD on all orders within India. A small COD handling fee may apply for orders below ₹5,000.',
      },
    ],
  },
  {
    category: 'Shipping',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 5–7 business days within India. Ready-to-ship items dispatch within 24–48 hours. Custom orders take 15–25 business days.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship worldwide. International delivery typically takes 10–15 business days. Additional customs duties may apply based on your country.',
      },
      {
        q: 'Is shipping free?',
        a: 'Free shipping on all prepaid orders above ₹4,999 within India. International shipping charges are calculated at checkout.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery for ready-made items. The product must be unused, unwashed, and in original packaging with tags intact.',
      },
      {
        q: 'Can I return custom-made or stitched items?',
        a: 'No. Custom-made, stitched, and altered items are non-returnable since they are made specifically for you.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Refunds are processed within 5–7 business days after we receive and inspect the returned item. The amount is credited to your original payment method.',
      },
    ],
  },
  {
    category: 'Customisation',
    items: [
      {
        q: 'Can I customise a product?',
        a: 'Absolutely! We specialize in customisation. Contact us via the Customisation page or WhatsApp with your requirements — colour, embroidery, fabric, size — and we\'ll create something unique for you.',
      },
      {
        q: 'How long does a custom order take?',
        a: 'Custom orders typically take 15–25 business days depending on complexity. We will give you an exact timeline when you confirm the order.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-brand-pearl border-b border-brand-cream py-14 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-gold mb-3">Help Centre</p>
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-black">Frequently Asked Questions</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <FaqAccordion faqs={FAQS} />

        <div className="mt-14 p-6 bg-brand-pearl border border-brand-cream text-center">
          <p className="text-sm font-serif text-brand-black mb-2">Still have questions?</p>
          <p className="text-sm text-brand-stone mb-4">Our team is here to help.</p>
          <a
            href="/contact"
            className="inline-block bg-brand-gold text-white text-[11px] font-semibold tracking-[0.22em] uppercase px-7 py-3 hover:bg-[#b8893f] transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}
