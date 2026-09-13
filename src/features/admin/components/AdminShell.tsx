'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/features/admin/components/AdminSidebar';
import { AdminHeader } from '@/features/admin/components/AdminHeader';

interface AdminShellProps {
  user: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8F5F1] text-[#2E221C] overflow-hidden antialiased">
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <AdminSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8F5F1]">
        <AdminHeader user={user} onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8F5F1]">
          {children}
        </main>
      </div>
    </div>
  );
}
