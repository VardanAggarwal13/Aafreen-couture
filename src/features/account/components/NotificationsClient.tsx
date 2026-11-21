'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  AlertCircle,
  Bell,
  CheckCheck,
  CheckCircle2,
  Loader2,
  MailOpen,
  Package,
  Trash2,
  Truck,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/store/notification.store';
import { NOTIFICATION_RETENTION_DAYS, type NotificationType } from '@/constants/notification.constants';
import type { NotificationRecord } from '@/server/repositories/notification.repository';

interface Props {
  initialItems: NotificationRecord[];
  initialUnread: number;
  initialTotal: number;
  initialHasNext: boolean;
  pageSize: number;
}

const TYPE_STYLE: Record<NotificationType, { icon: LucideIcon; tone: string }> = {
  order_placed: { icon: Package, tone: 'bg-gold/10 text-gold-ink' },
  payment_failed: { icon: AlertCircle, tone: 'bg-red-50 text-red-700' },
  order_shipped: { icon: Truck, tone: 'bg-sky-50 text-sky-700' },
  order_out_for_delivery: { icon: Truck, tone: 'bg-sky-50 text-sky-700' },
  order_delivered: { icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-700' },
  order_cancelled: { icon: XCircle, tone: 'bg-stone-100 text-stone-600' },
};

// A fixed time zone keeps the server-rendered and browser-rendered text identical.
const TIME_FORMAT = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

async function call(url: string, init?: RequestInit): Promise<Response> {
  return fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
}

export function NotificationsClient({ initialItems, initialUnread, initialTotal, initialHasNext, pageSize }: Props) {
  const setSidebarUnread = useNotificationStore((s) => s.setUnread);
  const [items, setItems] = useState(initialItems);
  const [unread, setUnread] = useState(initialUnread);
  const [total, setTotal] = useState(initialTotal);
  const [hasNext, setHasNext] = useState(initialHasNext);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);

  // Keep the sidebar badge in step with this list at all times (instant, no server round trip).
  useEffect(() => {
    setSidebarUnread(unread);
  }, [unread, setSidebarUnread]);

  async function setRead(item: NotificationRecord, read: boolean, quiet = false) {
    if (item.isRead === read) return;
    // Optimistic update; rolled back if the server refuses.
    setItems((prev) => prev.map((n) => (n._id === item._id ? { ...n, isRead: read } : n)));
    setUnread((u) => Math.max(0, u + (read ? -1 : 1)));
    try {
      const res = await call(`/api/notifications/${item._id}`, { method: 'PATCH', body: JSON.stringify({ read }) });
      if (!res.ok) throw new Error('failed');
    } catch {
      setItems((prev) => prev.map((n) => (n._id === item._id ? { ...n, isRead: item.isRead } : n)));
      setUnread((u) => Math.max(0, u + (read ? 1 : -1)));
      if (!quiet) toast.error('Could not update the notification. Please try again.');
    }
  }

  async function remove(item: NotificationRecord) {
    setBusyId(item._id);
    try {
      const res = await call(`/api/notifications/${item._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('failed');
      setItems((prev) => prev.filter((n) => n._id !== item._id));
      setTotal((t) => Math.max(0, t - 1));
      if (!item.isRead) setUnread((u) => Math.max(0, u - 1));
    } catch {
      toast.error('Could not delete the notification. Please try again.');
    } finally {
      setBusyId(null);
    }
  }

  async function markAllRead() {
    setBulkBusy(true);
    try {
      const res = await call('/api/notifications', { method: 'PATCH' });
      if (!res.ok) throw new Error('failed');
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {
      toast.error('Could not mark notifications as read. Please try again.');
    } finally {
      setBulkBusy(false);
    }
  }

  async function clearAll() {
    setBulkBusy(true);
    try {
      const res = await call('/api/notifications', { method: 'DELETE' });
      if (!res.ok) throw new Error('failed');
      setItems([]);
      setUnread(0);
      setTotal(0);
      setHasNext(false);
      setConfirmClear(false);
    } catch {
      toast.error('Could not clear notifications. Please try again.');
    } finally {
      setBulkBusy(false);
    }
  }

  async function loadMore() {
    setLoadingMore(true);
    try {
      const res = await call(`/api/notifications?page=${page + 1}&limit=${pageSize}`);
      if (!res.ok) throw new Error('failed');
      const json = (await res.json()) as {
        data: NotificationRecord[];
        pagination: { hasNextPage: boolean; total: number };
      };
      setItems((prev) => {
        const known = new Set(prev.map((n) => n._id));
        return [...prev, ...json.data.filter((n) => !known.has(n._id))];
      });
      setPage((p) => p + 1);
      setHasNext(json.pagination.hasNextPage);
      setTotal(json.pagination.total);
    } catch {
      toast.error('Could not load more notifications.');
    } finally {
      setLoadingMore(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-surface p-10 text-center rounded-2xl shadow-sm">
        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
          <Bell size="1.375rem" className="text-gold" />
        </div>
        <h3 className="text-base font-serif text-heading mb-1.5">No notifications yet</h3>
        <p className="text-xs sm:text-sm text-text">
          Order confirmations, dispatch and delivery updates will appear here.
        </p>
        <p className="text-[0.6875rem] text-text/70 mt-4">
          Notifications are kept for {NOTIFICATION_RETENTION_DAYS} days.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-text" aria-live="polite">
          {unread > 0 ? (
            <>
              <strong className="text-heading">{unread}</strong> unread · {total} total
            </>
          ) : (
            <>All caught up · {total} total</>
          )}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={markAllRead}
            disabled={unread === 0 || bulkBusy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-heading transition-colors hover:border-gold hover:text-gold-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size="0.875rem" /> Mark all as read
          </button>
          {confirmClear ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs text-red-800">
              Delete all?
              <button
                type="button"
                onClick={clearAll}
                disabled={bulkBusy}
                className="rounded-md bg-red-600 px-2 py-0.5 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {bulkBusy ? 'Deleting…' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                disabled={bulkBusy}
                className="rounded-md px-2 py-0.5 font-medium hover:bg-red-100"
              >
                No
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text transition-colors hover:border-red-300 hover:text-red-700"
            >
              <Trash2 size="0.875rem" /> Clear all
            </button>
          )}
        </div>
      </div>

      <ul className="space-y-2.5">
        {items.map((n) => {
          const { icon: Icon, tone } = TYPE_STYLE[n.type] ?? TYPE_STYLE.order_placed;
          return (
            <li
              key={n._id}
              className={cn(
                'relative flex gap-3.5 rounded-2xl border bg-surface p-4 shadow-xs transition-colors sm:p-5',
                n.isRead ? 'border-transparent' : 'border-gold/40 bg-gold/[0.04]'
              )}
            >
              <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', tone)}>
                <Icon size="1.125rem" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                  <h3 className={cn('text-sm text-heading', n.isRead ? 'font-medium' : 'font-semibold')}>
                    {!n.isRead && (
                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-gold align-middle" aria-label="Unread" />
                    )}
                    {n.title}
                  </h3>
                  <time dateTime={n.createdAt} className="shrink-0 text-[0.6875rem] text-text/80">
                    {TIME_FORMAT.format(new Date(n.createdAt))}
                  </time>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-text sm:text-[0.8125rem]">{n.message}</p>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0 text-xs">
                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={() => void setRead(n, true, true)}
                      className="inline-flex min-h-8 items-center font-semibold text-gold-ink underline-offset-4 hover:underline"
                    >
                      View order{n.orderNumber ? ` ${n.orderNumber}` : ''}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => void setRead(n, !n.isRead)}
                    className="inline-flex min-h-8 items-center gap-1 text-text transition-colors hover:text-heading"
                  >
                    <MailOpen size="0.8125rem" /> {n.isRead ? 'Mark as unread' : 'Mark as read'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(n)}
                    disabled={busyId === n._id}
                    aria-label={`Delete notification: ${n.title}`}
                    className="inline-flex min-h-8 items-center gap-1 text-text transition-colors hover:text-red-700 disabled:opacity-50"
                  >
                    {busyId === n._id ? <Loader2 size="0.8125rem" className="animate-spin" /> : <Trash2 size="0.8125rem" />} Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {hasNext && (
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2 text-xs font-semibold uppercase tracking-wider text-heading transition-colors hover:border-gold disabled:opacity-60"
          >
            {loadingMore && <Loader2 size="0.875rem" className="animate-spin" />} Load older notifications
          </button>
        </div>
      )}

      <p className="pt-2 text-center text-[0.6875rem] text-text/70">
        Notifications are kept for {NOTIFICATION_RETENTION_DAYS} days and then removed automatically. You can delete
        any of them at any time.
      </p>
    </div>
  );
}
