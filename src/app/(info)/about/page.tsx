import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Heart, Scissors, ShieldCheck, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { InfoHeroBanner } from '@/features/info/components/InfoHeroBanner';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Our Story & Atelier | Aafreen Couture',
  description:
    'Discover the heritage, artistry, and vision behind Aafreen Couture — timeless Indian bridal wear and bespoke luxury handcrafted with royal elegance.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#221617]">
      {/* Luxury Editorial Hero */}
      <InfoHeroBanner
        badge="✦ Aafreen Couture By Pearl"
        title="Our Story &amp; Atelier"
        italicTitle="Heirloom Craftsmanship"
        subtitle="Where every thread tells a regal story. Preserving centuries of authentic Indian karigari, rare zardozi embroidery, and modern silhouette tailoring for life's most cherished milestones."
        metaInfo="Bespoke Bridal Atelier · Amritsar, Punjab · Shipping Worldwide to 50+ Countries"
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 space-y-16 sm:space-y-24">
        {/* Brand Narrative Quote */}
        <section className="text-center max-w-3xl mx-auto space-y-6 font-sans text-xs sm:text-[14px] text-[#5C554E] leading-[2.2]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A67C52] block">
            ✦ The Couturier&apos;s Creed
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#221617] uppercase tracking-wide leading-relaxed">
            &ldquo;We don&apos;t just craft garments; we curate heirlooms destined to be treasured across generations.&rdquo;
          </h2>
          <p className="pt-2">
            <strong>Aafreen Couture By Pearl</strong> was born from an enduring devotion to authentic Indian textile heritage, regal Mughal and Punjabi silhouettes, and the transformative joy of bridal couture. Designed to bridge timeless royal craftsmanship with effortless modern comfort, our atelier creates masterpieces that honor individual elegance and sovereign grace.
          </p>
          <p>
            Every bespoke bridal lehenga, custom-tailored suit, and festive ensemble represents hundreds of artisan hours — master karigars in Amritsar painstakingly threading authentic zardozi, dabka, resham, gota patti, and micro-pearls onto the purest mulberry silks, handloom organza, and royal velvets.
          </p>
        </section>

        {/* Atelier Key Metrics Strip */}
        <section className="bg-white border border-[#E8D8C8] p-6 sm:p-10 rounded-xs shadow-[0_4px_20px_rgba(34,22,23,0.03)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#E8D8C8]">
            <div className="pt-4 sm:pt-0">
              <span className="font-serif text-3xl sm:text-4xl text-[#221617] font-semibold block">200+</span>
              <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold text-[#A67C52] mt-1 block">Artisan Hours</span>
              <p className="text-[11px] text-[#7D756C] mt-1 max-w-[180px] mx-auto">Hand embroidery &amp; detailing on every bridal creation</p>
            </div>
            <div className="pt-4 sm:pt-0">
              <span className="font-serif text-3xl sm:text-4xl text-[#221617] font-semibold block">100%</span>
              <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold text-[#A67C52] mt-1 block">Pure Silks &amp; Velvets</span>
              <p className="text-[11px] text-[#7D756C] mt-1 max-w-[180px] mx-auto">Ethically sourced mulberry silks, tissue &amp; sheer organza</p>
            </div>
            <div className="pt-4 sm:pt-0">
              <span className="font-serif text-3xl sm:text-4xl text-[#221617] font-semibold block">50+</span>
              <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold text-[#A67C52] mt-1 block">Global Countries</span>
              <p className="text-[11px] text-[#7D756C] mt-1 max-w-[180px] mx-auto">Insured express air transit worldwide via DHL &amp; FedEx</p>
            </div>
            <div className="pt-4 sm:pt-0">
              <span className="font-serif text-3xl sm:text-4xl text-[#221617] font-semibold block">10-Day</span>
              <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold text-[#A67C52] mt-1 block">Fit Guarantee</span>
              <p className="text-[11px] text-[#7D756C] mt-1 max-w-[180px] mx-auto">Complimentary bespoke alterations on all bridal pieces</p>
            </div>
          </div>
        </section>

        {/* 4 Pillars of Excellence */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-[#A67C52] mb-1 block">
              ✦ Atelier Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#221617] uppercase tracking-wide">
              The Four Pillars of Our Craft
            </h2>
            <p className="text-xs sm:text-[13px] text-[#6E6A66] mt-2 font-sans">
              Uncompromising standards guiding every stitch, thread, and silhouette.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Scissors,
                title: 'Artisanal Karigari',
                desc: 'Handcrafted by third-generation master embroiderers preserving rare zardozi, dabka, cutdana, and gota patti techniques.',
              },
              {
                icon: Sparkles,
                title: 'Purest Textiles',
                desc: 'Ethically sourced mulberry raw silks, tissue chiffons, plush velvets, and hand-dyed organzas that drape with royal majesty.',
              },
              {
                icon: Heart,
                title: 'Bespoke Couture',
                desc: 'Personalized made-to-measure tailoring adapted to your posture, height, and personal bridal aesthetic.',
              },
              {
                icon: ShieldCheck,
                title: 'Heirloom Longevity',
                desc: 'Reinforced seams, precision breathable lining, and bespoke keepsake packaging engineered to last for generations.',
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white border border-[#E8D8C8] p-6 sm:p-7 rounded-xs shadow-[0_4px_16px_rgba(34,22,23,0.03)] flex flex-col justify-between text-center transition-all duration-300 hover:border-[#C49A5A] hover:-translate-y-1"
                >
                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] mx-auto mb-4">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-serif text-sm uppercase tracking-wide text-[#221617] mb-2 font-semibold">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#5C554E] leading-relaxed font-sans">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* The Bespoke Bridal Journey */}
        <section className="bg-white border border-[#E8D8C8] p-8 sm:p-12 rounded-xs shadow-[0_4px_20px_rgba(34,22,23,0.03)] space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-[#A67C52] mb-1 block">
              ✦ Creation Stages
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#221617] uppercase tracking-wide">
              The Bespoke Bridal Journey
            </h2>
            <p className="text-xs text-[#7D756C] mt-2 font-sans">
              From the initial virtual design consultation to the final white-glove delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Styling Consultation',
                text: 'One-on-one virtual or in-person discussion to understand your ceremony theme, silhouette preferences, and color palette.',
              },
              {
                step: '02',
                title: 'Pattern & Swatches',
                text: 'Master pattern cutters draft your individualized proportions, accompanied by silk color swatches and embroidery mockups.',
              },
              {
                step: '03',
                title: 'Karigari & Stitching',
                text: 'Over 200 hours of delicate zardozi, dabka, and pearl embroidery crafted onto hand-stretched wooden adda frames.',
              },
              {
                step: '04',
                title: 'Trial & Delivery',
                text: '48-point quality inspection, trial adjustments, and signature weather-sealed insured dispatch to your doorstep.',
              },
            ].map((st) => (
              <div key={st.step} className="bg-[#FAF7F2] p-5 sm:p-6 rounded-xs border border-[#E8D8C8] space-y-2.5 text-center font-sans flex flex-col justify-between">
                <div>
                  <span className="w-10 h-10 rounded-full bg-[#221617] text-[#C49A5A] font-serif font-bold text-sm flex items-center justify-center mx-auto mb-3 shadow-xs">
                    {st.step}
                  </span>
                  <h4 className="font-serif text-sm uppercase tracking-wider text-[#221617] font-semibold">{st.title}</h4>
                  <p className="text-xs text-[#5C554E] leading-relaxed mt-1">{st.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Invitation Section */}
        <section className="bg-[#221617] text-white border border-[#C49A5A]/40 p-8 sm:p-14 text-center rounded-xs space-y-6 shadow-md">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C49A5A] block">
            ✦ Your Wedding Milestone
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-wide text-white">
            Begin Your Bespoke Bridal Journey
          </h2>
          <p className="text-xs sm:text-sm text-white/75 max-w-xl mx-auto leading-relaxed font-sans">
            Explore our curated bridal edits or connect with our head couturier on WhatsApp for personal guidance on sizing, fabrics, and ceremony ensembles.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 font-sans">
            <Link
              href="/bridal"
              className="w-full sm:w-auto bg-[#C49A5A] text-[#1A1011] hover:bg-[#FAF7F2] text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-3.5 transition-all rounded-xs shadow-xs"
            >
              Explore Bridal Edit →
            </Link>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20consult%20for%20my%20bridal%20outfit.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-3.5 transition-colors rounded-xs flex items-center justify-center gap-2"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Stylist</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
