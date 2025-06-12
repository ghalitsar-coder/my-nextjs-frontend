// Utility functions for role-based middleware
import { NextResponse } from 'next/server';

export function setRoleCookie(response: NextResponse, role: string) {
  response.cookies.set('user-role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}

export function clearRoleCookie(response: NextResponse) {
  response.cookies.delete('user-role');
  return response;
}
