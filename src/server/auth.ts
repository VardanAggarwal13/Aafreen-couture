import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { UnauthorizedError, ForbiddenError } from '@/lib/api-errors';
import { isAdminUser } from '@/lib/admin-access';

/**
 * Validates that the requesting client has an active session with role 'admin'.
 * Throws UnauthorizedError (401) if unauthenticated, or ForbiddenError (403) if role is not 'admin'.
 */
export async function requireAdmin(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (session?.user) {
    if (isAdminUser(session.user)) return session;
    throw new ForbiddenError();
  }

  throw new UnauthorizedError();
}

/**
 * Validates that the requesting client has an active session.
 */
export async function requireAuth(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    throw new UnauthorizedError();
  }
  return session;
}
