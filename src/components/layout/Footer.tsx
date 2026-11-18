import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site.config';
import { FooterGate } from '@/components/layout/FooterGate';
import { FooterNav } from '@/components/layout/FooterNav';
import { NewsletterForm } from '@/components/layout/NewsletterForm';

const COLLECTION_LINKS = [
  { href: '/bridal', label: 'Bridal Lehengas' },
  { href: '/suits', label: 'Luxury Suits' },
  { href: '/ready-to-wear', label: 'Ready To Wear' },
  { href: '/jewellery', label: 'Royal Jewellery' },
  { href: '/bags', label: 'The Bag Edit' },
  { href: '/occasions', label: 'Shop By Occasion' },
];

const CARE_LINKS = [
  { href: '/about', label: 'Our Story & Atelier' },
  { href: '/contact', label: 'Contact & Appointments' },
  { href: '/shipping-policy', label: 'Shipping & Delivery' },
  { href: '/returns-policy', label: 'Exchange & Returns' },
  { href: '/faq', label: 'Help & FAQs' },
  { href: '/blog', label: 'The Journal' },
];

const LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/returns-policy', label: 'Exchange & Refund' },
  { href: '/shipping-policy', label: 'Shipping Policy' },
];

function FooterLinkList({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="pb-3 md:pb-0">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="flex min-h-11 items-center text-[0.84375rem] text-text transition-colors hover:text-gold active:text-gold md:min-h-0 md:py-1.5 md:text-[0.8125rem]"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Server component: only the newsletter form, the mobile accordions and the back-to-top button
 * are client islands, so the footer adds almost no JavaScript to any page.
 */
export function Footer() {
  const year = new Date().getFullYear();

  const socialButton =
    'flex h-11 w-11 items-center justify-center rounded-full border border-heading/25 bg-transparent text-heading transition-all hover:border-heading hover:bg-heading hover:text-footer active:scale-95';

  return (
    <FooterGate>
    <footer className="cv-auto mt-auto border-t border-heading/10 bg-footer font-sans text-heading">
      {/* 1. Newsletter */}
      <div className="border-b border-heading/10 bg-heading/[0.05] px-4 py-9 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.32em] text-gold-ink">The Atelier Newsletter</p>
          <h2 className="mb-2 font-serif text-[1.625rem] leading-tight tracking-tight text-heading sm:text-3xl">
            Join The World of Aafreen Couture
          </h2>
          <p className="mx-auto mb-6 max-w-sm text-[0.8125rem] leading-relaxed text-[#6F533F] sm:text-sm">
            Collection previews, bespoke bridal invitations and atelier stories, straight to your inbox.
          </p>

          <NewsletterForm />
        </div>
      </div>

      {/* 2. Directory */}
      <div className="px-4 pb-4 pt-10 sm:px-6 lg:px-10 lg:pb-12 lg:pt-14">
        <div className="mx-auto flex max-w-[87.5rem] flex-col lg:grid lg:grid-cols-12 lg:gap-x-10">
          {/* Brand */}
          <div className="flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-left">
            <Link href="/" className="inline-block select-none transition-opacity hover:opacity-90" aria-label="Aafreen Couture home">
              <Image
                src="/images/logo-header.webp"
                alt="Aafreen Couture By Pearl"
                width={240}
                height={114}
                className="h-16 w-auto object-contain sm:h-[4.5rem]"
              />
            </Link>
            <p className="mt-4 max-w-xs text-[0.84375rem] leading-relaxed text-text lg:max-w-sm">
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
                <Mail size="1.0625rem" />
              </a>
              <a href={`tel:${siteConfig.phone}`} className={socialButton} aria-label="Call us">
                <Phone size="1.0625rem" />
              </a>
            </div>
          </div>

          {/* Concierge card: first thing a phone visitor can act on */}
          <div className="order-none mt-8 lg:order-last lg:col-span-4 lg:mt-0">
            <div className="rounded-2xl border border-heading/10 bg-heading/[0.05] p-5 sm:p-6">
              <p className="mb-1 text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-gold-ink">Boutique Concierge</p>
              <h3 className="mb-4 font-serif text-xl leading-snug text-heading">Plan your bridal look with our stylists</h3>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-heading text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-surface transition-colors hover:bg-gold active:scale-[0.98]"
                >
                  <Phone size="0.9375rem" /> Call
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-emerald-800/30 bg-emerald-800/10 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-emerald-900 transition-colors hover:bg-emerald-800/20 active:scale-[0.98]"
                >
                  <WhatsAppIcon width={16} height={16} /> WhatsApp
                </a>
              </div>

              <ul className="mt-4 space-y-3 text-[0.8125rem] text-[#6F533F]">
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 transition-colors hover:text-gold">
                    <Mail size="0.9375rem" className="shrink-0 text-gold" />
                    <span className="min-w-0 break-all">{siteConfig.email}</span>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size="0.9375rem" className="mt-0.5 shrink-0 text-gold" />
                  <span>Mon – Sat, 10:30 AM – 7:30 PM IST</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size="0.9375rem" className="mt-0.5 shrink-0 text-gold" />
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
            <FooterNav title="Help & Info">
              <FooterLinkList links={CARE_LINKS} />
            </FooterNav>
          </div>
        </div>
      </div>

      {/* 3. Copyright, policy links and credit */}
      <div className="border-t border-heading/10 px-4 pb-8 pt-6 sm:px-6 lg:px-10 lg:py-5">
        <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 items-center gap-3 text-center text-xs text-text lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
          <p className="order-2 text-[0.71875rem] lg:order-1 lg:text-left">© {year} Aafreen Couture By Pearl. All Rights Reserved.</p>

          <nav aria-label="Legal" className="order-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[0.75rem] lg:order-2">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="py-1.5 transition-colors hover:text-gold">
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="order-3 text-[0.8125rem] lg:pr-14 lg:text-right">
            <a
              href="https://smartvings.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-1 transition-colors hover:text-gold hover:underline underline-offset-2"
            >
              Design &amp; Developed by <span className="font-semibold text-heading">Smartvings</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
    </FooterGate>
  );
}
