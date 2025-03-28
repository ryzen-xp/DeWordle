import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the token from cookies instead of localStorage
  const token = request.cookies.get('token')?.value;

  // If the token exists, continue as normal
  if (token) {
    return NextResponse.next();
  }

  // Redirect to login page if not authenticated
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: '/game',
};
