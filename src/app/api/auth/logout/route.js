import { NextResponse } from "next/server";

import { clearAdminSession } from "@/lib/admin-session";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out",
  });

  return clearAdminSession(response);
}

export async function DELETE() {
  return POST();
}
