'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, Phone, ArrowRight, ArrowUp, ChevronDown, Clock, MapPin } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/icons';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site.config';
import { cn } from '@/lib/utils';

const COLLECTION_LINKS = [
  { href: '/bridal', label: 'Bridal Lehengas' },
  { href: '/suits', label: 'Luxury Suits' },
  { href: '/ready-to-wear', label: 'Ready To Wear' },
  { href: '/jewellery', label: 'Royal Jewellery' },
  { href: '/bags', label: 'The Bag Edit' },
  { href: '/occasions', label: 'Shop By Occasion' },
  { href: '/blog', label: 'The Journal' },
];

const CARE_LINKS = [
  { href: '/about', label: 'Our Story & Atelier' },
  { href: '/contact', label: 'Contact & Appointments' },
  { href: '/track-order', label: 'Track Your Order' },
  { href: '/shipping-policy', label: 'Shipping & Delivery' },
  { href: '/returns-policy', label: 'Exchange & Returns' },
  { href: '/faq', label: 'Help & FAQs' },
];

const LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/returns-policy', label: 'Exchange & Refund' },
  { href: '/shipping-policy', label: 'Shipping Policy' },
];

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'UPI', 'RuPay'];

export function Footer() {
  const pathname = usePathname();
  const isAuthRoute =
    pathname === '/login' ||
    pathname.startsWith('/login/') ||
    pathname === '/register' ||
    pathname.startsWith('/register/') ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/forgot-password/') ||
    pathname === '/verify-email' ||
    pathname.startsWith('/verify-email/');
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAuthRoute || isAdminRoute) {
    return null;
  }

  return <StorefrontFooter />;
}

/**
 * Collapsible on phones (large tap target, one section open at a time is not
 * enforced), always open from `lg` up. Links stay in the DOM when collapsed so
 * crawlers and screen readers still reach them; collapsed content is
 * `invisible`, which also removes it from the keyboard tab order.
 */
