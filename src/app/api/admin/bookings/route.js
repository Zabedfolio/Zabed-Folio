import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";
    const search = (searchParams.get("search") || "").trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));
    const skip = (page - 1) * limit;

    const db = await getDb();
    const col = db.collection("bookings");

    const now = new Date();
    const conditions = [];

    // 1. Filter logic
    switch (filter) {
      case "upcoming":
        conditions.push({
          status: { $in: ["confirmed", "accepted"] },
          $or: [{ startTime: { $gte: now } }, { startTime: { $gte: now.toISOString() } }],
        });
        break;
      case "past":
        conditions.push({
          status: { $in: ["confirmed", "accepted"] },
          $or: [{ startTime: { $lt: now } }, { startTime: { $lt: now.toISOString() } }],
        });
        break;
      case "cancelled":
        conditions.push({
          status: { $in: ["cancelled", "canceled", "rejected"] },
        });
        break;
      case "rescheduled":
        conditions.push({
          status: "rescheduled",
        });
        break;
      case "all":
      default:
        // No status filter
        break;
    }

    // 2. Search logic (name, email, phone, or title)
    if (search) {
      const escaped = escapeRegex(search);
      const searchRegex = new RegExp(escaped, "i");
      conditions.push({
        $or: [
          { attendeeName: searchRegex },
          { attendeeEmail: searchRegex },
          { attendeePhone: searchRegex },
          { title: searchRegex },
        ],
      });
    }

    const query = conditions.length === 1 ? conditions[0] : conditions.length > 1 ? { $and: conditions } : {};

    // 3. Sorting logic:
    // Upcoming: nearest upcoming first
    // Past/Cancelled/All: most recent first
    const sort = filter === "upcoming" ? { startTime: 1 } : { startTime: -1, createdAt: -1 };

    const [total, items] = await Promise.all([
      col.countDocuments(query),
      col.find(query).sort(sort).skip(skip).limit(limit).toArray(),
    ]);

    const serialized = items.map((doc) => ({
      ...doc,
      _id: doc._id?.toString(),
    }));

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      bookings: serialized,
      data: serialized,
      total,
      page,
      totalPages,
      limit,
      pagination: {
        total,
        page,
        totalPages,
        limit,
      },
    });
  } catch (err) {
    console.error("GET /api/admin/bookings error:", err);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
