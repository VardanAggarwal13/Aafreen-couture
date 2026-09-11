import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Bell } from 'lucide-react';
import { auth } from '@/lib/auth';

export const metadata: Metadata = { title: 'Notifications | Aafreen Couture' };

export default async function NotificationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login?redirect=%2Fnotifications');

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif text-heading">Notifications & Alerts</h1>
        <p className="text-xs sm:text-sm text-text mt-1">Updates regarding your orders, bespoke fittings, and account activity</p>
      </div>

      <div className="space-y-3">
        {/* Empty state */}
        <div className="bg-surface border border-border p-10 text-center rounded-xs shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <Bell size={22} className="text-gold" />
          </div>
          <h3 className="text-base font-serif text-heading mb-1.5">No notifications yet</h3>
          <p className="text-xs sm:text-sm text-text">
            Dispatch milestones, delivery notifications, and atelier alerts will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
