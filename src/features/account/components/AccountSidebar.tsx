'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, User, MapPin, RotateCcw, Bell, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import { ROUTES } from '@/constants/routes';
import type { User as AuthUser } from '@/lib/auth';

interface AccountSidebarProps {
  user: AuthUser;
}

const NAV = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.ORDERS, label: 'My Orders', icon: Package },
  { href: ROUTES.PROFILE, label: 'Profile', icon: User },
  { href: ROUTES.ADDRESSES, label: 'Addresses', icon: MapPin },
  { href: ROUTES.RETURNS, label: 'Returns', icon: RotateCcw },
  { href: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: Bell },
];

export function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname();

  async function handleSignOut() {
    await authClient.signOut();
    window.location.href = '/';
  }

  return (
    <div className="bg-brand-pearl border border-brand-cream rounded-sm p-5 space-y-1">
      {/* User info */}
      <div className="pb-4 mb-4 border-b border-brand-cream">
        <p className="text-sm font-semibold text-brand-black truncate">{user.name}</p>
        <p className="text-xs text-brand-stone truncate">{user.email}</p>
      </div>

      {NAV.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== ROUTES.DASHBOARD && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors',
              isActive
                ? 'bg-brand-gold text-white font-medium'
                : 'text-brand-stone hover:text-brand-black hover:bg-brand-cream/50'
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}

      <div className="pt-4 mt-4 border-t border-brand-cream">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-sm text-sm text-brand-stone hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
