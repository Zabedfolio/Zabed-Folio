import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { requireAdminSession } from "@/lib/admin-auth";

export async function PUT(request) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  try {
    const db = await getDb();
    const body = await request.json(); // [{ id: string, order: number, stepIdUpdate: string }]

    const ops = body.map(({ id, order, stepIdUpdate }) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order, id: stepIdUpdate } },
      },
    }));

    if (ops.length > 0) {
      await db.collection("processSteps").bulkWrite(ops);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
