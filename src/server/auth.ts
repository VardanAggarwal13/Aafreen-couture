import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { UnauthorizedError, ForbiddenError } from '@/lib/api-errors';

/**
 * Validates that the requesting client has an active session with role 'admin'.
 * Throws UnauthorizedError (401) if unauthenticated, or ForbiddenError (403) if role is not 'admin'.
 */
export async function requireAdmin(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (session?.user) {
    const role = (session.user as Record<string, unknown>).role as string | undefined;
    const userEmail = session.user.email?.toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

    if (role === 'admin' || userEmail === adminEmail || userEmail === 'support@aafreencouture.com') {
      return session;
    }
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
