import type { NextRequest } from 'next/server';
import { auditLogRepository } from '@/server/repositories/audit-log.repository';

interface SessionLike {
  user: { name?: string | null; email?: string | null };
}

/**
 * Fire-and-forget audit trail write. Never awaited by callers and never throws —
 * a logging failure must not break the actual admin mutation it's recording.
 */
export function logAdminAction(
  session: SessionLike,
  request: NextRequest,
  action: string,
  details: string
): void {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  auditLogRepository
    .create({
      userName: session.user.name || 'Unknown',
      userEmail: session.user.email || 'unknown',
      action,
      details,
      ip,
    })
    .catch((err) => console.error('[AuditLog] Failed to record action:', err));
}
