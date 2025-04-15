import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './lib/middleware/auth-middleware';

export async function middleware(req: NextRequest) {
  // Run the authentication middleware
  const authResponse = await authMiddleware(req);

  // If the auth middleware returned a response (redirect or rewrite), return it
  if (authResponse) {
    return authResponse;
  }

  // Continue processing the request if no response from auth middleware
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Apply middleware to all routes except static files and specific folders
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
