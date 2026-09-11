'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, User, MapPin, RotateCcw, Bell, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import { ROUTES } from '@/constants/routes';
import type { User as AuthUser } from '@/lib/auth';

interface AccountSidebarProps {
  user: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
}

const NAV = [
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
    <div className="bg-surface border border-border rounded-xs p-5 space-y-1 shadow-2xs font-sans">
      {/* User info */}
      <div className="pb-4 mb-4 border-b border-border">
        <p className="text-sm font-semibold text-heading truncate">{user.name || 'Valued Client'}</p>
        <p className="text-xs text-text truncate">{user.email || ''}</p>
      </div>

      {NAV.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xs text-xs uppercase tracking-wider transition-colors',
              isActive
                ? 'bg-gold text-white font-semibold shadow-xs'
                : 'text-text hover:text-heading hover:bg-background'
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        );
      })}

      <div className="pt-4 mt-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xs text-xs uppercase tracking-wider text-text hover:text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
