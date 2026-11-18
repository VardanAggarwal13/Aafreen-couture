import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface OccasionItem {
  label: string;
  href: string;
  image: string;
  tone: string;
}

const OCCASIONS_DATA: OccasionItem[] = [
  {
    label: 'Engagement',
    href: '/occasions/engagement',
    image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872396/aafreen-couture/occasions/engagement.webp',
    tone: 'Cocktail & Rings',
  },
  {
    label: 'Haldi',
    href: '/occasions/haldi',
    image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872396/aafreen-couture/occasions/haldi.webp',
    tone: 'Sunlit Yellows',
  },
  {
    label: 'Mehendi',
    href: '/occasions/mehendi',
    image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872396/aafreen-couture/occasions/mehendi.webp',
    tone: 'Festive Flora',
  },
  {
    label: 'Sangeet',
    href: '/occasions/sangeet',
    image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872395/aafreen-couture/occasions/sangeet.webp',
    tone: 'High-Glitz Glamour',
  },
  {
    label: 'Jago Edit',
    href: '/occasions/jago',
    image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872421/aafreen-couture/products/heer-jago-salwar-suit-1413.webp',
    tone: 'Midnight Revelry',
  },
  {
    label: 'Wedding',
    href: '/occasions/wedding',
    image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872395/aafreen-couture/occasions/wedding.webp',
    tone: 'Sacred Pheras',
  },
  {
    label: 'Reception',
    href: '/occasions/reception',
    image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872396/aafreen-couture/occasions/reception.webp',
    tone: 'Grand Finale Gowns',
  },
];

function OccasionCard({ occ, isLast }: { occ: OccasionItem; isLast?: boolean }) {
  return (
    <Link
      href={occ.href}
      className={cn(
        'group relative flex flex-col justify-end overflow-hidden aspect-[3/4.6] rounded-xl border border-[#E8D4BE]/60 bg-[#1A0E0C] shadow-sm hover:shadow-xl hover:border-[#C49A5A] transition-all duration-500',
        isLast &&
          'col-span-2 justify-self-center w-full max-w-[calc(50%-0.375rem)] sm:max-w-none sm:col-span-1 sm:col-start-2 md:col-start-auto lg:col-start-auto'
      )}
    >
      {/* Background Image */}
      <Image
          src={occ.image}
          alt={occ.label}
          fill
          sizes="(max-width: 40em) 50vw, (max-width: 64em) 33vw, 14vw"
          className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
        />

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#140B0A]/95 via-[#140B0A]/35 to-transparent pointer-events-none transition-opacity duration-500 group-hover:from-[#140B0A]/90" />

      {/* Card Content Plaque */}
      <div className="relative z-10 p-3 sm:p-3.5 text-center flex flex-col items-center">
        {/* Mood Tagline */}
        <span className="text-[0.5625rem] uppercase font-bold tracking-[0.22em] text-[#E8C06A] block mb-1">
          {occ.tone}
        </span>

        {/* Occasion Title */}
        <h3 className="font-serif text-white text-base sm:text-lg font-medium leading-snug tracking-tight group-hover:text-[#FAF5EE] transition-colors">
          {occ.label}
        </h3>

        {/* Micro Action Button */}
        <div className="mt-1.5 inline-flex items-center gap-1 text-[0.5625rem] uppercase tracking-[0.2em] font-semibold text-white/70 group-hover:text-white border-b border-[#C49A5A]/50 group-hover:border-[#C49A5A] pb-0.5 transition-all">
          <span>Explore</span>
          <ArrowRight size="0.625rem" className="text-[#C49A5A] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export function ShopByOccasion() {
  const isOdd = OCCASIONS_DATA.length % 2 !== 0;

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-[#FAF7F2] border-b border-[#E8D8C8]">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header with Couture Breadth */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 sm:mb-9 pb-4 border-b border-[#E8D4BE]/70 gap-4">
          <div>
            <div className="flex flex-nowrap items-center gap-1.5 min-[380px]:gap-2 mb-3 sm:mb-2">
              <Sparkles className="shrink-0 size-2.5 min-[380px]:size-3 text-[#C49A5A]" />
              <span className="whitespace-nowrap text-[0.5rem] min-[380px]:text-[0.5625rem] sm:text-[0.625rem] uppercase font-bold tracking-[0.18em] min-[380px]:tracking-[0.24em] sm:tracking-[0.35em] text-gold-ink">
                Ceremonial Edit
              </span>
              <span className="shrink-0 w-3 min-[380px]:w-5 sm:w-8 h-px bg-[#C49A5A]/60" />
              <span className="whitespace-nowrap text-[0.5rem] min-[380px]:text-[0.5625rem] sm:text-[0.625rem] uppercase font-normal min-[380px]:font-medium tracking-[0.15em] min-[380px]:tracking-[0.2em] sm:tracking-[0.25em] text-[#6E5C4D]">
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
            className="hidden md:inline-flex md:self-end items-center gap-1.5 text-xs font-semibold tracking-[0.16em] uppercase text-[#221617] hover:text-[#8A6240] transition-colors underline underline-offset-4"
          >
            View All Occasions <ArrowRight size="0.8125rem" />
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

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/occasions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.16em] uppercase text-[#221617] hover:text-[#8A6240] transition-colors underline underline-offset-4"
          >
            View All Occasions <ArrowRight size="0.8125rem" />
          </Link>
        </div>
      </div>
    </section>
  );
}
