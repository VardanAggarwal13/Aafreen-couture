import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { collections } from '@/config/navigation.config';

export const metadata: Metadata = {
  title: 'All Collections | Aafreen Couture',
  description: 'Explore our curated collections of bridal lehengas, suits, dresses, and accessories.',
};

const COLLECTION_IMAGES: Record<string, string> = {
  'bridal-lehengas-suits': '/images/products/noor-e-ishq.webp',
  'bridesmaid-lehengas': '/images/products/gulbahar.webp',
  'formals-cotton-kurta-set': '/images/products/mehrunissa-anarkali.webp',
  'indo-western': '/images/products/roshani-coord.webp',
  'signature-co-ord-sets': '/images/products/roshani-coord.webp',
  'summer-essentials': '/images/products/zarafshan.webp',
  'partywear-unstitched': '/images/products/shahzadi-sharara.webp',
  'custom-embroidered-suits': '/images/products/mehrunissa-anarkali.webp',
  'saree-edit': '/images/products/zarafshan.webp',
  'jewellery': '/images/products/sitara-polki-choker.webp',
  'the-bag-edit': '/images/products/begum-potli.webp',
  'occasion-lehengas': '/images/products/noor-e-ishq.webp',
};

const COLLECTION_GRADIENTS: Record<string, string> = {
  'bridal-lehengas-suits': 'from-[#2C1510] via-[#5C2A1A] to-[#C49A5A]',
  'bridesmaid-lehengas': 'from-[#1A1225] via-[#3E2060] to-[#B589D6]',
  'formals-cotton-kurta-set': 'from-[#0E1A14] via-[#1E3028] to-[#6BA88A]',
  'indo-western': 'from-[#141A1A] via-[#1A3030] to-[#5E9E9E]',
  'signature-co-ord-sets': 'from-[#1A1225] via-[#2E1A40] to-[#9B7EC4]',
  'summer-essentials': 'from-[#1A1510] via-[#2E2518] to-[#E8C56A]',
  'partywear-unstitched': 'from-[#1A100E] via-[#3A1A14] to-[#D4826A]',
  'custom-embroidered-suits': 'from-[#0E100E] via-[#1A2018] to-[#7EA86A]',
  'saree-edit': 'from-[#1A0E14] via-[#381828] to-[#C46A8A]',
  'jewellery': 'from-[#181408] via-[#2A2010] to-[#C49A5A]',
  'the-bag-edit': 'from-[#101018] via-[#1A1A30] to-[#8A8AC4]',
  'occasion-lehengas': 'from-[#1A100E] via-[#301A14] to-[#C49A5A]',
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Page header */}
      <div className="bg-white border-b border-[#E8D8C8] py-14 text-center">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.4em] text-[#A67C52] mb-3">
          Curated For You
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#221617] uppercase tracking-wider">All Collections</h1>
        <p className="mt-3 text-xs sm:text-sm text-[#6E6A66] max-w-md mx-auto font-sans">
          Discover our world of timeless bridal and ethnic fashion, handcrafted with love.
        </p>
      </div>

      {/* Collections grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {collections.map((col) => {
            const slug = col.href.replace('/collections/', '');
            const imgSrc = COLLECTION_IMAGES[slug];
            const gradient = COLLECTION_GRADIENTS[slug] ?? 'from-[#1A1A1A] via-[#2A2A2A] to-[#C49A5A]';
            return (
              <Link
                key={col.href}
                href={col.href}
                className="group relative overflow-hidden aspect-[3/4] rounded-xs border border-[#E8D8C8] shadow-2xs bg-[#FAF7F2]"
              >
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={col.label}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${gradient} transition-transform duration-700 group-hover:scale-105`}
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#221617]/90 via-[#221617]/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-white font-serif text-base leading-snug">{col.label}</h2>
                  <span className="inline-block mt-2 text-[10px] text-[#A67C52] font-semibold tracking-wider uppercase border-b border-[#A67C52]/40 pb-0.5 opacity-90 group-hover:text-white transition-colors">
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
