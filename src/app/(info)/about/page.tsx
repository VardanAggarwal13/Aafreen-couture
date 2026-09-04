import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Heart, Scissors, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story & Atelier | Aafreen Couture',
  description:
    'Discover the heritage, artistry, and vision behind Aafreen Couture — timeless Indian bridal wear and bespoke luxury handcrafted with royal elegance.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#221617]">
      {/* Luxury Hero Banner */}
      <div className="bg-[#1A1011] text-[#FAF7F2] py-16 sm:py-24 border-b border-[#C49A5A]/30 relative overflow-hidden text-center">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #C49A5A 0px, #C49A5A 1px, transparent 1px, transparent 14px)',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#2C1A1C] border border-[#C49A5A]/30 px-3.5 py-1 rounded-full text-[10.5px] text-[#C49A5A] uppercase tracking-[0.3em] font-semibold mb-4">
            <span>✦ The World of Aafreen Couture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif uppercase tracking-wider text-white leading-tight">
            Where Every Thread<br />
            <em className="text-[#C49A5A] not-italic">Tells a Regal Story</em>
          </h1>
          <p className="mt-5 text-xs sm:text-sm text-white/75 font-sans max-w-xl mx-auto leading-relaxed">
            Woven with centuries of Indian textile heritage, intricate embroidery, and modern silhouette design for life&apos;s most cherished milestones.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">
        
        {/* Brand Narrative Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6 font-sans text-xs sm:text-sm text-[#5C554E] leading-[2.2]">
          <p className="font-serif text-xl sm:text-2xl text-[#1A1011] uppercase tracking-wide leading-relaxed">
            &ldquo;We don&apos;t just craft garments; we curate heirlooms destined to be treasured across generations.&rdquo;
          </p>
          <p>
            <strong>Aafreen Couture By Pearl</strong> was born from an enduring passion for authentic Indian textile art, regal silhouettes, and the magical transcendence of bridal fashion. Founded to bridge timeless royal craftsmanship with contemporary elegance, our atelier creates pieces that celebrate individuality, grace, and royal splendor.
          </p>
          <p>
            Every bridal lehenga, custom-stitched suit, and handcrafted ensemble represents hundreds of artisan hours — master karigars painstakingly threading zardozi, dabka, resham, and gota patti onto the purest mulberry silks, handloom organza, and rich velvets.
          </p>
        </section>

        {/* 4 Pillars of Excellence */}
        <section className="space-y-8">
          <div className="text-center">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.35em] text-[#A67C52] mb-1.5">
              Our Core Philosophy
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1011] uppercase tracking-wide">
              The Pillars of Our Atelier
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Scissors,
                title: 'Artisanal Karigari',
                desc: 'Handcrafted by third-generation master embroiderers preserving rare zardozi and gota patti techniques.',
              },
              {
                icon: Sparkles,
                title: 'Purest Textiles',
                desc: 'Ethically sourced mulberry silks, handloom tissue, plush velvets, and fluid georgettes that drape flawlessly.',
              },
              {
                icon: Heart,
                title: 'Bespoke Couture',
                desc: 'Custom made-to-measure tailoring tailored to your unique posture, measurements, and bridal aesthetic.',
              },
              {
                icon: ShieldCheck,
                title: 'Heirloom Quality',
                desc: 'Reinforced seams, precision hand-lining, and protective garment storage designed to last a lifetime.',
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white border border-[#E8D8C8] p-6 rounded-sm shadow-xs flex flex-col justify-between text-center transition-transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] mx-auto mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-serif text-sm uppercase tracking-wide text-[#1A1011] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#5C554E] leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* The Atelier Creation Journey */}
        <section className="bg-white border border-[#E8D8C8] p-8 sm:p-12 rounded-sm shadow-xs space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.35em] text-[#A67C52] mb-1.5">
              How We Create
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1011] uppercase tracking-wide">
              The Bespoke Bridal Journey
            </h2>
            <p className="text-xs text-[#7D756C] mt-2 font-sans">
              From the initial virtual design consultation to the final steam pressing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { step: '01', title: 'Consultation', text: 'One-on-one virtual or in-person styling discussion to understand your vision, wedding theme, and fabric choices.' },
              { step: '02', title: 'Pattern & Swatches', text: 'Our master cutter creates custom drafted patterns with personalized body measurements and color swatches.' },
              { step: '03', title: 'Hand Embroidery', text: 'Master karigars bring the motifs to life with delicate hand zardozi, sequins, crystals, and gold threadwork.' },
              { step: '04', title: 'Fitting & Dispatch', text: 'Multi-point quality verification, custom lining, trial adjustments, and signature insured global delivery.' },
            ].map((st) => (
              <div key={st.step} className="text-center space-y-2 font-sans">
                <span className="w-10 h-10 rounded-full bg-[#221617] text-[#C49A5A] font-serif font-bold text-sm flex items-center justify-center mx-auto mb-3 shadow-xs">
                  {st.step}
                </span>
                <h4 className="font-serif text-sm uppercase tracking-wide text-[#1A1011]">{st.title}</h4>
                <p className="text-xs text-[#5C554E] leading-relaxed">{st.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-[#1A1011] text-white border border-[#C49A5A]/40 p-8 sm:p-14 text-center rounded-sm space-y-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #C49A5A 0px, #C49A5A 1px, transparent 1px, transparent 14px)',
            }}
          />
          <div className="relative z-10 max-w-xl mx-auto space-y-4 font-sans">
            <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-wide text-white">
              Begin Your Bridal Story
            </h2>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
              Explore our curated bridal collections or schedule a private consultation with our head couturier.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/collections/bridal-lehengas-suits"
                className="w-full sm:w-auto bg-[#C49A5A] text-[#1A1011] hover:bg-white text-[11px] font-semibold tracking-[0.22em] uppercase px-8 py-3.5 transition-colors rounded-xs"
              >
                Explore Bridal Edit
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto border border-white/40 hover:border-[#C49A5A] hover:text-[#C49A5A] text-[11px] font-semibold tracking-[0.22em] uppercase px-8 py-3.5 transition-colors rounded-xs"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
