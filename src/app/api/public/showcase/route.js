import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { defaultShowcase } from "@/data/defaultShowcase";

export async function GET() {
  try {
    const db = await getDb();
    const items = await db
      .collection("showcase")
      .find({})
      .sort({ order: 1 })
      .toArray();

    if (items && items.length > 0) {
      // Serialize ObjectIds to strings
      const serialized = items.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
      }));
      return NextResponse.json(serialized);
    }

    return NextResponse.json(defaultShowcase);
  } catch (error) {
    console.error("GET /api/public/showcase error:", error);
    return NextResponse.json(defaultShowcase);
  }
}
