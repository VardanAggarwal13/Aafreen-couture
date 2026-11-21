/** How long a notification is kept before the database removes it automatically. */
export const NOTIFICATION_RETENTION_DAYS = 90;

/** Notifications shown per page on the customer's Notifications screen. */
export const NOTIFICATION_PAGE_SIZE = 15;

export const NOTIFICATION_TYPES = [
  'order_placed',
  'payment_failed',
  'order_shipped',
  'order_out_for_delivery',
  'order_delivered',
  'order_cancelled',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
