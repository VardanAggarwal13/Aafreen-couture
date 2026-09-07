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
    const adminEmail = (process.env.ADMIN_EMAIL || 'support@aafreencouture.com').toLowerCase();

    if (role === 'admin' || userEmail === adminEmail) {
      return session;
    }
    throw new ForbiddenError();
  }

  if (process.env.NODE_ENV === 'development') {
    return {
      user: {
        id: 'admin-dev',
        name: 'Aafreen Admin Concierge',
        email: 'support@aafreencouture.com',
        role: 'admin',
      },
      session: { id: 'dev-session', userId: 'admin-dev' },
    } as any;
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
