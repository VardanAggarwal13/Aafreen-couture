'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { api } from '@/utils/api';
import { ProductCard } from '@/components/product/ProductCard';
import type { IProduct } from '@/types';
import type { PaginatedResponse } from '@/types/api.types';

export interface HubChapter {
  id: string;
  chapterNum: string;
  title: string;
  subtitle: string;
  viewAllHref: string;
  categorySlug?: string;
  occasionSlug?: string;
  tag?: string;
}

export interface CategoryHubProps {
  title: string;
  italicTitle?: string;
  badge?: string;
  heroSubtitle: string;
  heroImage: string;
  heroObjectPosition?: string;
  heroHighlights?: string[];
  consultationLink?: string;
  chapters: HubChapter[];
  showOccasionsGrid?: boolean;
}

const OCCASION_CARDS = [
  { label: 'Engagement', href: '/occasions/engagement', image: '/images/occasions/engagement.webp', tone: 'Cocktail & Rings' },
  { label: 'Haldi', href: '/occasions/haldi', image: '/images/occasions/haldi.webp', tone: 'Sun-drenched Yellows' },
  { label: 'Mehendi', href: '/occasions/mehendi', image: '/images/occasions/mehendi.webp', tone: 'Festive Greens & Flora' },
  { label: 'Sangeet', href: '/occasions/sangeet', image: '/images/occasions/sangeet.webp', tone: 'High-Glitz Mirrorwork' },
  { label: 'Wedding', href: '/occasions/wedding', image: '/images/occasions/wedding.webp', tone: 'Heirloom Crimson & Silk' },
  { label: 'Reception', href: '/occasions/reception', image: '/images/occasions/reception.webp', tone: 'Sculptural Ballgowns' },
];

