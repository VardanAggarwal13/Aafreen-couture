import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ChevronRight, ArrowRight, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { productRepository } from '@/server/repositories/product.repository';
import { ProductCard } from '@/components/product/ProductCard';
import type { IProduct } from '@/types';

export const metadata: Metadata = {
  title: 'Shop By Occasion | Aafreen Couture',
  description: 'Handcrafted couture for every milestone celebration — from sacred morning Haldi rituals and midnight Jago celebrations to opulent reception galas.',
};

const OCCASIONS_PRE_WEDDING = [
  {
    num: '01',
    label: 'Engagement',
    href: '/occasions/engagement',
    image: '/images/occasions/engagement.webp',
    tagline: 'Cocktail & Rings',
    description: 'Romantic pastels, glistening cutdana, and modern silhouette lehengas.',
  },
  {
    num: '02',
    label: 'Haldi',
    href: '/occasions/haldi',
    image: '/images/occasions/haldi.webp',
    tagline: 'Sun-Drenched Rituals',
    description: 'Sunshine yellows, delicate gota patti, and playful lightweight silhouettes.',
  },
  {
    num: '03',
    label: 'Mehendi',
    href: '/occasions/mehendi',
    image: '/images/occasions/mehendi.webp',
    tagline: 'Festive Flora & Henna',
    description: 'Vibrant lime greens, teals, and emeralds detailed with floral threadwork.',
  },
  {
    num: '04',
    label: 'Sangeet',
    href: '/occasions/sangeet',
    image: '/images/occasions/sangeet.webp',
    tagline: 'High-Glamour Dance Night',
    description: 'Dazzling high-octane mirrorwork, metallic sequins, and flowing silhouettes.',
  },
];

const OCCASIONS_MAIN_CELEBRATION = [
  {
    num: '05',
    label: 'Jago Night',
    href: '/occasions/jago',
    image: '/images/products/heer-jago-salwar-suit-1413.webp',
    tagline: 'Midnight Punjabi Celebrations',
    description: 'Authentic raw silk salwar suits with peacock tilla and rich Phulkari drapes.',
  },
  {
    num: '06',
    label: 'The Wedding Day',
    href: '/occasions/wedding',
    image: '/images/occasions/wedding.webp',
    tagline: 'Sacred Pheras & Royal Vows',
    description: 'Majestic scarlet lehengas, heirloom zardozi velvets, and royal couture.',
  },
  {
    num: '07',
    label: 'Reception Gala',
    href: '/occasions/reception',
    image: '/images/occasions/reception.webp',
    tagline: 'The Grand Evening Finale',
    description: 'Sculptural ballgowns, dramatic capes, and crystal-embroidered eveningwear.',
  },
];

