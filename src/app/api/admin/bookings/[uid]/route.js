import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  const { uid } = await context.params;

  try {
    const db = await getDb();
    const doc = await db.collection("bookings").findOne({ uid });

    if (!doc) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...doc,
      _id: doc._id?.toString(),
    });
  } catch (err) {
    console.error("GET /api/admin/bookings/[uid] error:", err);
    return NextResponse.json({ error: "Failed to fetch booking details" }, { status: 500 });
  }
}

