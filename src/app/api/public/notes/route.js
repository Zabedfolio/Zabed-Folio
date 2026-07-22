import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET(request) {
  try {
    const { error } = await requireAdminSession(request);
    if (error) return error;

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
