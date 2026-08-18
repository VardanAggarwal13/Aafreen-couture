'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { homeCategories } from '@/config/navigation.config';

const FALLBACK_GRADIENTS: Record<string, string> = {
  'Bridal Lehengas':    'from-[#2C1510] to-[#C49A5A]',
  'Bridesmaid Lehengas':'from-[#1A1225] to-[#B589D6]',
  'Suits':              'from-[#0E1A14] to-[#6BA88A]',
  'Co-ord Sets':        'from-[#141A1A] to-[#5E9E9E]',
  'Jewellery':          'from-[#181408] to-[#C49A5A]',
  'The Bag Edit':       'from-[#101018] to-[#8A8AC4]',
};

function CategoryCircle({ label, href, image }: { label: string; href: string; image: string }) {
  const [err, setErr] = useState(false);
  const gradient = FALLBACK_GRADIENTS[label] ?? 'from-[#221617] to-[#A67C52]';

  return (
    <Link href={href} className="group flex flex-col items-center gap-3.5">
      <div className="relative w-[96px] h-[96px] sm:w-[120px] sm:h-[120px] lg:w-[136px] lg:h-[136px] rounded-full overflow-hidden ring-[2px] ring-[#E8D8C8] group-hover:ring-[#A67C52] group-hover:ring-2 transition-all duration-300 shadow-xs">
        {!err ? (
          <Image
            src={image}
            alt={label}
            fill
            className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
            sizes="(max-width: 640px) 96px, (max-width: 1024px) 120px, 136px"
            onError={() => setErr(true)}
          />
        ) : (
          <div className={`absolute inset-0 bg-linear-to-br ${gradient}`} />
        )}
      </div>
      <span className="text-xs font-semibold text-[#221617] tracking-[0.08em] text-center leading-tight group-hover:text-[#A67C52] transition-colors uppercase max-w-[110px]">
        {label}
      </span>
    </Link>
  );
}

export function CategoryGrid() {
  return (
    <section className="py-20 lg:py-24 bg-[#FAF7F2] border-b border-[#E8D8C8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="text-center text-xs lg:text-sm font-semibold tracking-[0.35em] text-[#221617] uppercase mb-12 lg:mb-16">
          Shop By Category
        </h2>
        <div className="flex items-start justify-center gap-6 sm:gap-10 lg:gap-14 flex-wrap">
          {homeCategories.map((cat) => (
            <CategoryCircle key={cat.href} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
