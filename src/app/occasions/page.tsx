import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { shopByOccasion } from '@/config/navigation.config';

export const metadata: Metadata = {
  title: 'Shop By Occasion | Aafreen Couture',
  description: 'Find the perfect outfit for every occasion — from weddings and receptions to sangeet, mehendi, and festive celebrations.',
};

const OCCASION_GRADIENTS: Record<string, string> = {
  'Wedding':    'from-[#2C1510] to-[#C49A5A]',
  'Engagement': 'from-[#1A1225] to-[#B589D6]',
  'Reception':  'from-[#0E1A14] to-[#8BA88A]',
  'Mehendi':    'from-[#1A2008] to-[#8BAA5A]',
  'Haldi':      'from-[#2C2010] to-[#E8C06A]',
  'Sangeet':    'from-[#1A0E24] to-[#8B5AD6]',
  'Jago Edit':  'from-[#2A1015] to-[#D65A8B]',
};

export default function OccasionsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* 1. Haute Couture Editorial Split Hero (Left: Text on Pure Canvas | Right: Full-Height Picture with ZERO Overlap) */}
      <section className="w-full bg-[#FAF5EE] border-b border-[#E8D4BE] overflow-hidden">
        <div className="max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[460px] lg:min-h-[480px] xl:min-h-[500px]">
          {/* Left Side: Pure Editorial Text Canvas */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-6 sm:px-8 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-8 xl:py-9 bg-[#FAF5EE] text-[#221617] z-10">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#E8D4BE]/40 border border-[#C49A5A]/50 text-[9.5px] sm:text-[10px] uppercase tracking-[0.3em] text-[#A67C52] font-semibold w-fit mb-2.5">
              <Sparkles size={11} className="text-[#C49A5A]" />
              <span>Aafreen Atelier · Celebration Edit</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-serif text-[#221617] tracking-tight leading-[1.12] mb-1.5">
              The Milestone{' '}
              <span className="italic font-light text-[#A67C52]">Occasions</span>
            </h1>

            <div className="flex items-center gap-2.5 my-2">
              <div className="h-px w-8 bg-gradient-to-r from-[#C49A5A] to-transparent" />
              <span className="text-[#C49A5A] text-xs">✦</span>
              <div className="h-px w-8 bg-gradient-to-l from-[#C49A5A] to-transparent" />
            </div>

            <p className="text-xs sm:text-[12.5px] text-[#5C554E] font-sans leading-relaxed mb-3.5 max-w-lg">
              Find the perfect handcrafted couture look for every celebration — from intimate morning Haldi rituals to dramatic midnight reception galas.
            </p>

            <div className="space-y-1 pb-3 mb-3.5 border-b border-[#E8D4BE]/70">
              <div className="flex items-center gap-2 text-xs text-[#3D332A] font-serif tracking-wide">
                <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                <span>Bespoke ensembles curated for 7 royal wedding ceremonies</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#3D332A] font-serif tracking-wide">
                <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                <span>Pure heritage raw silks, velvets & delicate sheer organza</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#3D332A] font-serif tracking-wide">
                <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                <span>Personalized styling & bridal squad coordination</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="#occasions-grid"
                className={buttonVariants({ variant: 'couture', size: 'couture' })}
              >
                <span>Explore All Occasions</span>
                <ChevronDown size={13} className="text-[#C49A5A]" />
              </a>

              <a
                href="https://wa.me/919876543210?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20inquire%20about%20Occasion%20Wear."
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'couture-outline', size: 'couture' })}
              >
                <span>Book Consultation</span>
                <ArrowRight size={13} className="text-[#C49A5A]" />
              </a>
            </div>

            <p className="text-[9.5px] uppercase tracking-[0.2em] text-[#8C7A6B] font-sans mt-2.5">
              7 Dedicated Occasion Collections Available
            </p>
          </div>

          {/* Right Side: Full-Height Picture Showcase (Proper Alignment, ZERO Text Overlap) */}
          <div className="lg:col-span-6 xl:col-span-7 relative w-full h-[360px] sm:h-[420px] lg:h-auto min-h-[360px] lg:min-h-[480px] xl:min-h-[500px] overflow-hidden bg-[#1A0E0C] border-t lg:border-t-0 lg:border-l border-[#E8D4BE]/80">
            <Image
              src="/images/occasions/wedding.webp"
              alt="Aafreen Couture Occasions"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-[center_20%]"
            />
          </div>
        </div>
      </section>

      {/* Occasions grid */}
      <div id="occasions-grid" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-14 scroll-mt-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
          {shopByOccasion.map((occ) => {
            const gradient = OCCASION_GRADIENTS[occ.label] ?? 'from-[#221617] to-[#A67C52]';
            return (
              <Link
                key={occ.href}
                href={occ.href}
                className="group relative overflow-hidden aspect-[3/4] rounded-xs border border-[#E8D8C8] shadow-2xs bg-[#FAF7F2]"
              >
                {occ.image ? (
                  <Image
                    src={occ.image}
                    alt={occ.label}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-700"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-linear-to-br ${gradient}`} />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#221617]/85 via-[#221617]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h2 className="text-white font-serif text-base leading-tight uppercase tracking-wider">{occ.label}</h2>
                  <span className="inline-block mt-2 text-[10px] text-[#A67C52] font-semibold tracking-widest uppercase border-b border-[#A67C52]/40 pb-0.5 group-hover:text-white transition-colors">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
