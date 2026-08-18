'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Delhi',
    rating: 5,
    text: 'Absolutely stunning bridal lengha! The fabric quality and embroidery are exquisite. Received so many compliments on my wedding day. Aafreen Couture exceeded all my expectations.',
    date: 'March 2025',
  },
  {
    name: 'Meera Patel',
    location: 'Mumbai',
    rating: 5,
    text: 'The sharara set I ordered was exactly as shown, and the craftsmanship is impeccable. Fast shipping and beautifully packaged. Will definitely order again for my sister\'s wedding!',
    date: 'February 2025',
  },
  {
    name: 'Ritu Agarwal',
    location: 'Jaipur',
    rating: 5,
    text: 'Outstanding quality and service. The team helped me pick the perfect suit for my mehndi ceremony. The fabric is luxurious and the fit was perfect. Highly recommend!',
    date: 'January 2025',
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-white border-t border-[#F0E8DC]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-10">
          <h2 className="font-serif text-[22px] sm:text-[28px] tracking-[0.02em] text-[#1A1A1A]">What Our Brides Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-white rounded-sm p-6 flex flex-col gap-4 border border-brand-cream"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }, (_, i) => (
                  <Star key={i} size={12} className="text-brand-gold fill-brand-gold" />
                ))}
              </div>
              <p className="text-sm text-brand-stone leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-auto pt-4 border-t border-brand-cream">
                <p className="text-sm font-medium text-brand-black">{t.name}</p>
                <p className="text-xs text-brand-stone">{t.location} · {t.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
