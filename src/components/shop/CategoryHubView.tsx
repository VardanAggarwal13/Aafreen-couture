'use client';

import { LoadingState } from '@/components/common/LoadingState';
import { ProductGridSkeleton } from '@/components/product/ProductCardSkeleton';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight, ChevronDown, ChevronRight, Ruler, Video, Gem } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { api } from '@/utils/api';
import { ProductCard } from '@/components/product/ProductCard';
import type { IProduct } from '@/types';
import type { PaginatedResponse } from '@/types/api.types';
import { buildBreadcrumbJsonLd, jsonLdString } from '@/utils/seo';

export interface HubChapter {
  id: string;
  chapterNum: string;
  title: string;
  subtitle: string;
  viewAllHref: string;
  categorySlug?: string;
  occasionSlug?: string;
  tag?: string;
  initialData?: PaginatedResponse<IProduct>;
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
  /** Optional descriptive card rendered beside the consultation panel (side by side on large screens). */
  seoContent?: React.ReactNode;
}

const OCCASION_CARDS = [
  { label: 'Engagement', href: '/occasions/engagement', image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872396/aafreen-couture/occasions/engagement.webp', tone: 'Cocktail & Rings' },
  { label: 'Haldi', href: '/occasions/haldi', image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872396/aafreen-couture/occasions/haldi.webp', tone: 'Sun-drenched Yellows' },
  { label: 'Mehendi', href: '/occasions/mehendi', image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872396/aafreen-couture/occasions/mehendi.webp', tone: 'Festive Greens & Flora' },
  { label: 'Sangeet', href: '/occasions/sangeet', image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872395/aafreen-couture/occasions/sangeet.webp', tone: 'High-Glitz Mirrorwork' },
  { label: 'Jago Edit', href: '/occasions/jago', image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872421/aafreen-couture/products/heer-jago-salwar-suit-1413.webp', tone: 'Midnight Revelry' },
  { label: 'Wedding', href: '/occasions/wedding', image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872395/aafreen-couture/occasions/wedding.webp', tone: 'Heirloom Crimson & Silk' },
  { label: 'Reception', href: '/occasions/reception', image: 'https://res.cloudinary.com/adzbklts/image/upload/v1791872396/aafreen-couture/occasions/reception.webp', tone: 'Sculptural Ballgowns' },
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
    initialData: chapter.initialData,
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
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 sm:mb-6 gap-4 pb-3 border-b border-[#E2D2C2]">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-[0.625rem] uppercase font-bold tracking-[0.35em] text-gold-ink">
                Chapter {chapter.chapterNum}
              </span>
              <span className="w-8 h-px bg-[#C49A5A]/60" />
              <span className="text-[0.625rem] uppercase tracking-[0.25em] text-[#6E5C4D]">
                Couture Archive
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#221617] tracking-tight">
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
            <ArrowRight size="0.8125rem" className="group-hover:translate-x-1 text-[#C49A5A] transition-transform" />
          </Link>
        </div>

        {/* Product Cards */}
        {isLoading ? (
          <LoadingState label={`Loading ${chapter.title}`}>
            <ProductGridSkeleton count={4} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" />
          </LoadingState>
        ) : products.length === 0 ? (
          <div className="text-center py-12 border border-[#E2D2C2] rounded-2xl p-8 max-w-lg mx-auto">
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
  seoContent,
}: CategoryHubProps) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { label: 'Home', href: '/' },
    { label: title },
  ]);

  return (
    <div className="min-h-dvh bg-[#FAF7F2]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="w-full bg-[#FAF7F2] border-b border-[#E8D8C8]/70">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[0.65625rem] uppercase tracking-[0.2em] text-[#6E5C4D]">
            <Link href="/" className="hover:text-[#A67C52] transition-colors">Home</Link>
            <ChevronRight size="0.625rem" className="text-[#C49A5A]" />
            <span className="text-[#221617] font-semibold">{title}</span>
          </nav>
        </div>
      </div>

      {/* Hero: text on the left, photo on the right as a clean rounded rectangle (no frame or border) */}
      <section className="bg-[#F5EFE6] border-b border-[#E8D4BE]">
        <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-5 lg:gap-10 px-6 sm:px-10 lg:px-12 py-6 sm:py-7 lg:py-8">
          <div className="order-2 lg:order-1 max-w-xl">
            <p className="inline-flex items-center gap-2 text-[0.65625rem] uppercase tracking-[0.3em] text-gold-ink font-semibold mb-2.5">
              <Sparkles size="0.75rem" className="text-[#C49A5A]" />
              {badge}
            </p>

            <h1 className="text-4xl sm:text-[2.625rem] lg:text-[2.875rem] font-serif text-[#221617] tracking-tight leading-[1.05] mb-2.5">
              {title}{' '}
              {italicTitle && <span className="italic font-light text-[#A67C52]">{italicTitle}</span>}
            </h1>

            <p className="text-sm text-[#4A433C] font-sans leading-relaxed mb-4">{heroSubtitle}</p>

            <ul className="space-y-1 mb-5">
              {heroHighlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2.5 text-[0.8125rem] text-[#3D332A] font-sans leading-snug">
                  <span className="mt-1.5 w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-3">
              <a href="#chapters" className={buttonVariants({ variant: 'couture', size: 'couture' })}>
                <span>Explore Subcategories</span>
                <ChevronDown size="0.8125rem" className="text-[#C49A5A]" />
              </a>
              <a
                href={consultationLink}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'couture-outline', size: 'couture' })}
              >
                <span>Book Consultation</span>
                <ArrowRight size="0.8125rem" className="text-[#C49A5A]" />
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2 mx-auto w-full max-w-[34rem]">
            <div className="relative aspect-[4/3] lg:aspect-[34/25] overflow-hidden rounded-2xl bg-[#E8D8C8] shadow-[0_18px_40px_-24px_rgba(46,34,28,0.45)]">
              <Image
                src={heroImage}
                alt={title}
                fill
                priority
                sizes="(max-width: 64em) 100vw, 544px"
                className={`object-cover ${heroObjectPosition}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky quick chapter jump bar */}
      <nav
        id="chapters"
        aria-label="Subcategory quick jump"
        className="sticky top-[var(--header-h)] z-20 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8D8C8]"
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 py-2.5 flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 text-[0.625rem] uppercase font-bold tracking-[0.22em] text-gold-ink shrink-0">
            <Sparkles size="0.6875rem" className="text-[#C49A5A]" />
            <span>Select Chapter:</span>
          </div>

          {/* Only the pills scroll sideways, so the label stays put and the page never shifts */}
          <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-1.5 sm:gap-2">
            {chapters.map((ch) => (
              <a
                key={ch.id}
                href={`#${ch.id}`}
                className="px-3 lg:px-2.5 py-1 rounded-full border border-[#D9C7B0] hover:border-[#221617] bg-transparent hover:bg-[#221617] text-[#221617] hover:text-[#FAF5EE] whitespace-nowrap uppercase tracking-[0.14em] lg:tracking-[0.1em] text-[0.625rem] font-medium transition-all duration-200"
              >
                <span className="text-gold-ink mr-1 font-bold">{ch.chapterNum}.</span>
                {ch.title}
              </a>
            ))}
            {showOccasionsGrid && (
              <a
                href="#bridal-occasions"
                className="px-3 lg:px-2.5 py-1 rounded-full border border-[#C49A5A] bg-transparent text-gold-ink whitespace-nowrap uppercase tracking-[0.14em] lg:tracking-[0.1em] text-[0.625rem] font-semibold hover:bg-[#C49A5A] hover:text-[#221617] transition-colors"
              >
                Bridal Occasions
              </a>
            )}
          </div>
          </div>
        </div>
      </nav>

      {/* Subcategory chapters */}
      <div>
        {chapters.map((ch, idx) => (
          <ChapterShelf key={ch.id} chapter={ch} isEven={idx % 2 === 0} />
        ))}

        {/* Bridal occasions: same cream surface, photo on top and caption underneath */}
        {showOccasionsGrid && (
          <section id="bridal-occasions" className="py-10 sm:py-12 lg:py-14 bg-[#F5EFE6] border-b border-[#E8D4BE]/60 scroll-mt-28">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12">
              <div className="text-center max-w-xl mx-auto mb-7 sm:mb-9">
                <span className="text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-gold-ink">The Milestone Gallery</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#221617] tracking-tight mt-1.5">
                  Shop By Bridal Occasion
                </h2>
                <p className="text-xs sm:text-sm text-[#5C554E] font-sans mt-2">
                  From golden Haldi celebrations to magnificent midnight reception ballgowns.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 sm:gap-5">
                {OCCASION_CARDS.map((occ) => (
                  <Link
                    key={occ.href}
                    href={occ.href}
                    // 7 cards never fill a 2- or 3-column grid evenly, so the last one is centred instead of left-stranded
                    className="group block max-sm:last:col-span-2 max-sm:last:mx-auto max-sm:last:w-[calc(50%-0.5rem)] sm:max-lg:last:col-start-2"
                  >
                    <div className="relative overflow-hidden aspect-[3/4] rounded-xl bg-[#E8D8C8]">
                      <Image
                        src={occ.image}
                        alt={occ.label}
                        fill
                        sizes="(max-width: 40em) 50vw, (max-width: 64em) 33vw, 16vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="pt-3 text-center">
                      <h3 className="text-[#221617] font-sans font-semibold text-sm group-hover:text-[#A67C52] transition-colors">
                        {occ.label}
                      </h3>
                      <p className="text-[0.625rem] text-gold-ink uppercase tracking-widest mt-0.5 font-semibold">{occ.tone}</p>
                      <span className="inline-block mt-1.5 text-[0.59375rem] uppercase tracking-widest text-[#6E5C4D] group-hover:text-[#221617] border-b border-[#C49A5A]/50 pb-0.5 transition-colors">
                        View Ensembles →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bespoke made-to-measure: plain two-column band on the same page colour and width as the sections above */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF7F2] border-t border-[#E8D8C8]">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12">
            <div className={seoContent ? 'grid gap-12 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-[#E8D8C8]' : ''}>
              <div className={seoContent ? 'lg:pr-12 xl:pr-20' : 'mx-auto max-w-3xl text-center'}>
                <div className={`mb-4 flex items-center gap-3 ${seoContent ? '' : 'justify-center'}`}>
                  <span aria-hidden="true" className="h-px w-8 bg-[#C49A5A]" />
                  <p className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.3em] text-gold-ink font-semibold">
                    Made-To-Measure Experience
                  </p>
                </div>
                <h2 className="text-[1.75rem] sm:text-4xl lg:text-[2.25rem] leading-[1.15] font-serif tracking-tight text-[#221617]">
                  Bespoke Couture Consultation
                </h2>
                <p className="mt-5 text-sm sm:text-[0.9375rem] text-[#5C554E] font-sans leading-[1.85]">
                  Every creation can be customized to your precise measurements, preferred color palette, and heirloom zardozi placement. Connect directly with our master atelier in Amritsar for a private virtual styling consultation.
                </p>
                <div className={`mt-7 flex flex-col sm:flex-row flex-wrap gap-3 ${seoContent ? '' : 'justify-center'}`}>
                  <a
                    href={consultationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: 'couture', size: 'couture', className: 'gap-1.5 justify-center' })}
                  >
                    <span>Inquire on WhatsApp</span>
                    <ArrowRight size="0.8125rem" className="text-[#C49A5A]" />
                  </a>
                  <Link
                    href="/contact"
                    className={buttonVariants({ variant: 'couture-outline', size: 'couture', className: 'justify-center' })}
                  >
                    Visit Atelier
                  </Link>
                </div>

                {/* Experience highlights: a quiet icon list, no boxes */}
                <ul
                  className="mt-8 pt-6 border-t border-[#E8D8C8] grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
                >
                  {[
                    { icon: Ruler, title: 'Made to your measurements' },
                    { icon: Video, title: 'Private virtual styling' },
                    { icon: Gem, title: 'Hand-finished in Amritsar' },
                  ].map(({ icon: Icon, title }) => (
                    <li key={title} className="flex items-center gap-3 sm:flex-col sm:gap-2.5 sm:text-center text-[0.8125rem] leading-snug font-sans text-[#3E322B]">
                      <Icon size="1.25rem" className="shrink-0 text-[#C49A5A]" aria-hidden="true" />
                      {title}
                    </li>
                  ))}
                </ul>
              </div>
              {seoContent}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
