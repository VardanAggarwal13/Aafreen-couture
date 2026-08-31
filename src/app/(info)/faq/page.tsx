import type { Metadata } from 'next';
import { FaqAccordion, type FaqCategory } from '@/features/faq/components/FaqAccordion';
import { HelpCircle, Clock } from 'lucide-react';

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
        a: 'Browse our curated collections, select your desired ensemble and size, and proceed to secure checkout. You can complete payment using UPI, Credit/Debit cards, Netbanking via Razorpay, or select Cash on Delivery (COD) for eligible domestic orders.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, MasterCard, RuPay, American Express), UPI (Google Pay, PhonePe, Paytm), Netbanking across 50+ Indian banks, and secure digital wallets via Razorpay with 256-bit SSL encryption.',
      },
      {
        q: 'Can I cancel or modify my order after placing it?',
        a: 'Orders can be modified or cancelled before they enter fabric cutting, custom tailoring, or dispatch (typically within 12–24 hours of placement). Once handcrafting or dispatch has begun, cancellation is no longer possible.',
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Yes, we offer Cash on Delivery across most serviceable Indian pincodes for orders up to ₹50,000.',
      },
    ],
  },
  {
    category: 'Custom & Bridal Couture',
    items: [
      {
        q: 'Can I customize a bridal lehenga or suit to my measurements?',
        a: 'Yes! We specialize in bespoke bridal and ethnic customisation. You can provide your custom body measurements during order placement or connect with our concierge team on WhatsApp for dedicated virtual sizing guidance.',
      },
      {
        q: 'How long does a made-to-order bridal piece take to craft?',
        a: 'Handcrafted bridal lehengas and bespoke creations typically take 15–25 business days to craft, depending on the complexity of hand embroidery (zardozi, gota patti, dabka) and hand dyeing.',
      },
      {
        q: 'Do you offer complimentary alterations?',
        a: 'Yes, we offer complimentary fit alterations on all custom bridal pieces within 10 days of delivery to ensure a flawless fit for your wedding day.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
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
        a: 'Once your order is handed over to the courier partner, an automated email and WhatsApp notification with your AWB tracking link will be sent. You can also track your shipment live on our Track Order page.',
      },
    ],
  },
  {
    category: 'Exchanges & Refunds',
    items: [
      {
        q: 'What is your exchange policy?',
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
      {/* Luxury Hero Banner */}
      <div className="bg-[#1A1011] text-[#FAF7F2] py-14 sm:py-20 border-b border-[#C49A5A]/30 relative overflow-hidden text-center">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #C49A5A 0px, #C49A5A 1px, transparent 1px, transparent 14px)',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#2C1A1C] border border-[#C49A5A]/30 px-3.5 py-1 rounded-full text-[10.5px] text-[#C49A5A] uppercase tracking-[0.3em] font-semibold mb-4">
            <span>✦ Client Help &amp; Guidance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif uppercase tracking-wider text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-white/75 font-sans max-w-xl mx-auto leading-relaxed">
            Everything you need to know about bespoke bridal couture, sizing, orders, Razorpay payments, and international deliveries.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <FaqAccordion faqs={FAQS} />
      </div>
    </main>
  );
}
