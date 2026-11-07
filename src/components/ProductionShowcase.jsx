'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineExternalLink,
  HiOutlineArrowRight,
  HiOutlineCheck,
  HiOutlineSparkles,
} from "react-icons/hi";
import { defaultShowcase } from "@/data/defaultShowcase";

// Bespoke Project Logo Icons
function ProjectLogo({ logo, title }) {
  if (typeof logo === "string" && (logo.startsWith("http") || logo.startsWith("/"))) {
    return (
      <div className="relative h-6 w-6 rounded-lg overflow-hidden shrink-0 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={title} className="h-full w-full object-contain" />
      </div>
    );
  }

  // Presets
  switch (logo) {
    case "jerseyx":
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black text-[11px] font-mono font-black tracking-tighter text-[#1FB57A] shadow-xs shrink-0">
          JX
        </span>
      );
    case "hatkhola":
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#E07A5F]/15 border border-[#E07A5F]/30 text-[#C85A32] text-[11px] font-mono font-black tracking-tighter shrink-0">
          HB
        </span>
      );
    case "neighbornotes":
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#12A36B]/15 border border-[#12A36B]/30 text-[#12A36B] text-[11px] font-mono font-black tracking-tighter shrink-0">
          NN
        </span>
      );
    case "icaw":
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#2563EB] text-[11px] font-mono font-black tracking-tighter shrink-0">
          IC
        </span>
      );
    default:
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black/10 text-[11px] font-mono font-bold text-black/70 shrink-0">
          {title ? title.slice(0, 2).toUpperCase() : "PW"}
        </span>
      );
  }
}

