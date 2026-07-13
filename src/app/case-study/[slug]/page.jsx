import NeighborNotesCaseStudy from "@/components/NeighborNotesCaseStudy";

export default async function CaseStudyDetailPage({ params }) {
  const { slug } = params;

  const response = await fetch("/api/case-studies", { cache: "no-store" });
  const caseStudies = await response.json();
  const study = Array.isArray(caseStudies)
    ? caseStudies.find((item) => item.slug === slug || item.id === slug)
    : null;

  return (
    <main className="min-h-screen bg-white">
      <NeighborNotesCaseStudy variant="full" study={study} slug={slug} />
    </main>
  );
}
