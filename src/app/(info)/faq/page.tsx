import type { Metadata } from 'next';
import { FaqAccordion, type FaqCategory } from '@/features/faq/components/FaqAccordion';
import { InfoHeroBanner } from '@/features/info/components/InfoHeroBanner';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQs) | Aafreen Couture',
  description:
    'Find clear answers to common questions about orders, payments via Razorpay, custom bridal lehengas, domestic/international shipping, and size exchanges.',
};

const FAQS: FaqCategory[] = [
  {
    category: 'Orders & Payments',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse our curated collections, select your desired silhouette and size, and proceed to checkout. Complete payment securely via UPI, Credit/Debit cards, Netbanking via Razorpay, or select Cash on Delivery (COD) for eligible domestic destinations.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, MasterCard, RuPay, American Express), UPI (Google Pay, PhonePe, Paytm), Netbanking across 50+ Indian banks, and secure digital wallets via Razorpay with 256-bit SSL banking-grade encryption.',
      },
      {
        q: 'Can I cancel or modify my order after placing it?',
        a: 'Orders can be modified or cancelled before fabric cutting or dispatch begins (within 12 hours for ready-to-wear and 24 hours for bespoke bridal lehengas). Please reach out to our concierge immediately on WhatsApp.',
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Yes, Cash on Delivery is available across most serviceable Indian pincodes for orders up to ₹50,000.',
      },
    ],
  },
  {
    category: 'Custom & Bridal Couture',
    items: [
      {
        q: 'Can I customize a bridal lehenga or suit to my measurements?',
        a: 'Yes! We specialize in bespoke bridal customisation. You can provide your custom body measurements during checkout or connect with our concierge team on WhatsApp for dedicated virtual sizing guidance.',
      },
      {
        q: 'How long does a made-to-order bridal piece take to craft?',
        a: 'Handcrafted bridal lehengas and bespoke creations typically take 15–25 business days to craft, depending on the complexity of hand embroidery (zardozi, gota patti, dabka) and hand dyeing.',
      },
      {
        q: 'Do you offer complimentary alterations?',
        a: 'Yes, we offer complimentary fit alterations on all custom bridal pieces within 10 days of delivery to ensure a flawless fit for your wedding celebrations.',
      },
    ],
  },
  {
    category: 'Shipping & Transit',
    items: [
      {
        q: 'How long does domestic shipping take across India?',
        a: 'Ready-to-ship pieces are dispatched within 1–2 business days, and delivery takes 5–7 business days post-dispatch via insured air courier partners (Blue Dart, Delhivery).',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes! We ship worldwide to over 50 countries (USA, UK, Canada, UAE, Australia, Singapore, Europe) via DHL Express and FedEx International Priority. International delivery takes 10–15 business days.',
      },
      {
        q: 'How can I track my shipment?',
        a: 'Once your order is handed over to the courier partner, an automated email and WhatsApp notification with your AWB tracking link will be sent. You can also track your shipment live on our dedicated Track Order portal.',
      },
    ],
  },
  {
    category: 'Exchanges & Fitting',
    items: [
      {
        q: 'What is your size exchange policy?',
        a: 'Unaltered, standard ready-to-wear pieces may be exchanged for a different size within 7 days of delivery, provided all tags and original packaging remain intact.',
      },
      {
        q: 'What happens if I refuse delivery of my parcel at the doorstep?',
        a: 'If you choose not to accept delivery and the courier returns the unopened parcel intact to our atelier, we will refund 100% of your payment received once verified by our team.',
      },
      {
        q: 'How long does an approved refund take to reflect in my bank account?',
        a: 'Once your returned parcel is inspected at our atelier, the refund is initiated to your original payment method (via Razorpay) within 24–48 hours and reflects in your account within 5–7 business days.',
      },
      {
        q: 'Why is an unboxing video recommended?',
        a: 'For transit damage, missing item, or defect claims, a continuous unedited unboxing video starting from the sealed courier package helps us resolve carrier disputes immediately and dispatch a priority replacement.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#221617]">
      {/* Luxury Editorial Hero */}
      <InfoHeroBanner
        badge="✦ Aafreen Client Helpdesk"
        title="Frequently Asked Questions"
        italicTitle="Atelier Guidance"
        subtitle="Everything you need to know regarding bespoke bridal sizing, payment security, express air transit, and our fitting guarantee."
        metaInfo="Dedicated Styling Concierge · Direct WhatsApp Assistance · 24-48h Response Guarantee"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <FaqAccordion faqs={FAQS} />
      </div>
    </main>
  );
}
