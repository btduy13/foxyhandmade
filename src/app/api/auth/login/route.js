import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  LEGACY_ADMIN_COOKIE,
  createAdminSessionToken,
  getAdminAuthErrorMessage,
  getAdminSessionCookieOptions,
  isValidAdminPassword,
} from "@/lib/admin-session";

export async function POST(request) {
  try {
    const authError = getAdminAuthErrorMessage();
    if (authError) {
      return NextResponse.json(
        { success: false, message: authError },
        { status: 500 }
      );
    }

    const { password } = await request.json();
    if (!isValidAdminPassword(password)) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unable to create an admin session" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      ...getAdminSessionCookieOptions(),
    });

    response.cookies.set({
      name: LEGACY_ADMIN_COOKIE,
      value: "",
      ...getAdminSessionCookieOptions(),
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unable to process the login request" },
      { status: 500 }
    );
  }
}
