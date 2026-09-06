'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Search, ShoppingBag, Heart, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { navLinks } from '@/config/navigation.config';
import type { NavLink } from '@/config/navigation.config';
import { ROUTES } from '@/constants/routes';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const cartItemCount = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md transition-shadow duration-300',
          isScrolled ? 'shadow-[0_1px_4px_0_rgba(34,22,23,0.08)] border-b border-[#E8D8C8]' : 'border-b border-[#E8D8C8]'
        )}
      >
        <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10">
          <div className="relative flex items-center justify-between lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] h-[72px] sm:h-[76px] lg:h-[84px] py-1.5">

            {/* Left section: Hamburger on mobile, Brand logo on desktop */}
            <div className="flex items-center justify-start min-w-0">
              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 -ml-1.5 text-[#221617] hover:text-brand-gold transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu size={22} />
              </button>

              {/* Brand Logo */}
              <Link
                href={ROUTES.HOME}
                className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex items-center justify-center py-1 select-none group transition-opacity hover:opacity-90 max-w-[50vw] sm:max-w-none"
              >
                <Image
                  src="/images/logo-header.webp"
                  alt="Aafreen Couture By Pearl"
                  width={260}
                  height={123}
                  className="h-11 sm:h-14 lg:h-[62px] xl:h-[66px] w-auto object-contain drop-shadow-2xs"
                  priority
                />
              </Link>
            </div>

            {/* Center section: Desktop nav links, horizontally centered */}
            <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-2">
              {navLinks.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  isActive={activeMega === link.label}
                  onEnter={() => link.megaMenu ? setActiveMega(link.label) : setActiveMega(null)}
                  onLeave={() => setActiveMega(null)}
                />
              ))}
            </nav>

            {/* Right section: Action Icons */}
            <div className="flex items-center justify-end gap-0.5 sm:gap-1 min-w-0">
              <Link href={ROUTES.SEARCH} aria-label="Search" className="p-1.5 sm:p-2.5 text-[#221617]/80 hover:text-brand-gold transition-colors">
                <Search size={18} />
              </Link>
              <Link href={ROUTES.PROFILE} aria-label="Account" className="p-1.5 sm:p-2.5 text-[#221617]/80 hover:text-brand-gold transition-colors hidden sm:flex">
                <User size={18} />
              </Link>
              <Link href={ROUTES.WISHLIST} aria-label="Wishlist" className="p-1.5 sm:p-2.5 text-[#221617]/80 hover:text-brand-gold transition-colors relative">
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-0.5 bg-brand-gold text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>
              <Link href={ROUTES.CART} aria-label="Cart" className="p-1.5 sm:p-2.5 text-[#221617]/80 hover:text-brand-gold transition-colors relative">
                <ShoppingBag size={18} />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-0.5 bg-[#A67C52] text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.22 }}
              className="fixed left-0 top-0 bottom-0 w-[300px] bg-[#FAF7F2] z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-20 border-b border-[#E8D8C8]">
                <Link
                  href={ROUTES.HOME}
                  className="flex items-center"
                  onClick={() => setMobileOpen(false)}
                >
                  <Image
                    src="/images/logo-header.webp"
                    alt="Aafreen Couture By Pearl"
                    width={160}
                    height={76}
                    className="h-11 w-auto object-contain"
                    priority
                  />
                </Link>
                <button onClick={() => setMobileOpen(false)} aria-label="Close" className="p-1 text-[#1A1A1A]/60">
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.href} className="border-b border-[#F0E8DC]">
                    {link.megaMenu ? (
                      <>
                        <button
                          onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                          className={cn(
                            'w-full flex items-center justify-between px-5 py-3.5 text-[11px] font-semibold tracking-[0.15em] uppercase',
                            link.isSale ? 'text-red-600' : 'text-[#1A1A1A]'
                          )}
                        >
                          {link.label}
                          <ChevronDown
                            size={13}
                            className={cn('transition-transform text-brand-gold', mobileExpanded === link.label && 'rotate-180')}
                          />
                        </button>
                        {mobileExpanded === link.label && (
                          <div className="bg-[#FAF8F5] pb-2">
                            {link.megaMenu.flatMap((g) => g.links).map((sub, i, arr) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                prefetch={true}
                                className={cn(
                                  'block pl-8 pr-5 py-2.5 text-[11px] text-[#1A1A1A]/70 hover:text-brand-gold transition-colors',
                                  i === arr.length - 1 && 'font-semibold text-brand-gold border-t border-[#F0E8DC] mt-1 pt-2.5'
                                )}
                                onClick={() => setMobileOpen(false)}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center px-5 py-3.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors',
                          link.isSale ? 'text-red-600' : 'text-[#1A1A1A] hover:text-brand-gold'
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="px-5 py-5 border-t border-[#E8D4A8] space-y-3">
                <Link
                  href={ROUTES.PROFILE}
                  className="flex items-center gap-2 text-sm text-[#1A1A1A]/70 hover:text-brand-gold transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={15} /> My Account
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  link,
  isActive,
  onEnter,
  onLeave,
}: {
  link: NavLink;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Link
        href={link.href}
        prefetch={true}
        className={cn(
          'flex items-center gap-0.5 xl:gap-1 px-2 xl:px-3 py-2 text-[10px] xl:text-[11px] font-semibold tracking-[0.11em] xl:tracking-[0.14em] uppercase transition-colors whitespace-nowrap',
          link.isSale
            ? 'text-red-600 hover:text-red-700'
            : isActive
            ? 'text-brand-gold'
            : 'text-[#1A1A1A]/80 hover:text-brand-gold'
        )}
      >
        {link.label}
        {link.megaMenu && (
          <ChevronDown
            size={11}
            className={cn('mt-px transition-transform duration-200', isActive && 'rotate-180 text-brand-gold')}
          />
        )}
      </Link>

      {/* Mega menu dropdown */}
      <AnimatePresence>
        {isActive && link.megaMenu && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white border border-[#E8D4A8] shadow-lg z-50 min-w-[210px] py-1.5"
          >
            {link.megaMenu.map((group) => (
              <div key={group.title} className="py-1">
                {group.links.map((sub, i) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    prefetch={true}
                    onClick={onLeave}
                    className={cn(
                      'block px-5 py-2 text-[11.5px] text-[#221617]/80 hover:text-[#A67C52] hover:bg-[#FAF8F5] transition-colors whitespace-nowrap',
                      i === group.links.length - 1 && 'font-semibold text-[#A67C52] border-t border-[#F0E8DC] mt-1 pt-2.5'
                    )}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
