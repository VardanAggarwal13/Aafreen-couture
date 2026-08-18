import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const COLLECTIONS = [
  {
    slug: 'bridal-lehengas-suits',
    name: 'Bridal Collection',
    description: 'Statement pieces crafted for your special day',
    itemCount: '24 pieces',
    image: '/images/products/noor-e-ishq.webp',
  },
  {
    slug: 'signature-co-ord-sets',
    name: 'Signature Co-Ord Sets',
    description: 'Curated sets that define modern elegance',
    itemCount: '18 pieces',
    image: '/images/products/signature-coord.webp',
  },
  {
    slug: 'saree-edit',
    name: 'The Saree Edit',
    description: 'Grace in every drape — timeless silk sarees',
    itemCount: '15 pieces',
    image: '/images/products/zarafshan.webp',
  },
  {
    slug: 'the-bag-edit',
    name: 'The Bag Edit',
    description: 'Handcrafted potlis and luxury clutches',
    itemCount: '20 pieces',
    image: '/images/products/luxury-potli.webp',
  },
];

export function FeaturedCollections() {
  return (
    <section className="py-20 lg:py-24 bg-white border-b border-[#E8D8C8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-12 lg:mb-16">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-wide text-[#221617] uppercase">
              Featured Collections
            </h2>
            <p className="text-xs text-[#6E6A66] mt-1 font-sans">
              Editorial showcases curated by Aafreen Couture By Pearl
            </p>
          </div>
          <Link
            href="/collections"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[#221617] hover:text-[#A67C52] transition-colors underline underline-offset-4"
          >
            View All Collections <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group relative overflow-hidden aspect-[3/4] bg-[#FAF7F2] border border-[#E8D8C8] rounded-xs shadow-2xs"
            >
              <Image
                src={col.image}
                alt={col.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700"
              />
              {/* Text overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#221617]/90 via-[#221617]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <p className="text-[10px] text-[#A67C52] uppercase tracking-[0.2em] mb-1 font-semibold">
                  {col.itemCount}
                </p>
                <h3 className="text-white font-serif text-lg sm:text-xl leading-snug">{col.name}</h3>
                <p className="text-white/70 text-xs mt-1.5 hidden sm:block leading-relaxed font-sans">{col.description}</p>
                <span className="inline-block mt-3 text-[11px] text-[#A67C52] tracking-wider uppercase border-b border-[#A67C52]/40 pb-0.5 group-hover:text-white transition-colors font-semibold">
                  Explore Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
