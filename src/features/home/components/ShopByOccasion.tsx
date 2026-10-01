'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export interface OccasionItem {
  num: string;
  label: string;
  href: string;
  image: string;
  tone: string;
}

const OCCASIONS_DATA: OccasionItem[] = [
  {
    num: '01',
    label: 'Engagement',
    href: '/occasions/engagement',
    image: '/images/occasions/engagement.webp',
    tone: 'Cocktail & Rings',
  },
  {
    num: '02',
    label: 'Haldi',
    href: '/occasions/haldi',
    image: '/images/occasions/haldi.webp',
    tone: 'Sunlit Yellows',
  },
  {
    num: '03',
    label: 'Mehendi',
    href: '/occasions/mehendi',
    image: '/images/occasions/mehendi.webp',
    tone: 'Festive Flora',
  },
  {
    num: '04',
    label: 'Sangeet',
    href: '/occasions/sangeet',
    image: '/images/occasions/sangeet.webp',
    tone: 'High-Glitz Glamour',
  },
  {
    num: '05',
    label: 'Jago Edit',
    href: '/occasions/jago',
    image: '/images/products/heer-jago-salwar-suit-1413.webp',
    tone: 'Midnight Revelry',
  },
  {
    num: '06',
    label: 'Wedding',
    href: '/occasions/wedding',
    image: '/images/occasions/wedding.webp',
    tone: 'Sacred Pheras',
  },
  {
    num: '07',
    label: 'Reception',
    href: '/occasions/reception',
    image: '/images/occasions/reception.webp',
    tone: 'Grand Finale Gowns',
  },
];

function OccasionCard({ occ, isLast }: { occ: OccasionItem; isLast?: boolean }) {
  const [err, setErr] = useState(false);

  return (
    <Link
      href={occ.href}
      prefetch={true}
      className={cn(
        'group relative flex flex-col justify-end overflow-hidden aspect-[3/4.6] rounded-xl border border-[#E8D4BE]/60 bg-[#1A0E0C] shadow-sm hover:shadow-xl hover:border-[#C49A5A] transition-all duration-500',
        isLast &&
          'col-span-2 justify-self-center w-full max-w-[calc(50%-6px)] sm:max-w-none sm:col-span-1 sm:col-start-2 md:col-start-auto lg:col-start-auto'
      )}
    >
      {/* Background Image */}
      {!err ? (
        <Image
          src={occ.image}
          alt={occ.label}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 14vw"
          className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
          onError={() => setErr(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1510] to-[#140B0A]" />
      )}

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#140B0A]/95 via-[#140B0A]/35 to-transparent pointer-events-none transition-opacity duration-500 group-hover:from-[#140B0A]/90" />

      {/* Ceremony Order Index Chip */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[9px] font-mono tracking-widest text-white/90">
          {occ.num}
        </span>
      </div>

      {/* Card Content Plaque */}
      <div className="relative z-10 p-3 sm:p-3.5 text-center flex flex-col items-center">
        {/* Mood Tagline */}
        <span className="text-[9px] uppercase font-bold tracking-[0.22em] text-[#E8C06A] block mb-1">
          {occ.tone}
        </span>

        {/* Occasion Title */}
        <h3 className="font-serif text-white text-base sm:text-lg font-medium leading-snug tracking-tight group-hover:text-[#FAF5EE] transition-colors">
          {occ.label}
        </h3>

        {/* Micro Action Button */}
        <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] font-semibold text-white/70 group-hover:text-white border-b border-[#C49A5A]/50 group-hover:border-[#C49A5A] pb-0.5 transition-all">
          <span>Explore</span>
          <ArrowRight size={10} className="text-[#C49A5A] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export function ShopByOccasion() {
  const isOdd = OCCASIONS_DATA.length % 2 !== 0;

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-[#FAF7F2] border-b border-[#E8D8C8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header with Couture Breadth */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 sm:mb-9 pb-4 border-b border-[#E8D4BE]/70 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} className="text-[#C49A5A]" />
              <span className="text-[10px] uppercase font-bold tracking-[0.35em] text-[#C49A5A]">
                Ceremonial Edit
              </span>
              <span className="w-8 h-px bg-[#C49A5A]/60" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7A6B]">
                Milestone Occasions
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#221617] tracking-tight">
              Shop By Celebration
            </h2>

            <p className="text-xs sm:text-sm text-[#5C554E] font-sans mt-1 max-w-xl leading-relaxed">
              From sunlit morning Haldi rituals and midnight Jago dances to sacred wedding vows and grand reception galas.
            </p>
          </div>

          <Link
            href="/occasions"
            prefetch={true}
            className={buttonVariants({
              variant: 'couture-outline',
              size: 'couture-sm',
              className: 'group shrink-0 self-start md:self-end',
            })}
          >
            <span>Explore All 7 Occasions</span>
            <ArrowRight size={12} className="text-[#C49A5A] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 7-Occasion Balanced Editorial Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 lg:gap-3.5">
          {OCCASIONS_DATA.map((occ, idx) => (
            <OccasionCard
              key={occ.href}
              occ={occ}
              isLast={isOdd && idx === OCCASIONS_DATA.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
