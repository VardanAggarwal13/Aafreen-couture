import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ProfileForm } from '@/features/account/components/ProfileForm';

export const metadata = { title: 'My Profile | Aafreen Couture' };

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login?redirect=%2Fprofile');

  const safeUser = {
    id: session.user.id,
    name: session.user.name ?? '',
    email: session.user.email ?? '',
    phone: session.user.phone ?? '',
    role: session.user.role,
  };

  return (
    <div className="space-y-6 font-sans">
      <h1 className="text-2xl font-serif text-heading">My Profile</h1>
      <ProfileForm user={safeUser as any} />
    </div>
  );
}
