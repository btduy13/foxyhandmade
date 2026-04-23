import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getAdminAuthErrorMessage,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

export async function requireAdminSession() {
  const authError = getAdminAuthErrorMessage();
  if (authError) {
    return NextResponse.json({ error: authError }, { status: 500 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
