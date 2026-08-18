import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { ProfileForm } from '@/features/account/components/ProfileForm';

export const metadata = { title: 'My Profile | Aafreen Couture' };

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-brand-black">My Profile</h1>
      <ProfileForm user={session!.user} />
    </div>
  );
}
