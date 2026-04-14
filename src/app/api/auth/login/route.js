import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();

    // In a real app, reading from process.env is preferred
    const adminPassword = process.env.ADMIN_PASSWORD || 'foxy123';

    if (password === adminPassword) {
      const response = NextResponse.json({ success: true, message: 'Đăng nhập thành công' });
      
      // Set the authentication cookie
      response.cookies.set({
        name: 'foxy_admin_token',
        value: 'authenticated',
        httpOnly: true, // Prevent XSS reading the cookie
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
      
      return response;
    } else {
      return NextResponse.json({ success: false, message: 'Mật khẩu không chính xác' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra' }, { status: 500 });
  }
}
