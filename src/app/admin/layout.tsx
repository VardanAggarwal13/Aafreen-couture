import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { AdminSidebar } from '@/features/admin/components/AdminSidebar';
import { AdminHeader } from '@/features/admin/components/AdminHeader';

export const metadata = { title: 'Admin | Aafreen Couture' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userRole = (session?.user as Record<string, unknown>)?.role;
  const userEmail = session?.user?.email?.toLowerCase();
  const adminEmail = (process.env.ADMIN_EMAIL || 'support@aafreencouture.com').toLowerCase();

  const isAdmin = userRole === 'admin' || (userEmail && userEmail === adminEmail);

  if (process.env.NODE_ENV === 'production' && (!session || !isAdmin)) {
    redirect('/login?redirect=/admin');
  }

  const currentUser = session?.user || {
    id: 'admin-local',
    name: 'Aafreen Admin Concierge',
    email: 'support@aafreencouture.com',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: true,
  };

  return (
    <div className="flex h-screen bg-[#0F0F0F] overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader user={currentUser as any} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
