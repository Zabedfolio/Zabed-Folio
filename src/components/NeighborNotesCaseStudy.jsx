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
        <p className="text-sm text-white/50">Static map preview for portfolio layout</p>
      </div>
      <div className="mx-auto overflow-hidden rounded-[1.75rem] bg-slate-950/90 p-4">
        <img
          src="https://i.ibb.co/GSn7pcB/Chat-GPT-Image-Jul-13-2026-05-44-12-PM.png"
          alt="Bangladesh city study map"
          className="h-[420px] w-full object-cover"
        />
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
            <div className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8 shadow-[0_20px_120px_rgba(0,0,0,0.25)]">
              <p className="section-label">Case study</p>
              <h3 className="mt-3 text-4xl font-semibold text-white">NeighborNotes — Digital transformation of owner–resident communication</h3>
              <p className="mt-5 max-w-2xl text-xl leading-9 text-white/70">A verified digital notice board connecting building owners and residents.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {study.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/60">{tag}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/50">
                <span>University capstone project</span>
                <span className="hidden sm:inline">•</span>
                <span>Timeline: 1 to 1.5 months</span>
              </div>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_0.75fr]">
              <div className="space-y-10">
                <section className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-2xl font-semibold text-white">Overview</h4>
                  <p className="mt-5 text-base leading-8 text-white/65">NeighborNotes is a role-based digital notice board that connects building owners and residents directly, replacing the scattered mix of handwritten paper notices, verbal messages passed through guards, and chaotic WhatsApp groups that dominate communication in Bangladesh's multi-story residential buildings today.</p>
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-2xl font-semibold text-white">1. What was this project, and how did it come about?</h4>
                  <p className="mt-5 text-sm leading-8 text-white/65">This was an open-topic capstone project for my university — we were free to choose any real-world problem to solve. Rather than picking something generic, I wanted to build something rooted in a problem I could actually observe. My father owns a residential building, which gave me a natural starting point to look closely at how communication actually works between owners and residents.</p>
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-2xl font-semibold text-white">2. How did you identify the problem?</h4>
                  <p className="mt-5 text-sm leading-8 text-white/65">I started by talking through the situation with AI tools and cross-checking with general research, using my father's building as a real-world reference point. The pattern that emerged was clear: residents across major Bangladeshi cities have no direct line to their building owner.</p>
                  <p className="mt-4 text-sm leading-8 text-white/65">If a pump breaks, a lift stops working, or a service charge deadline is approaching, that information has to pass through a building guard or caretaker — someone who is often busy, forgetful, or simply not equipped to manage communication for an entire building.</p>
                  <p className="mt-4 text-sm leading-8 text-white/65">This gets worse when the owner doesn't live on-site, which is common. Many owners are occupied with personal, office, or business commitments elsewhere in the city, or are expatriates living abroad entirely. In those cases, residents are frequently left to resolve building issues on their own, with no clear channel to escalate problems or receive updates.</p>
                  <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-6 text-sm leading-7 text-white/65">
                    <p className="font-semibold text-white">Communication gap</p>
                    <p className="mt-3">Resident → Guard → Owner, with critical messages often delayed or lost entirely.</p>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-2xl font-semibold text-white">3. How did you validate this was a real, widespread problem?</h4>
                  <p className="mt-5 text-sm leading-8 text-white/65">I didn't want to build a solution around a single anecdote, so I used AI-assisted research alongside public data sources (BBS census data, city corporation revenue records, and development authority reports) to check whether this pattern held at a national scale. It did — and the numbers were more severe than I expected.</p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-[1.5rem] bg-white/[0.03] p-6">
                      <p className="text-sm uppercase tracking-[0.24em] text-white/40">Dhaka</p>
                      <p className="mt-4 text-3xl font-semibold text-white">68%</p>
                      <p className="mt-3 text-sm text-white/60">renters in Dhaka facing a broken line to owners.</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-white/[0.03] p-6">
                      <p className="text-sm uppercase tracking-[0.24em] text-white/40">Chattogram</p>
                      <p className="mt-4 text-3xl font-semibold text-white">80%</p>
                      <p className="mt-3 text-sm text-white/60">tenant share, with monsoon damage and shared infrastructure risk.</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-white/[0.03] p-6">
                      <p className="text-sm uppercase tracking-[0.24em] text-white/40">Barisal</p>
                      <p className="mt-4 text-3xl font-semibold text-white">49.6%</p>
                      <p className="mt-3 text-sm text-white/60">buildings with functioning septic tanks, exposing sanitation notice gaps.</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-2xl font-semibold text-white">4. What was the core idea behind NeighborNotes?</h4>
                  <div className="mt-5 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-[1.5rem] bg-white/[0.03] p-6">
                      <p className="font-semibold text-white">Owner side</p>
                      <ul className="mt-4 space-y-3 text-sm text-white/65">
                        <li>Publish building notices, service charge updates, and official rules.</li>
                        <li>Pin critical alerts and keep an auditable record of notices.</li>
                        <li>Store documents and receipts tied to the building board.</li>
                      </ul>
                    </div>
                    <div className="rounded-[1.5rem] bg-white/[0.03] p-6">
                      <p className="font-semibold text-white">Resident side</p>
                      <ul className="mt-4 space-y-3 text-sm text-white/65">
                        <li>Report issues with photos directly to owners.</li>
                        <li>Filter notices by category for emergencies, maintenance, and rules.</li>
                        <li>Join only the board tied to their verified building.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-2xl font-semibold text-white">5. Biggest design problem</h4>
                  <p className="mt-5 text-sm leading-8 text-white/65">Problem: if anyone could join any building's notice board, the system would be chaotic and insecure — there would be no way to guarantee that people posting and reading notices actually lived in that building.</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[
                      { step: "1", label: "Owner collects resident email" },
                      { step: "2", label: "Owner invites email with unique building code" },
                      { step: "3", label: "Resident registers with email + building code" },
                    ].map((item) => (
                      <div key={item.step} className="rounded-[1.5rem] bg-white/[0.03] p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10 text-sm font-semibold text-[#ff4d00]">{item.step}</div>
                        <p className="mt-4 text-sm text-white/65">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-2xl font-semibold text-white">6. Why no private messaging?</h4>
                  <div className="mt-5 rounded-[1.5rem] border border-amber-500/15 bg-amber-500/5 p-6">
                    <p className="text-white font-semibold">Keeping communication public preserves accountability and reduces conflict.</p>
                    <p className="mt-4 text-sm leading-7 text-white/65">Direct chat can escalate disputes, create unread late-night messages, and remove the shared, auditable record that a notice board provides.</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-white/65">
                      <div className="rounded-2xl bg-white/[0.05] p-3">Transparency</div>
                      <div className="rounded-2xl bg-white/[0.05] p-3">Boundaries</div>
                      <div className="rounded-2xl bg-white/[0.05] p-3">Accountability</div>
                    </div>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-2xl font-semibold text-white">7. How the platform organizes information</h4>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {[
                      "Maintenance",
                      "Emergency",
                      "Lost & Found",
                      "Events",
                      "Rules",
                      "General",
                    ].map((category) => (
                      <span key={category} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/65">{category}</span>
                    ))}
                  </div>
                  <p className="mt-6 text-sm leading-8 text-white/65">Notices are sorted into fixed categories so residents can scan only what matters most. Critical items can be pinned, and older notices auto-archive to keep the board current instead of cluttered.</p>
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-2xl font-semibold text-white">8. What I would build next</h4>
                  <ul className="mt-5 space-y-4 text-sm text-white/65">
                    <li>Real-time updates via WebSockets so notices and comments appear instantly.</li>
                    <li>Mobile apps (React Native) for residents and caretakers who primarily use smartphones.</li>
                    <li>Maintenance ticketing with status tracking from reported issue to resolution.</li>
                    <li>Automated rent reminders and digital receipt generation.</li>
                  </ul>
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-2xl font-semibold text-white">9. What I learned</h4>
                  <p className="mt-5 text-sm leading-8 text-white/65">This project taught me how to turn a vague, personally observed problem into something backed by real data and scoped into a buildable product. The building-code invite system was a key lesson in access control: the instinct to let anyone self-register is almost never right for a system tied to physical buildings.</p>
                </section>
              </div>

              <aside className="space-y-8">
                <div className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-xl font-semibold text-white">Hero visual</h4>
                  <div className="mt-6 overflow-hidden rounded-[1.75rem] bg-slate-950/90">
                    <img src="https://i.ibb.co/GSn7pcB/Chat-GPT-Image-Jul-13-2026-05-44-12-PM.png" alt="NeighborNotes hero visual" className="h-80 w-full object-cover" />
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-xl font-semibold text-white">Technologies</h4>
                  <div className="mt-6 grid gap-3">
                    {[
                      "Next.js 14",
                      "Node.js",
                      "Express.js",
                      "MongoDB",
                      "Better Auth",
                      "Cloudinary",
                      "date-fns",
                    ].map((tech) => (
                      <span key={tech} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/65">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
                  <h4 className="text-xl font-semibold text-white">Supporting data</h4>
                  <div className="mt-6 space-y-4 text-sm text-white/65">
                    <div><span className="font-semibold text-white">Market value:</span> $12B+</div>
                    <div><span className="font-semibold text-white">Urban households:</span> 1.32 crore</div>
                    <div><span className="font-semibold text-white">Urban structures:</span> 25–30 lakh</div>
                  </div>
                </div>
              </aside>
            </div>

            <div className="mt-14 rounded-[2rem] border border-white/10 bg-[#060606]/80 p-8">
              <h4 className="text-2xl font-semibold text-white">Sources</h4>
              <div className="mt-5 space-y-3 text-sm text-white/65">
                {sources.map((s) => (
                  <div key={s}>• {s}</div>
                ))}
              </div>
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
