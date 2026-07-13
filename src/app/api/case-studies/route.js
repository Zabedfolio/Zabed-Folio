import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { neighborNotesCaseStudyFallback } from "@/data/neighborNotesCaseStudy";

export async function GET() {
  try {
    const db = await getDb();
    const caseStudies = await db.collection("caseStudies").find({}).sort({ order: 1 }).toArray();

    if (caseStudies.length > 0) {
      return NextResponse.json(
        caseStudies.map((item) => ({ ...item, _id: item._id.toString() }))
      );
    }

    return NextResponse.json([neighborNotesCaseStudyFallback]);
  } catch {
    return NextResponse.json([neighborNotesCaseStudyFallback]);
  }
}
