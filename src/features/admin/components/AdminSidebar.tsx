'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Layers,
  Archive,
  Ticket,
  ImageIcon,
  FileText,
  Star,
  RotateCcw,
  Settings,
  Shield,
  ClipboardList,
  ChevronRight,
  ExternalLink,
  X,
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
    label: 'Sales & Marketing',
    items: [
      { href: ROUTES.ADMIN_ORDERS, label: 'Orders', icon: ShoppingCart },
      { href: ROUTES.ADMIN_RETURNS, label: 'Returns', icon: RotateCcw },
      { href: ROUTES.ADMIN_COUPONS, label: 'Coupons', icon: Ticket },
    ],
  },
  {
    label: 'Team & Clients',
    items: [
      { href: ROUTES.ADMIN_CUSTOMERS, label: 'Users & Admins', icon: Users },
      { href: ROUTES.ADMIN_ROLES, label: 'Staff Roles', icon: Shield },
      { href: ROUTES.ADMIN_REVIEWS, label: 'Reviews', icon: Star },
    ],
  },
  {
    label: 'Content & Visuals',
    items: [
      { href: ROUTES.ADMIN_BANNERS, label: 'Banners', icon: ImageIcon },
      { href: ROUTES.ADMIN_BLOG, label: 'Blog Articles', icon: FileText },
      { href: ROUTES.ADMIN_CMS, label: 'CMS Pages', icon: FileText },
    ],
  },
  {
    label: 'Atelier System',
    items: [
      { href: ROUTES.ADMIN_SETTINGS, label: 'Store Settings', icon: Settings },
      { href: ROUTES.ADMIN_AUDIT_LOGS, label: 'Audit Logs', icon: ClipboardList },
    ],
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-[230px] shrink-0 bg-[#F4EFEA] flex flex-col h-full overflow-hidden border-r border-[#DDD2C5] select-none transition-transform duration-200 ease-out',
        'lg:static lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Brand Header */}
      <div className="px-5 h-16 flex items-center justify-between border-b border-[#DDD2C5] shrink-0 bg-[#EAE2D7]/50">
        <div>
          <Link href="/admin" className="block" onClick={onClose}>
            <p className="font-serif text-base tracking-[0.18em] text-[#2E221C] uppercase font-semibold">
              Aafreen
            </p>
            <p className="text-[8.5px] tracking-[0.35em] text-[#C9A86A] uppercase font-semibold mt-0.5">
              Couture · Admin
            </p>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            target="_blank"
            title="View live storefront"
            className="p-1.5 rounded-full hover:bg-white text-[#8A6A55] hover:text-[#C9A86A] transition-colors"
          >
            <ExternalLink size={13} />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-full hover:bg-white text-[#8A6A55] hover:text-[#2E221C] transition-colors lg:hidden cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-5 px-3">
        {NAV_GROUPS.map(({ label, items }) => (
          <div key={label}>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8A6A55] px-2 mb-1.5 font-sans">
              {label}
            </p>
            <div className="space-y-0.5">
              {items.map((item) => {
                const { href, label: itemLabel, icon: Icon } = item;
                const exact = 'exact' in item ? item.exact : undefined;
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-xs text-[12.5px] font-medium transition-all group font-sans',
                      active
                        ? 'bg-[#C9A86A]/20 text-[#9E7B3A] font-semibold shadow-xs border-l-2 border-[#C9A86A]'
                        : 'text-[#2E221C]/80 hover:text-[#2E221C] hover:bg-white/70'
                    )}
                  >
                    <Icon
                      size={14}
                      strokeWidth={active ? 2.2 : 1.6}
                      className={active ? 'text-[#C9A86A]' : 'text-[#8A6A55] group-hover:text-[#2E221C]'}
                    />
                    <span className="flex-1 truncate">{itemLabel}</span>
                    {active && <ChevronRight size={11} className="text-[#C9A86A]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Status Strip */}
      <div className="px-5 py-3.5 border-t border-[#DDD2C5] shrink-0 bg-[#EAE2D7]/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-[#8A6A55] font-medium">Atelier Live · Secure</span>
          </div>
          <span className="text-[9px] font-mono text-[#8A6A55]/70">v2.4</span>
        </div>
      </div>
    </aside>
  );
}
