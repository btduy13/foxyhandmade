import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Đã đăng xuất' });
  
  // Clear the cookie by setting maxAge to 0
  response.cookies.set({
    name: 'foxy_admin_token',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  
  return response;
}
