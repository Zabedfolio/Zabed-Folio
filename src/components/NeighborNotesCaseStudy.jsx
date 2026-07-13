'use client';

import Link from "next/link";
import { neighborNotesCaseStudyContent } from "@/data/neighborNotesCaseStudy";

function DonutChart({ data, label }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;

  return (
    <div className="space-y-4">
      <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-white/[0.03] p-3">
        <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
          <circle cx="60" cy="60" r="48" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
          {data.map((item) => {
            const length = (item.value / total) * 302;
            const dash = `${length} 302`;
            const circle = (
              <circle
                key={item.name}
                cx="60"
                cy="60"
                r="48"
                stroke={item.color}
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={dash}
                strokeDashoffset={-offset}
              />
            );
            offset += length;
            return circle;
          })}
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">{data[0]?.value}% renters</p>
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map((item) => item.holdings));

  return (
    <div className="mt-8 space-y-4">
      {data.map((item) => (
        <div key={item.city}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-white/70">{item.city}</span>
            <span className="text-white/45">{item.holdings.toLocaleString()}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4338CA] to-[#ff4d00]"
              style={{ width: `${(item.holdings / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NeighborNotesCaseStudy({ variant = "teaser", slug }) {
  const study = neighborNotesCaseStudyContent;
  const isFull = variant === "full";
  const stats = study.marketStats || study.stats || [];
  const cities = study.cities || [];
  const evidenceCards = study.evidenceCards || [];
  const coverageRows = study.coverageRows || [];
  const backlog = study.backlog || [];
  const sources = study.sources || [];
  const chartData = study.chartData || { holdings: [], dhakaTenure: [], chattogramTenure: [], barisalSanitation: [] };

  const mapCities = [
    { name: "Dhaka", x: 188, y: 170, labelOffsetX: -16, labelOffsetY: -12 },
    { name: "Chattogram", x: 264, y: 330, labelOffsetX: 10, labelOffsetY: 4 },
    { name: "Sylhet", x: 285, y: 110, labelOffsetX: 10, labelOffsetY: -10 },
    { name: "Khulna", x: 135, y: 360, labelOffsetX: -34, labelOffsetY: 4 },
    { name: "Rajshahi", x: 90, y: 220, labelOffsetX: -30, labelOffsetY: -10 },
    { name: "Barisal", x: 170, y: 400, labelOffsetX: 10, labelOffsetY: 12 },
  ];

  return (
    <section className="section-shell py-24 sm:py-32">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/75 transition hover:border-[#ff4d00]/30 hover:text-white">
              ← Back home
            </Link>
            <p className="section-label mb-0">{isFull ? "Case Study" : "03 — Case Study"}</p>
          </div>
          <h2 className="section-title mt-4">{study.title}</h2>
            {study.heroSubtitle ? <p className="mt-3 text-lg leading-8 text-white/60">{study.heroSubtitle}</p> : null}
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">{study.summary}</p>
        </div>
        {isFull ? (
          <a href={study.liveUrl || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#ff4d00]/20 bg-[#ff4d00]/10 px-5 py-3 text-sm text-white transition hover:border-[#ff4d00]/40">
            NeighborNotes Live Link <span aria-hidden>→</span>
          </a>
        ) : (
          <Link href={slug ? `/case-study/${slug}` : "/case-study/neighbornotes"} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/75 transition hover:border-[#ff4d00]/30 hover:text-white">
            Read the city-by-city research <span aria-hidden>→</span>
          </Link>
        )}
      </div>

      {isFull ? (
        <div className="space-y-8">
          <div className="grid gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-panel rounded-[1.5rem] p-6">
                <p className="text-sm text-white/40">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-white/50">{stat.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label">Research Snapshot</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Six cities, one recurring failure mode</h3>
                </div>
                {study.liveUrl ? (
                  <a href={study.liveUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[#ff4d00]/20 bg-[#ff4d00]/10 px-4 py-2 text-sm text-white/80">
                    Live Project ↗
                  </a>
                ) : null}
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {evidenceCards.map((card) => (
                  <div key={card.title} className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm font-semibold text-white">{card.title}</p>
                    <p className="mt-3 text-sm leading-7 text-white/55">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <p className="section-label">Regional context</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Six cities across Bangladesh</h3>
              <p className="mt-6 text-sm leading-7 text-white/60">This case study is built from research across Dhaka, Chattogram, Sylhet, Khulna, Rajshahi, and Barisal to show the national reach of the problem.</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {cities.map((city) => (
              <article key={city.city} className="glass-panel rounded-[1.75rem] p-6">
                <p className="section-label">{city.name}</p>
                <p className="mt-3 text-xl font-semibold text-white">{city.holdingsLabel || city.holdings?.toLocaleString()}</p>
                {city.ownerNote ? (
                  <p className="mt-2 text-sm text-[#ff8c00]">{city.ownerNote}</p>
                ) : city.tenantPct != null ? (
                  <p className="mt-2 text-sm text-[#ff8c00]">{city.tenantPct}% renter / {city.ownerPct}% owner</p>
                ) : null}
                <p className="mt-4 text-sm leading-7 text-white/60">{city.leadingProblem}</p>
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/55">
                  <span className="font-semibold text-white">Mapped feature:</span> {city.feature}
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <p className="section-label">Chart 1</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Registered holdings across six cities</h3>
              <BarChart data={chartData.holdings} />
            </div>
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <p className="section-label">Chart 2</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Tenant-heavy tenure pattern</h3>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <DonutChart data={chartData.dhakaTenure} label="Dhaka" />
                <DonutChart data={chartData.chattogramTenure} label="Chattogram" />
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <p className="section-label">Chart 3</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Barisal sanitation functionality</h3>
              <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">
                <DonutChart data={chartData.barisalSanitation} label="Barisal" />
                <div className="space-y-3 text-sm leading-7 text-white/60">
                  <p>Only 49.6% of buildings have a functioning septic tank, making sanitation a visible and urgent civic issue.</p>
                  <p>NeighborNotes can provide a trackable maintenance trail, but not replace infrastructure investment.</p>
                </div>
              </div>
            </div>
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <p className="section-label">Chart 4</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Rajshahi affordability pressure</h3>
              <div className="mt-8 rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-200">Coverage signal</p>
                    <p className="mt-2 text-4xl font-semibold text-white">80%</p>
                  </div>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-emerald-500/40 text-2xl font-semibold text-emerald-200">
                    80%
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-white/60">A shared events and cost-sharing layer can help residents coordinate around rising prices even when market forces remain beyond the product’s control.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <p className="section-label">Chart 5</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Sylhet tax escalation</h3>
              <div className="mt-8 rounded-[1.75rem] border border-amber-400/20 bg-amber-400/10 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-amber-100">Holding tax spike</p>
                <p className="mt-4 text-5xl font-semibold text-white">500×</p>
                <p className="mt-4 text-sm leading-7 text-white/65">The protest context in Sylhet shows that poor communication around ownership and finances can turn a manageable issue into a civic flashpoint.</p>
              </div>
            </div>
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <p className="section-label">Coverage</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Honest feature-to-problem coverage</h3>
              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="bg-white/[0.03] text-white/45">
                    <tr>
                      <th className="px-4 py-3">Problem</th>
                      <th className="px-4 py-3">City</th>
                      <th className="px-4 py-3">Feature</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-white/65">
                    {coverageRows.map((row) => (
                      <tr key={row.problem}>
                        <td className="px-4 py-3">{row.problem}</td>
                        <td className="px-4 py-3">{row.city}</td>
                        <td className="px-4 py-3">{row.feature}</td>
                        <td className={`px-4 py-3 ${row.tone === "positive" ? "text-emerald-300" : row.tone === "warning" ? "text-amber-300" : "text-white/45"}`}>
                          {row.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <p className="section-label">Future Scope</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Backlog surfaced by the city research</h3>
              <ul className="mt-6 space-y-3 text-sm leading-7 text-white/60">
                {backlog.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">{item}</li>
                ))}
              </ul>
            </div>
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <p className="section-label">Sources</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Research references</h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {sources.map((source) => (
                  <span key={source} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/55">
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <p className="section-label">Problem overview</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">The same broken channel shows up in six cities</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {stats.slice(0, 4).map((stat) => (
                <div key={stat.label} className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-white/40">{stat.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-2 text-sm text-white/50">{stat.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-[#ff4d00]">What the research says</p>
              <p className="mt-3 text-sm leading-7 text-white/60">The strongest insight is not that every city has a different issue; it is that all of them share a communication vacuum. NeighborNotes is positioned as the shared layer that brings visibility, accountability, and direct escalation into a system that otherwise depends on paper notes, caretakers, or silence.</p>
            </div>
          </div>
          <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <p className="section-label">Preview</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">Why this belongs in a portfolio</h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/60">
                This case study demonstrates research, product framing, and a real multi-city strategy, not just polished UI.
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/60">
                The visual language combines data storytelling, clear problem definition, and a credible product boundary so the work feels thoughtful rather than overhyped.
              </div>
              <Link href={slug ? `/case-study/${slug}` : "/case-study/neighbornotes"} className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#ff4d00]/20 bg-[#ff4d00]/10 px-5 py-3 text-sm text-white">
                View full case study <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
