import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { defaultProcess } from "@/data/defaultProcess";

export async function GET() {
  try {
    const db = await getDb();
    const items = await db
      .collection("process")
      .find({})
      .sort({ order: 1 })
      .toArray();

    if (items && items.length > 0) {
      const serialized = items.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
      }));
      return NextResponse.json(serialized);
    }

    return NextResponse.json(defaultProcess);
  } catch (error) {
    console.error("GET /api/public/process error:", error);
    return NextResponse.json(defaultProcess);
  }
}
