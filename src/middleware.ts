import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '../auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/chat');
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');

  // Protect admin routes - must be authenticated AND have admin role
  if (isAdminRoute) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
    if (req.auth.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  // Protect chat routes - must be authenticated
  if (isProtectedRoute && !req.auth) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && req.auth) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
