import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Root path (/) → always show landing page, never redirect
  if (pathname === '/') {
    return NextResponse.next();
  }
  
  // Panel routes require authentication (handled client-side via AuthContext)
  // Just pass through — client-side will handle redirect to /auth/login
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
