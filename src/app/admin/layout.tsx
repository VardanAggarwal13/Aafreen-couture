import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { isAdminUser } from '@/lib/admin-access';
import { AdminShell } from '@/features/admin/components/AdminShell';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Admin Atelier | Aafreen Couture',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const isAdmin = isAdminUser(session?.user);

  // Strictly enforce login in both development and production
  if (!session || !isAdmin) {
    redirect('/login?redirect=/admin');
  }

  const currentUser = session.user;

  return <AdminShell user={currentUser}>{children}</AdminShell>;
}