export default async function OccasionsPage() {
  // Fetch spotlight products for 3 key ceremonies
  const [jagoData, haldiData, weddingData] = await Promise.all([
    productRepository.findMany({ occasion: 'jago' }, { page: 1, limit: 4 }),
    productRepository.findMany({ occasion: 'haldi' }, { page: 1, limit: 4 }),
    productRepository.findMany({ occasion: 'wedding' }, { page: 1, limit: 4 }),
  ]);

  const jagoProducts = (JSON.parse(JSON.stringify(jagoData.items ?? [])) as IProduct[]);
  const haldiProducts = (JSON.parse(JSON.stringify(haldiData.items ?? [])) as IProduct[]);
  const weddingProducts = (JSON.parse(JSON.stringify(weddingData.items ?? [])) as IProduct[]);

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* 1. Top Breadcrumb Bar (Distinct breathing separation from Navbar) */}
      <div className="w-full bg-[#FAF7F2] border-b border-[#E8D8C8]/70">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.2em] text-[#8C7A6B]">
            <Link href="/" className="hover:text-[#A67C52] transition-colors">Home</Link>
            <ChevronRight size={10} className="text-[#C49A5A]" />
            <span className="text-[#221617] font-semibold">Occasions</span>
          </nav>
        </div>
      </div>

      {/* 2. Haute Couture Editorial Framed Hero (Clean Inset Frame - ZERO Navbar Merging) */}
      <section className="w-full bg-[#FAF5EE] border-b border-[#E8D4BE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column: Editorial Storytelling */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-[#221617]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8D4BE]/40 border border-[#C49A5A]/50 text-[10px] uppercase tracking-[0.3em] text-[#A67C52] font-semibold w-fit mb-3">
                <Sparkles size={11} className="text-[#C49A5A]" />
                <span>Aafreen Atelier · Celebration Edit</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-serif text-[#221617] tracking-tight leading-[1.15] mb-2">
                The Milestone{' '}
                <span className="italic font-light text-[#A67C52]">Occasions</span>
              </h1>

              <div className="flex items-center gap-2.5 my-2.5">
                <div className="h-px w-10 bg-gradient-to-r from-[#C49A5A] to-transparent" />
                <span className="text-[#C49A5A] text-xs">✦</span>
                <div className="h-px w-10 bg-gradient-to-l from-[#C49A5A] to-transparent" />
              </div>

              <p className="text-xs sm:text-[13px] text-[#5C554E] font-sans leading-relaxed mb-4 max-w-lg">
                Find the perfect handcrafted couture look for every celebration — from intimate morning Haldi rituals and midnight Jago dances to dramatic royal wedding pheras and reception galas.
              </p>

              <div className="space-y-1.5 pb-4 mb-4 border-b border-[#E8D4BE]/80">
                <div className="flex items-center gap-2 text-xs text-[#3D332A] font-serif tracking-wide">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                  <span>Bespoke ensembles curated for 7 sacred wedding ceremonies</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#3D332A] font-serif tracking-wide">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                  <span>Pure heritage raw silks, velvets, organzas & Phulkari weaves</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#3D332A] font-serif tracking-wide">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                  <span>Personalized bridal squad styling & family coordination</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#occasions-grid"
                  className={buttonVariants({ variant: 'couture', size: 'couture' })}
                >
                  <span>Explore 7 Occasions</span>
                  <ArrowRight size={13} className="text-[#C49A5A]" />
                </a>

                <a
                  href="https://wa.me/919876543210?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20inquire%20about%20Occasion%20Wear."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: 'couture-outline', size: 'couture' })}
                >
                  <span>Book Consultation</span>
                  <ArrowRight size={13} className="text-[#C49A5A]" />
                </a>
              </div>
            </div>

            {/* Right Column: Balanced, Stable Haute Couture Showcase (4:3 Aspect Ratio) */}
            <div className="lg:col-span-6 xl:col-span-6 flex justify-center items-center">
              <div className="w-full max-w-[560px] mx-auto">
                <div className="relative p-2.5 sm:p-3 bg-white/95 border border-[#E8D4BE] shadow-[0_16px_50px_rgba(34,22,23,0.08)] rounded-xs">
                  {/* Inner Frame with 4:3 Stable Ratio (Matches exact 1200x896 dimensions, zero height overflow) */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xs border border-[#C49A5A]/35 bg-[#FAF5EE]">
                    <Image
                      src="/images/occasions/occasions-hero-stable.webp"
                      alt="Aafreen Couture Milestone Occasions - Royal Wedding Seated Grandeur"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                    />

                    {/* Subtle Corner Atelier Badge */}
                    <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#221617]/80 backdrop-blur-xs text-[9px] uppercase font-bold tracking-[0.2em] text-[#FAF5EE] pointer-events-none">
                      <Sparkles size={10} className="text-[#C49A5A]" />
                      <span>Royal Nuptials & Ceremonies</span>
                    </div>
                  </div>

                  {/* Clean Museum Plaque Below the Picture */}
                  <div className="mt-2.5 pt-2 border-t border-[#E8D4BE]/70 flex items-center justify-between text-[#221617]">
                    <div>
                      <span className="text-[9.5px] uppercase font-bold tracking-[0.25em] text-[#C49A5A] block">
                        Ceremonial Grandeur
                      </span>
                      <p className="font-serif text-xs sm:text-sm font-medium tracking-wide text-[#221617] mt-0.5">
                        Heirloom Velvet & Antique Zardozi Kalis
                      </p>
                    </div>
                    <a
                      href="#occasions-grid"
                      className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#A67C52] hover:text-[#221617] transition-colors border-b border-[#C49A5A] pb-0.5 shrink-0"
                    >
                      Explore 7 Occasions ↓
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The 7 Sacred Occasions Directory */}
      <section id="occasions-grid" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 scroll-mt-24">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-[0.35em] text-[#C49A5A]">
              Ceremonial Journey
            </span>
            <span className="w-8 h-px bg-[#C49A5A]/60" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7A6B]">
              Atelier Archive
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#221617] uppercase tracking-wide mb-2">
            The Seven Celebrations
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6A66] leading-relaxed">
            Every ceremony carries its own distinct palette, craftsmanship, and emotion. Choose an occasion to explore curated looks.
          </p>
        </div>

        {/* Tier 1: Pre-Wedding Celebrations (4 columns) */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-[#E8D8C8]">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#A67C52]">
              Part I · Pre-Wedding Celebrations
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {OCCASIONS_PRE_WEDDING.map((occ) => (
              <Link
                key={occ.href}
                href={occ.href}
                prefetch={true}
                className="group relative overflow-hidden aspect-[3/4] rounded-xs border border-[#E8D8C8] shadow-2xs bg-[#1A0E0C] hover:border-[#C49A5A] transition-all duration-300"
              >
                <Image
                  src={occ.image}
                  alt={occ.label}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#221617]/95 via-[#221617]/40 to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs border border-white/20 text-[9px] text-white/90 font-mono tracking-widest">
                  {occ.num}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <span className="text-[9.5px] uppercase font-semibold tracking-[0.2em] text-[#C49A5A] block mb-1">
                    {occ.tagline}
                  </span>
                  <h3 className="text-white font-serif text-lg leading-tight uppercase tracking-wider mb-1.5">
                    {occ.label}
                  </h3>
                  <p className="text-white/75 text-[11px] font-sans leading-snug line-clamp-2 mb-3">
                    {occ.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-[#E8C06A] font-semibold tracking-widest uppercase border-b border-[#E8C06A]/50 pb-0.5 group-hover:text-white group-hover:border-white transition-colors">
                    <span>Explore Collection</span>
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Tier 2: Grand Wedding Festivities (3 featured wide columns) */}
        <div>
          <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-[#E8D8C8]">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#A67C52]">
              Part II · Grand Wedding Celebrations
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {OCCASIONS_MAIN_CELEBRATION.map((occ) => (
              <Link
                key={occ.href}
                href={occ.href}
                prefetch={true}
                className="group relative overflow-hidden aspect-[4/3] sm:aspect-[16/11] rounded-xs border border-[#E8D8C8] shadow-2xs bg-[#1A0E0C] hover:border-[#C49A5A] transition-all duration-300"
              >
                <Image
                  src={occ.image}
                  alt={occ.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-[center_20%] group-hover:scale-106 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#221617]/95 via-[#221617]/35 to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs border border-white/20 text-[9px] text-white/90 font-mono tracking-widest">
                  {occ.num}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-left">
                  <span className="text-[10px] uppercase font-semibold tracking-[0.22em] text-[#C49A5A] block mb-1">
                    {occ.tagline}
                  </span>
                  <h3 className="text-white font-serif text-xl leading-tight uppercase tracking-wider mb-1.5">
                    {occ.label}
                  </h3>
                  <p className="text-white/80 text-xs font-sans leading-relaxed line-clamp-2 mb-3 max-w-md">
                    {occ.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-[#E8C06A] font-semibold tracking-widest uppercase border-b border-[#E8C06A]/50 pb-0.5 group-hover:text-white group-hover:border-white transition-colors">
                    <span>Explore Collection</span>
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Live Curated Spotlight 01: Jago Night Edit */}
      {jagoProducts.length > 0 && (
        <section className="py-10 sm:py-12 bg-[#FAF5EE] border-t border-b border-[#E8D4BE]/70">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-[#E2D2C2] gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C49A5A] block mb-1">
                  Spotlight 01 · Midnight Punjabi Revelry
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#221617] uppercase tracking-wide">
                  Jago Night Edit
                </h2>
                <p className="text-xs text-[#5C554E] mt-0.5">
                  Handcrafted raw silk salwar suits, peacock tilla embroidery, and vivid Phulkari drapes.
                </p>
              </div>
              <Link
                href="/occasions/jago"
                prefetch={true}
                className={buttonVariants({ variant: 'couture-outline', size: 'couture-sm', className: 'shrink-0' })}
              >
                <span>View All Jago ({jagoProducts.length})</span>
                <ArrowRight size={12} className="text-[#C49A5A]" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {jagoProducts.slice(0, 4).map((product, idx) => (
                <ProductCard key={String(product._id)} product={product} priority={idx < 2} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Live Curated Spotlight 02: Haldi Auspicious Rituals */}
      {haldiProducts.length > 0 && (
        <section className="py-10 sm:py-12 bg-[#FAF7F2] border-b border-[#E8D4BE]/70">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-[#E2D2C2] gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C49A5A] block mb-1">
                  Spotlight 02 · Sun-Drenched Joy
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#221617] uppercase tracking-wide">
                  The Haldi Ceremony
                </h2>
                <p className="text-xs text-[#5C554E] mt-0.5">
                  Lightweight silks, gota patti kalis, and floral threadwork crafted for morning rituals.
                </p>
              </div>
              <Link
                href="/occasions/haldi"
                prefetch={true}
                className={buttonVariants({ variant: 'couture-outline', size: 'couture-sm', className: 'shrink-0' })}
              >
                <span>View All Haldi ({haldiProducts.length})</span>
                <ArrowRight size={12} className="text-[#C49A5A]" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {haldiProducts.slice(0, 4).map((product, idx) => (
                <ProductCard key={String(product._id)} product={product} priority={idx < 2} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Live Curated Spotlight 03: The Royal Wedding */}
      {weddingProducts.length > 0 && (
        <section className="py-10 sm:py-12 bg-[#FAF5EE] border-b border-[#E8D4BE]/70">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-[#E2D2C2] gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C49A5A] block mb-1">
                  Spotlight 03 · Sacred Pheras & Heritage
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#221617] uppercase tracking-wide">
                  The Wedding Day
                </h2>
                <p className="text-xs text-[#5C554E] mt-0.5">
                  Heirloom zardozi lehengas and regal velvet kalis crafted for holy wedding vows.
                </p>
              </div>
              <Link
                href="/occasions/wedding"
                prefetch={true}
                className={buttonVariants({ variant: 'couture-outline', size: 'couture-sm', className: 'shrink-0' })}
              >
                <span>View All Wedding ({weddingProducts.length})</span>
                <ArrowRight size={12} className="text-[#C49A5A]" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {weddingProducts.slice(0, 4).map((product, idx) => (
                <ProductCard key={String(product._id)} product={product} priority={idx < 2} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Haute Couture Concierge Banner */}
      <section className="py-12 sm:py-16 bg-[#FAF7F2]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-6 sm:p-10 lg:p-12 bg-white border border-[#E8D4BE] shadow-[0_10px_35px_rgba(34,22,23,0.06)] rounded-xs text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FAF5EE] border border-[#C49A5A]/50 text-[#C49A5A] mb-3.5 mx-auto">
              <Sparkles size={18} />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.35em] text-[#A67C52] block mb-1">
              Bespoke Styling Service
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#221617] tracking-tight mb-2.5">
              Planning a Multi-Day Wedding Celebration?
            </h2>
            <p className="text-xs sm:text-sm text-[#5C554E] font-sans max-w-xl mx-auto leading-relaxed mb-6">
              From coordinated bride and bridal squad palettes to custom-tailored trousseau selections across all 7 ceremonies, our master atelier stylists provide personal guidance.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/919876543210?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20consult%20for%20my%20Wedding%20Occasions."
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'couture', size: 'couture' })}
              >
                <span>WhatsApp Atelier Stylist</span>
                <ArrowRight size={13} className="text-[#C49A5A]" />
              </a>

              <Link
                href="/bridal"
                className={buttonVariants({ variant: 'couture-outline', size: 'couture' })}
              >
                <span>Explore Bridal Edit</span>
                <ChevronRight size={13} className="text-[#C49A5A]" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
