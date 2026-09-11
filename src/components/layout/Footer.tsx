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

  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (isAuthRoute || isAdminRoute) {
    return null;
  }

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
      <div className="border-b border-border bg-background py-10 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-gold mb-1.5">
            The Atelier Newsletter
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-heading uppercase tracking-wide mb-2">
            Join The World of Aafreen Couture
          </h2>
          <p className="text-xs sm:text-sm text-text max-w-md mx-auto mb-6 leading-relaxed font-sans">
            Subscribe for exclusive collection previews, bespoke bridal invitations, and atelier stories.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
                required
                className="flex-1 bg-surface border border-border px-4 py-2.5 text-xs text-heading placeholder:text-text/60 rounded-xs focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                className="bg-heading hover:bg-gold text-surface text-[11px] font-semibold uppercase tracking-[0.2em] px-6 py-2.5 rounded-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
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

      {/* 2. Main Footer Directory */}
      <div className="py-10 sm:py-12 lg:py-14">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            
            {/* Brand Column */}
            <div className="space-y-4">
              <Link href="/" className="inline-block select-none transition-opacity hover:opacity-90">
                <Image
                  src="/images/logo-header.webp"
                  alt="Aafreen Couture By Pearl"
                  width={240}
                  height={114}
                  className="h-13 sm:h-15 w-auto object-contain"
                />
              </Link>

              <p className="text-xs text-text leading-relaxed max-w-xs font-sans">
                Handcrafted luxury Indian bridal wear and bespoke couture, celebrating royal heritage craftsmanship with modern elegance.
              </p>

              {/* Social Channels */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-border bg-surface flex items-center justify-center text-heading/80 hover:text-gold hover:border-gold transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon width={15} height={15} />
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-border bg-surface flex items-center justify-center text-heading/80 hover:text-gold hover:border-gold transition-colors"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon width={15} height={15} />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="w-8 h-8 rounded-full border border-border bg-surface flex items-center justify-center text-heading/80 hover:text-gold hover:border-gold transition-colors"
                  aria-label="Email"
                >
                  <Mail size={14} />
                </a>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="w-8 h-8 rounded-full border border-border bg-surface flex items-center justify-center text-heading/80 hover:text-gold hover:border-gold transition-colors"
                  aria-label="Phone"
                >
                  <Phone size={13} />
                </a>
              </div>
            </div>

            {/* Column 1: Collections */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-heading border-b border-border pb-2">
                Collections
              </h3>
              <ul className="space-y-2 text-xs font-sans">
                <li><Link href="/bridal" className="text-text hover:text-gold transition-colors">Bridal Lehengas</Link></li>
                <li><Link href="/suits" className="text-text hover:text-gold transition-colors">Luxury Suits</Link></li>
                <li><Link href="/ready-to-wear" className="text-text hover:text-gold transition-colors">Ready To Wear</Link></li>
                <li><Link href="/jewellery" className="text-text hover:text-gold transition-colors">Royal Jewellery</Link></li>
                <li><Link href="/bags" className="text-text hover:text-gold transition-colors">The Bag Edit</Link></li>
                <li><Link href="/occasions" className="text-text hover:text-gold transition-colors">Shop By Occasion</Link></li>
              </ul>
            </div>

            {/* Column 2: Client Care */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-heading border-b border-border pb-2">
                Client Care
              </h3>
              <ul className="space-y-2 text-xs font-sans">
                <li><Link href="/about" className="text-text hover:text-gold transition-colors">Our Story &amp; Atelier</Link></li>
                <li><Link href="/track-order" className="text-text hover:text-gold transition-colors">Track Your Order</Link></li>
                <li><Link href="/shipping-policy" className="text-text hover:text-gold transition-colors">Shipping &amp; Delivery</Link></li>
                <li><Link href="/returns-policy" className="text-text hover:text-gold transition-colors">Exchange &amp; Returns</Link></li>
                <li><Link href="/faq" className="text-text hover:text-gold transition-colors">Help &amp; FAQs</Link></li>
              </ul>
            </div>

            {/* Column 3: Concierge */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-heading border-b border-border pb-2">
                Boutique Concierge
              </h3>
              <ul className="space-y-2.5 text-xs font-sans">
                <li>
                  <a href={`tel:${siteConfig.phone}`} className="text-text hover:text-gold transition-colors flex items-center gap-2">
                    <Phone size={13} className="text-gold shrink-0" />
                    <span>{siteConfig.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="text-text hover:text-gold transition-colors flex items-center gap-2">
                    <Mail size={13} className="text-gold shrink-0" />
                    <span>{siteConfig.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <MessageCircle size={13} className="text-gold shrink-0" />
                    <span>WhatsApp Bridal Consultation</span>
                  </a>
                </li>
                <li className="text-[11px] text-text/80 pt-1">
                  Mon – Sat: 10:30 AM – 7:30 PM IST
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright & Policy Strip */}
      <div className="border-t border-border bg-footer py-4 sm:py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text font-sans">
          <p>© {year} Aafreen Couture By Pearl. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px]">
            <Link href="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
            <Link href="/returns-policy" className="hover:text-gold transition-colors">Exchange &amp; Refund</Link>
            <Link href="/shipping-policy" className="hover:text-gold transition-colors">Shipping Policy</Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-wider text-text/80">
              <span>VISA</span> · <span>MC</span> · <span>UPI</span> · <span>RUPAY</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-full border border-border text-heading hover:border-gold hover:text-gold transition-colors cursor-pointer"
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
