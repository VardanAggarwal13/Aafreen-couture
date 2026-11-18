import Link from 'next/link';
import Image from 'next/image';
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
  const gradient = FALLBACK_GRADIENTS[label] ?? 'from-[#221617] to-[#A67C52]';

  return (
    <Link href={href} className="group flex flex-col items-center gap-2.5 sm:gap-3.5">
      <div className={`relative w-[5rem] h-[5rem] xs:w-[5.5rem] xs:h-[5.5rem] sm:w-[7.25rem] sm:h-[7.25rem] lg:w-[8.5rem] lg:h-[8.5rem] rounded-full overflow-hidden bg-linear-to-br ${gradient} ring-[2px] ring-[#E8D8C8] group-hover:ring-[#A67C52] group-hover:ring-2 transition-all duration-300 shadow-xs`}>
        <Image
            src={image}
            alt={label}
            fill
            className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
            sizes="(max-width: 40em) 88px, (max-width: 64em) 116px, 136px"
        />
      </div>
      <span className="text-[0.6875rem] sm:text-xs font-semibold text-[#221617] tracking-[0.06em] sm:tracking-[0.08em] text-center leading-tight group-hover:text-[#8A6240] transition-colors uppercase max-w-[5.3125rem] xs:max-w-[5.9375rem] sm:max-w-[6.875rem]">
        {label}
      </span>
    </Link>
  );
}

export function CategoryGrid() {
  return (
    <section className="py-10 sm:py-12 lg:py-14 bg-[#FAF7F2] border-b border-[#E8D8C8]">
      <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="text-center text-xs lg:text-sm font-semibold tracking-[0.35em] text-[#221617] uppercase mb-6 sm:mb-8 lg:mb-10">
          Shop By Category
        </h2>
        <div className="flex items-start justify-center gap-3.5 xs:gap-5 sm:gap-10 lg:gap-14 flex-wrap">
          {homeCategories.map((cat) => (
            <CategoryCircle key={cat.href} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
