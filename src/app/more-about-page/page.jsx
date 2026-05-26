'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Motion helpers ───────────────────────────────────────────────────────────
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

// ─── Journey start: Jan 1 2026 00:00:00 UTC+6 (Bangladesh) ───────────────────
const JOURNEY_START = new Date("2026-01-01T00:00:00+06:00").getTime();

// ─── Social links ─────────────────────────────────────────────────────────────
const socials = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
];

// ─── Live seconds timer ───────────────────────────────────────────────────────
function useJourneySeconds() {
  const [seconds, setSeconds] = useState(() =>
    Math.floor((Date.now() - JOURNEY_START) / 1000)
  );
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - JOURNEY_START) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return seconds;
}

function formatSeconds(s) {
  return s.toLocaleString("en-US");
}

// ─── Hover image popup component ─────────────────────────────────────────────
function HoverImage({ src, alt, label }) {
  const [visible, setVisible] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMouse({ x: e.clientX, y: e.clientY });
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
    >
      <span className="cursor-default font-semibold text-white underline decoration-dashed decoration-[#ff5f1a]/50 underline-offset-4">
        {label}
      </span>

      {visible && (
        <span
          className="pointer-events-none fixed z-50"
          style={{ left: mouse.x + 20, top: mouse.y - 100 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="block overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60"
            style={{ width: 260, height: 170 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-1.5 block text-center font-mono text-[10px] tracking-widest text-white/30"
          >
            {alt}
          </motion.span>
        </span>
      )}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MoreAboutPage() {
  const seconds = useJourneySeconds();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Back link ── */}
      <div className="section-shell pt-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/35 transition-colors hover:text-white/70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5">
            <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
          </svg>
          Back home
        </Link>
      </div>

      {/* ── Hero ── */}
      <section className="section-shell pb-16 pt-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-w-3xl space-y-6"
        >
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
            <span className="text-white/30">Still learning. Always building.</span>
          </motion.h1>

          {/* ── Live timer ── */}
          <motion.div
            variants={fade(0.1)}
            className="inline-flex flex-col gap-1 rounded-2xl border border-[#ff5f1a]/20 bg-[#ff5f1a]/5 px-6 py-4"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/30">
              Seconds since I started this journey
            </span>
            <span className="font-mono text-[clamp(1.6rem,4vw,2.8rem)] font-bold tabular-nums tracking-tight text-[#ff5f1a]">
              {formatSeconds(seconds)}
            </span>
            <span className="font-mono text-[10px] text-white/20">
              counting from January 1, 2026 · live · never stops
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── Journey + Stack ── */}
      <section className="section-shell py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
          variants={stagger}
          className="grid gap-16 lg:grid-cols-2 lg:items-start"
        >

          {/* Left: paragraphs */}
          <div>
            <motion.p variants={fade()} className="mb-12 font-mono text-xs uppercase tracking-[0.24em] text-white/30">
              The journey
            </motion.p>
            <div className="space-y-8 text-[1.05rem] leading-[1.9] text-white/50">
              <motion.p variants={fade(0.05)}>
                It started in <span className="font-semibold text-white">March 2024</span> — I came across a full web development playlist online. Something about it pulled me in. I started watching, started trying things out, copying HTML into a file and seeing it appear in a browser. It was small, but it felt like unlocking a door.
              </motion.p>

              {/* July 2024 — hover image popup */}
              <motion.p variants={fade(0.1)} className="relative">
                Then came{" "}
                <HoverImage
                  src="https://i.ibb.co.com/rf7qNgB2/credit-prothom-alo.webp"
                  alt="July Uprising — Prothom Alo"
                  label="July 2024"
                />
                . Bangladesh saw a massive student uprising, the internet was cut off, and everything went still. That gap wasn't just a pause — it was a full stop. Weeks passed with nothing. The momentum I had built quietly faded away.
              </motion.p>

              <motion.p variants={fade(0.15)}>
                By <span className="font-semibold text-white">September 2024</span>, I picked it back up. But I'll be honest — I wasn't consistent. Between then and December 2025, I watched maybe 50–60 videos total. No rhythm, no plan. I'd go weeks without touching it. I knew I wanted to build things, but I hadn't yet committed to actually doing it.
              </motion.p>
              <motion.p variants={fade(0.2)}>
                Then on <span className="font-semibold text-white">December 24, 2025</span>, a Facebook video caught my attention — Programming Hero's web development course. It was the last day to enroll. I didn't overthink it. I signed up.
              </motion.p>
              <motion.p variants={fade(0.25)}>
                <span className="font-semibold text-white">January 1, 2026.</span> Class started. And this time, something was different. HTML, CSS, Tailwind, JavaScript — actually understanding it, not just copying it. Then React, Next.js, Express.js, REST APIs, MongoDB. Each one harder than the last. Each one making the ones before it make more sense.
              </motion.p>
              <motion.p variants={fade(0.3)}>
                I'm still in it. My{" "}
                <a
                  href="https://zabedfolio.github.io/Knowledge_A01/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link relative inline-flex items-baseline gap-1 font-semibold text-white underline decoration-[#ff5f1a]/40 underline-offset-4 transition-all hover:decoration-[#ff5f1a]"
                >
                  first project
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="currentColor" className="mb-0.5 h-2.5 w-2.5 opacity-40 transition-opacity group-hover/link:opacity-100">
                    <path d="M3.5 1.5a.5.5 0 0 0 0 1H8.29L1.65 9.15a.5.5 0 1 0 .7.7L9 3.21V8a.5.5 0 0 0 1 0V2a.5.5 0 0 0-.5-.5H3.5Z" />
                  </svg>
                </a>
                {" "}after I started learning was a knowledge-base site. There's a lot I haven't learned yet — a lot I will get wrong before I get right. But I'm not going to stop this time. I'll work hard for this.
              </motion.p>
            </div>
            <motion.blockquote
              variants={fade(0.35)}
              className="mt-14 border-l-2 border-[#ff5f1a]/30 pl-6 text-base italic leading-8 text-white/30"
            >
              "The best time to start was March 2024. The second best time is{" "}
              <span className="font-semibold not-italic text-white/60">right now.</span>"
            </motion.blockquote>
          </div>

          {/* Right: stack — sticky so it stays in view while you read */}
          <div className="lg:sticky lg:top-24">
            <motion.p variants={fade()} className="mb-8 font-mono text-xs uppercase tracking-[0.24em] text-white/30">
              What I've learned so far
            </motion.p>
            <div className="space-y-3">
              {[
                { label: "HTML & CSS", note: "where it all started" },
                { label: "Tailwind CSS", note: "utility-first styling" },
                { label: "JavaScript", note: "the real turning point" },
                { label: "React", note: "components & hooks" },
                { label: "Next.js", note: "full-stack React" },
                { label: "Express.js + REST APIs", note: "backend basics" },
                { label: "MongoDB", note: "databases" },
              ].map((item, i) => (
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

        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── Social links ── */}
      <section className="section-shell py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="flex flex-col items-start gap-6"
        >
          <motion.p variants={fade()} className="font-mono text-xs uppercase tracking-[0.24em] text-white/30">
            Find me on
          </motion.p>
          <motion.div variants={fade(0.05)} className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-0 overflow-hidden rounded-full border border-white/8 bg-white/[0.04] p-3 text-white/40 transition-all duration-300 hover:border-[#ff5f1a]/30 hover:bg-[#ff5f1a]/8 hover:text-[#ff5f1a] hover:gap-2 hover:pl-4 hover:pr-5"
              >
                {s.icon}
                <span className="max-w-0 overflow-hidden whitespace-nowrap font-mono text-xs font-medium tracking-wide transition-all duration-300 group-hover:max-w-[80px]">
                  {s.name}
                </span>
              </a>
            ))}
          </motion.div>
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