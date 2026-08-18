import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | Aafreen Couture',
  description: 'Discover the story behind Aafreen Couture — timeless bridal fashion, handcrafted with love.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-brand-black py-20 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #C49A5A 0px, #C49A5A 1px, transparent 1px, transparent 14px)',
          }}
        />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-gold mb-4">Our Story</p>
          <h1 className="text-3xl sm:text-5xl font-serif text-white leading-tight">
            Where Every Thread<br />
            <em className="text-brand-gold not-italic">Tells a Story</em>
          </h1>
        </div>
      </div>

      {/* Brand story */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-brand-stone text-sm leading-[2] mb-6">
          Aafreen Couture was born from a deep love for the artistry of Indian textiles and the magic of bridal fashion.
          Founded by a passionate designer, we curate handcrafted lehengas, suits, and accessories that blend centuries-old
          craftsmanship with contemporary sensibilities.
        </p>
        <p className="text-brand-stone text-sm leading-[2] mb-6">
          Every piece in our collection is thoughtfully designed and crafted by skilled artisans — people who pour their
          heart into every embroidery stitch, every drape, every detail. We believe that what a bride wears on her wedding
          day should be nothing less than extraordinary.
        </p>
        <p className="text-brand-stone text-sm leading-[2]">
          From bridal lehengas that shimmer under the mandap lights to co-ord sets for the sangeet night, we dress you for
          every moment that matters.
        </p>
      </section>

      {/* Values */}
      <section className="bg-brand-pearl border-y border-brand-cream py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif text-brand-black">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { title: 'Authenticity', body: 'Every piece is rooted in genuine Indian craftsmanship — no shortcuts, no compromises.' },
              { title: 'Quality', body: 'We source the finest fabrics — rich silks, delicate georgettes, hand-woven tissues — that drape beautifully.' },
              { title: 'Personalisation', body: 'Your wedding is unique. We offer customisation so your outfit is as individual as you are.' },
            ].map((v) => (
              <div key={v.title} className="text-center px-4">
                <div className="w-10 h-0.5 bg-brand-gold mx-auto mb-5" />
                <h3 className="font-serif text-lg text-brand-black mb-3">{v.title}</h3>
                <p className="text-sm text-brand-stone leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-serif text-brand-black mb-4">Dress Your Dream</h2>
        <p className="text-sm text-brand-stone mb-8 max-w-sm mx-auto">
          Explore our collections or reach out to create something uniquely yours.
        </p>
        <div className="flex items-center justify-center gap-5">
          <Link
            href="/collections"
            className="inline-block bg-brand-gold text-white text-[11px] font-semibold tracking-[0.22em] uppercase px-8 py-3.5 hover:bg-[#b8893f] transition-colors"
          >
            Shop Collections
          </Link>
          <Link
            href="/contact?customise=true"
            className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-black border-b border-brand-black/40 pb-0.5 hover:text-brand-gold hover:border-brand-gold transition-colors"
          >
            Customise
          </Link>
        </div>
      </section>
    </main>
  );
}