function FooterNav({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={cn('border-b border-heading/10 md:border-0', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full min-h-12 items-center justify-between text-left md:min-h-0 md:pb-4 md:pointer-events-none md:cursor-default"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-heading">{title}</span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={cn('text-gold transition-transform duration-300 md:hidden', open && 'rotate-180')}
        />
      </button>
      <div
        id={panelId}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out md:block',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className={cn('overflow-hidden md:overflow-visible', open ? 'visible' : 'invisible md:visible')}>
          {children}
        </div>
      </div>
    </div>
  );
}

function FooterLinkList({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="pb-3 md:pb-0">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="flex min-h-11 items-center text-[13.5px] text-text transition-colors hover:text-gold active:text-gold md:min-h-0 md:py-1.5 md:text-[13px]"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function StorefrontFooter() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    toast.success('Thank you for subscribing!', {
      description: 'You have been added to the Aafreen Couture private preview list.',
    });
    setEmail('');
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const socialButton =
    'flex h-11 w-11 items-center justify-center rounded-full border border-heading/25 bg-transparent text-heading transition-all hover:border-heading hover:bg-heading hover:text-footer active:scale-95';

  return (
    <footer className="mt-auto border-t border-heading/10 bg-footer font-sans text-heading">
      {/* 1. Newsletter */}
      <div className="border-b border-heading/10 bg-heading/[0.05] px-4 py-9 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">The Atelier Newsletter</p>
          <h2 className="mb-2 font-serif text-[26px] leading-tight tracking-tight text-heading sm:text-3xl">
            Join The World of Aafreen Couture
          </h2>
          <p className="mx-auto mb-6 max-w-sm text-[13px] leading-relaxed text-text sm:text-sm">
            Collection previews, bespoke bridal invitations and atelier stories, straight to your inbox.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="mx-auto flex max-w-md flex-col gap-2.5 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl sm:flex-1 border border-heading/20 bg-transparent px-4 text-base text-heading placeholder:text-text/70 transition-colors focus:border-gold focus:outline-none sm:text-sm"
              />
              <button
                type="submit"
                className="flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-heading px-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-surface transition-colors hover:bg-gold active:scale-[0.99]"
              >
                <span>Subscribe</span>
                <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            <p className="text-sm font-medium tracking-wide text-gold">Thank you for subscribing to our private preview list.</p>
          )}
        </div>
      </div>

      {/* 2. Directory */}
      <div className="px-4 pb-4 pt-10 sm:px-6 lg:px-10 lg:pb-12 lg:pt-14">
        <div className="mx-auto flex max-w-[1400px] flex-col lg:grid lg:grid-cols-12 lg:gap-x-10">
          {/* Brand */}
          <div className="flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-left">
            <Link href="/" className="inline-block select-none transition-opacity hover:opacity-90" aria-label="Aafreen Couture home">
              <Image
                src="/images/logo-header.webp"
                alt="Aafreen Couture By Pearl"
                width={240}
                height={114}
                className="h-16 w-auto object-contain sm:h-[72px]"
              />
            </Link>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-text lg:max-w-sm">
              Handcrafted luxury Indian bridal wear and bespoke couture, celebrating royal heritage craftsmanship with modern elegance.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className={socialButton} aria-label="Instagram">
                <InstagramIcon width={18} height={18} />
              </a>
              <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className={socialButton} aria-label="WhatsApp">
                <WhatsAppIcon width={18} height={18} />
              </a>
              <a href={`mailto:${siteConfig.email}`} className={socialButton} aria-label="Email">
                <Mail size={17} />
              </a>
              <a href={`tel:${siteConfig.phone}`} className={socialButton} aria-label="Call us">
                <Phone size={17} />
              </a>
            </div>
          </div>

          {/* Concierge card: first thing a phone visitor can act on */}
          <div className="order-none mt-8 lg:order-last lg:col-span-4 lg:mt-0">
            <div className="rounded-2xl border border-heading/10 bg-heading/[0.05] p-5 sm:p-6">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">Boutique Concierge</p>
              <h3 className="mb-4 font-serif text-xl leading-snug text-heading">Plan your bridal look with our stylists</h3>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-surface transition-colors hover:bg-gold active:scale-[0.98]"
                >
                  <Phone size={15} /> Call
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-emerald-800/30 bg-emerald-800/10 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-900 transition-colors hover:bg-emerald-800/20 active:scale-[0.98]"
                >
                  <WhatsAppIcon width={16} height={16} /> WhatsApp
                </a>
              </div>

              <ul className="mt-4 space-y-3 text-[13px] text-text">
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 transition-colors hover:text-gold">
                    <Mail size={15} className="shrink-0 text-gold" />
                    <span className="min-w-0 break-all">{siteConfig.email}</span>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={15} className="mt-0.5 shrink-0 text-gold" />
                  <span>Mon – Sat, 10:30 AM – 7:30 PM IST</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-gold" />
                  <span>SCO No. 43, 1st Floor, B-Block Market, New Amritsar, Amritsar, Punjab 143001</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Link groups: accordions on phones, side by side from tablet up */}
          <div className="mt-8 border-t border-heading/10 md:grid md:grid-cols-2 md:gap-x-8 md:border-0 lg:col-span-4 lg:mt-0">
            <FooterNav title="Collections">
              <FooterLinkList links={COLLECTION_LINKS} />
            </FooterNav>
            <FooterNav title="Client Care">
              <FooterLinkList links={CARE_LINKS} />
            </FooterNav>
          </div>
        </div>
      </div>

      {/* 3. Legal strip */}
      <div className="border-t border-heading/10 px-4 pb-8 pt-6 sm:px-6 lg:px-10 lg:py-5">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-5 text-xs text-text lg:flex-row lg:justify-between">
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[12px]">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="py-1.5 transition-colors hover:text-gold">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <ul className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Accepted payment methods">
              {PAYMENT_METHODS.map((method) => (
                <li
                  key={method}
                  className="rounded-md border border-heading/20 bg-transparent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text"
                >
                  {method}
                </li>
              ))}
            </ul>
            <button
              onClick={scrollToTop}
              className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-heading/25 bg-transparent px-4 text-[11px] font-semibold uppercase tracking-wider text-heading transition-colors hover:border-heading hover:bg-heading hover:text-footer active:scale-95"
              aria-label="Scroll to top"
            >
              Back to top <ArrowUp size={14} />
            </button>
          </div>

          <p className="text-center text-[11.5px] text-text/85">© {year} Aafreen Couture By Pearl. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
