import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
};

export default function OccasionsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8D8C8] py-14 text-center">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.4em] text-[#A67C52] mb-3">
          Dress for the Moment
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#221617] uppercase tracking-wider">
          Shop By Occasion
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[#6E6A66] max-w-sm mx-auto font-sans">
          Find the perfect handcrafted look for every milestone celebration.
        </p>
      </div>

      {/* Occasions grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
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
