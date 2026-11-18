import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';

/**
 * Server component: the hero is the page's largest paint, so it ships no client JavaScript.
 * Entrance effects are CSS animations (never hiding the heading or the image), which keeps
 * framer-motion out of the homepage's critical path.
 */
export function HeroSection() {
  return (
    <section className="relative h-[88svh] sm:h-[90svh] lg:h-[92svh] overflow-hidden bg-[#0c0a08]">

      {/* Background image — 100% full brightness and clarity */}
      <Image
        src="https://res.cloudinary.com/adzbklts/image/upload/v1791872394/aafreen-couture/banners/hero-banner.webp"
        alt="Aafreen Couture — The Bridal Edit"
        fill
        priority
        fetchPriority="high"
        className="object-cover object-[center_30%] opacity-100"
        sizes="100vw"
      />

      {/* Soft dark vignette on left side to ensure high text contrast */}
      <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/25 to-transparent" />

      {/* Content — scoped to left column so it never overlaps the background bride or pillars */}
      <div className="relative h-full flex items-center">
        <div className="max-w-[87.5rem] mx-auto px-5 sm:px-12 lg:px-20 w-full">
          <div className="max-w-[21.25rem] sm:max-w-[27.5rem] lg:max-w-[30rem] text-left">

            {/* Tagline */}
            <div className="mb-4 sm:mb-5 lg:mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
              <span className="font-display text-[0.625rem] sm:text-xs font-semibold uppercase tracking-[0.35em] sm:tracking-[0.45em] text-[#C49A5A]">
                Bridal Collection 2026
              </span>
            </div>

            {/* Title — stacked 2 lines to stay on left column */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08] tracking-tight mb-5 sm:mb-6 lg:mb-7 drop-shadow-md">
              <span className="sr-only">Aafreen Couture Bridal Lehengas &amp; Designer Suits — </span>
              The Bridal<br />Edit
            </h1>

            {/* Subtitle */}
            <p
              className="text-xs sm:text-sm text-white/90 font-sans tracking-wide leading-relaxed max-w-[20rem] mb-8 lg:mb-10 animate-in fade-in duration-500 fill-mode-both"
              style={{ animationDelay: '150ms' }}
            >
              Handcrafted Lehengas & Regal Attire
            </p>

            {/* CTA Button */}
            <div
              className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
              style={{ animationDelay: '250ms' }}
            >
              <Link
                href="/collections/bridal-lehengas-suits"
                className={buttonVariants({ variant: 'couture-gold', size: 'couture-lg' })}
              >
                Discover Collection
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-in fade-in duration-700 fill-mode-both"
        style={{ animationDelay: '600ms' }}
        aria-hidden="true"
      >
        <div className="w-px h-8 bg-white/30 origin-top animate-pulse" />
      </div>
    </section>
  );
}
