import NeighborNotesCaseStudy from "@/components/NeighborNotesCaseStudy";

export default async function CaseStudyDetailPage({ params }) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,77,0,0.08),transparent_30%),linear-gradient(180deg,#0a0808_0%,#050505_100%)] text-white">
      <NeighborNotesCaseStudy variant="full" slug={slug} />
    </main>
  );
}
