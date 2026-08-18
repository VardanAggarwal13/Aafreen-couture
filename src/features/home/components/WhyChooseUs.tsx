import { Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Premium Craftsmanship',
    description: 'Every piece is handcrafted by skilled artisans using authentic fabrics and intricate embroidery.',
  },
  {
    icon: Truck,
    title: 'Free Shipping Over ₹5,000',
    description: 'Complimentary delivery across India, with real-time tracking for every order.',
  },
  {
    icon: RotateCcw,
    title: '7-Day Easy Returns',
    description: 'Not satisfied? Return within 7 days, no questions asked. Your happiness is guaranteed.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'Pay with Razorpay, UPI, cards, or Cash on Delivery. 100% secure checkout.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-gold mb-3">
            The Aafreen Promise
          </p>
          <h2 className="text-3xl sm:text-4xl text-brand-pearl">Why Choose Us</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                <Icon size={20} />
              </div>
              <h3 className="text-brand-pearl text-base font-serif">{title}</h3>
              <p className="text-brand-stone text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
