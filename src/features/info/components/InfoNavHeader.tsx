'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Truck,
  RefreshCw,
  HelpCircle,
  Phone,
  FileText,
  Shield,
} from 'lucide-react';

const INFO_LINKS = [
  { href: '/about', label: 'Our Story', icon: Sparkles },
  { href: '/shipping-policy', label: 'Shipping & Delivery', icon: Truck },
  { href: '/returns-policy', label: 'Exchange & Returns', icon: RefreshCw },
  { href: '/faq', label: 'Help & FAQs', icon: HelpCircle },
  { href: '/contact', label: 'Contact Concierge', icon: Phone },
  { href: '/terms', label: 'Terms & Service', icon: FileText },
  { href: '/privacy-policy', label: 'Privacy Policy', icon: Shield },
];

export function InfoNavHeader() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Atelier Client Care & Information Navigation"
      className="sticky top-[var(--header-h)] z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-[0_2px_8px_rgba(34,22,23,0.03)] transition-all"
    >
      <div className="max-w-[90rem] mx-auto px-3 sm:px-6 lg:px-10">
        <div className="relative flex items-center">
          {/* Scrollable Nav Container with refined pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 sm:py-3 scrollbar-none w-full">
            {INFO_LINKS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === '/terms' && pathname === '/terms-of-service') ||
                (item.href === '/returns-policy' &&
                  (pathname === '/return-policy' ||
                    pathname === '/refund-policy' ||
                    pathname === '/cancellation-policy')) ||
                (item.href === '/faq' && pathname === '/faqs');

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 text-[0.65625rem] sm:text-[0.6875rem] font-semibold tracking-[0.14em] uppercase shrink-0 select-none ${
                    isActive
                      ? 'bg-gold/20 text-heading border border-gold shadow-xs'
                      : 'bg-white/80 border border-border text-text hover:text-heading hover:border-gold/50 hover:bg-background'
                  }`}
                >
                  <Icon
                    size="0.75rem"
                    className={`shrink-0 ${isActive ? 'text-gold-ink' : 'text-gold-ink opacity-80'}`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
