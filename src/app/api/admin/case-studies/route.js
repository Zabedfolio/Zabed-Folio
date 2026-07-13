import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/admin-auth";
import { neighborNotesCaseStudyFallback } from "@/data/neighborNotesCaseStudy";

export async function GET(request) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  const db = await getDb();
  const existing = await db.collection("caseStudies").find({}).sort({ order: 1 }).toArray();

  if (existing.length > 0) {
    return NextResponse.json(existing.map((item) => ({ ...item, _id: item._id.toString() })));
  }

  const existingFallback = await db.collection("caseStudies").findOne({ id: neighborNotesCaseStudyFallback.id });
  if (existingFallback) {
    return NextResponse.json([{ ...existingFallback, _id: existingFallback._id.toString() }]);
  }

  const fallbackDoc = { ...neighborNotesCaseStudyFallback };
  delete fallbackDoc._id;
  const inserted = await db.collection("caseStudies").insertOne({
    ...fallbackDoc,
    order: 0,
    createdAt: new Date(),
  });

  const saved = await db.collection("caseStudies").findOne({ _id: inserted.insertedId });
  return NextResponse.json([{ ...saved, _id: saved._id.toString() }]);
}

export async function POST(request) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  const db = await getDb();
  const body = await request.json();

  const last = await db.collection("caseStudies").findOne({}, { sort: { order: -1 } });
  const order = last ? (last.order ?? 0) + 1 : 0;

  const doc = {
    ...body,
    order,
    createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
  };

  const result = await db.collection("caseStudies").insertOne(doc);
  return NextResponse.json({ ...doc, _id: result.insertedId.toString() }, { status: 201 });
}
