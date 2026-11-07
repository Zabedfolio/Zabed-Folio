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
      // Serialize ObjectIds and normalize images and logos
      const serialized = items.map((doc) => {
        let image = doc.image;
        let logo = doc.logo;

        if (doc.id === "jerseyx") {
          if (!image || image.includes("unsplash")) {
            image = "https://i.ibb.co.com/WvF8GrDS/SCR-20261013-sufk.jpg";
          }
          if (!logo || logo === "jerseyx") {
            logo = "/jerseyX-light.png";
          }
          // Sync to db if outdated
          if (image !== doc.image || logo !== doc.logo) {
            db.collection("showcase").updateOne({ _id: doc._id }, { $set: { image, logo } }).catch(() => {});
          }
        } else if (doc.id === "hatkhola-bazar") {
          if (!logo || logo === "hatkhola") {
            logo = "/hatkhola.png";
            db.collection("showcase").updateOne({ _id: doc._id }, { $set: { logo } }).catch(() => {});
          }
        } else if (doc.id === "neighbornotes") {
          if (!logo || logo === "neighbornotes") {
            logo = "/neighbornotes-bell.png";
            db.collection("showcase").updateOne({ _id: doc._id }, { $set: { logo } }).catch(() => {});
          }
        } else if (doc.id === "icaw" || doc.id === "intelligent-collaborative-academic-workspace") {
          if (!logo || logo === "icaw") {
            logo = "/ICAW.png";
            db.collection("showcase").updateOne({ _id: doc._id }, { $set: { logo } }).catch(() => {});
          }
        }

        return {
          ...doc,
          _id: doc._id.toString(),
          image,
          logo,
        };
      });

      return NextResponse.json(serialized);
    }

    return NextResponse.json(defaultShowcase);
  } catch (error) {
    console.error("GET /api/public/showcase error:", error);
    return NextResponse.json(defaultShowcase);
  }
}
