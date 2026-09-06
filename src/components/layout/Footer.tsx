'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, ArrowRight, ArrowUp, MessageCircle } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/icons';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site.config';

export function Footer() {
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
    <footer className="bg-[#FAF5EE] text-[#221617] mt-auto border-t border-[#E8D8C8] font-sans">
      {/* 1. Sleek Minimal Newsletter */}
      <div className="border-b border-[#E8D8C8] bg-[#FAF7F2] py-10 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-[#A67C52] mb-1.5">
            The Atelier Newsletter
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#221617] uppercase tracking-wide mb-2">
            Join The World of Aafreen Couture
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6A66] max-w-md mx-auto mb-6 leading-relaxed font-sans">
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
                className="flex-1 bg-white border border-[#E8D8C8] px-4 py-2.5 text-xs text-[#221617] placeholder:text-[#6E6A66]/60 rounded-xs focus:outline-none focus:border-[#A67C52] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#221617] hover:bg-[#A67C52] text-white text-[11px] font-semibold uppercase tracking-[0.2em] px-6 py-2.5 rounded-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Subscribe</span>
                <ArrowRight size={13} />
              </button>
            </form>
          ) : (
            <p className="text-xs text-[#A67C52] font-medium tracking-wide">
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

              <p className="text-xs text-[#6E6A66] leading-relaxed max-w-xs font-sans">
                Handcrafted luxury Indian bridal wear and bespoke couture, celebrating royal heritage craftsmanship with modern elegance.
              </p>

              {/* Social Channels */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#E8D8C8] bg-white flex items-center justify-center text-[#221617]/80 hover:text-[#A67C52] hover:border-[#A67C52] transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon width={15} height={15} />
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#E8D8C8] bg-white flex items-center justify-center text-[#221617]/80 hover:text-[#A67C52] hover:border-[#A67C52] transition-colors"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon width={15} height={15} />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="w-8 h-8 rounded-full border border-[#E8D8C8] bg-white flex items-center justify-center text-[#221617]/80 hover:text-[#A67C52] hover:border-[#A67C52] transition-colors"
                  aria-label="Email"
                >
                  <Mail size={14} />
                </a>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="w-8 h-8 rounded-full border border-[#E8D8C8] bg-white flex items-center justify-center text-[#221617]/80 hover:text-[#A67C52] hover:border-[#A67C52] transition-colors"
                  aria-label="Phone"
                >
                  <Phone size={13} />
                </a>
              </div>
            </div>

            {/* Column 1: Collections */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#221617] border-b border-[#E8D8C8] pb-2">
                Collections
              </h3>
              <ul className="space-y-2 text-xs font-sans">
                <li><Link href="/bridal" className="text-[#6E6A66] hover:text-[#A67C52] transition-colors">Bridal Lehengas</Link></li>
                <li><Link href="/suits" className="text-[#6E6A66] hover:text-[#A67C52] transition-colors">Luxury Suits</Link></li>
                <li><Link href="/ready-to-wear" className="text-[#6E6A66] hover:text-[#A67C52] transition-colors">Ready To Wear</Link></li>
                <li><Link href="/jewellery" className="text-[#6E6A66] hover:text-[#A67C52] transition-colors">Royal Jewellery</Link></li>
                <li><Link href="/bags" className="text-[#6E6A66] hover:text-[#A67C52] transition-colors">The Bag Edit</Link></li>
                <li><Link href="/occasions" className="text-[#6E6A66] hover:text-[#A67C52] transition-colors">Shop By Occasion</Link></li>
              </ul>
            </div>

            {/* Column 2: Client Care */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#221617] border-b border-[#E8D8C8] pb-2">
                Client Care
              </h3>
              <ul className="space-y-2 text-xs font-sans">
                <li><Link href="/about" className="text-[#6E6A66] hover:text-[#A67C52] transition-colors">Our Story &amp; Atelier</Link></li>
                <li><Link href="/track-order" className="text-[#6E6A66] hover:text-[#A67C52] transition-colors">Track Your Order</Link></li>
                <li><Link href="/shipping-policy" className="text-[#6E6A66] hover:text-[#A67C52] transition-colors">Shipping &amp; Delivery</Link></li>
                <li><Link href="/returns-policy" className="text-[#6E6A66] hover:text-[#A67C52] transition-colors">Exchange &amp; Returns</Link></li>
                <li><Link href="/faq" className="text-[#6E6A66] hover:text-[#A67C52] transition-colors">Help &amp; FAQs</Link></li>
              </ul>
            </div>

            {/* Column 3: Concierge */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#221617] border-b border-[#E8D8C8] pb-2">
                Boutique Concierge
              </h3>
              <ul className="space-y-2.5 text-xs font-sans">
                <li>
                  <a href={`tel:${siteConfig.phone}`} className="text-[#6E6A66] hover:text-[#A67C52] transition-colors flex items-center gap-2">
                    <Phone size={13} className="text-[#A67C52] shrink-0" />
                    <span>{siteConfig.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="text-[#6E6A66] hover:text-[#A67C52] transition-colors flex items-center gap-2">
                    <Mail size={13} className="text-[#A67C52] shrink-0" />
                    <span>{siteConfig.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6E6A66] hover:text-[#A67C52] transition-colors flex items-center gap-2"
                  >
                    <MessageCircle size={13} className="text-[#A67C52] shrink-0" />
                    <span>WhatsApp Bridal Consultation</span>
                  </a>
                </li>
                <li className="text-[11px] text-[#8C7E72] pt-1">
                  Mon – Sat: 10:30 AM – 7:30 PM IST
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright & Policy Strip */}
      <div className="border-t border-[#E8D8C8] bg-[#FAF7F2] py-4 sm:py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6E6A66] font-sans">
          <p>© {year} Aafreen Couture By Pearl. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px]">
            <Link href="/privacy-policy" className="hover:text-[#A67C52] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#A67C52] transition-colors">Terms of Service</Link>
            <Link href="/returns-policy" className="hover:text-[#A67C52] transition-colors">Exchange &amp; Refund</Link>
            <Link href="/shipping-policy" className="hover:text-[#A67C52] transition-colors">Shipping Policy</Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-wider text-[#8C7E72]">
              <span>VISA</span> · <span>MC</span> · <span>UPI</span> · <span>RUPAY</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-full border border-[#E8D8C8] text-[#221617] hover:border-[#A67C52] hover:text-[#A67C52] transition-colors cursor-pointer"
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
