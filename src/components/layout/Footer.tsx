'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, Phone, ArrowRight, ArrowUp, MessageCircle } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/icons';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site.config';

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

  return (
    <footer className="bg-footer text-heading mt-auto border-t border-border font-sans">
      {/* 1. Sleek Minimal Newsletter */}
      <div className="border-b border-border bg-background py-8 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <p className="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.3em] text-gold mb-1.5">
            The Atelier Newsletter
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-heading tracking-tight mb-2">
            Join The World of Aafreen Couture
          </h2>
          <p className="text-xs sm:text-sm text-text max-w-md mx-auto mb-5 sm:mb-6 leading-relaxed font-sans px-2">
            Subscribe for exclusive collection previews, bespoke bridal invitations, and atelier stories.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 sm:gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
                required
                className="flex-1 bg-surface border border-border px-4 py-2.5 sm:py-2.5 text-base sm:text-xs text-heading placeholder:text-text/60 rounded-lg focus:outline-none focus:border-gold transition-colors h-11 sm:h-auto"
              />
              <button
                type="submit"
                className="bg-heading hover:bg-gold text-surface text-xs sm:text-[11px] font-semibold uppercase tracking-[0.2em] px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer h-11 sm:h-auto active:scale-[0.99]"
              >
                <span>Subscribe</span>
                <ArrowRight size={13} />
              </button>
            </form>
          ) : (
            <p className="text-xs text-gold font-medium tracking-wide">
              Thank you for subscribing to our private preview list.
            </p>
          )}
        </div>
      </div>

      {/* 2. Main Footer Directory — 2 columns on mobile, 4 columns on desktop */}
      <div className="py-8 sm:py-12 lg:py-14">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-8 sm:gap-y-10 lg:gap-10">
            
            {/* Brand Column — Spans full width on mobile, 1 col on desktop */}
            <div className="col-span-2 lg:col-span-1 space-y-3.5 sm:space-y-4 pb-2 sm:pb-0">
              <Link href="/" className="inline-block select-none transition-opacity hover:opacity-90">
                <Image
                  src="/images/logo-header.webp"
                  alt="Aafreen Couture By Pearl"
                  width={240}
                  height={114}
                  className="h-12 sm:h-14 lg:h-15 w-auto object-contain"
                />
              </Link>

              <p className="text-xs text-text leading-relaxed max-w-sm font-sans">
                Handcrafted luxury Indian bridal wear and bespoke couture, celebrating royal heritage craftsmanship with modern elegance.
              </p>

              {/* Social Channels — Touch-friendly tap targets */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-border bg-surface flex items-center justify-center text-heading/80 hover:text-gold hover:border-gold transition-colors active:scale-95 shadow-2xs"
                  aria-label="Instagram"
                >
                  <InstagramIcon width={16} height={16} />
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-border bg-surface flex items-center justify-center text-heading/80 hover:text-gold hover:border-gold transition-colors active:scale-95 shadow-2xs"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon width={16} height={16} />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-border bg-surface flex items-center justify-center text-heading/80 hover:text-gold hover:border-gold transition-colors active:scale-95 shadow-2xs"
                  aria-label="Email"
                >
                  <Mail size={15} />
                </a>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-border bg-surface flex items-center justify-center text-heading/80 hover:text-gold hover:border-gold transition-colors active:scale-95 shadow-2xs"
                  aria-label="Phone"
                >
                  <Phone size={14} />
                </a>
              </div>
            </div>

            {/* Column 1: Collections — Sits side-by-side with Client Care on mobile */}
            <div className="col-span-1 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-heading border-b border-border/80 pb-2">
                Collections
              </h3>
              <ul className="space-y-1 text-xs font-sans">
                <li><Link href="/bridal" className="block py-1 text-text hover:text-gold transition-colors">Bridal Lehengas</Link></li>
                <li><Link href="/suits" className="block py-1 text-text hover:text-gold transition-colors">Luxury Suits</Link></li>
                <li><Link href="/ready-to-wear" className="block py-1 text-text hover:text-gold transition-colors">Ready To Wear</Link></li>
                <li><Link href="/jewellery" className="block py-1 text-text hover:text-gold transition-colors">Royal Jewellery</Link></li>
                <li><Link href="/bags" className="block py-1 text-text hover:text-gold transition-colors">The Bag Edit</Link></li>
                <li><Link href="/occasions" className="block py-1 text-text hover:text-gold transition-colors">Shop By Occasion</Link></li>
              </ul>
            </div>

            {/* Column 2: Client Care — Sits side-by-side with Collections on mobile */}
            <div className="col-span-1 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-heading border-b border-border/80 pb-2">
                Client Care
              </h3>
              <ul className="space-y-1 text-xs font-sans">
                <li><Link href="/about" className="block py-1 text-text hover:text-gold transition-colors">Our Story &amp; Atelier</Link></li>
                <li><Link href="/track-order" className="block py-1 text-text hover:text-gold transition-colors">Track Your Order</Link></li>
                <li><Link href="/shipping-policy" className="block py-1 text-text hover:text-gold transition-colors">Shipping &amp; Delivery</Link></li>
                <li><Link href="/returns-policy" className="block py-1 text-text hover:text-gold transition-colors">Exchange &amp; Returns</Link></li>
                <li><Link href="/faq" className="block py-1 text-text hover:text-gold transition-colors">Help &amp; FAQs</Link></li>
              </ul>
            </div>

            {/* Column 3: Concierge — Spans full width on mobile with clean touch rows */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/60">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-heading border-b border-border/80 pb-2">
                Boutique Concierge
              </h3>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="text-text hover:text-gold transition-colors inline-flex items-center gap-2.5 py-1"
                  >
                    <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                      <Phone size={12} className="text-gold" />
                    </div>
                    <span className="font-medium">{siteConfig.phone}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-text hover:text-gold transition-colors inline-flex items-center gap-2.5 py-1"
                  >
                    <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                      <Mail size={12} className="text-gold" />
                    </div>
                    <span className="font-medium truncate">{siteConfig.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text hover:text-gold transition-colors inline-flex items-center gap-2.5 py-1"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-600/15 flex items-center justify-center shrink-0">
                      <MessageCircle size={12} className="text-emerald-700" />
                    </div>
                    <span className="font-medium">WhatsApp Consultation</span>
                  </a>
                </li>
                <li className="text-[11px] text-text/80 pt-1 leading-relaxed">
                  Mon – Sat: 10:30 AM – 7:30 PM IST · Delhi / NCR Atelier
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright, Policies & Payment Strip */}
      <div className="border-t border-border bg-footer pt-5 pb-8 sm:py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text font-sans">
          <p className="text-center sm:text-left text-[11.5px] text-text/85 order-2 md:order-1">
            © {year} Aafreen Couture By Pearl. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-[11px] text-text/90 order-1 md:order-2">
            <Link href="/privacy-policy" className="hover:text-gold transition-colors py-0.5">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors py-0.5">Terms of Service</Link>
            <Link href="/returns-policy" className="hover:text-gold transition-colors py-0.5">Exchange &amp; Refund</Link>
            <Link href="/shipping-policy" className="hover:text-gold transition-colors py-0.5">Shipping Policy</Link>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-border/50 gap-4 order-3">
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-text/75 font-medium">
              <span>VISA</span> · <span>MC</span> · <span>UPI</span> · <span>RUPAY</span>
            </div>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 px-2.5 py-1 sm:p-1.5 rounded-full border border-border text-xs sm:text-[11px] text-heading hover:border-gold hover:text-gold transition-colors cursor-pointer bg-surface/80 shadow-2xs active:scale-95"
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              <span className="text-[10px] uppercase font-semibold sm:hidden">Top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
