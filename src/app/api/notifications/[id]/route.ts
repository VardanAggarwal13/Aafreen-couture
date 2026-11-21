import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth';
import { handleApiError, notFound } from '@/lib/api-errors';
import { notificationService } from '@/server/services/notification.service';
import { notificationReadSchema } from '@/validators/notification.schema';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Mark one of the signed-in customer's notifications read or unread. */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth(request);
    const { id } = await params;
    const { read } = notificationReadSchema.parse(await request.json());
    const ok = await notificationService.setRead(session.user.id, id, read);
    if (!ok) return notFound('Notification');
    return NextResponse.json({ success: true, data: { id, read } }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Delete one of the signed-in customer's notifications. */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth(request);
    const { id } = await params;
    const ok = await notificationService.remove(session.user.id, id);
    if (!ok) return notFound('Notification');
    return NextResponse.json({ success: true, data: { id } }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return handleApiError(error);
  }
}
