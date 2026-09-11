'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, ShoppingBag, Heart, User, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { navLinks } from '@/config/navigation.config';
import type { NavLink } from '@/config/navigation.config';
import { ROUTES } from '@/constants/routes';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useSession, authClient } from '@/lib/auth-client';
import { api } from '@/utils/api';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Authentication & admin routes use their own dedicated minimal layouts
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const { data: session } = useSession();
  const cartItemCount = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Warm key routes immediately so clicking has zero latency
    try {
      router.prefetch(ROUTES.LOGIN);
      router.prefetch(ROUTES.REGISTER);
      router.prefetch(ROUTES.ORDERS);
      router.prefetch(ROUTES.WISHLIST);
      router.prefetch(ROUTES.CART);
    } catch {
      // Safe fallback
    }
  }, [router]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isAuthRoute || isAdminRoute) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 bg-navbar/95 backdrop-blur-md transition-shadow duration-300',
          isScrolled ? 'shadow-[0_1px_4px_0_rgba(46,34,28,0.08)] border-b border-border' : 'border-b border-border'
        )}
      >
        <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10">
          <div className="relative flex items-center justify-between lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] h-[72px] sm:h-[76px] lg:h-[84px] py-1.5">

            {/* Left section: Hamburger on mobile, Brand logo on desktop */}
            <div className="flex items-center justify-start min-w-0">
              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 -ml-1.5 text-heading hover:text-gold transition-colors"
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
              <Link href={ROUTES.SEARCH} aria-label="Search" className="p-1.5 sm:p-2.5 text-heading/80 hover:text-gold transition-colors">
                <Search size={18} />
              </Link>
              
              {/* Account / Sign In Dropdown */}
              <div
                ref={accountMenuRef}
                className="relative block"
                onMouseEnter={() => {
                  setAccountMenuOpen(true);
                  try {
                    router.prefetch(ROUTES.LOGIN);
                    router.prefetch(ROUTES.REGISTER);
                    router.prefetch(ROUTES.ORDERS);
                  } catch {
                    // Safe fallback
                  }
                }}
                onMouseLeave={() => setAccountMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  aria-label="Account"
                  aria-expanded={accountMenuOpen}
                  className="p-1.5 sm:p-2.5 text-heading/80 hover:text-gold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <User size={18} />
                  {session?.user && (
                    <span className="text-[11px] font-medium text-heading max-w-[85px] truncate hidden md:inline">
                      {session.user.name?.split(' ')[0]}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {accountMenuOpen && (
                  <div className="absolute right-0 top-full pt-1.5 z-50 w-60 animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-surface border border-border shadow-lg rounded-xs py-2 text-xs font-sans">
                      {session?.user ? (
                        <>
                          <div className="px-4 py-2.5 border-b border-border/60">
                            <p className="font-serif text-xs font-semibold text-heading truncate">{session.user.name}</p>
                            <p className="text-[10.5px] text-text truncate">{session.user.email}</p>
                          </div>
                          <Link
                            href={ROUTES.ORDERS}
                            prefetch={true}
                            onClick={() => setAccountMenuOpen(false)}
                            className="block px-4 py-2 text-heading hover:bg-background hover:text-gold transition-colors"
                          >
                            My Orders & Purchases
                          </Link>
                          <Link
                            href={ROUTES.ADDRESSES}
                            prefetch={true}
                            onClick={() => setAccountMenuOpen(false)}
                            className="block px-4 py-2 text-heading hover:bg-background hover:text-gold transition-colors"
                          >
                            Saved Delivery Addresses
                          </Link>
                          <Link
                            href={ROUTES.PROFILE}
                            prefetch={true}
                            onClick={() => setAccountMenuOpen(false)}
                            className="block px-4 py-2 text-heading hover:bg-background hover:text-gold transition-colors"
                          >
                            Profile Details
                          </Link>
                          <div className="border-t border-border/60 mt-1 pt-1">
                            <button
                              type="button"
                              onClick={async () => {
                                setAccountMenuOpen(false);
                                await authClient.signOut();
                                window.location.href = '/';
                              }}
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
                            >
                              Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="px-4 py-2.5 text-text">
                            <p className="font-serif text-xs font-semibold text-heading mb-0.5">Welcome to Aafreen Couture</p>
                            <p className="text-[10.5px] text-text">Access orders & saved addresses</p>
                          </div>
                          <div className="px-4 py-2 border-t border-border/60 space-y-2">
                            <Link
                              href={ROUTES.LOGIN}
                              prefetch={true}
                              onClick={() => setAccountMenuOpen(false)}
                              className="block text-center py-2 bg-heading text-surface font-semibold uppercase tracking-wider text-[11px] rounded-xs hover:bg-gold transition-colors"
                            >
                              Sign In
                            </Link>
                            <Link
                              href={ROUTES.REGISTER}
                              prefetch={true}
                              onClick={() => setAccountMenuOpen(false)}
                              className="block text-center py-1.5 border border-border text-heading font-medium text-[11px] rounded-xs hover:border-gold hover:text-gold transition-colors"
                            >
                              Create Account
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link href={ROUTES.WISHLIST} aria-label="Wishlist" className="p-1.5 sm:p-2.5 text-heading/80 hover:text-gold transition-colors relative">
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-0.5 bg-gold text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>
              <Link href={ROUTES.CART} aria-label="Cart" className="p-1.5 sm:p-2.5 text-heading/80 hover:text-gold transition-colors relative">
                <ShoppingBag size={18} />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-0.5 bg-gold text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
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
              className="fixed left-0 top-0 bottom-0 w-[300px] bg-navbar z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-20 border-b border-border">
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
                <button onClick={() => setMobileOpen(false)} aria-label="Close" className="p-1 text-heading/60 hover:text-heading">
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.href} className="border-b border-border/60">
                    {link.megaMenu ? (
                      <>
                        <button
                          onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                          className={cn(
                            'w-full flex items-center justify-between px-5 py-3.5 text-[11px] font-sans font-medium tracking-[0.15em] uppercase',
                            link.isSale ? 'text-red-600' : 'text-heading'
                          )}
                        >
                          {link.label}
                          <ChevronDown
                            size={13}
                            className={cn('transition-transform text-gold', mobileExpanded === link.label && 'rotate-180')}
                          />
                        </button>
                        {mobileExpanded === link.label && (
                          <div className="bg-background pb-2">
                            {link.megaMenu.flatMap((g) => g.links).map((sub, i, arr) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                prefetch={true}
                                className={cn(
                                  'block pl-8 pr-5 py-2.5 text-[11px] text-text hover:text-gold transition-colors',
                                  i === arr.length - 1 && 'font-semibold text-gold border-t border-border/60 mt-1 pt-2.5'
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
                          'flex items-center px-5 py-3.5 text-[11px] font-sans font-medium tracking-[0.15em] uppercase transition-colors',
                          link.isSale ? 'text-red-600' : 'text-heading hover:text-gold'
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="px-5 py-5 border-t border-border space-y-3">
                {session?.user ? (
                  <>
                    <div className="pb-2 border-b border-border/60">
                      <p className="font-serif text-xs font-semibold text-heading">{session.user.name}</p>
                      <p className="text-[11px] text-text">{session.user.email}</p>
                    </div>
                    <Link
                      href={ROUTES.ORDERS}
                      className="flex items-center gap-2 text-xs text-heading hover:text-gold transition-colors font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      <ShoppingBag size={14} /> My Orders
                    </Link>
                    <Link
                      href={ROUTES.ADDRESSES}
                      className="flex items-center gap-2 text-xs text-heading hover:text-gold transition-colors font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      <MapPin size={14} /> Saved Addresses
                    </Link>
                    <button
                      onClick={async () => {
                        await authClient.signOut();
                        window.location.href = '/';
                      }}
                      className="text-xs font-semibold text-red-600 hover:underline pt-1 block"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href={ROUTES.LOGIN}
                      prefetch={true}
                      className="block text-center py-2 bg-heading text-surface text-xs font-semibold uppercase tracking-wider hover:bg-gold transition-colors rounded-xs"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href={ROUTES.REGISTER}
                      prefetch={true}
                      className="block text-center py-2 border border-border text-heading text-xs font-medium hover:border-gold hover:text-gold transition-colors rounded-xs"
                      onClick={() => setMobileOpen(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                )}
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
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleWarm = () => {
    try {
      router.prefetch(link.href);
    } catch {
      // Safe fallback
    }

    // Warm TanStack query cache for target category products
    if (link.href === '/jewellery') {
      queryClient.prefetchQuery({
        queryKey: ['couture-catalog', 'jewellery', '', 'newest', '', '', '', null, 1],
        queryFn: () => api.getPaginated('/api/products?category=jewellery&sort=newest'),
      });
    } else if (link.href === '/bridal') {
      queryClient.prefetchQuery({
        queryKey: ['hub-chapter', 'bridal-lehengas', '', ''],
        queryFn: () => api.getPaginated('/api/products?category=bridal-lehengas&limit=4'),
      });
    } else if (link.href === '/suits') {
      queryClient.prefetchQuery({
        queryKey: ['hub-chapter', 'cotton-kurta-sets', '', ''],
        queryFn: () => api.getPaginated('/api/products?category=cotton-kurta-sets&limit=4'),
      });
    } else if (link.href === '/bags') {
      queryClient.prefetchQuery({
        queryKey: ['hub-chapter', 'handbags', '', ''],
        queryFn: () => api.getPaginated('/api/products?category=handbags&limit=4'),
      });
    } else if (link.href === '/ready-to-wear') {
      queryClient.prefetchQuery({
        queryKey: ['hub-chapter', 'new-arrivals', '', ''],
        queryFn: () => api.getPaginated('/api/products?category=new-arrivals&limit=4'),
      });
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        handleWarm();
        onEnter();
      }}
      onMouseLeave={onLeave}
    >
      <Link
        href={link.href}
        prefetch={true}
        className={cn(
          'flex items-center gap-0.5 xl:gap-1 px-2 xl:px-3 py-2 text-[10px] xl:text-[11px] font-sans font-medium tracking-[0.11em] xl:tracking-[0.14em] uppercase transition-colors whitespace-nowrap',
          link.isSale
            ? 'text-red-600 hover:text-red-700'
            : isActive
            ? 'text-gold'
            : 'text-heading/85 hover:text-gold'
        )}
      >
        {link.label}
        {link.megaMenu && (
          <ChevronDown
            size={11}
            className={cn('mt-px transition-transform duration-200', isActive && 'rotate-180 text-gold')}
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
            className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-surface border border-border shadow-lg z-50 min-w-[210px] py-1.5"
          >
            {link.megaMenu.map((group) => (
              <div key={group.title} className="py-1">
                {group.links.map((sub, i) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    prefetch={true}
                    onMouseEnter={() => {
                      try {
                        router.prefetch(sub.href);
                      } catch {}
                    }}
                    onClick={onLeave}
                    className={cn(
                      'block px-5 py-2 text-[11.5px] text-heading/80 hover:text-gold hover:bg-background transition-colors whitespace-nowrap',
                      i === group.links.length - 1 && 'font-semibold text-gold border-t border-border/60 mt-1 pt-2.5'
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

