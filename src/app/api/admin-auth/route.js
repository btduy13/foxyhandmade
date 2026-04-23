export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  clearAdminSession,
  createAdminSessionToken,
  getAdminAuthErrorMessage,
  getAdminSessionCookieOptions,
  isAdminAuthConfigured,
  isValidAdminPassword,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

export async function POST(request) {
  const authError = getAdminAuthErrorMessage();
  if (authError) {
    return NextResponse.json({ error: authError }, { status: 500 });
  }

  const { password } = await request.json();
  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = createAdminSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Unable to create an admin session" },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    ...getAdminSessionCookieOptions(),
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  return clearAdminSession(response);
}

export async function GET() {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json({ authenticated: false, configured: false });
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return NextResponse.json({
    authenticated: verifyAdminSessionToken(session),
    configured: true,
  });
}
