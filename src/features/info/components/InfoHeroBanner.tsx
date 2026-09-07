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
  badge = '✦ Aafreen Atelier Client Care',
  title,
  italicTitle,
  subtitle,
  metaInfo,
}: InfoHeroBannerProps) {
  return (
    <section className="relative bg-gradient-to-b from-[#F5EFEB] via-[#FAF7F2] to-[#FAF7F2] border-b border-[#E8D8C8] overflow-hidden py-12 sm:py-16 lg:py-20 text-center">
      {/* Subtle royal geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#221617 1px, transparent 1px), radial-gradient(#C49A5A 1px, #FAF7F2 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-[#8C7A6B] mb-5 font-sans"
        >
          <Link href="/" className="hover:text-[#A67C52] transition-colors">
            Home
          </Link>
          <ChevronRight size={10} className="text-[#C49A5A]" />
          <span className="text-[#221617] font-semibold">{title}</span>
        </nav>

        {/* Eyebrow Badge */}
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 border border-[#E8D8C8] text-[10px] sm:text-[10.5px] uppercase tracking-[0.28em] font-semibold text-[#A67C52] shadow-2xs mb-4">
            <span>{badge}</span>
          </div>
        )}

        {/* Main Title with Editorial Serif & Italic */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#221617] tracking-tight uppercase leading-tight">
          {title}{' '}
          {italicTitle && (
            <span className="font-serif italic capitalize lowercase font-normal text-[#A67C52] block sm:inline">
              &amp; {italicTitle}
            </span>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xs sm:text-sm lg:text-[15px] text-[#5C554E] font-sans max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* Metadata Strip */}
        {metaInfo && (
          <div className="mt-5 inline-flex items-center justify-center gap-2 text-[11px] text-[#8C7E72] font-sans border-t border-[#E8D8C8]/80 pt-3">
            <span>{metaInfo}</span>
          </div>
        )}
      </div>
    </section>
  );
}
