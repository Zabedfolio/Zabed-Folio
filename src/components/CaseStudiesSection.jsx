'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CaseStudiesSection() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        const response = await fetch("/api/case-studies", { cache: "no-store" });
        const data = await response.json();
        setCaseStudies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load case studies", error);
      } finally {
        setLoading(false);
      }
    };

    loadCaseStudies();
  }, []);

  return (
    <section id="case-studies" className="section-shell py-24 sm:py-32">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="section-label">04 — Case Studies</p>
          <h2 className="section-title mt-4">Research-led product stories that go beyond a polished landing page.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
            Each case study captures a problem, a market lens, and a product response so your portfolio shows both strategic thinking and execution.
          </p>
        </div>
        <Link href="/case-study" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/75 transition hover:border-[#ff4d00]/30 hover:text-white">
          View all case studies <span aria-hidden>→</span>
        </Link>
      </div>

      {loading ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="glass-panel h-72 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      ) : caseStudies.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-white/60">
          No case studies are available yet. Add one from the admin dashboard to publish it here.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {caseStudies.map((study, index) => {
            const detailPath = `/case-study/${study.slug || study.id || study._id}`;
            return (
              <motion.article
                key={study._id || study.id || study.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="glass-panel group overflow-hidden rounded-[2rem]"
              >
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#4338CA]/35 via-[#ff4d00]/20 to-transparent">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,77,0,0.25),transparent_45%)]" />
                  <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/70 backdrop-blur">
                    {study.category || "Case Study"}
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-sm text-white/45">{study.year || "2026"}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{study.title}</h3>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <p className="text-sm leading-7 text-white/60">{study.subtitle || study.summary}</p>

                  <div className="flex flex-wrap gap-2">
                    {(study.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link href={detailPath} className="inline-flex items-center gap-2 rounded-full border border-[#ff4d00]/20 bg-[#ff4d00]/10 px-4 py-2 text-sm text-white transition hover:border-[#ff4d00]/40">
                      Read case study <span aria-hidden>→</span>
                    </Link>
                    {study.liveUrl ? (
                      <a href={study.liveUrl} target="_blank" rel="noreferrer" className="text-sm text-white/60 transition hover:text-white">
                        Live preview ↗
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
