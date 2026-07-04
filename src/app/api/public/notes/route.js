import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const items = await db.collection("notes").find({}).sort({ order: 1 }).toArray();
    
    // Map _id to string for react client
    const serialized = items.map(doc => ({
      ...doc,
      _id: doc._id?.toString()
    }));
    
    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
