import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth';
import { handleApiError } from '@/lib/api-errors';
import { notificationService } from '@/server/services/notification.service';
import { notificationListQuerySchema } from '@/validators/notification.schema';

export const dynamic = 'force-dynamic';

const PRIVATE = { 'Cache-Control': 'private, no-store' };

/** The signed-in customer's own notifications, newest first. */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const { page, limit } = notificationListQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const result = await notificationService.list(session.user.id, page, limit);
    return NextResponse.json(
      { success: true, data: result.items, unread: result.unread, pagination: result.pagination },
      { headers: PRIVATE }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/** Mark every notification as read. */
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const updated = await notificationService.markAllRead(session.user.id);
    return NextResponse.json({ success: true, data: { updated } }, { headers: PRIVATE });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Delete every notification of the signed-in customer ("clear all"). */
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const deleted = await notificationService.removeAll(session.user.id);
    return NextResponse.json({ success: true, data: { deleted } }, { headers: PRIVATE });
  } catch (error) {
    return handleApiError(error);
  }
}
