import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function getDhakaTodayRange() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const dhakaDateStr = formatter.format(now); // "YYYY-MM-DD"

  const startOfDay = new Date(`${dhakaDateStr}T00:00:00+06:00`);
  const endOfDay = new Date(`${dhakaDateStr}T23:59:59.999+06:00`);

  return { startOfDay, endOfDay };
}

export async function GET(request) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  try {
    const db = await getDb();
    const col = db.collection("bookings");

    const now = new Date();
    const { startOfDay, endOfDay } = getDhakaTodayRange();

    const [total, upcoming, today, cancelled] = await Promise.all([
      col.countDocuments({}),
      col.countDocuments({
        status: "confirmed",
        startTime: { $gte: now },
      }),
      col.countDocuments({
        status: { $in: ["confirmed", "rescheduled"] },
        startTime: { $gte: startOfDay, $lte: endOfDay },
      }),
      col.countDocuments({
        status: { $in: ["cancelled", "rejected"] },
      }),
    ]);

    return NextResponse.json({
      total,
      upcoming,
      today,
      cancelled,
    });
  } catch (err) {
    console.error("GET /api/admin/bookings/stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

