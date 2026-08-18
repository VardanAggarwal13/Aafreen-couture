'use client';

import { Search, Bell, User } from 'lucide-react';
import type { User as AuthUser } from '@/lib/auth';

interface AdminHeaderProps { user: AuthUser }

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-[#111111] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-sm px-3 py-1.5 w-64">
        <Search size={13} className="text-white/30" />
        <input
          type="text"
          placeholder="Search…"
          className="bg-transparent text-xs text-white/70 placeholder:text-white/25 outline-none flex-1"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-white/40 hover:text-white/70 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-brand-gold" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center">
            <User size={13} className="text-brand-gold" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[11px] font-medium text-white/80 leading-none">{user.name}</p>
            <p className="text-[9px] text-white/30 mt-0.5 capitalize">{(user as Record<string, unknown>).role as string ?? 'admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
