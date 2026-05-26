'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import pic from "@/assets/zabed.png";

// ─── Motion helpers ───────────────────────────────────────────────────────────
const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const timeline = [
  {
    year: "2018",
    title: "First line of HTML",
    body: "Opened Notepad, typed <h1>Hello</h1>, and something clicked. That was the start of it all.",
  },
  {
    year: "2020",
    title: "Went deep on React",
    body: "Components, hooks, state — I rebuilt everything I'd made just to understand it properly.",
  },
  {
    year: "2022",
    title: "First real client project",
    body: "Shipped a production dashboard for a local business. Learnt more in six weeks than in two years of tutorials.",
  },
  {
    year: "2024",
    title: "Design systems obsession",
    body: "Stopped treating CSS as an afterthought. Started caring about spacing, typography, motion, and intent.",
  },
  {
    year: "Now",
    title: "Building things that matter",
    body: "15+ projects in, still learning. Focus: interfaces that feel inevitable, not assembled.",
  },
];

const stack = [
  { label: "React / Next.js", note: "primary framework" },
  { label: "TypeScript", note: "always" },
  { label: "Tailwind CSS", note: "styling" },
  { label: "Framer Motion", note: "animation" },
  { label: "Figma", note: "design" },
  { label: "Node.js", note: "backend when needed" },
];

const interests = [
  "Interface motion design",
  "Design systems",
  "Open source tooling",
  "Typography & editorial layout",
  "Ambient music while coding",
  "Long walks with bad ideas that become good ones",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function MoreAboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Back link ── */}
      <div className="section-shell pt-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/35 transition-colors hover:text-white/70"
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

      {/* ── Hero block ── */}
      <section className="section-shell pb-16 pt-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="grid gap-12 lg:grid-cols-5 lg:items-start"
        >
          {/* Left: text */}
          <div className="space-y-6 lg:col-span-3">
            <motion.p
              variants={fade(0)}
              className="font-mono text-xs uppercase tracking-[0.24em] text-[#ff5f1a]"
            >
              A little more about me
            </motion.p>

            <motion.h1
              variants={fade(0.05)}
              className="text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[1.05] tracking-[-0.04em]"
            >
              Hey, I'm{" "}
              <span className="text-[#ff5f1a]">Zabed.</span>
              <br />
              Designer &amp; dev,
              <br />
              <span className="text-white/30">a bit of both.</span>
            </motion.h1>

            <motion.p
              variants={fade(0.1)}
              className="max-w-xl text-lg leading-8 text-white/55"
            >
              I'm a frontend developer and interface designer from Bangladesh.
              I care deeply about how products <em className="text-white/80 not-italic">feel</em> — the
              spacing between letters, the easing on a transition, the moment a
              layout becomes obvious rather than explained.
            </motion.p>

            <motion.p
              variants={fade(0.15)}
              className="max-w-xl text-lg leading-8 text-white/55"
            >
              I've been making websites for about{" "}
              <span className="font-semibold text-white">6 months</span> seriously,
              building <span className="font-semibold text-white">15+ projects</span> ranging
              from dashboards and landing pages to full product interfaces. I'm
              currently focused on levelling up in motion design and complex
              interactive UI.
            </motion.p>
          </div>

          {/* Right: portrait */}
          <motion.div
            variants={fade(0.2)}
            className="lg:col-span-2"
          >
            <motion.div
              whileHover={{ y: -8 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="glass-panel relative aspect-[3/4] overflow-hidden rounded-[2rem] p-3"
            >
              <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]">
                <Image
                  src={pic}
                  alt="Zabed Mahmud"
                  fill
                  className="object-cover"
                  priority
                />
                {/* subtle orange overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#ff4d00]/20 to-transparent" />
              </div>

              {/* floating badge */}
              <div className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/60 px-4 py-1.5 font-mono text-xs tracking-widest text-white/60 backdrop-blur-md">
                Based in Bangladesh 🇧🇩
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── Timeline ── */}
      <section className="section-shell py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          <motion.p
            variants={fade()}
            className="mb-10 font-mono text-xs uppercase tracking-[0.24em] text-white/35"
          >
            Journey so far
          </motion.p>

          <div className="relative space-y-0 before:absolute before:left-[5.5rem] before:top-0 before:h-full before:w-px before:bg-white/8 sm:before:left-24">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                variants={fade(i * 0.06)}
                className="group relative grid grid-cols-[6rem_1fr] gap-6 py-7 sm:grid-cols-[6rem_1fr]"
              >
                {/* Year */}
                <div className="pt-0.5 text-right font-mono text-sm font-semibold text-[#ff5f1a]/60 transition-colors group-hover:text-[#ff5f1a]">
                  {item.year}
                </div>

                {/* Dot */}
                <div className="absolute left-[5.4rem] top-[1.85rem] h-2.5 w-2.5 rounded-full border-2 border-[#ff5f1a]/30 bg-[#0a0a0a] transition-colors group-hover:border-[#ff5f1a] sm:left-[5.85rem]" />

                {/* Content */}
                <div className="pl-6">
                  <p className="mb-1 text-base font-semibold text-white/90">{item.title}</p>
                  <p className="text-sm leading-7 text-white/45">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── Stack + Interests ── */}
      <section className="section-shell py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="grid gap-16 lg:grid-cols-2"
        >
          {/* Stack */}
          <div>
            <motion.p
              variants={fade()}
              className="mb-8 font-mono text-xs uppercase tracking-[0.24em] text-white/35"
            >
              What I work with
            </motion.p>
            <div className="space-y-3">
              {stack.map((item, i) => (
                <motion.div
                  key={item.label}
                  variants={fade(i * 0.05)}
                  className="group flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.03] px-5 py-4 transition-colors hover:border-[#ff5f1a]/20 hover:bg-white/[0.05]"
                >
                  <span className="font-medium text-white/80 transition-colors group-hover:text-white">
                    {item.label}
                  </span>
                  <span className="font-mono text-xs text-white/25 transition-colors group-hover:text-white/40">
                    {item.note}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <motion.p
              variants={fade()}
              className="mb-8 font-mono text-xs uppercase tracking-[0.24em] text-white/35"
            >
              What I think about
            </motion.p>
            <div className="flex flex-wrap gap-3">
              {interests.map((item, i) => (
                <motion.span
                  key={item}
                  variants={fade(i * 0.05)}
                  className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-sm text-white/60 transition-colors hover:border-[#ff5f1a]/30 hover:text-white/80"
                >
                  {item}
                </motion.span>
              ))}
            </div>

            {/* Quote / closing note */}
            <motion.blockquote
              variants={fade(0.4)}
              className="mt-12 border-l-2 border-[#ff5f1a]/40 pl-5 text-base italic leading-8 text-white/40"
            >
              "I don't want to make things that work. I want to make things that{" "}
              <span className="text-white/70 not-italic font-medium">feel right</span>."
            </motion.blockquote>
          </div>
        </motion.div>
      </section>

      {/* ── CTA strip ── */}
      <section className="section-shell pb-24 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel hover-glow rounded-3xl p-10 text-center"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-white/30">
            Want to work together?
          </p>
          <h2 className="mb-6 text-3xl font-bold tracking-tight">
            Let's build something{" "}
            <span className="text-[#ff5f1a]">memorable.</span>
          </h2>
          <Link href="/#contact">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-[#ff5f1a] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#ff5f1a]/20 transition-opacity hover:opacity-90"
            >
              Get in touch
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}