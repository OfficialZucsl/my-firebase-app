import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const PROTECTED_ROUTES = ['/', '/loans', '/payments', '/transactions', '/offers', '/articles', '/settings'];
const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const session = cookies().get('user_session')?.value;
  const { pathname } = request.nextUrl;

  // Check if the current path is one of the protected routes.
  // Using .includes() on an array of exact paths is more reliable than startsWith().
  const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

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
