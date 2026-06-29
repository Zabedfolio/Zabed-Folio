import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

const { GET: betterAuthGET, POST: betterAuthPOST } = toNextJsHandler(auth);

export const GET = betterAuthGET;

export async function POST(request, ctx) {
  const url = new URL(request.url);

  // Block all sign-up attempts — only admin (created via seed script) can access
  if (
    url.pathname.includes("/sign-up") ||
    url.pathname.includes("/signUp")
  ) {
    return NextResponse.json(
      { error: "Registration is disabled on this site." },
      { status: 403 }
    );
  }

  return betterAuthPOST(request, ctx);
}
