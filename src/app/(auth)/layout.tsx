import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: `Client Atelier Portal — ${siteConfig.name}`,
  description: 'Sign in to access your bespoke orders, bridal measurements, and exclusive preview collections.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-gold selection:text-white">
      {/* Minimalist Atelier Auth Top Bar */}
      <header className="border-b border-border/80 bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Back to Store Button */}
          <Link
            href={ROUTES.HOME}
            className="group flex items-center gap-2 text-xs font-sans uppercase tracking-[0.16em] text-text hover:text-gold transition-colors"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-gold" />
            <span className="font-semibold">Back to Store</span>
          </Link>

          {/* Centered Brand Logo */}
          <Link href={ROUTES.HOME} className="transition-transform hover:scale-102">
            <Image
              src="/images/logo-header.webp"
              alt={siteConfig.name}
              width={180}
              height={80}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Secure Client Portal Badge */}
          <div className="flex items-center gap-1.5 text-[11px] text-text/80 font-sans tracking-wider uppercase">
            <ShieldCheck size={14} className="text-gold" />
            <span className="hidden sm:inline font-medium">Atelier Security</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Flow */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Discreet Luxury Auth Footer */}
      <footer className="border-t border-border/70 py-4 bg-surface/50 text-[11px] font-sans text-text/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="tracking-wider">
            © {new Date().getFullYear()} {siteConfig.name} Atelier. Handcrafted Luxury.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 tracking-wider">
            <Link href="/privacy-policy" className="hover:text-heading transition-colors">Privacy Policy</Link>
            <span className="text-border">·</span>
            <Link href="/terms" className="hover:text-heading transition-colors">Terms of Service</Link>
            <span className="text-border">·</span>
            <Link href="/contact" className="hover:text-heading transition-colors">Client Concierge</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
