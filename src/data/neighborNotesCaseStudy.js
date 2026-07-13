export const neighborNotesCaseStudyContent = {
  id: "neighbornotes",
  slug: "neighbornotes",
  title: "NeighborNotes — The Problem",
  subtitle: "One platform. Six cities. One broken channel.",
  summary:
    "From Dhaka's service-charge opacity to Barisal's sanitation crisis, Bangladesh's fastest-growing cities share the same breakdown: owners and residents have no reliable channel for communication, accountability, or escalation.",
  liveUrl: "",
  category: "Case Study",
  year: "2026",
  image: "",
  tags: ["Research", "Urban Housing", "Bangladesh", "Product Strategy"],
  stats: [
    { label: "Market value", value: "$12B+", detail: "~7.9% of GDP" },
    { label: "Urban households", value: "1.32 crore", detail: "Nationwide" },
    { label: "Urban structures", value: "25–30 lakh", detail: "Mostly in major cities" },
    { label: "Cities studied", value: "6", detail: "Dhaka to Barisal" },
  ],
  evidenceCards: [
    {
      title: "68–80% renters",
      description: "Major cities are dominated by tenants rather than owners, making communication breakdowns far more disruptive.",
    },
    {
      title: "500× tax shock",
      description: "Sylhet's holding-tax increase triggered protests, revealing how poor owner–resident communication magnifies public frustration.",
    },
    {
      title: "6 distinct local problems",
      description: "Each city had a different symptom, but the same structural gap: no dependable shared channel for notice, escalation, and accountability.",
    },
  ],
  cities: [
    {
      city: "Dhaka",
      holdings: "5.92 lakh holdings",
      ratio: "68% tenant / 32% owner",
      problem: "Service-charge opacity and developers mortgaging buildings without residents' knowledge.",
      feature: "Rules + general notice attachment for service-charge documentation.",
    },
    {
      city: "Chattogram",
      holdings: "1.85 lakh holdings",
      ratio: "~80% tenant",
      problem: "Waterlogging, lift failures, and delayed maintenance with paper-based coordination.",
      feature: "Emergency and maintenance categories for urgent alerts and repair visibility.",
    },
    {
      city: "Sylhet",
      holdings: "75,430 holdings",
      ratio: "Mostly NRB owners",
      problem: "Absentee owners and local residents cannot coordinate around building issues in real time.",
      feature: "Remote owner dashboard for 24/7 visibility from anywhere in the world.",
    },
    {
      city: "Khulna",
      holdings: "51,675 holdings",
      ratio: "Ownership disputes common",
      problem: "Unauthorized subletting and outsider access create a serious safety risk.",
      feature: "Verified building registration via a unique building code.",
    },
    {
      city: "Rajshahi",
      holdings: "82,000 holdings",
      ratio: "Tenant-dependent middle class",
      problem: "Post-COVID affordability pressure and rising flat prices create daily coordination strain.",
      feature: "Events and general categories to coordinate cost-sharing and shared services.",
    },
    {
      city: "Barisal",
      holdings: "1,05,200 households",
      ratio: "Climate-migrant growth",
      problem: "Weak sanitation infrastructure and rapid unplanned growth outpace repair coordination.",
      feature: "Maintenance category for visible reporting and escalation trails.",
    },
  ],
  coverageRows: [
    {
      problem: "Unauthorized subletting & outsider security risk",
      city: "Khulna",
      feature: "Verified registration via unique building/area code",
      status: "Solved",
      tone: "positive",
    },
    {
      problem: "Absentee owner disconnect",
      city: "Sylhet",
      feature: "Owner Dashboard, accessible remotely",
      status: "Solved",
      tone: "positive",
    },
    {
      problem: "Real-time hazard communication",
      city: "Chattogram / Sylhet",
      feature: "Emergency category + pin",
      status: "Solved",
      tone: "positive",
    },
    {
      problem: "Maintenance visibility & escalation",
      city: "Chattogram / Barisal",
      feature: "Maintenance category + comment thread",
      status: "Partially solved",
      tone: "warning",
    },
    {
      problem: "Service-charge financial opacity",
      city: "Dhaka",
      feature: "Rules/General category + notice attachments",
      status: "Partially solved",
      tone: "warning",
    },
    {
      problem: "Developer mortgage fraud",
      city: "Dhaka",
      feature: "—",
      status: "Out of scope",
      tone: "neutral",
    },
    {
      problem: "Housing affordability / inflation",
      city: "Rajshahi",
      feature: "Events/General category for cost-sharing coordination",
      status: "Partial, indirect mitigation",
      tone: "warning",
    },
    {
      problem: "Sanitation infrastructure",
      city: "Barisal",
      feature: "Maintenance category",
      status: "Partially solved",
      tone: "warning",
    },
  ],
  backlog: [
    "Maintenance ticket status field (Pending / In Progress / Resolved)",
    "Service Charge Ledger for audited monthly finance visibility",
    "PDF / document attachments on notices for receipts and contracts",
    "Multi-building and NRB remote owner support",
  ],
  sources: [
    "REHAB",
    "BBS Digital Census 2022",
    "DNCC Jan 2026 guideline",
    "City corporation revenue departments and assessment cells",
  ],
  chartData: {
    holdings: [
      { city: "Dhaka", holdings: 592000 },
      { city: "Chattogram", holdings: 185000 },
      { city: "Rajshahi", holdings: 82000 },
      { city: "Sylhet", holdings: 75430 },
      { city: "Khulna", holdings: 51675 },
      { city: "Barisal", holdings: 105200 },
    ],
    dhakaTenure: [
      { name: "Renters", value: 68, color: "#F59E0B" },
      { name: "Owners", value: 32, color: "#10B981" },
    ],
    chattogramTenure: [
      { name: "Renters", value: 80, color: "#F59E0B" },
      { name: "Owners", value: 20, color: "#10B981" },
    ],
    barisalSanitation: [
      { name: "Functioning septic tank", value: 49.6, color: "#10B981" },
      { name: "Inadequate / none", value: 50.4, color: "#F87171" },
    ],
  },
};

export const neighborNotesCaseStudyFallback = {
  ...neighborNotesCaseStudyContent,
  _id: "fallback-case-study",
};
