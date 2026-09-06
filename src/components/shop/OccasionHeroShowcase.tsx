'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface OccasionHeroLook {
  id: string;
  title: string;
  ceremony: string;
  craft: string;
  image: string;
  href: string;
}

const OCCASION_LOOKS: OccasionHeroLook[] = [
  {
    id: 'wedding',
    title: 'The Wedding Day',
    ceremony: 'Sacred Vows & Royal Nuptials',
    craft: 'Heirloom Crimson Zardozi & Velvet Kalis',
    image: '/images/occasions/wedding.webp',
    href: '/occasions/wedding',
  },
  {
    id: 'jago',
    title: 'Jago Night',
    ceremony: 'Midnight Punjabi Celebrations',
    craft: 'Authentic Pure Raw Silk Salwar Suit with Tilla Work',
    image: '/images/products/heer-jago-salwar-suit-1413.webp',
    href: '/occasions/jago',
  },
  {
    id: 'sangeet',
    title: 'Sangeet Glamour',
    ceremony: 'High-Glamour Dance Soirée',
    craft: 'Royal Blue Chandelier Kali Lehenga',
    image: '/images/occasions/sangeet.webp',
    href: '/occasions/sangeet',
  },
  {
    id: 'haldi',
    title: 'Haldi Ceremony',
    ceremony: 'Sun-Drenched Morning Rituals',
    craft: 'Sunshine Yellow Gota Patti & Sheer Organza',
    image: '/images/occasions/haldi.webp',
    href: '/occasions/haldi',
  },
  {
    id: 'rivaayat',
    title: 'Royal Bandhani',
    ceremony: 'Signature Heritage Bridal',
    craft: 'Handcrafted Antique Dabka & Bandhani Silk',
    image: '/images/products/rivaayat-bridal-lehenga-1072.webp',
    href: '/bridal/bridal-lehengas',
  },
];

export function OccasionHeroShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeLook = OCCASION_LOOKS[activeIdx];

  return (
    <div className="w-full max-w-[440px] sm:max-w-[460px] lg:max-w-[480px] mx-auto">
      {/* Museum-Grade Archival Matte Frame (Safe Portrait Ratio, Zero Crop) */}
      <div className="relative p-2.5 sm:p-3.5 bg-white/95 border border-[#E8D4BE] shadow-[0_16px_45px_rgba(34,22,23,0.08)] rounded-xs">
        {/* Inner Frame with 3:4 Vertical Portrait Ratio (Matches 896x1200 full-length photography) */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xs border border-[#C49A5A]/35 bg-[#FAF5EE]">
          <Image
            key={activeLook.image}
            src={activeLook.image}
            alt={activeLook.title}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 480px"
            className="object-cover object-center transition-opacity duration-300"
          />

          {/* Discreet Top Corner Atelier Badge */}
          <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#221617]/80 backdrop-blur-xs text-[9px] uppercase font-bold tracking-[0.2em] text-[#FAF5EE] pointer-events-none">
            <Sparkles size={10} className="text-[#C49A5A]" />
            <span>{activeLook.title}</span>
          </div>
        </div>

        {/* Clean Museum Plaque Below the Picture (NO text covering the dress) */}
        <div className="mt-3 pt-2.5 border-t border-[#E8D4BE]/70 flex items-center justify-between text-[#221617]">
          <div className="min-w-0 pr-2">
            <span className="text-[9.5px] uppercase font-bold tracking-[0.25em] text-[#C49A5A] block truncate">
              {activeLook.ceremony}
            </span>
            <p className="font-serif text-xs sm:text-sm font-medium tracking-wide text-[#221617] mt-0.5 truncate">
              {activeLook.craft}
            </p>
          </div>
          <Link
            href={activeLook.href}
            className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#A67C52] hover:text-[#221617] transition-colors border-b border-[#C49A5A] pb-0.5 shrink-0 inline-flex items-center gap-1"
          >
            <span>Explore</span>
            <ArrowRight size={10} />
          </Link>
        </div>
      </div>

      {/* Ceremony Switcher Chips */}
      <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
        {OCCASION_LOOKS.map((look, i) => (
          <button
            key={look.id}
            type="button"
            onClick={() => setActiveIdx(i)}
            className={`text-[9.5px] uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
              activeIdx === i
                ? 'border-[#C49A5A] bg-[#221617] text-[#FAF5EE] font-semibold shadow-xs'
                : 'border-[#E8D4BE] bg-white/80 text-[#6E6A66] hover:border-[#C49A5A]/60 hover:text-[#221617]'
            }`}
          >
            {look.title}
          </button>
        ))}
      </div>
    </div>
  );
}
