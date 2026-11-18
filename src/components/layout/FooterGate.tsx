'use client';

import { usePathname } from 'next/navigation';

const HIDDEN_PREFIXES = ['/login', '/register', '/forgot-password', '/verify-email', '/admin'];

/**
 * The footer itself is a server component; this tiny client wrapper only decides, from the
 * current URL, whether it should be shown (auth screens and the admin area have their own chrome).
 */
export function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const hidden = HIDDEN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return hidden ? null : <>{children}</>;
}
