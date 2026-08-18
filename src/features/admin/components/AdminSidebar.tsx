'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Layers,
  Archive, Ticket, ImageIcon, FileText, Star, RotateCcw,
  Settings, Shield, ClipboardList, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: ROUTES.ADMIN, label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { href: ROUTES.ADMIN_PRODUCTS, label: 'Products', icon: Package },
      { href: ROUTES.ADMIN_CATEGORIES, label: 'Categories', icon: Tag },
      { href: ROUTES.ADMIN_COLLECTIONS, label: 'Collections', icon: Layers },
      { href: ROUTES.ADMIN_INVENTORY, label: 'Inventory', icon: Archive },
    ],
  },
  {
    label: 'Sales',
    items: [
      { href: ROUTES.ADMIN_ORDERS, label: 'Orders', icon: ShoppingCart },
      { href: ROUTES.ADMIN_RETURNS, label: 'Returns', icon: RotateCcw },
      { href: ROUTES.ADMIN_COUPONS, label: 'Coupons', icon: Ticket },
    ],
  },
  {
    label: 'Customers',
    items: [
      { href: ROUTES.ADMIN_CUSTOMERS, label: 'Customers', icon: Users },
      { href: ROUTES.ADMIN_REVIEWS, label: 'Reviews', icon: Star },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: ROUTES.ADMIN_BANNERS, label: 'Banners', icon: ImageIcon },
      { href: ROUTES.ADMIN_BLOG, label: 'Blog', icon: FileText },
      { href: ROUTES.ADMIN_CMS, label: 'CMS Pages', icon: FileText },
    ],
  },
  {
    label: 'System',
    items: [
      { href: ROUTES.ADMIN_SETTINGS, label: 'Settings', icon: Settings },
      { href: ROUTES.ADMIN_ROLES, label: 'Roles', icon: Shield },
      { href: ROUTES.ADMIN_AUDIT_LOGS, label: 'Audit Logs', icon: ClipboardList },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-[220px] shrink-0 bg-[#111111] flex flex-col h-full overflow-hidden border-r border-white/5">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-white/5 shrink-0">
        <div>
          <p className="font-serif text-base tracking-[0.15em] text-white uppercase">Aafreen</p>
          <p className="text-[8px] tracking-[0.4em] text-brand-gold uppercase font-medium">Couture · Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-5 px-3">
        {NAV_GROUPS.map(({ label, items }) => (
          <div key={label}>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30 px-2 mb-1.5">{label}</p>
            {items.map((item) => {
              const { href, label: itemLabel, icon: Icon } = item;
              const exact = 'exact' in item ? item.exact : undefined;
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-[13px] font-medium transition-colors group',
                    active
                      ? 'bg-brand-gold/15 text-brand-gold'
                      : 'text-white/55 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon size={14} strokeWidth={active ? 2 : 1.5} />
                  <span className="flex-1 truncate">{itemLabel}</span>
                  {active && <ChevronRight size={10} className="text-brand-gold/60" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom indicator */}
      <div className="px-5 py-4 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-white/30">System Operational</span>
        </div>
      </div>
    </aside>
  );
}
