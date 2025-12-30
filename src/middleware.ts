import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getSessionSecret, SESSION_COOKIE_NAME } from './lib/config';

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/products'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get session token from cookie
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionToken) {
    // Redirect to login if no session
    const url = new URL('/api/auth/login', request.url);
    return NextResponse.redirect(url);
  }

  try {
    // Verify the session token
    const secret = new TextEncoder().encode(getSessionSecret());
    const { payload } = await jwtVerify(sessionToken.value, secret);

    // Check if session is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt && typeof payload.expiresAt === 'number' && payload.expiresAt <= now) {
      // Session expired, redirect to login
      const url = new URL('/api/auth/login', request.url);
      return NextResponse.redirect(url);
    }

    // Session is valid, continue
    return NextResponse.next();
  } catch (error) {
    console.error('Session verification failed:', error);
    // Invalid session, redirect to login
    const url = new URL('/api/auth/login', request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
