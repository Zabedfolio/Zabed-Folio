'use client';

import Link from "next/link";
import { motion } from "framer-motion";

// Motion helpers matching the reference page motion language
const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

export default function NeighborNotesCaseStudy({ study, variant = "full", slug }) {
  const isNeighborNotes = slug === "neighbornotes" || !slug || (study && (study.slug === "neighbornotes" || study.id === "neighbornotes"));

  // Dynamic values for other custom case studies
  const title = study?.title || "Case Study";
  const subtitle = study?.subtitle || study?.summary || "";
  const heroSubtitle = study?.heroSubtitle || "Project Detail";
  const year = study?.year || "2026";
  const tags = Array.isArray(study?.tags)
    ? study.tags
    : study?.tags
    ? study.tags.split(",").map((t) => t.trim())
    : [];
  const image = study?.image || "";
  const liveUrl = study?.liveUrl || (isNeighborNotes ? "https://neighbornotes.vercel.app" : "");

  const parseJSON = (val) => {
    if (!val) return [];
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  };

  const marketStats = parseJSON(study?.marketStats);
  const chartData = parseJSON(study?.chartData);
  const evidenceCards = parseJSON(study?.evidenceCards);
  const problemCoverageAnalysis = study?.problemCoverageAnalysis && typeof study.problemCoverageAnalysis === "object"
    ? study.problemCoverageAnalysis
    : study?.problemCoverageAnalysis
    ? JSON.parse(study.problemCoverageAnalysis)
    : null;
  const coverageRows = parseJSON(study?.coverageRows);
  const backlog = Array.isArray(study?.backlog)
    ? study.backlog
    : study?.backlog
    ? study.backlog.split(",").map((b) => b.trim())
    : [];
  const techStack = parseJSON(study?.techStack);
  const legalBackdrop = Array.isArray(study?.legalBackdrop)
    ? study.legalBackdrop
    : study?.legalBackdrop
    ? study.legalBackdrop.split(",").map((l) => l.trim())
    : [];
  const sources = Array.isArray(study?.sources)
    ? study.sources
    : study?.sources
    ? study.sources.split(",").map((s) => s.trim())
    : [];

  if (!isNeighborNotes) {
    // ── Render Clean, Light-Themed Generic Layout for Other Custom Case Studies ──
    return (
      <main className="min-h-screen bg-white text-[#1a1a1a] select-text">
        {/* Navigation */}
        <div className="section-shell pt-10 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-black/35 transition-colors hover:text-black/70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3 rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5"
            >
              <path
                fillRule="evenodd"
                d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                clipRule="evenodd"
              />
            </svg>
            Back home
          </Link>
        </div>

        {/* Hero Section */}
        <section className="section-shell pt-16 pb-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="max-w-3xl space-y-6"
          >
            <motion.p
              variants={fade(0)}
              className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold"
            >
              {study?.category || "Case Study"}
            </motion.p>

            <motion.h1
              variants={fade(0.05)}
              className="text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#1a1a1a]"
            >
              {title}.
              {heroSubtitle && (
                <>
                  <br />
                  <span className="text-black/30">{heroSubtitle}</span>
                </>
              )}
            </motion.h1>

            <motion.p
              variants={fade(0.1)}
              className="text-lg leading-8 text-black/55 font-normal"
            >
              {subtitle}
            </motion.p>

            {liveUrl && (
              <motion.div variants={fade(0.15)} className="pt-2">
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#ff5f1a]/30 bg-white px-5 py-2.5 text-xs font-semibold tracking-wide text-[#1a1a1a] shadow-sm hover:border-[#ff5f1a] hover:bg-[#ff5f1a] hover:text-white hover:shadow-md transition-all duration-300"
                >
                  View Live Project ↗
                </a>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* Project Meta Cards Row */}
        <section className="section-shell pb-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid gap-6 md:grid-cols-3 w-full"
          >
            <motion.div
              variants={fade(0)}
              className="group rounded-3xl border border-black/8 bg-white p-6 flex flex-col justify-between min-h-[160px] hover:border-[#ff5f1a]/30 hover:shadow-lg transition-all duration-300 shadow-sm"
            >
              <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">Timeline / Year</span>
              <p className="text-2xl font-extrabold text-[#1a1a1a] mt-3">{year}</p>
              <span className="text-[8px] font-mono text-[#ff5f1a]/70 uppercase tracking-widest font-bold mt-2">Active</span>
            </motion.div>

            <motion.div
              variants={fade(0.05)}
              className="group rounded-3xl border border-black/8 bg-white p-6 flex flex-col justify-between min-h-[160px] hover:border-[#ff5f1a]/30 hover:shadow-lg transition-all duration-300 shadow-sm"
            >
              <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">Tags</span>
              <p className="text-sm font-semibold text-[#1a1a1a] truncate mt-3">
                {tags.slice(0, 3).join(", ") || "Development"}
              </p>
              <span className="text-[8px] font-mono text-[#ff5f1a]/70 uppercase tracking-widest font-bold mt-2">Core skills</span>
            </motion.div>

            <motion.div
              variants={fade(0.1)}
              className="group rounded-3xl border border-black/8 bg-white p-6 flex flex-col justify-between min-h-[160px] hover:border-[#ff5f1a]/30 hover:shadow-lg transition-all duration-300 shadow-sm"
            >
              <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">Status</span>
              <p className="text-2xl font-extrabold text-[#1a1a1a] mt-3">{liveUrl ? "Live" : "Internal"}</p>
              <span className="text-[8px] font-mono text-[#ff5f1a]/70 uppercase tracking-widest font-bold mt-2">Environment</span>
            </motion.div>
          </motion.div>
        </section>

        {/* Divider */}
        <div className="section-shell">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </div>

        {/* Detail Image if present */}
        {image && (
          <section className="section-shell py-12">
            <div className="overflow-hidden rounded-3xl border border-black/8 shadow-sm">
              <img src={image} alt={title} className="w-full h-[400px] object-cover" />
            </div>
          </section>
        )}

        {/* Content Sections */}
        <section className="section-shell py-12 space-y-16">
          
          {/* Market Stats if any */}
          {marketStats.length > 0 && (
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">Supporting Stats</p>
              <div className="grid gap-6 md:grid-cols-3">
                {marketStats.map((stat, i) => (
                  <div key={i} className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm hover:border-[#ff5f1a]/30 transition-colors">
                    <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">{stat.label}</span>
                    <p className="text-3xl font-extrabold text-[#1a1a1a] mt-2">{stat.value}</p>
                    {stat.detail && <p className="text-[10px] text-black/40 mt-1">{stat.detail}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Cards / Key Insights if any */}
          {evidenceCards.length > 0 && (
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">Key Insights</p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {evidenceCards.map((card, i) => (
                  <div key={i} className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm hover:border-[#ff5f1a]/30 transition-colors">
                    <h3 className="text-base font-bold text-[#1a1a1a]">{card.title}</h3>
                    <p className="text-xs leading-relaxed text-black/60 mt-2">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Backdrop if any */}
          {legalBackdrop.length > 0 && (
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">Regulatory Backdrop</p>
              <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  {legalBackdrop.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-sm text-black/60 items-start">
                      <span className="flex-shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">✓</span>
                      <span className="leading-relaxed font-semibold text-black">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Problem Coverage Analysis block if any */}
          {problemCoverageAnalysis && (
            <div className="space-y-4 max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">{problemCoverageAnalysis.heading || "Coverage Analysis"}</p>
              <p className="text-[1.05rem] leading-[1.9] text-black/55">{problemCoverageAnalysis.intro}</p>
            </div>
          )}

          {/* Coverage Rows Table if any */}
          {coverageRows.length > 0 && (
            <div className="space-y-4 w-full">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">System Resolution Matrix</p>
              <div className="overflow-x-auto border border-black/8 rounded-2xl bg-white w-full">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-black/10 bg-[#fcfcfc]">
                      <th className="py-4 px-4 font-mono text-[9px] text-black/45 font-bold uppercase tracking-wider">Problem</th>
                      <th className="py-4 px-4 font-mono text-[9px] text-black/45 font-bold uppercase tracking-wider">City Example</th>
                      <th className="py-4 px-4 font-mono text-[9px] text-black/45 font-bold uppercase tracking-wider">Feature</th>
                      <th className="py-4 px-4 font-mono text-[9px] text-black/45 font-bold uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-black/70">
                    {coverageRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#fcfcfc] transition-colors">
                        <td className="py-4 px-4 font-medium text-[#1a1a1a]">{row.problem}</td>
                        <td className="py-4 px-4 font-mono text-black/55">{row.city}</td>
                        <td className="py-4 px-4 text-black/55">{row.feature}</td>
                        <td className="py-4 px-4 font-mono font-bold">
                          <span className={row.tone === "positive" ? "text-emerald-600" : row.tone === "warning" ? "text-amber-600" : "text-black/35"}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tech Stack List if any */}
          {techStack.length > 0 && (
            <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start border-t border-black/5 pt-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">Tech Stack</p>
                <h3 className="text-2xl font-bold tracking-tight text-[#1a1a1a] mt-4">Tools & systems integrated in the development lifecycle.</h3>
              </div>
              <div className="space-y-3">
                {techStack.map((tech, idx) => (
                  <div key={idx} className="group flex flex-col justify-center rounded-2xl border border-black/8 bg-white px-5 py-4 shadow-sm hover:border-[#ff5f1a]/30 hover:shadow-md transition-all duration-300">
                    <span className="font-semibold text-black/85">{tech.name}</span>
                    <p className="mt-1.5 text-xs text-black/50 leading-relaxed font-normal">{tech.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Backlog List if any */}
          {backlog.length > 0 && (
            <div className="space-y-6 pt-12 max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">Future Roadmap</p>
              <ol className="space-y-4 text-[1.05rem] leading-[1.8] text-black/55">
                {backlog.map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="font-mono text-sm text-black/30 font-bold">{idx + 1}.</span>
                    <span className="font-semibold text-black">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* What I learned if any */}
          {study?.whatILearned && (
            <div className="space-y-4 pt-12 max-w-3xl border-t border-black/5">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">What I Learned</p>
              <p className="text-[1.05rem] leading-[1.9] text-black/55 italic">"{study.whatILearned}"</p>
            </div>
          )}

          {/* Sources if any */}
          {sources.length > 0 && (
            <div className="border-t border-black/5 pt-10">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/35 font-bold">Research references & Data sources</p>
              <ul className="grid gap-2 text-[10px] text-black/40 font-mono select-text list-none p-0 mt-4">
                {sources.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Closing CTA */}
        <section className="section-shell pb-24 pt-4">
          <div className="rounded-3xl border border-black/8 bg-white p-10 text-center shadow-sm">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-black/35">Explore project</p>
            <h2 className="mb-6 text-2xl font-bold text-[#1a1a1a]">Explore the case study live demo or repository</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/">
                <button className="rounded-full bg-[#ff5f1a] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#ff5f1a]/25 transition-opacity hover:opacity-90 animate-pulse">
                  Back home
                </button>
              </Link>
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <button className="rounded-full border border-black/8 bg-white px-8 py-3.5 text-sm font-semibold text-black/70 hover:bg-black/5 transition-all">
                    View Live Site ↗
                  </button>
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ── Render Bespoke NeighborNotes Case Study Page ──
  return (
    <main className="min-h-screen bg-white text-[#1a1a1a] select-text">
      
      {/* ── Top Navigation (Back Home) ── */}
      <div className="section-shell pt-10 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-black/35 transition-colors hover:text-black/70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3 w-3 rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5"
          >
            <path
              fillRule="evenodd"
              d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
              clipRule="evenodd"
            />
          </svg>
          Back home
        </Link>
      </div>

      {/* ── Hero Section ── */}
      <section className="section-shell pt-16 pb-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="max-w-3xl space-y-6"
        >
          <motion.p
            variants={fade(0)}
            className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold"
          >
            A solo capstone project
          </motion.p>

          <motion.h1
            variants={fade(0.05)}
            className="text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#1a1a1a]"
          >
            NeighborNotes.
            <br />
            <span className="text-black/30">Notice board.</span>
          </motion.h1>

          <motion.p
            variants={fade(0.1)}
            className="text-lg leading-8 text-black/55 font-normal"
          >
            A solo capstone project analyzing the owner–resident communication gap across six major Bangladeshi cities, and the digital notice board I built to close it.
          </motion.p>

          {liveUrl && (
            <motion.div variants={fade(0.12)} className="pt-2">
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#ff5f1a]/30 bg-white px-5 py-2.5 text-xs font-semibold tracking-wide text-[#1a1a1a] shadow-sm hover:border-[#ff5f1a] hover:bg-[#ff5f1a] hover:text-white hover:shadow-md transition-all duration-300"
              >
                View Live Project ↗
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ── Metadata Cards Section ── */}
      <section className="section-shell pb-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid gap-6 md:grid-cols-3 w-full"
        >
          {/* Coverage Card — 37.5% Fully Solved */}
          <motion.div
            variants={fade(0)}
            className="group relative overflow-hidden rounded-3xl border border-black/8 bg-white flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 min-h-[360px]"
          >
            {/* SVG radial arc background — 37.5% */}
            <div className="relative h-[200px] w-full bg-[#f8fdfb] border-b border-black/5 flex items-center justify-center overflow-hidden select-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
              {/* Large faint full circle as track */}
              <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full opacity-[0.07]">
                <circle cx="80" cy="80" r="65" fill="none" stroke="#10b981" strokeWidth="18" />
              </svg>
              {/* Animated arc — 37.5% of 408.41 circumference = 153.15 */}
              <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="65" fill="none" stroke="#10b981" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="408.41"
                  strokeDashoffset="255.26"
                  className="transition-all duration-1000"
                  style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.4))" }}
                />
              </svg>
              {/* Center stat */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="font-mono text-4xl font-black tracking-tight text-emerald-600">37.5%</span>
                <span className="font-mono text-[9px] text-emerald-600/60 uppercase tracking-widest font-bold mt-1">of 8 Problems</span>
              </div>
            </div>
            <div className="p-5 flex flex-col justify-between flex-grow text-left gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-xs font-bold font-mono text-[#1a1a1a] uppercase tracking-wider">Fully Solved</h3>
                </div>
                <p className="text-[11px] text-black/55 leading-relaxed mt-2">
                  3 out of 8 distinct city problems are completely resolved — unauthorized subletting, absentee owner disconnect, and real-time hazard communication.
                </p>
              </div>
              <span className="font-mono text-[8px] text-emerald-600/70 uppercase tracking-widest font-bold">
                Direct feature coverage
              </span>
            </div>
          </motion.div>

          {/* Coverage Card — 50% Partially Solved */}
          <motion.div
            variants={fade(0.05)}
            className="group relative overflow-hidden rounded-3xl border border-black/8 bg-white flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 min-h-[360px]"
          >
            {/* SVG radial arc background — 50% */}
            <div className="relative h-[200px] w-full bg-[#fffdf8] border-b border-black/5 flex items-center justify-center overflow-hidden select-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
              {/* Track */}
              <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full opacity-[0.07]">
                <circle cx="80" cy="80" r="65" fill="none" stroke="#f59e0b" strokeWidth="18" />
              </svg>
              {/* Animated arc — 50% of 408.41 = 204.20 offset */}
              <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="65" fill="none" stroke="#f59e0b" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="408.41"
                  strokeDashoffset="204.21"
                  className="transition-all duration-1000"
                  style={{ filter: "drop-shadow(0 0 6px rgba(245,158,11,0.4))" }}
                />
              </svg>
              {/* Center stat */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="font-mono text-4xl font-black tracking-tight text-amber-500">50%</span>
                <span className="font-mono text-[9px] text-amber-500/60 uppercase tracking-widest font-bold mt-1">of 8 Problems</span>
              </div>
            </div>
            <div className="p-5 flex flex-col justify-between flex-grow text-left gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <h3 className="text-xs font-bold font-mono text-[#1a1a1a] uppercase tracking-wider">Partially Solved</h3>
                </div>
                <p className="text-[11px] text-black/55 leading-relaxed mt-2">
                  4 out of 8 problems are significantly improved — maintenance visibility, service-charge opacity, housing affordability, and sanitation escalation.
                </p>
              </div>
              <span className="font-mono text-[8px] text-amber-500/70 uppercase tracking-widest font-bold">
                Communication layer added
              </span>
            </div>
          </motion.div>

          {/* Coverage Card — 12.5% Out of Scope */}
          <motion.div
            variants={fade(0.1)}
            className="group relative overflow-hidden rounded-3xl border border-black/8 bg-white flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:border-black/20 hover:shadow-xl hover:shadow-black/5 min-h-[360px]"
          >
            {/* SVG radial arc background — 12.5% */}
            <div className="relative h-[200px] w-full bg-[#fafafa] border-b border-black/5 flex items-center justify-center overflow-hidden select-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
              {/* Track */}
              <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full opacity-[0.06]">
                <circle cx="80" cy="80" r="65" fill="none" stroke="#6b7280" strokeWidth="18" />
              </svg>
              {/* Animated arc — 12.5% of 408.41 = 357.36 offset */}
              <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="65" fill="none" stroke="#9ca3af" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="408.41"
                  strokeDashoffset="357.36"
                  className="transition-all duration-1000"
                  style={{ filter: "drop-shadow(0 0 4px rgba(107,114,128,0.3))" }}
                />
              </svg>
              {/* Center stat */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="font-mono text-4xl font-black tracking-tight text-black/40">12.5%</span>
                <span className="font-mono text-[9px] text-black/30 uppercase tracking-widest font-bold mt-1">of 8 Problems</span>
              </div>
            </div>
            <div className="p-5 flex flex-col justify-between flex-grow text-left gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-black/20" />
                  <h3 className="text-xs font-bold font-mono text-[#1a1a1a] uppercase tracking-wider">Out of Scope</h3>
                </div>
                <p className="text-[11px] text-black/55 leading-relaxed mt-2">
                  1 out of 8 problems — developer mortgage fraud in Dhaka — is a legal/registry-verification issue no digital notice board can realistically solve.
                </p>
              </div>
              <span className="font-mono text-[8px] text-black/30 uppercase tracking-widest font-bold">
                Registry-level legal problem
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── Introduction & Context ── */}
      <section className="section-shell py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="max-w-3xl"
        >
          <motion.p variants={fade(0)} className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">
            Introduction & Context
          </motion.p>
          <div className="mt-6 text-[1.05rem] leading-[1.9] text-black/55 space-y-6">
            <motion.p variants={fade(0.05)}>
              This started as an open-topic university capstone — I could choose any real-world problem to solve. My father owns a residential building, which gave me a first-hand reference point to actually watch how communication breaks down between an owner and residents in practice.
            </motion.p>
            <motion.p variants={fade(0.1)}>
              What I found wasn't a small, local quirk. Bangladesh's urban housing market has grown to support over <span className="font-semibold text-[#1a1a1a]">5.2 crore urban residents</span>, and the same core problem — no direct channel between owner and resident — shows up everywhere, just with different local symptoms: service-charge opacity in Dhaka, sanitation failures in Barisal, absentee landlords in Sylhet. Residents are left with unresolved maintenance calls; owners struggle to coordinate basic building-wide communication. NeighborNotes is the digital notice board I designed and built to close that gap.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── Scale of the Problem ── */}
      <section className="section-shell py-16 space-y-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="space-y-8 w-full"
        >
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">
              The Scale of the Problem
            </p>
            <p className="mt-6 text-[1.05rem] leading-[1.9] text-black/55">
              Bangladesh's real estate sector now exceeds <strong className="text-black font-semibold">$12 billion</strong> in value, contributing roughly <strong className="text-black font-semibold">7.9% of national GDP</strong>. Of the country's urban households, over <strong className="text-black font-semibold">1.32 crore</strong> reside in city centers — and in Dhaka alone, more than <strong className="text-black font-semibold">56 lakh</strong> households live in dense, multi-story apartment stock with no institutional communication layer between owners and residents.
            </p>
          </div>

          {/* 3-up Simple Metric Cards (Full Width) */}
          <div className="grid gap-6 md:grid-cols-3 w-full">
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm flex flex-col justify-between h-36 hover:-translate-y-1 hover:border-[#ff5f1a]/30 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">Market Value</span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">$12B+</p>
                <p className="text-[10px] text-black/40 font-mono mt-1">Real Estate Sector</p>
              </div>
            </div>

            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm flex flex-col justify-between h-36 hover:-translate-y-1 hover:border-[#ff5f1a]/30 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">GDP Share</span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">7.9%</p>
                <p className="text-[10px] text-black/40 font-mono mt-1">National GDP</p>
              </div>
            </div>

            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm flex flex-col justify-between h-36 hover:-translate-y-1 hover:border-[#ff5f1a]/30 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">Urban Families</span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">1.32C</p>
                <p className="text-[10px] text-black/40 font-mono mt-1">Metropolitan Center</p>
              </div>
            </div>
          </div>

          {/* Holdings Bar Chart Card (Spans Full Width) */}
          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm hover:border-[#ff5f1a]/30 transition-all duration-300 w-full">
            <div className="mb-6">
              <p className="font-mono text-[9px] text-[#ff5f1a] uppercase tracking-wider font-bold">Registered Holdings by City</p>
              <h4 className="text-base font-bold text-[#1a1a1a] mt-1">Holdings distribution across major urban centers</h4>
            </div>
            <div className="space-y-4">
              {[
                { city: "Dhaka", value: 592000, label: "5.92 lakh" },
                { city: "Chattogram", value: 185000, label: "1.85 lakh" },
                { city: "Barisal", value: 105200, label: "1.05 lakh households" },
                { city: "Rajshahi", value: 82000, label: "82,000" },
                { city: "Sylhet", value: 75430, label: "75,430" },
                { city: "Khulna", value: 51675, label: "51,675" },
              ].map((item, idx) => {
                const max = 592000;
                const percent = (item.value / max) * 100;
                return (
                  <div key={item.city} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-mono text-black/60">
                      <span className="font-semibold text-black">{item.city}</span>
                      <span>{item.label}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-black/5 overflow-hidden w-full relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-[#ff5f1a] to-amber-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── How I Identified the Problem ── */}
      <section className="section-shell py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="max-w-3xl"
        >
          <motion.p variants={fade(0)} className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">
            How I Identified and Validated the Problem
          </motion.p>
          <div className="mt-6 text-[1.05rem] leading-[1.9] text-black/55 space-y-6">
            <motion.p variants={fade(0.05)}>
              I used AI tools to help me research and structure the problem, then cross-checked what I found against public data — BBS census figures, city corporation revenue records, and development authority reports — so the product wouldn't be built around a single anecdote. The pattern held at a national scale, and in most cases was worse than I expected. That regional breakdown is what shaped the product: instead of one generic feature set, each city's specific failure mode maps to a specific NeighborNotes feature.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── Six Cities, Six Local Crises ── */}
      <section className="section-shell py-16 space-y-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="space-y-8 w-full"
        >
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">
              Six Cities, Six Local Crises
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 w-full">
            {[
              {
                city: "Dhaka",
                badge: "DNCC/DSCC",
                meta: "5.92 lakh holdings · 68% renters",
                problem: "Developers have secretly mortgaged buildings without informing buyers; when loans default, courts auction homes out from under residents. Meanwhile, most renters never receive an audited service-charge statement.",
                resolution: "Rules/General categories with document attachments force public visibility on service-charge statements and property registry status."
              },
              {
                city: "Chattogram",
                badge: "CCC",
                meta: "1.85 lakh holdings · ~80% renters",
                problem: "Severe monsoon waterlogging cripples ground floors and water pumps. Caretakers rely on paper logs, causing long delays in fixing generators, lifts, and shared infrastructure.",
                resolution: "Emergency notifications flag real-time hazards; the Maintenance category tracks physical repairs with a visible history."
              },
              {
                city: "Sylhet",
                badge: "SCC",
                meta: "75,430 holdings · expat owners",
                problem: "Absentee NRB (expat) owners leave properties with local caretakers. When services fail or taxes spike, residents have no direct line to the actual owner.",
                resolution: "A remote owner dashboard gives diaspora landlords real-time oversight and a direct feedback channel from anywhere in the world."
              },
              {
                city: "Khulna",
                badge: "KCC",
                meta: "51,675 holdings · informal sublets",
                problem: "Tenants sublet informally without consent. Without visitor logs or a tenant register, unidentified occupants can pose safety risks inside buildings.",
                resolution: "Strict invite-only onboarding via verified building/owner codes prevents unregistered occupants from ever accessing the board."
              },
              {
                city: "Rajshahi",
                badge: "RCC",
                meta: "82,000 holdings · middle-class squeeze",
                problem: "Flat rates have spiked to ৳3,400–4,000/sq ft, pushing inflation-hit middle-class residents into cheaper housing with fewer basic services.",
                resolution: "Shared Events and General channels let tenants coordinate community-level cost-sharing for utilities and amenities."
              },
              {
                city: "Barisal",
                badge: "BCC",
                meta: "1.05 lakh households · climate growth",
                problem: "Rapid, unplanned migration has outpaced infrastructure. Sanitation is severe — only 49.6% of structures have a functioning septic tank.",
                resolution: "Maintenance logs give tenants a public escalation trail for building-wide sanitation updates."
              }
            ].map((item, idx) => (
              <motion.div
                key={item.city}
                variants={fade(idx * 0.05)}
                className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm flex flex-col justify-between min-h-[340px] hover:-translate-y-1 hover:border-[#ff5f1a]/30 hover:shadow-lg transition-all duration-500"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-[#1a1a1a]">{item.city}</h3>
                    <span className="font-mono text-[9px] text-black/40 font-bold uppercase tracking-wider bg-black/5 border border-black/5 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[9px] font-mono text-black/35 mt-1 font-semibold">
                    {item.meta}
                  </p>
                  
                  <div className="mt-4">
                    <h4 className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">Local Problem</h4>
                    <p className="text-xs leading-relaxed text-black/60 mt-1">{item.problem}</p>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10">
                  <h4 className="text-[9px] font-mono text-emerald-600/70 font-bold uppercase tracking-wider">NeighborNotes Resolution</h4>
                  <p className="text-xs leading-relaxed text-emerald-800/90 mt-1">{item.resolution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── The Legal Backdrop ── */}
      <section className="section-shell py-16 space-y-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="space-y-8 w-full"
        >
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">
              The Legal Backdrop (DNCC, January 2026)
            </p>
          </div>

          <motion.div
            variants={fade(0.05)}
            className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm hover:border-[#ff5f1a]/30 transition-all duration-300 w-full"
          >
            <p className="text-sm text-black/60 leading-relaxed mb-6 font-normal">
              Under the Rent Control Act 1991, the Dhaka North City Corporation released a 16-point tenant–owner guideline that NeighborNotes was designed to help owners comply with:
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "15% Rent Cap", desc: "Renegotiation capped at maximum 15% rent hike annually" },
                { title: "Key Access", desc: "Tenants must receive primary access keys (gate/roof) for fire safety" },
                { title: "Consent Required", desc: "New community guidelines require resident consent first" },
                { title: "Payment Receipts", desc: "Every payment demands a signed written receipt" },
                { title: "Deposit Limit", desc: "Security deposits capped at a maximum of 1–3 months' rent" },
                { title: "Notice Period", desc: "No arbitrary lockouts or motion restrictions without notice" },
                { title: "Bilateral Agreements", desc: "Written bilateral rental agreements are mandatory" },
                { title: "Utility Guarantee", desc: "Owners must keep gas/water/electricity and sanitation utilities active" }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 text-sm text-black/60 items-start">
                  <span className="flex-shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                    ✓
                  </span>
                  <span className="leading-relaxed">
                    <strong className="text-black font-semibold">{item.title}</strong> — {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── Designing the Access System ── */}
      <section className="section-shell py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="max-w-3xl space-y-8"
        >
          <motion.p variants={fade(0)} className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">
            Designing the Access System
          </motion.p>

          <motion.blockquote
            variants={fade(0.05)}
            className="border-l-2 border-[#ff5f1a]/40 pl-6 text-base italic leading-8 text-black/45"
          >
            If registration were open, anyone could join any building's board — no way to guarantee the people posting and reading notices actually lived there.
          </motion.blockquote>

          <motion.div
            variants={fade(0.1)}
            className="space-y-4"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-[#ff5f1a] font-bold">A two-step verified-entry flow:</p>
            <ol className="space-y-4 text-[1.05rem] leading-[1.8] text-black/55">
              <li className="flex gap-4">
                <span className="font-mono text-sm text-black/30 font-bold">1.</span>
                <span>The owner collects the resident's email directly, the same way a landlord already knows who's renting from them.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-sm text-black/30 font-bold">2.</span>
                <span>The owner invites that email and issues a unique building code.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-sm text-black/30 font-bold">3.</span>
                <span>The resident registers with their email <strong className="text-black font-semibold">and</strong> that code together — only then do they get access to that specific building's board.</span>
              </li>
            </ol>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── Why No Direct Messaging ── */}
      <section className="section-shell py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="max-w-3xl space-y-8"
        >
          <motion.p variants={fade(0)} className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">
            Why No Direct Messaging
          </motion.p>

          <motion.blockquote
            variants={fade(0.05)}
            className="border-l-2 border-[#ff5f1a]/40 pl-6 text-base italic leading-8 text-black/45"
          >
            Nothing gets said in private that either side can later deny — and nobody gets pinged outside reasonable hours.
          </motion.blockquote>

          <motion.p
            variants={fade(0.1)}
            className="text-[1.05rem] leading-[1.9] text-black/55"
          >
            Deliberately, NeighborNotes has no private chat. Direct messaging tends to escalate landlord–tenant conflict — late-night pings, unresolved back-and-forth, no record of what was actually agreed. Keeping everything as public notices and open comments keeps every interaction visible and timestamped.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── How NeighborNotes Solves It ── */}
      <section className="section-shell py-16 space-y-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="space-y-8 w-full"
        >
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">
              How NeighborNotes Solves It
            </p>
          </div>

          <motion.div
            variants={fade(0.05)}
            className="overflow-x-auto w-full border border-black/8 rounded-2xl bg-white shadow-sm"
          >
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 bg-[#fcfcfc]">
                  <th className="py-4 px-4 font-mono text-[9px] text-black/45 font-bold uppercase tracking-wider">Problem</th>
                  <th className="py-4 px-4 font-mono text-[9px] text-black/45 font-bold uppercase tracking-wider">City Example</th>
                  <th className="py-4 px-4 font-mono text-[9px] text-black/45 font-bold uppercase tracking-wider">NeighborNotes Feature</th>
                  <th className="py-4 px-4 font-mono text-[9px] text-black/45 font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-black/70">
                {[
                  { prob: "Unauthorized subletting & security risk", city: "Khulna", feat: "Verified registration via unique building/area code", status: "Solved", style: "text-emerald-600" },
                  { prob: "Absentee owner disconnect", city: "Sylhet", feat: "Owner Dashboard, accessible remotely from anywhere", status: "Solved", style: "text-emerald-600" },
                  { prob: "Real-time hazard communication", city: "Chattogram, Sylhet", feat: "Emergency category + pinned notice headers", status: "Solved", style: "text-emerald-600" },
                  { prob: "Maintenance visibility & escalation", city: "Chattogram, Barisal", feat: "Maintenance category + notice comment thread", status: "Partially Solved", style: "text-amber-600" },
                  { prob: "Service-charge financial opacity", city: "Dhaka", feat: "Rules/General category + document attachment options", status: "Partially Solved", style: "text-amber-600" },
                  { prob: "Developer mortgage fraud", city: "Dhaka", feat: "N/A — out of scope, legal/registry-verification problem", status: "Out of Scope", style: "text-black/35" },
                  { prob: "Housing affordability / inflation", city: "Rajshahi", feat: "Events/General channels for cost-sharing coordination", status: "Partially Solved", style: "text-amber-600" },
                  { prob: "Sanitation infrastructure failures", city: "Barisal", feat: "Maintenance category escalations & comment history", status: "Partially Solved", style: "text-amber-600" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#fcfcfc] transition-colors">
                    <td className="py-4 px-4 font-medium text-[#1a1a1a]">{row.prob}</td>
                    <td className="py-4 px-4 font-mono text-black/55">{row.city}</td>
                    <td className="py-4 px-4 text-black/55">{row.feat}</td>
                    <td className="py-4 px-4 font-mono font-bold">
                      <span className={row.style}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── Problem Coverage Analysis ── */}
      <section className="section-shell py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="max-w-3xl"
        >
          <motion.p variants={fade(0)} className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">
            Problem Coverage Analysis
          </motion.p>
          <div className="mt-6 text-[1.05rem] leading-[1.9] text-black/55">
            <motion.p variants={fade(0.05)}>
              Across the eight distinct local problems identified in this six-city research, NeighborNotes' current feature set{" "}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 font-mono text-[10px] font-bold mx-0.5">
                37.5% fully solved
              </span>
              ,{" "}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-600 font-mono text-[10px] font-bold mx-0.5">
                50% partially solved
              </span>{" "}
              by adding communication and accountability where none existed before, and is honestly{" "}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-black/10 bg-black/5 text-black/45 font-mono text-[10px] font-bold mx-0.5">
                12.5% out of scope
              </span>{" "}
              — developer mortgage fraud, which is a legal/registry-verification issue no notice board can realistically fix.
            </motion.p>
            <motion.p variants={fade(0.1)} className="mt-4">
              By replacing unverified verbal caretaker chains with timestamped digital notices and comment history, NeighborNotes directly targets the core communication loop affecting well over <strong className="text-black font-semibold">85.8 lakh urban residents</strong> across Dhaka and the other major city corporations studied here.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── Tech Stack ── */}
      <section className="section-shell py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start w-full"
        >
          <motion.div variants={fade(0)}>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">
              Tech Stack
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[#1a1a1a] mt-4">
              A modern stack designed for high availability and security.
            </h2>
          </motion.div>

          <div className="space-y-3 w-full">
            {[
              { name: "Next.js 14 (App Router)", reason: "Fast, mobile-responsive, well-suited to a role-based dashboard" },
              { name: "Node.js", reason: "Scalable network application environment supporting REST API patterns" },
              { name: "Express.js", reason: "Lightweight routing framework for the centralized controller logic" },
              { name: "MongoDB", reason: "Flexible document schema fitting varying notices, categories, and documents" },
              { name: "Better Auth", reason: "Handles the verified, building code invitation registration flow" },
              { name: "Cloudinary", reason: "Secure image storage for maintenance tickets and hazard notices" },
              { name: "date-fns", reason: "Utility methods managing auto-archived logs and notice expiry durations" }
            ].map((tech, idx) => (
              <motion.div
                key={tech.name}
                variants={fade(0.05 + idx * 0.03)}
                className="group flex flex-col justify-center rounded-2xl border border-black/8 bg-white px-5 py-4 shadow-sm transition-all hover:border-[#ff5f1a]/30 hover:shadow-md hover:shadow-[#ff5f1a]/5 w-full"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-black/85 transition-colors group-hover:text-[#1a1a1a]">
                    {tech.name}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-black/35">
                    Tool {idx + 1}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-black/50 leading-relaxed font-normal">
                  {tech.reason}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── Future Scope & Backlog ── */}
      <section className="section-shell py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="max-w-3xl space-y-8"
        >
          <motion.p variants={fade(0)} className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">
            Future Scope & Backlog
          </motion.p>

          <motion.div
            variants={fade(0.05)}
            className="space-y-6 text-[1.05rem] leading-[1.8] text-black/55"
          >
            <div className="flex gap-4 items-start">
              <span className="font-mono text-sm text-black/30 font-bold mt-0.5">1.</span>
              <span>
                <strong className="text-black font-semibold">Maintenance Ticket Status Fields</strong> — Implementing transitions (
                <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 rounded">Pending</span>,{" "}
                <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded">In Progress</span>,{" "}
                <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded">Resolved</span>
                ) for maintenance alerts, mapped directly from repair-logging gaps in Chattogram and Barisal.
              </span>
            </div>

            <div className="flex gap-4 items-start">
              <span className="font-mono text-sm text-black/30 font-bold mt-0.5">2.</span>
              <span>
                <strong className="text-black font-semibold">Audited Service-Charge Ledger</strong> — A digital accounting module allowing building associations to log collections, utilities, and expenses, mapped directly from Dhaka's service-charge opacity problem. (
                <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 rounded">Pending</span>
                )
              </span>
            </div>

            <div className="flex gap-4 items-start">
              <span className="font-mono text-sm text-black/30 font-bold mt-0.5">3.</span>
              <span>
                <strong className="text-black font-semibold">Document Attachment (PDF Support)</strong> — Allowing authors to attach receipts, utility billing scans, or lease templates directly inside Rules or Maintenance notices. (
                <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded">In Progress</span>
                )
              </span>
            </div>

            <div className="flex gap-4 items-start">
              <span className="font-mono text-sm text-black/30 font-bold mt-0.5">4.</span>
              <span>
                <strong className="text-black font-semibold">Multi-Building / NRB Remote Access</strong> — Streamlining landlord controls for owners managing properties from abroad, mapped directly from Sylhet's expat landlord-tenant disconnect. (
                <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded">Resolved</span>
                )
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── What I Learned ── */}
      <section className="section-shell py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="max-w-3xl"
        >
          <motion.p variants={fade(0)} className="font-mono text-xs uppercase tracking-[0.24em] text-black/35 font-semibold">
            What I Learned
          </motion.p>
          <div className="mt-6 text-[1.05rem] leading-[1.9] text-black/55 space-y-6">
            <motion.p variants={fade(0.05)}>
              Beyond the technical build, this project taught me how to turn a vague, personally-observed problem into something backed by real data and scoped into an actual buildable product. The building-code invite system in particular was a good lesson in access control — the instinct to "just let people sign up" is almost never right for a system tied to real physical spaces, and thinking through <em className="text-black font-semibold">who should be allowed in, and how do they prove it</em> early on shaped a lot of the rest of the architecture.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="section-shell pb-24 pt-4">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-black/8 bg-white p-10 text-center shadow-sm"
          >
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-black/35">
              Curious about the build?
            </p>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-[#1a1a1a]">
              Explore the project codebase or go back home.
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full bg-[#ff5f1a] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#ff5f1a]/25 transition-opacity hover:opacity-90"
                >
                  Back to homepage
                </motion.button>
              </Link>
              <a
                href="https://github.com/Zabedfolio"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full border border-black/8 bg-white px-8 py-3.5 text-sm font-semibold text-black/70 shadow-sm transition-all hover:bg-black/5"
                >
                  View the code
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Research References & Data Sources ── */}
      <section className="section-shell border-t border-black/5 pt-10 pb-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-4 max-w-3xl"
        >
          <motion.p variants={fade(0)} className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/35 font-bold">
            Research References & Data Sources
          </motion.p>
          <motion.ul variants={fade(0.05)} className="grid gap-2 text-[10px] text-black/40 font-mono select-text list-none p-0">
            <li>• Bangladesh Bureau of Statistics (BBS) — Population & Housing Census Report 2022</li>
            <li>• Real Estate & Housing Association of Bangladesh (REHAB) Annual Housing Index (2024–2025)</li>
            <li>• Dhaka North City Corporation (DNCC) Zonal Revenue Department & Tenant Guidelines (Jan 2026)</li>
            <li>• Sylhet City Corporation (SCC) Revenue Branch & BBS 2022 Ward Data</li>
            <li>• Chattogram City Corporation (CCC) Annual Budget & CDA Master Plan</li>
            <li>• Khulna City Corporation (KCC) Assessment Cell & KDA Master Plan</li>
            <li>• Rajshahi City Corporation (RCC) Door-to-Door Assessment Records & Revenue Branch</li>
            <li>• Barisal City Corporation (BCC) Assessment Cell & BBS Sanitation Survey</li>
          </motion.ul>
        </motion.div>
      </section>
      
    </main>
  );
}
