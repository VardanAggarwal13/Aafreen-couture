import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { notificationService } from '@/server/services/notification.service';
import { NotificationsClient } from '@/features/account/components/NotificationsClient';
import { NOTIFICATION_PAGE_SIZE } from '@/constants/notification.constants';

export const metadata: Metadata = { title: 'Notifications | Aafreen Couture' };
export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login?redirect=%2Fnotifications');

  // Only this signed-in customer's notifications are ever loaded.
  const { items, unread, pagination } = await notificationService.list(session.user.id, 1, NOTIFICATION_PAGE_SIZE);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif text-heading">Notifications & Alerts</h1>
        <p className="text-xs sm:text-sm text-text mt-1">Updates regarding your orders and payments</p>
      </div>

      <NotificationsClient
        initialItems={items}
        initialUnread={unread}
        initialTotal={pagination.total}
        initialHasNext={pagination.hasNextPage}
        pageSize={NOTIFICATION_PAGE_SIZE}
      />
    </div>
  );
}
