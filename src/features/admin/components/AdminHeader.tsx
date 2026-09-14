'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ExternalLink, Plus, LogOut, Menu } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

interface AdminHeaderProps {
  user: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  onMenuClick?: () => void;
}

export function AdminHeader({ user, onMenuClick }: AdminHeaderProps) {
  const router = useRouter();

  async function handleSignOut() {
    try {
      await authClient.signOut();
      toast.success('Signed out of admin atelier');
      router.push('/');
      router.refresh();
    } catch {
      window.location.href = '/';
    }
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'A';

  return (
    <header className="h-14 bg-white border-b border-[#DDD2C5] flex items-center justify-between gap-2 px-3 sm:px-5 shrink-0 shadow-xs">
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="p-2 -ml-1 rounded-lg text-[#2E221C] hover:bg-[#FAF7F2] transition-colors lg:hidden cursor-pointer shrink-0"
      >
        <Menu size={20} />
      </button>

      {/* Quick Search */}
      <div className="hidden md:flex items-center gap-2 bg-[#FAF7F2] border border-[#DDD2C5] rounded-lg px-3 py-1.5 w-64 focus-within:border-[#C9A86A] transition-colors">
        <Search size={13} className="text-[#8A6A55]" />
        <input
          type="text"
          placeholder="Search products, orders, clients…"
          className="bg-transparent text-xs text-[#2E221C] placeholder:text-[#8A6A55]/60 outline-none flex-1 font-sans"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-3 min-w-0">
        {/* Quick View Storefront */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#8A6A55] hover:text-[#2E221C] transition-colors border border-[#DDD2C5] px-3 py-1.5 rounded-lg bg-[#FAF7F2]/80 hover:bg-white"
        >
          <ExternalLink size={12} className="text-[#C9A86A]" />
          <span>View Live Store</span>
        </Link>

        {/* Quick Add Product */}
        <Link
          href="/admin/products/new"
          title="Add Product"
          className="inline-flex items-center gap-1.5 bg-[#C9A86A] hover:bg-[#B58E52] text-white text-xs font-semibold uppercase tracking-wider px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-colors shadow-xs shrink-0"
        >
          <Plus size={13} />
          <span className="hidden sm:inline">Add Product</span>
        </Link>

        {/* User Chip & Sign Out */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#DDD2C5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C9A86A]/20 text-[#9E7B3A] border border-[#C9A86A]/40 flex items-center justify-center font-sans font-bold text-xs shrink-0">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-[#2E221C] leading-none truncate max-w-[140px]">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-[#C9A86A] font-medium tracking-wider uppercase mt-0.5">
                {user?.role || 'Admin'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign out of Admin Session"
            className="p-1.5 rounded-lg text-[#8A6A55] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
