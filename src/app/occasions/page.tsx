import type { Metadata } from 'next';
import Link from 'next/link';
import { shopByOccasion } from '@/config/navigation.config';

export const metadata: Metadata = {
  title: 'Shop By Occasion | Aafreen Couture',
  description: 'Find the perfect outfit for every occasion — from weddings and receptions to sangeet, mehendi, and festive celebrations.',
};

const GRADIENTS: Record<string, string> = {
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

export default function OccasionsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#FAF8F5] border-b border-[#E8D4A8] py-14 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-gold mb-3">Dress for the Moment</p>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1A1A]">Shop By Occasion</h1>
        <p className="mt-3 text-sm text-[#7A7A7A] max-w-sm mx-auto">
          Find the perfect look for every milestone.
        </p>
      </div>

      {/* Occasions grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {shopByOccasion.map((occ) => {
            const gradient = GRADIENTS[occ.label] ?? 'from-[#1A1A1A] to-[#C49A5A]';
            return (
              <Link
                key={occ.href}
                href={occ.href}
                className="group relative overflow-hidden aspect-[3/4]"
              >
                <div className={`absolute inset-0 bg-linear-to-br ${gradient} group-hover:scale-105 transition-transform duration-700`} />
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h2 className="text-white font-serif text-base leading-tight">{occ.label}</h2>
                  <span className="inline-block mt-2 text-[9px] text-brand-gold tracking-widest uppercase border-b border-brand-gold/40 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
