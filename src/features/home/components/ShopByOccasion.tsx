'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { shopByOccasion } from '@/config/navigation.config';

const OCCASION_GRADIENTS: Record<string, string> = {
  'Wedding':    'from-[#2C1510] to-[#C49A5A]',
  'Engagement': 'from-[#1A1225] to-[#B589D6]',
  'Reception':  'from-[#0E1A14] to-[#8BA88A]',
  'Mehendi':    'from-[#1A2008] to-[#8BAA5A]',
  'Haldi':      'from-[#2C2010] to-[#E8C06A]',
  'Sangeet':    'from-[#1A0E24] to-[#8B5AD6]',
  'Cocktail':   'from-[#0E141A] to-[#5A8BAA]',
  'Festive':    'from-[#2C1A0E] to-[#C49A5A]',
  'Party Wear': 'from-[#1A0E18] to-[#C45A8B]',
  'Formal':     'from-[#0E0E14] to-[#6A6A8A]',
};

function OccasionCard({ label, href, image }: { label: string; href: string; image: string }) {
  const [err, setErr] = useState(false);
  const gradient = OCCASION_GRADIENTS[label] ?? 'from-[#221617] to-[#A67C52]';

  return (
    <Link href={href} className="group flex flex-col items-center gap-3">
      <div className="relative w-[84px] h-[106px] sm:w-[104px] sm:h-[130px] lg:w-[118px] lg:h-[148px] overflow-hidden rounded-xs border border-[#E8D8C8] shadow-2xs">
        {!err ? (
          <Image
            src={image}
            alt={label}
            fill
            className="object-cover object-top group-hover:scale-108 transition-transform duration-500"
            sizes="130px"
            onError={() => setErr(true)}
          />
        ) : (
          <div className={`absolute inset-0 bg-linear-to-br ${gradient}`} />
        )}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>
      <span className="text-[11px] font-semibold text-[#221617] tracking-[0.12em] uppercase text-center group-hover:text-[#A67C52] transition-colors">
        {label}
      </span>
    </Link>
  );
}

export function ShopByOccasion() {
  return (
    <section className="py-20 lg:py-24 bg-[#FAF7F2] border-b border-[#E8D8C8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-xs lg:text-sm font-semibold tracking-[0.35em] text-[#221617] uppercase mb-2">
            Shop By Occasion
          </h2>
          <p className="text-xs text-[#6E6A66] tracking-wide font-sans">Find the perfect look for every moment</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10">
          {shopByOccasion.map((occ) => (
            <OccasionCard key={occ.href} {...occ} />
          ))}
        </div>
      </div>
    </section>
  );
}
