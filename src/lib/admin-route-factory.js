import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/admin-auth";

/**
 * Factory that creates standard CRUD route handlers for a MongoDB collection.
 *
 * @param {string} collectionName - The MongoDB collection name
 * @returns {{ GET, POST, PUT, DELETE, reorderPUT }}
 */
export function createAdminRoutes(collectionName) {
  // GET /api/admin/[collection] — list all sorted by order
  async function GET(request) {
    const { error } = await requireAdminSession(request);
    if (error) return error;

    const db = await getDb();
    const items = await db
      .collection(collectionName)
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(items.map(serializeDoc));
  }

  // POST /api/admin/[collection] — create new item
  async function POST(request) {
    const { error } = await requireAdminSession(request);
    if (error) return error;

    const db = await getDb();
    const body = await request.json();

    // Determine next order value
    const last = await db
      .collection(collectionName)
      .findOne({}, { sort: { order: -1 } });
    const order = last ? (last.order ?? 0) + 1 : 0;

    const doc = { ...body, order, createdAt: new Date() };
    const result = await db.collection(collectionName).insertOne(doc);

    return NextResponse.json(
      serializeDoc({ ...doc, _id: result.insertedId }),
      { status: 201 }
    );
  }

  // PUT /api/admin/[collection]/[id] — update item
  async function PUT_ONE(request, id) {
    const { error } = await requireAdminSession(request);
    if (error) return error;

    const db = await getDb();
    const body = await request.json();
    const { _id, ...update } = body; // strip _id from update

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(serializeDoc(result));
  }

  // DELETE /api/admin/[collection]/[id] — delete item
  async function DELETE_ONE(request, id) {
    const { error } = await requireAdminSession(request);
    if (error) return error;

    const db = await getDb();
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  }

  // PUT /api/admin/[collection]/reorder — bulk reorder
  async function REORDER(request) {
    const { error } = await requireAdminSession(request);
    if (error) return error;

    const db = await getDb();
    const body = await request.json(); // [{ id: string, order: number }]

    const ops = body.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order } },
      },
    }));

    if (ops.length > 0) {
      await db.collection(collectionName).bulkWrite(ops);
    }

    return NextResponse.json({ success: true });
  }

  return { GET, POST, PUT_ONE, DELETE_ONE, REORDER };
}

// Serialize MongoDB document (convert _id ObjectId to string)
function serializeDoc(doc) {
  if (!doc) return doc;
  return {
    ...doc,
    _id: doc._id?.toString(),
  };
}
