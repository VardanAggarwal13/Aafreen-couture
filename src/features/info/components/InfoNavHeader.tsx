'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, RefreshCw, Shield, Truck, Phone, HelpCircle, Sparkles } from 'lucide-react';

const INFO_LINKS = [
  { href: '/terms', label: 'Terms & Conditions', icon: FileText },
  { href: '/returns-policy', label: 'Exchange & Refunds', icon: RefreshCw },
  { href: '/privacy-policy', label: 'Privacy Policy', icon: Shield },
  { href: '/shipping-policy', label: 'Shipping & Delivery', icon: Truck },
  { href: '/contact', label: 'Contact & Concierge', icon: Phone },
  { href: '/faq', label: 'Help & FAQs', icon: HelpCircle },
  { href: '/about', label: 'Our Atelier', icon: Sparkles },
];

export function InfoNavHeader() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8D8C8] shadow-2xs transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <nav
          aria-label="Legal & Information Pages Navigation"
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs font-sans"
        >
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
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all text-[11px] font-medium tracking-wider uppercase select-none ${
                  isActive
                    ? 'bg-[#221617] text-[#C49A5A] shadow-xs'
                    : 'text-[#6E6A66] hover:text-[#221617] hover:bg-[#E8D8C8]/40'
                }`}
              >
                <Icon size={12} className={isActive ? 'text-[#C49A5A]' : 'opacity-70'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