function ChapterShelf({
  chapter,
  isEven,
}: {
  chapter: HubChapter;
  isEven: boolean;
}) {
  const { data, isLoading } = useQuery<PaginatedResponse<IProduct>>({
    queryKey: ['hub-chapter', chapter.categorySlug ?? '', chapter.occasionSlug ?? '', chapter.tag ?? ''],
    queryFn: () => {
      const q = new URLSearchParams();
      if (chapter.categorySlug) q.set('category', chapter.categorySlug);
      if (chapter.occasionSlug) q.set('occasion', chapter.occasionSlug);
      if (chapter.tag) q.set('q', chapter.tag);
      q.set('limit', '4');
      return api.getPaginated<IProduct>(`/api/products?${q.toString()}`);
    },
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });

  const products = data?.data ?? [];
  const total = data?.pagination?.total ?? products.length;

  return (
    <section
      id={chapter.id}
      className={`py-8 sm:py-10 lg:py-12 border-b border-[#E8D4BE]/60 scroll-mt-28 transition-colors ${
        isEven ? 'bg-[#FAF7F2]' : 'bg-[#F5EFE6]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 sm:mb-6 gap-4 pb-3 border-b border-[#E2D2C2]">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-[0.35em] text-[#C49A5A]">
                Chapter {chapter.chapterNum}
              </span>
              <span className="w-8 h-px bg-[#C49A5A]/60" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7A6B]">
                Couture Archive
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#221617] uppercase tracking-wide">
              {chapter.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C554E] mt-1 font-sans max-w-2xl leading-relaxed">
              {chapter.subtitle}
            </p>
          </div>

          <Link
            href={chapter.viewAllHref}
            prefetch={true}
            className={buttonVariants({ variant: 'couture-outline', size: 'couture-sm', className: 'group shrink-0' })}
          >
            <span>Explore All {chapter.title} ({total})</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 text-[#C49A5A] transition-transform" />
          </Link>
        </div>

        {/* Product Cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[3/4] bg-white/70 border border-[#E8D8C8] rounded-xs animate-pulse" />
                <div className="h-3 bg-[#E8D8C8]/60 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-[#E8D8C8]/40 rounded animate-pulse w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-14 bg-white/80 border border-[#E8D8C8] rounded-xs p-8 max-w-lg mx-auto shadow-2xs">
            <p className="text-sm text-[#5C554E] font-serif italic">
              New heirloom ensembles arriving shortly for {chapter.title}.
            </p>
            <Link
              href={chapter.viewAllHref}
              className="mt-4 inline-block text-xs uppercase tracking-[0.2em] font-semibold text-[#A67C52] hover:text-[#221617] border-b border-[#A67C52] pb-0.5 transition-colors"
            >
              View Full Collection →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.slice(0, 4).map((product, i) => (
              <ProductCard key={product._id} product={product} priority={i < 2} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function CategoryHubView({
  title,
  italicTitle,
  badge = 'Aafreen Atelier · Royal Heritage',
  heroSubtitle,
  heroImage,
  heroObjectPosition = 'object-center',
  heroHighlights = [
    '200+ hours of painstaking hand embroidery per ensemble',
    'Pure raw silks, heritage velvets & sheer organza dupattas',
    'Personalized made-to-measure couture consultation',
  ],
  consultationLink = 'https://wa.me/919517901117?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20inquire%20about%20the%20Collection.',
  chapters,
  showOccasionsGrid = false,
}: CategoryHubProps) {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* 0. Top Breadcrumb Bar (Distinct breathing separation from Navbar) */}
      <div className="w-full bg-[#FAF7F2] border-b border-[#E8D8C8]/70">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.2em] text-[#8C7A6B]">
            <Link href="/" className="hover:text-[#A67C52] transition-colors">Home</Link>
            <ChevronRight size={10} className="text-[#C49A5A]" />
            <span className="text-[#221617] font-semibold">{title}</span>
          </nav>
        </div>
      </div>

      {/* 1. Haute Couture Editorial Framed Split Hero (Safe Inset Frame - ZERO Navbar Merging) */}
      <section className="w-full bg-[#FAF5EE] border-b border-[#E8D4BE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Side: Pure Editorial Text Canvas (100% Crisp Legibility) */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center text-[#221617] z-10">
              {/* Royal Atelier Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#E8D4BE]/40 border border-[#C49A5A]/50 text-[9.5px] sm:text-[10px] uppercase tracking-[0.3em] text-[#A67C52] font-semibold w-fit mb-2.5">
                <Sparkles size={11} className="text-[#C49A5A]" />
                <span>{badge}</span>
              </div>

              {/* Grand Serif Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-serif text-[#221617] tracking-tight leading-[1.12] mb-1.5">
                {title}{' '}
                {italicTitle && (
                  <span className="italic font-light text-[#A67C52]">{italicTitle}</span>
                )}
              </h1>

              {/* Gold Diamond Accent Divider */}
              <div className="flex items-center gap-2.5 my-2">
                <div className="h-px w-8 bg-gradient-to-r from-[#C49A5A] to-transparent" />
                <span className="text-[#C49A5A] text-xs">✦</span>
                <div className="h-px w-8 bg-gradient-to-l from-[#C49A5A] to-transparent" />
              </div>

              {/* Narrative Subtitle */}
              <p className="text-xs sm:text-[12.5px] text-[#5C554E] font-sans leading-relaxed mb-3.5 max-w-lg">
                {heroSubtitle}
              </p>

              {/* Key Craftsmanship Highlights */}
              <div className="space-y-1 pb-3 mb-3.5 border-b border-[#E8D4BE]/70">
                {heroHighlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2 text-xs text-[#3D332A] font-serif tracking-wide">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="#chapters"
                  className={buttonVariants({ variant: 'couture', size: 'couture' })}
                >
                  <span>Explore Subcategories</span>
                  <ChevronDown size={13} className="text-[#C49A5A]" />
                </a>

                <a
                  href={consultationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: 'couture-outline', size: 'couture' })}
                >
                  <span>Book Consultation</span>
                  <ArrowRight size={13} className="text-[#C49A5A]" />
                </a>
              </div>

              <p className="text-[9.5px] uppercase tracking-[0.2em] text-[#8C7A6B] font-sans mt-2.5">
                {chapters.length} Curated Subcategory Chapters Available
              </p>
            </div>

            {/* Right Side: Museum-Grade Framed Picture Showcase (Zero Navbar Merging) */}
            <div className="lg:col-span-6 xl:col-span-7">
              <div className="relative p-2.5 sm:p-3.5 bg-white/95 border border-[#E8D4BE] shadow-[0_12px_40px_rgba(34,22,23,0.08)] rounded-xs">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/11] overflow-hidden rounded-2xs border border-[#C49A5A]/35 bg-[#FAF5EE]">
                  <Image
                    src={heroImage}
                    alt={title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className={`object-cover ${heroObjectPosition}`}
                  />
                </div>

                {/* Plaque Cleanly Beneath the Photo (Zero Overlay / Zero Dark Gradient) */}
                <div className="mt-3 pt-2.5 border-t border-[#E8D4BE]/70 flex items-center justify-between text-[#221617]">
                  <div>
                    <span className="text-[9.5px] uppercase font-bold tracking-[0.25em] text-[#C49A5A] block">
                      Haute Couture Edit
                    </span>
                    <p className="font-serif text-xs sm:text-sm font-medium tracking-wide text-[#221617] mt-0.5">
                      {title} {italicTitle}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#8C7A6B] uppercase tracking-widest font-sans border-b border-[#C49A5A] pb-0.5 shrink-0">
                    {chapters.length} Subcategories
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sleek Sticky Quick Chapter Jump Bar */}
      <nav
        id="chapters"
        aria-label="Subcategory quick jump"
        className="sticky top-[72px] sm:top-[76px] lg:top-[84px] z-20 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8D8C8] shadow-2xs"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-2 sm:py-2.5 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.22em] text-[#A67C52] shrink-0">
            <Sparkles size={11} className="text-[#C49A5A]" />
            <span>Select Chapter:</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {chapters.map((ch) => (
              <a
                key={ch.id}
                href={`#${ch.id}`}
                className="px-3 py-1 rounded-full border border-[#E8D4BE] hover:border-[#221617] bg-white hover:bg-[#221617] text-[#221617] hover:text-[#FAF5EE] whitespace-nowrap uppercase tracking-[0.14em] text-[10px] font-medium transition-all duration-200"
              >
                <span className="text-[#C49A5A] mr-1 font-bold">{ch.chapterNum}.</span>
                {ch.title}
              </a>
            ))}
            {showOccasionsGrid && (
              <a
                href="#bridal-occasions"
                className="px-3 py-1 rounded-full border border-[#C49A5A] bg-[#221617] text-[#FAF5EE] whitespace-nowrap uppercase tracking-[0.14em] text-[10px] font-semibold hover:bg-[#3D2628] transition-colors"
              >
                Bridal Occasions
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* 3. Subcategories Presented One By One (Alternating Editorial Chapters) */}
      <main>
        {chapters.map((ch, idx) => (
          <ChapterShelf
            key={ch.id}
            chapter={ch}
            isEven={idx % 2 === 0}
          />
        ))}

        {/* 4. Bridal Occasions Showcase */}
        {showOccasionsGrid && (
          <section id="bridal-occasions" className="py-10 sm:py-12 lg:py-14 bg-[#1F1210] text-[#FAF5EE] scroll-mt-28">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
              <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#C49A5A]">
                  ✦ The Milestone Gallery ✦
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#FAF5EE] uppercase tracking-wide mt-1.5">
                  Shop By Bridal Occasion
                </h2>
                <div className="flex items-center justify-center gap-2.5 my-2.5">
                  <div className="h-px w-8 bg-gradient-to-r from-[#C49A5A] to-transparent" />
                  <span className="text-[#C49A5A] text-xs">✦</span>
                  <div className="h-px w-8 bg-gradient-to-l from-[#C49A5A] to-transparent" />
                </div>
                <p className="text-xs sm:text-sm text-[#FAF5EE]/70 font-sans">
                  From golden Haldi celebrations to magnificent midnight reception ballgowns.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {OCCASION_CARDS.map((occ) => (
                  <Link
                    key={occ.href}
                    href={occ.href}
                    prefetch={true}
                    className="group relative overflow-hidden aspect-[3/4] rounded-xs border border-[#C49A5A]/30 shadow-md bg-[#140B0A]"
                  >
                    <Image
                      src={occ.image}
                      alt={occ.label}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140B0A]/95 via-[#140B0A]/30 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-3 sm:p-3.5 text-center">
                      <h3 className="text-white font-serif text-sm uppercase tracking-wider group-hover:text-[#E8D4BE] transition-colors">
                        {occ.label}
                      </h3>
                      <p className="text-[9px] text-[#C49A5A] uppercase tracking-widest mt-0.5 font-semibold">
                        {occ.tone}
                      </p>
                      <span className="inline-block mt-1.5 text-[8.5px] uppercase tracking-widest text-[#FAF5EE]/60 group-hover:text-white border-b border-[#C49A5A]/40 pb-0.5 transition-colors">
                        View Ensembles →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Bespoke Atelier Made-to-Measure Section */}
        <section className="py-10 sm:py-12 lg:py-14 bg-[#140B0A] text-white border-t border-[#C49A5A]/20">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 border border-[#C49A5A]/40 px-3.5 py-1 rounded-full text-[9.5px] uppercase tracking-[0.25em] text-[#C49A5A] font-semibold">
              ✦ Made-To-Measure Experience
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif tracking-tight text-[#FAF5EE]">
              Bespoke Couture Consultation
            </h2>
            <p className="text-xs sm:text-[13px] text-white/70 max-w-2xl mx-auto font-sans leading-relaxed">
              Every creation can be customized to your precise measurements, preferred color palette, and heirloom zardozi placement. Connect directly with our master atelier in Jaipur for a private virtual styling consultation.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={consultationLink}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'couture-gold', size: 'couture', className: 'gap-1.5' })}
              >
                <span>Inquire on WhatsApp</span>
                <ArrowRight size={13} />
              </a>
              <Link
                href="/contact"
                className={buttonVariants({ variant: 'outline', size: 'couture', className: 'border-white/30 hover:border-white text-white hover:bg-white/10' })}
              >
                Visit Atelier
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
