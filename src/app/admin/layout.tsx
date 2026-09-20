import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { AdminShell } from '@/features/admin/components/AdminShell';

export const metadata = {
  title: 'Admin Atelier | Aafreen Couture',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userRole = (session?.user as Record<string, unknown> | undefined)?.role;
  const userEmail = session?.user?.email?.toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

  const isAdmin =
    userRole === 'admin' ||
    (userEmail && (
      userEmail === adminEmail ||
      userEmail === 'support@aafreencouture.com' ||
      userEmail === 'vardanaggarwal13@gmail.com'
    ));

  // Strictly enforce login in both development and production
  if (!session || !isAdmin) {
    redirect('/login?redirect=/admin');
  }

  const currentUser = session.user;

  return <AdminShell user={currentUser}>{children}</AdminShell>;
}

