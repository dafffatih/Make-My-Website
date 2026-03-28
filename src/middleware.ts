import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '../auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/chat');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');

  if (isProtectedRoute && !req.auth) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isAuthRoute && req.auth) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
