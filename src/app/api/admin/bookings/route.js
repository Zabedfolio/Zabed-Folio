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
    const query = {};

    // 1. Filter logic
    switch (filter) {
      case "upcoming":
        query.status = "confirmed";
        query.startTime = { $gte: now };
        break;
      case "past":
        query.status = "confirmed";
        query.startTime = { $lt: now };
        break;
      case "cancelled":
        query.status = { $in: ["cancelled", "rejected"] };
        break;
      case "rescheduled":
        query.status = "rescheduled";
        break;
      case "all":
      default:
        // No status filter
        break;
    }

    // 2. Search logic (name or email, case-insensitive)
    if (search) {
      const escaped = escapeRegex(search);
      const searchRegex = new RegExp(escaped, "i");
      query.$or = [
        { attendeeName: searchRegex },
        { attendeeEmail: searchRegex },
        { attendeePhone: searchRegex },
      ];
    }

    // 3. Sorting logic:
    // Upcoming: ascending by startTime (nearest upcoming first)
    // Past/Cancelled/All: descending by startTime (most recent first)
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
      data: serialized,
      total,
      page,
      totalPages,
      limit,
    });
  } catch (err) {
    console.error("GET /api/admin/bookings error:", err);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

