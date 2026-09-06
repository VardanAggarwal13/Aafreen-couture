'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { buttonVariants } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative h-[88vh] sm:h-[90vh] lg:h-[92vh] overflow-hidden bg-[#0c0a08]">

      {/* Background image — 100% full brightness and clarity */}
      <Image
        src="/images/hero-banner.webp"
        alt="Aafreen Couture — The Bridal Edit"
        fill
        priority
        className="object-cover object-[center_30%] opacity-100"
        sizes="100vw"
      />

      {/* Soft dark vignette on left side to ensure high text contrast */}
      <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/25 to-transparent" />

      {/* Content — scoped to left column so it never overlaps the background bride or pillars */}
      <div className="relative h-full flex items-center">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-20 w-full">
          <div className="max-w-[340px] sm:max-w-[440px] lg:max-w-[480px] text-left">

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-4 sm:mb-5 lg:mb-6"
            >
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.35em] sm:tracking-[0.45em] text-[#C49A5A]">
                Bridal Collection 2026
              </span>
            </motion.div>

            {/* Title — stacked 2 lines to stay on left column */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.7 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08] uppercase tracking-[0.08em] sm:tracking-[0.1em] mb-5 sm:mb-6 lg:mb-7 drop-shadow-md"
            >
              The Bridal<br />Edit
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xs sm:text-sm text-white/90 font-sans tracking-wide leading-relaxed max-w-[320px] mb-8 lg:mb-10"
            >
              Handcrafted Lehengas & Regal Attire
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.5 }}
            >
              <Link
                href="/collections/bridal-lehengas-suits"
                className={buttonVariants({ variant: 'couture-gold', size: 'couture-lg' })}
              >
                Discover Collection
              </Link>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="w-px h-8 bg-white/30 origin-top"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
