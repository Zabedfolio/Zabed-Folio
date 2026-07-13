'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart as ReRadarChart,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
} from "recharts";
import { fadeUp, staggerContainer } from "@/utils/motionVariants";
import { neighborNotesCaseStudyContent } from "@/data/neighborNotesCaseStudy";

function DonutChart({ data, label }) {
  const total = (data || []).reduce((sum, item) => sum + (item.value || 0), 0);
  let offset = 0;

  return (
    <div className="space-y-4">
      <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-white/[0.03] p-3">
        <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
          <circle cx="60" cy="60" r="48" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
          {(data || []).map((item) => {
            const length = total > 0 ? (item.value / total) * 302 : 0;
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
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">{data?.[0]?.value ?? ""}% renters</p>
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const safe = data || [];
  const max = safe.length ? Math.max(...safe.map((item) => item.holdings || 0)) : 1;

  return (
    <div className="mt-4 space-y-4">
      {safe.map((item) => (
        <div key={item.city}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-white/70">{item.city}</span>
            <span className="text-white/45">{(item.holdings || 0).toLocaleString()}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4338CA] to-[#ff4d00]"
              style={{ width: `${((item.holdings || 0) / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CityRadarChart({ cities }) {
  const categories = [
    "financial",
    "maintenance",
    "security",
    "sanitation",
    "affordability",
    "absentee",
  ];

  const aggregated = categories.map((category) => {
    const total = cities.reduce((sum, city) => sum + (city.problemSeverity?.[category] || 0), 0);
    const value = cities.length ? Math.round((total / cities.length) * 10) / 10 : 0;
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      value,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReRadarChart cx="50%" cy="50%" outerRadius="70%" data={aggregated}>
        <PolarGrid stroke="rgba(148,163,184,0.16)" />
        <PolarAngleAxis dataKey="category" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <Radar name="Severity" dataKey="value" stroke="#ff4d00" fill="#ff4d00" fillOpacity={0.3} />
        <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
      </ReRadarChart>
    </ResponsiveContainer>
  );
}

function CityBubbleChart({ cities }) {
  const data = cities.map((city) => ({
    city: city.name,
    holdings: city.holdings || 0,
    severity: city.problemSeverity?.[city.problemCategory] || 0,
    z: Math.max(60, Math.min(260, (city.holdings || 0) / 2500)),
    fill:
      city.problemCategory === "financial"
        ? "#4338CA"
        : city.problemCategory === "infrastructure"
        ? "#F59E0B"
        : city.problemCategory === "absentee"
        ? "#10B981"
        : "#8b5cf6",
  }));

  const renderBubble = (props) => {
    const { cx, cy, payload } = props;
    return <circle cx={cx} cy={cy} r={Math.max(8, Math.min(22, payload.z / 12))} fill={payload.fill} opacity={0.85} />;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
        <XAxis
          dataKey="holdings"
          tickFormatter={(value) => `${Math.round(value / 1000)}k`}
          tick={{ fill: "#cbd5e1", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          name="Holdings"
        />
        <YAxis
          dataKey="severity"
          domain={[0, 6]}
          tick={{ fill: "#cbd5e1", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          name="Severity"
        />
        <ZAxis dataKey="z" range={[90, 260]} name="Size" />
        <ReTooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => [value, name]} />
        <Scatter name="City severity" data={data} shape={renderBubble} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function CityTenantScatter({ cities }) {
  const data = cities
    .filter((city) => typeof city.tenantPct === "number")
    .map((city) => ({
      city: city.name,
      tenantPct: city.tenantPct,
      holdings: city.holdings || 0,
      z: Math.max(60, Math.min(220, (city.tenantPct || 0) * 2.5)),
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="4 4" />
        <XAxis
          dataKey="tenantPct"
          tickFormatter={(value) => `${value}%`}
          tick={{ fill: "#cbd5e1", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          name="Tenant %"
        />
        <YAxis
          dataKey="holdings"
          tickFormatter={(value) => `${Math.round(value / 1000)}k`}
          tick={{ fill: "#cbd5e1", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          name="Holdings"
        />
        <ZAxis dataKey="z" range={[80, 220]} name="Marker" />
        <ReTooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => [name === "holdings" ? `${Math.round(value / 1000)}k` : `${value}%`, name]} />
        <Scatter name="Tenant mix" data={data} fill="#10B981" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function CityMap({ cities }) {
  const problems = {
    financial: "#4338CA",
    infrastructure: "#F59E0B",
    absentee: "#10B981",
    security: "#10B981",
    affordability: "#F59E0B",
  };

  const cityMarkers = cities.map((city) => ({
    ...city,
    size: Math.max(
      18,
      Math.min(
        42,
        ((city.holdings || parseInt((city.householdsLabel || "").replace(/[^0-9]/g, ""), 10)) / 10000) * 3
      )
    ),
    color: problems[city.problemCategory] || "#4338CA",
  }));

  const handleCityClick = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="section-label mb-1">City research map</p>
          <h3 className="text-2xl font-semibold text-white">Bangladesh city study map</h3>
        </div>
        <p className="text-sm text-white/50">Hover markers for local issue detail</p>
      </div>
      <div className="relative mx-auto h-[420px] max-w-4xl overflow-hidden rounded-[1.75rem] bg-slate-950/90 p-4">
        <motion.svg
          viewBox="0 0 360 420"
          className="h-full w-full"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <path
            d="M96 26c-24 12-42 44-38 72 4 28 32 50 54 70 12 10 20 22 24 38 8 30 6 72 26 94 8 8 20 16 30 22 22 12 48 12 70 2 28-14 46-42 58-72 14-36 14-76 12-114-2-18-6-36-18-50-14-18-36-24-58-24-28 0-58 10-78 32-18 20-32 48-50 70-8 10-18 18-28 24-12 8-24 4-34-6-10-12-8-28 0-42z"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
          />
        </motion.svg>
        {cityMarkers.map((marker) => (
          <motion.button
            key={marker.id}
            type="button"
            onClick={() => handleCityClick(marker.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute rounded-full border border-white/10 p-0"
            style={{
              left: `${((marker.coordinates.lng - 88) / 4.5) * 100}%`,
              top: `${((25.5 - marker.coordinates.lat) / 4.5) * 100}%`,
              width: marker.size,
              height: marker.size,
              backgroundColor: marker.color,
              boxShadow: `0 0 0 6px ${marker.color}20`,
              transform: "translate(-50%, -50%)",
            }}
            title={`${marker.name}: ${marker.holdingsLabel || marker.householdsLabel}
${marker.leadingProblem}`}
          />
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {cityMarkers.map((marker) => (
          <motion.button
            key={`legend-${marker.id}`}
            type="button"
            onClick={() => handleCityClick(marker.id)}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-white/20"
          >
            <p className="text-sm font-semibold text-white">{marker.name}</p>
            <p className="mt-1 text-xs leading-5 text-white/60">{marker.holdingsLabel || marker.householdsLabel}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default function NeighborNotesCaseStudy({ variant = "teaser", slug }) {
  const study = neighborNotesCaseStudyContent || {};
  const isFull = variant === "full";

  const stats = study.marketStats || study.stats || [];
  const cities = study.cities || [];
  const evidenceCards = study.evidenceCards || [];
  const coverageRows = study.coverageRows || [];
  const backlog = study.backlog || [];
  const sources = study.sources || [];
  const chartData = study.chartData || { holdings: [], dhakaTenure: [], chattogramTenure: [], barisalSanitation: [] };

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
        <div className="flex flex-wrap items-center gap-3">
          {study.liveUrl ? (
            <a href={study.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#ff4d00]/20 bg-[#ff4d00]/10 px-5 py-3 text-sm text-white transition hover:border-[#ff4d00]/40">View Live Project <span aria-hidden>→</span></a>
          ) : (
            <button disabled className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/40">Coming soon</button>
          )}
        </div>
      </div>

      {isFull ? (
        <div className="space-y-8">
          <article className="max-w-4xl">
            <p className="section-label">Project at a glance</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">NeighborNotes — Role, Timeline, Tech</h3>
            <p className="mt-4 text-sm leading-7 text-white/65">{study.heroSubtitle || study.summary}</p>

            <div className="mt-4 space-y-2 text-sm text-white/60">
              <div><span className="font-semibold text-white">Role:</span> Zabed Mahmud (Team Lead & Full Stack Developer), Monjur Uddin (Frontend), Nosad Sattar Sohag (Backend)</div>
              <div><span className="font-semibold text-white">Project Type:</span> Community PropTech Web Application</div>
              <div><span className="font-semibold text-white">Timeline:</span> 1 to 1.5 months</div>
              <div><span className="font-semibold text-white">Tech Stack:</span> Next.js 14, Node.js, Express.js, MongoDB, Better Auth, Cloudinary, date-fns</div>
            </div>

            <h4 className="mt-8 text-2xl font-semibold text-white">Project Background & Problem</h4>
            <p className="mt-3 text-sm text-white/65">{study.summary}</p>
            <p className="mt-3 text-sm text-white/65">NeighborNotes addresses the lack of a coordinated, auditable communication channel between owners and residents. The product seeks to reduce maintenance delays, financial opacity, unauthorized subletting, and safety risks by centralizing notices, verification, and escalation workflows.</p>

            <h4 className="mt-8 text-2xl font-semibold text-white">Nationwide research & data (summary table)</h4>
            <CityMap cities={cities} />

            <div className="mt-4 overflow-x-auto">
              <table className="w-full table-auto text-left text-sm">
                <thead className="text-white/60 border-b border-white/6">
                  <tr>
                    <th className="py-3 px-3">City</th>
                    <th className="py-3 px-3">Holdings</th>
                    <th className="py-3 px-3">Owner / Tenant</th>
                    <th className="py-3 px-3">Major problem</th>
                    <th className="py-3 px-3">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((c) => (
                    <tr key={c.id} className="border-b border-white/6 align-top">
                      <td className="py-3 px-3 text-white">{c.name}</td>
                      <td className="py-3 px-3 text-white/65">{c.holdingsLabel || (c.holdings ? c.holdings.toLocaleString() : c.householdsLabel || "—")}</td>
                      <td className="py-3 px-3 text-white/65">{c.tenantPct != null ? `${c.tenantPct}% / ${c.ownerPct}%` : (c.ownerNote || "—")}</td>
                      <td className="py-3 px-3 text-white/65">{c.leadingProblem}</td>
                      <td className="py-3 px-3 text-white/60">{c.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 className="mt-8 text-2xl font-semibold text-white">Selected insights</h4>
            <ul className="mt-3 text-sm text-white/65 list-disc pl-5">
              {evidenceCards.map((card) => (
                <li key={card.title}><span className="font-semibold text-white">{card.title}:</span> {card.description}</li>
              ))}
            </ul>

            <h4 className="mt-8 text-2xl font-semibold text-white">Data visualizations</h4>
            <p className="mt-2 text-sm text-white/65">Focused charts illustrate the holdings distribution and tenure patterns that informed our product decisions.</p>

            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[1rem] border border-white/6 p-4 bg-white/[0.01]">
                <h5 className="text-white font-semibold">Registered holdings across cities</h5>
                <BarChart data={chartData.holdings} />
              </div>

              <div className="rounded-[1rem] border border-white/6 p-4 bg-white/[0.01]">
                <h5 className="text-white font-semibold">Tenure composition (sample cities)</h5>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <DonutChart data={chartData.dhakaTenure} label="Dhaka" />
                  <DonutChart data={chartData.chattogramTenure} label="Chattogram" />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1rem] border border-white/6 p-4 bg-white/[0.01]">
              <h5 className="text-white font-semibold">Barisal sanitation</h5>
              <div className="mt-3 flex items-start gap-4">
                <DonutChart data={chartData.barisalSanitation} label="Barisal" />
                <p className="text-sm text-white/65">Only <span className="font-semibold text-white">{chartData.barisalSanitation?.[0]?.value ?? "49.6"}%</span> of buildings have functioning septic tanks — a clear infrastructure gap where NeighborNotes can surface maintenance needs and escalate them to authorities.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="rounded-[1rem] border border-white/6 p-4 bg-white/[0.01]">
                <h5 className="text-white font-semibold">Qualitative severity radar</h5>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/40">Illustrative severity index only — derived from case-study descriptions.</p>
                <div className="mt-4 h-72">
                  <CityRadarChart cities={cities} />
                </div>
              </motion.div>
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="rounded-[1rem] border border-white/6 p-4 bg-white/[0.01]">
                <h5 className="text-white font-semibold">Holdings vs. qualitative severity</h5>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/40">Illustrative bubble chart only.</p>
                <div className="mt-4 h-72">
                  <CityBubbleChart cities={cities} />
                </div>
              </motion.div>
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="rounded-[1rem] border border-white/6 p-4 bg-white/[0.01]">
                <h5 className="text-white font-semibold">Holdings vs. tenant mix</h5>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/40">Real data only for Dhaka and Chattogram.</p>
                <div className="mt-4 h-72">
                  <CityTenantScatter cities={cities} />
                </div>
              </motion.div>
            </div>

            <h4 className="mt-8 text-2xl font-semibold text-white">What NeighborNotes solves</h4>
            <ul className="mt-3 list-disc pl-5 text-sm text-white/65">
              <li><span className="font-semibold text-white">Financial transparency:</span> uploadable receipts, pinned notices, and auditable threads.</li>
              <li><span className="font-semibold text-white">Verified access:</span> registration via building/area code to prevent unauthorized subletting.</li>
              <li><span className="font-semibold text-white">Maintenance & emergency workflows:</span> photo-backed notices, pinned emergencies, and visible escalation trails.</li>
              <li><span className="font-semibold text-white">Remote owner dashboards:</span> NRB owners can supervise and approve actions from anywhere.</li>
            </ul>

            <h4 className="mt-8 text-2xl font-semibold text-white">Technical architecture</h4>
            <p className="mt-3 text-sm text-white/65">Frontend: Next.js 14 (App Router) + Tailwind CSS. Backend: Node.js + Express.js. DB: MongoDB. Auth: Better Auth. Image uploads: Cloudinary. Date handling: date-fns. Deploy: Vercel (frontend) + Render (backend).</p>

            <h4 className="mt-8 text-2xl font-semibold text-white">UX decisions</h4>
            <p className="mt-3 text-sm text-white/65">We intentionally omitted private messaging to preserve public transparency and avoid harassment; instead the product emphasizes visible notices, comments, and pinned owner responses.</p>

            <h4 className="mt-8 text-2xl font-semibold text-white">Future roadmap</h4>
            <p className="mt-3 text-sm text-white/65">Planned features: real-time updates (WebSockets), mobile apps (React Native), maintenance request tracking, automated rent reminders and receipts.</p>

            <h4 className="mt-8 text-2xl font-semibold text-white">Sources</h4>
            <div className="mt-3 text-sm text-white/65">
              {sources.map((s) => (
                <div key={s}>• {s}</div>
              ))}
            </div>

          </article>
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
