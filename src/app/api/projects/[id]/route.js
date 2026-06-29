import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const normalizedId = decodeURIComponent(id || "").toLowerCase();
    const db = await getDb();

    // Try finding by custom string slug ID (e.g. "sportnest")
    let project = await db.collection("projects").findOne({ id: normalizedId });

    // Try finding by MongoDB ObjectId if slug fails and ID format is valid
    if (!project && ObjectId.isValid(id)) {
      project = await db.collection("projects").findOne({ _id: new ObjectId(id) });
    }

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Convert _id to string for JSON serialization
    if (project._id) {
      project._id = project._id.toString();
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}