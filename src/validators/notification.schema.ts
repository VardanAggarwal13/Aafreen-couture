import { z } from 'zod';

/** GET /api/notifications */
export const notificationListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(15),
});

/** PATCH /api/notifications/[id]: mark one notification read or unread. */
export const notificationReadSchema = z.object({
  read: z.boolean(),
});
