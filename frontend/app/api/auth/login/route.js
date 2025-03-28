import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  const body = await request.json();

  // Your authentication logic here
  // const { access_token, refresh_token } = await authenticateUser(body);

  // For demonstration purposes
  const access_token = localStorage.getItem('token');

  // Set the token as an HttpOnly cookie
  cookies().set({
    name: 'token',
    value: access_token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return NextResponse.json({ success: true });
}
