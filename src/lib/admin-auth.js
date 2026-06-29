import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Validates the current session from request headers.
 * Returns the session object if valid, or throws a 401 NextResponse.
 */
export async function requireAdminSession(request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session, error: null };
}
