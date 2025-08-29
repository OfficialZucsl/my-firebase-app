import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const PROTECTED_ROUTES = ['/', '/loans', '/payments', '/transactions', '/offers', '/articles', '/settings'];
const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const session = cookies().get('user_session')?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some(route => request.nextUrl.pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.includes(request.nextUrl.pathname);

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
