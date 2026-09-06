'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Mail, Phone, ArrowRight } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/icons';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site.config';

export function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing!', {
      description: 'You have been added to the Aafreen Couture private preview list.',
    });
    setEmail('');
  }

  return (
    <footer className="bg-[#1A1011] text-[#FAF7F2] mt-auto border-t border-[#C49A5A]/30">
      {/* Newsletter Subscription Banner */}
      <div className="border-b border-[#C49A5A]/20 bg-[#221617] py-8 sm:py-10 lg:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <p className="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.35em] text-[#C49A5A] mb-2">
            The Atelier Newsletter
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-wide mb-2">
            Join The World of Aafreen Couture
          </h2>
          <p className="text-xs sm:text-sm text-white/70 font-sans max-w-xl mx-auto mb-5 sm:mb-6 leading-relaxed">
            Subscribe to receive private previews, bespoke bridal trunk show invitations, and exclusive new collection releases.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-[#2C1A1C] border border-[#C49A5A]/40 text-white placeholder:text-white/40 px-4 py-2.5 text-xs font-sans focus:outline-none focus:border-[#C49A5A] transition-colors rounded-xs"
              required
            />
            <button
              type="submit"
              className="bg-[#C49A5A] text-[#1A0E0E] hover:bg-white text-[11px] font-semibold uppercase tracking-[0.2em] px-5 py-2.5 transition-colors flex items-center justify-center gap-1.5 rounded-xs shrink-0 cursor-pointer"
            >
              <span>Subscribe</span>
              <ArrowRight size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links & Brand Section */}
      <div className="py-10 sm:py-12 lg:py-14">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="inline-block select-none group transition-opacity hover:opacity-90">
                <Image
                  src="/images/logo-footer.webp"
                  alt="Aafreen Couture By Pearl"
                  width={280}
                  height={133}
                  className="h-16 sm:h-20 lg:h-24 w-auto object-contain"
                />
              </Link>

              <p className="text-xs text-white/70 font-sans leading-relaxed max-w-sm">
                Timeless Indian bridal wear, luxury lehengas, and handcrafted attire — woven with royal heritage, intricate embroidery, and modern elegance for your most special moments.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-4 pt-2">
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#C49A5A]/30 flex items-center justify-center text-white/80 hover:text-[#C49A5A] hover:border-[#C49A5A] transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon width={17} height={17} />
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#C49A5A]/30 flex items-center justify-center text-white/80 hover:text-[#C49A5A] hover:border-[#C49A5A] transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={17} />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="w-10 h-10 rounded-full border border-[#C49A5A]/30 flex items-center justify-center text-white/80 hover:text-[#C49A5A] hover:border-[#C49A5A] transition-colors"
                  aria-label="Email"
                >
                  <Mail size={17} />
                </a>
              </div>
            </div>

            {/* Column 1: Collections */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C49A5A] border-b border-[#C49A5A]/20 pb-2">
                Collections
              </h3>
              <ul className="space-y-2.5 text-xs font-sans">
                <li><Link href="/collections/bridal-lehengas-suits" className="text-white/70 hover:text-white transition-colors">Bridal Lehengas</Link></li>
                <li><Link href="/collections/bridesmaid-lehengas" className="text-white/70 hover:text-white transition-colors">Bridesmaid Lehengas</Link></li>
                <li><Link href="/shop?category=suits" className="text-white/70 hover:text-white transition-colors">Luxury Suits</Link></li>
                <li><Link href="/collections/signature-co-ord-sets" className="text-white/70 hover:text-white transition-colors">Co-ord Sets</Link></li>
                <li><Link href="/collections/jewellery" className="text-white/70 hover:text-white transition-colors">Kundan Jewellery</Link></li>
                <li><Link href="/collections/the-bag-edit" className="text-white/70 hover:text-white transition-colors">The Bag Edit</Link></li>
              </ul>
            </div>

            {/* Column 2: Client Care */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C49A5A] border-b border-[#C49A5A]/20 pb-2">
                Client Care
              </h3>
              <ul className="space-y-2.5 text-xs font-sans">
                <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">Our Story &amp; Atelier</Link></li>
                <li><Link href="/account" className="text-white/70 hover:text-white transition-colors">My Account</Link></li>
                <li><Link href="/track-order" className="text-white/70 hover:text-white transition-colors">Track Your Order</Link></li>
                <li><Link href="/shipping-policy" className="text-white/70 hover:text-white transition-colors">Shipping &amp; Delivery</Link></li>
                <li><Link href="/returns-policy" className="text-white/70 hover:text-white transition-colors">Exchange &amp; Returns</Link></li>
                <li><Link href="/faq" className="text-white/70 hover:text-white transition-colors">Help &amp; FAQs</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact & Boutique */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C49A5A] border-b border-[#C49A5A]/20 pb-2">
                Boutique Concierge
              </h3>
              <ul className="space-y-3 text-xs font-sans">
                <li>
                  <a href={`tel:${siteConfig.phone}`} className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Phone size={13} className="text-[#C49A5A]" />
                    <span>{siteConfig.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Mail size={13} className="text-[#C49A5A]" />
                    <span>{siteConfig.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <MessageCircle size={13} className="text-[#C49A5A]" />
                    <span>WhatsApp Bridal Consultation</span>
                  </a>
                </li>
                <li className="pt-1">
                  <Link href="/contact" className="text-[#C49A5A] hover:underline flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
                    <span>Contact Concierge Desk</span>
                    <ArrowRight size={11} />
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright, Policies & Payment Methods */}
      <div className="border-t border-[#C49A5A]/20 bg-[#140C0D] py-4 sm:py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50 font-sans">
          <p>© {year} Aafreen Couture By Pearl. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <Link href="/returns-policy" className="hover:text-white transition-colors">Exchange &amp; Refund Policy</Link>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link>
          </div>

          <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase text-white/40">
            <span>VISA</span> · <span>MASTERCARD</span> · <span>UPI</span> · <span>RUPAY</span> · <span>NETBANKING</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
