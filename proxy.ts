import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const isPublicRoute = pathname === '/login' || pathname === '/register';

  // If user is authenticated and tries to access public routes, redirect to dashboard
  if (isPublicRoute && token && verifyToken(token)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not authenticated and tries to access protected routes, redirect to login
  if (!isPublicRoute && (!token || !verifyToken(token))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)'],
};

