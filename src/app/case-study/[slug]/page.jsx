import NeighborNotesCaseStudy from "@/components/NeighborNotesCaseStudy";
import { getDb } from "@/lib/mongodb";
import { neighborNotesCaseStudyFallback } from "@/data/neighborNotesCaseStudy";

export default async function CaseStudyDetailPage({ params }) {
  // Await params since Next.js 15/16 makes dynamic route parameters asynchronous
  const { slug } = await params;

  let study = null;
  try {
    const db = await getDb();
    const item = await db.collection("caseStudies").findOne({ slug: slug });
    if (item) {
      study = { ...item, _id: item._id.toString() };
    }
  } catch (error) {
    console.error("Database connection error in Server Component:", error);
  }

  // Fallback to static mockup data if not found or DB query fails
  if (!study && (slug === "neighbornotes" || slug === "fallback-case-study")) {
    study = neighborNotesCaseStudyFallback;
  }

  return (
    <main className="min-h-screen bg-white">
      <NeighborNotesCaseStudy variant="full" study={study} slug={slug} />
    </main>
  );
}
