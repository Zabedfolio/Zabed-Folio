import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { path, referrer, device, sessionId } = body;

    if (!path || path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true });
    }

    const db = await getDb();
    const now = new Date();

    const event = {
      path: path.split("?")[0], // normalize path without query strings
      referrer: referrer || "Direct",
      device: device || "Desktop",
      sessionId: sessionId || "anonymous",
      timestamp: now,
      dateString: now.toISOString().split("T")[0], // YYYY-MM-DD for fast daily grouping
    };

    // Insert event
    await db.collection("analytics_events").insertOne(event);

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Non-blocking fail-safe
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
