import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function authMiddleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Allow requests for API routes, static files, and auth pages
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/auth') // Exclude all auth routes
  ) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated and trying to access a protected route
  if (!token && !pathname.startsWith('/auth')) {
     const loginUrl = new URL('/auth/login', req.url);
     loginUrl.searchParams.set('callbackUrl', req.url); // Optionally redirect back after login
     return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access login/register, redirect to dashboard
  if (token && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
      return NextResponse.redirect(new URL('/', req.url)); // Adjust redirect destination if needed (e.g., '/dashboard')
  }


  return NextResponse.next();
}
