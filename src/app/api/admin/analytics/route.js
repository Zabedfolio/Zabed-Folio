import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET(request) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  try {
    const db = await getDb();
    const col = db.collection("analytics_events");

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Total counts
    const totalViews = await col.countDocuments();
    const allUnique = await col.distinct("sessionId");
    const totalVisitors = allUnique.length;

    // 2. Today's counts
    const todayViews = await col.countDocuments({ dateString: todayStr });
    const todayUnique = await col.distinct("sessionId", { dateString: todayStr });
    const todayVisitors = todayUnique.length;

    // 3. Last 7 days views & visitors
    const last7Views = await col.countDocuments({ timestamp: { $gte: sevenDaysAgo } });
    const last7Unique = await col.distinct("sessionId", { timestamp: { $gte: sevenDaysAgo } });
    const last7Visitors = last7Unique.length;

    // 4. Top Pages
    const topPages = await col
      .aggregate([
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    // 5. Top Referrers
    const topReferrers = await col
      .aggregate([
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    // 6. Device Breakdown
    const devices = await col
      .aggregate([
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // 7. Daily past 7 days trend
    const dailyTrendRaw = await col
      .aggregate([
        { $match: { timestamp: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: "$dateString",
            views: { $sum: 1 },
            uniqueSessions: { $addToSet: "$sessionId" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const dailyTrend = dailyTrendRaw.map((d) => ({
      date: d._id.slice(5), // MM-DD
      views: d.views,
      visitors: d.uniqueSessions.length,
    }));

    return NextResponse.json({
      totalViews,
      totalVisitors,
      todayViews,
      todayVisitors,
      last7Views,
      last7Visitors,
      topPages: topPages.map((p) => ({ path: p._id, count: p.count })),
      topReferrers: topReferrers.map((r) => ({ name: r._id, count: r.count })),
      devices: devices.map((d) => ({ name: d._id, count: d.count })),
      dailyTrend,
    });
  } catch (err) {
    console.error("GET /api/admin/analytics error:", err);
    return NextResponse.json(
      {
        totalViews: 0,
        totalVisitors: 0,
        todayViews: 0,
        todayVisitors: 0,
        last7Views: 0,
        last7Visitors: 0,
        topPages: [],
        topReferrers: [],
        devices: [],
        dailyTrend: [],
      },
      { status: 200 }
    );
  }
}
