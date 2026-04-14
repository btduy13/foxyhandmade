import { NextResponse } from 'next/server';

export function middleware(request) {
  // If the user is trying to access any /admin path
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Let them through if they are already on the login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for the admin auth cookie
    const adminToken = request.cookies.get('foxy_admin_token');

    // If no valid cookie, redirect them to the login page
    if (!adminToken || adminToken.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Otherwise, continue normally
  return NextResponse.next();
}

export const config = {
  // Only run the middleware on admin paths
  matcher: ['/admin/:path*'],
};
