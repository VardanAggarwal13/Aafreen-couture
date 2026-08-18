import { NextRequest, NextResponse } from 'next/server';

const ACCOUNT_PREFIXES = ['/dashboard', '/orders', '/profile', '/addresses', '/returns', '/notifications'];
const ADMIN_PREFIX = '/admin';
const AUTH_ROUTES = ['/login', '/register'];

// Better Auth stores the session cookie under one of these names depending on env
function getSessionToken(request: NextRequest): string | undefined {
  return (
    request.cookies.get('better-auth.session_token')?.value ??
    request.cookies.get('__Secure-better-auth.session_token')?.value
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = getSessionToken(request);
  const isAuthenticated = !!sessionToken;

  // Redirect logged-in users away from auth pages
  if (AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect customer account routes
  const isAccountRoute = ACCOUNT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (isAccountRoute && !isAuthenticated) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
    );
  }

  // Protect admin routes — full role verification happens in each admin page/API
  if (pathname.startsWith(ADMIN_PREFIX) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};
