import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface InfoHeroBannerProps {
  badge?: string;
  title: string;
  italicTitle?: string;
  subtitle: string;
  metaInfo?: string;
}

export function InfoHeroBanner({
  badge = 'Aafreen Atelier Client Care',
  title,
  italicTitle,
  subtitle,
  metaInfo,
}: InfoHeroBannerProps) {
  return (
    <section className="relative bg-gradient-to-b from-navbar/50 via-background to-background border-b border-border overflow-hidden py-12 sm:py-16 lg:py-20 text-center">
      {/* Subtle royal geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(var(--heading) 1px, transparent 1px), radial-gradient(var(--gold) 1px, var(--background) 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      <div className="max-w-[75rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-center gap-2 text-[0.65625rem] uppercase tracking-[0.22em] text-text mb-5 font-sans"
        >
          <Link href="/" className="hover:text-gold-ink transition-colors">
            Home
          </Link>
          <ChevronRight size="0.625rem" className="text-gold" />
          <span className="text-heading font-semibold">{title}</span>
        </nav>

        {/* Eyebrow Badge */}
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 border border-border text-[0.625rem] sm:text-[0.65625rem] uppercase tracking-[0.28em] font-semibold text-gold-ink shadow-2xs mb-4">
            <span>{badge}</span>
          </div>
        )}

        {/* Main Title with Editorial Serif & Italic */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-heading tracking-tight leading-tight">
          {title}{' '}
          {italicTitle && (
            <span className="font-serif italic font-normal text-gold-ink block sm:inline">
              &amp; {italicTitle}
            </span>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xs sm:text-sm lg:text-[0.9375rem] text-text font-sans max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* Metadata Strip */}
        {metaInfo && (
          <div className="mt-5 inline-flex items-center justify-center gap-2 text-[0.6875rem] text-text font-sans border-t border-border/80 pt-3">
            <span>{metaInfo}</span>
          </div>
        )}
      </div>
    </section>
  );
}