export default function ProductionShowcase() {
  const [items, setItems] = useState(defaultShowcase);
  const [activeId, setActiveId] = useState(defaultShowcase[0].id);

  useEffect(() => {
    async function loadShowcase() {
      try {
        const res = await fetch("/api/public/showcase");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const activeOnly = data.filter((item) => item.active !== false);
            if (activeOnly.length > 0) {
              setItems(activeOnly);
              setActiveId(activeOnly[0].id || activeOnly[0]._id);
            }
          }
        }
      } catch (err) {
        console.error("Failed loading showcase from API, using default:", err);
      }
    }
    loadShowcase();
  }, []);

  const activeItem = items.find((it) => (it.id || it._id) === activeId) || items[0];

  return (
    <section id="proof-of-work" className="relative z-10 pt-16 pb-24 sm:pt-24 sm:pb-32 border-t border-black/8">
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/8 shadow-xs text-xs font-mono font-medium text-black/70">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12A36B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12A36B]"></span>
            </span>
            <span>Proof of Work · Production Systems</span>
          </div>

          <h2 className="font-bricolage text-[clamp(2rem,5vw,3.6rem)] font-extrabold tracking-[-0.035em] text-[#1a1a1a] leading-[1.15]">
            Engineering in Production.{" "}
            <span className="text-[#12A36B]">Real speed, real impact.</span>
          </h2>
          <p className="text-black/60 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
            Not just lines of code—these are live architectures engineered to slash load times, streamline logistics, and deliver measurable business outcomes.
          </p>
        </div>

        {/* Flat Logo Tab Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {items.map((item) => {
            const itemId = item.id || item._id;
            const isActive = itemId === activeId;

            return (
              <button
                key={itemId}
                onClick={() => setActiveId(itemId)}
                className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-300 text-xs sm:text-sm font-bold shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-white text-[#1a1a1a] border-black/15 shadow-sm ring-1 ring-black/5"
                    : "bg-black/[0.03] hover:bg-black/[0.07] border-black/8 text-black/60 hover:text-[#1a1a1a]"
                }`}
              >
                <ProjectLogo logo={item.logo} title={item.title} />
                <span className="font-sans font-extrabold tracking-tight">
                  {item.title}
                </span>

                {isActive && (
                  <motion.span
                    layoutId="showcaseActivePill"
                    className="h-1.5 w-1.5 rounded-full bg-[#12A36B]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Item Showcase Card */}
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div
              key={activeItem.id || activeItem._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-black/10 bg-white p-6 sm:p-9 shadow-xl shadow-black/5 overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                
                {/* Left Side: Outcome & Story (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Category Pill & Tagline */}
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-black/5 text-[11px] font-mono font-bold uppercase tracking-wider text-black/70">
                      {activeItem.category}
                    </div>
                    {activeItem.tagline && (
                      <h3 className="text-xl sm:text-2xl font-bricolage font-extrabold text-[#1a1a1a] tracking-tight">
                        {activeItem.tagline}
                      </h3>
                    )}
                  </div>

                  {/* LinkedIn-style Outcome Narrative */}
                  <blockquote className="text-[1.02rem] sm:text-[1.12rem] font-sans text-[#1a1a1a]/85 leading-[1.75] font-normal border-l-2 border-[#12A36B] pl-4 sm:pl-5 bg-[#12A36B]/[0.03] py-2 rounded-r-xl">
                    &ldquo;{activeItem.story}&rdquo;
                  </blockquote>

                  {/* Engineering Highlights */}
                  {Array.isArray(activeItem.highlights) && activeItem.highlights.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-black/40">
                        Key Engineering Decisions
                      </div>
                      <ul className="space-y-2">
                        {activeItem.highlights.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-black/70">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#12A36B]/15 text-[#12A36B]">
                              <HiOutlineCheck className="h-3 w-3 stroke-[3]" />
                            </span>
                            <span className="leading-snug">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    {activeItem.liveUrl && (
                      <a
                        href={activeItem.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1FB57A] to-[#12A36B] hover:from-[#19A36D] hover:to-[#0E8A5A] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#12A36B]/20 hover:shadow-lg hover:shadow-[#12A36B]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>Visit Live Platform</span>
                        <HiOutlineExternalLink className="text-base" />
                      </a>
                    )}

                    {activeItem.caseStudyUrl && (
                      <Link
                        href={activeItem.caseStudyUrl}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-black/10 bg-black/5 hover:bg-black/10 text-[#1a1a1a] text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>Read Case Study</span>
                        <HiOutlineArrowRight className="text-sm" />
                      </Link>
                    )}

                    {activeItem.githubUrl && (
                      <a
                        href={activeItem.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-black/10 bg-black/5 hover:bg-black/10 text-[#1a1a1a] text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>View Source Code</span>
                        <HiOutlineExternalLink className="text-sm" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Side: Mockup Image & Floating Metric Chips (5 Cols) */}
                <div className="lg:col-span-5 relative">
                  {/* Browser Window Chrome */}
                  <div className="relative rounded-2xl sm:rounded-3xl border border-black/10 bg-[#fafafa] p-2.5 sm:p-3 shadow-lg shadow-black/5 overflow-hidden">
                    {/* Top Browser dots */}
                    <div className="flex items-center gap-1.5 pb-2.5 px-1 border-b border-black/5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80 inline-block" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80 inline-block" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 inline-block" />
                      <span className="ml-2 text-[10px] font-mono text-black/35 truncate">
                        {activeItem.liveUrl ? new URL(activeItem.liveUrl).hostname : "production-build.preview"}
                      </span>
                    </div>

                    {/* Image Mockup */}
                    <div className="relative aspect-[16/11] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black/5">
                      {activeItem.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activeItem.image}
                          alt={activeItem.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-black/30 font-mono text-xs">
                          Live Architecture Preview
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floating Impact Metric Chips */}
                  {Array.isArray(activeItem.metrics) && activeItem.metrics.length > 0 && (
                    <div className="mt-3.5 sm:mt-4 grid grid-cols-2 gap-2.5">
                      {activeItem.metrics.map((metric, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-white border border-black/8 shadow-md shadow-black/5 space-y-0.5 transition-transform hover:-translate-y-0.5"
                        >
                          <div className="text-base sm:text-lg font-mono font-extrabold text-[#12A36B] tracking-tight">
                            {metric.value}
                          </div>
                          <div className="text-[11px] font-mono font-medium text-black/60 truncate">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
