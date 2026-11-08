'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  HiOutlineVideoCamera,
  HiOutlineDocumentText,
  HiOutlineColorSwatch,
  HiOutlineCode,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineGlobeAlt,
  HiOutlineBriefcase,
  HiOutlineCog,
} from "react-icons/hi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import mainPic from "@/assets/main-pic.jpg";
import { defaultProcess } from "@/data/defaultProcess";

const ICON_MAP = {
  video: HiOutlineVideoCamera,
  meeting: HiOutlineVideoCamera,
  document: HiOutlineDocumentText,
  proposal: HiOutlineDocumentText,
  scope: HiOutlineDocumentText,
  design: HiOutlineColorSwatch,
  ui: HiOutlineColorSwatch,
  color: HiOutlineColorSwatch,
  code: HiOutlineCode,
  tech: HiOutlineCode,
  rocket: HiOutlineRocketLaunch,
  launch: HiOutlineRocketLaunch,
  sparkles: HiOutlineSparkles,
  globe: HiOutlineGlobeAlt,
  briefcase: HiOutlineBriefcase,
  cog: HiOutlineCog,
};

const COLOR_MAP = {
  emerald: {
    pinColor: "bg-gradient-to-br from-[#1FB57A] to-[#12A36B]",
    pinGlow: "shadow-[#12A36B]/40",
    numColor: "text-[#12A36B]",
    badgeBg: "bg-[#12A36B]/10 text-[#0F8A5A] border-[#12A36B]/20",
  },
  blue: {
    pinColor: "bg-gradient-to-br from-blue-400 to-blue-600",
    pinGlow: "shadow-blue-500/40",
    numColor: "text-blue-600",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  purple: {
    pinColor: "bg-gradient-to-br from-purple-400 to-purple-600",
    pinGlow: "shadow-purple-500/40",
    numColor: "text-purple-600",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
  },
  teal: {
    pinColor: "bg-gradient-to-br from-teal-400 to-emerald-600",
    pinGlow: "shadow-teal-500/40",
    numColor: "text-teal-600",
    badgeBg: "bg-teal-50 text-teal-700 border-teal-200",
  },
  amber: {
    pinColor: "bg-gradient-to-br from-amber-400 to-orange-500",
    pinGlow: "shadow-amber-500/40",
    numColor: "text-amber-600",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  rose: {
    pinColor: "bg-gradient-to-br from-rose-400 to-red-500",
    pinGlow: "shadow-rose-500/40",
    numColor: "text-rose-600",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export default function WorkProcess() {
  const [steps, setSteps] = useState(defaultProcess);

  useEffect(() => {
    async function loadProcess() {
      try {
        const res = await fetch("/api/public/process");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSteps(data.filter((s) => s.active !== false));
          }
        }
      } catch (err) {
        console.error("Failed loading process steps:", err);
      }
    }
    loadProcess();
  }, []);

  return (
    <section id="process" className="relative z-10 pt-16 pb-6 sm:pt-24 sm:pb-8 border-t border-black/8">
      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/8 shadow-xs text-xs font-mono font-medium text-black/70">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12A36B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12A36B]"></span>
            </span>
            <span className="whitespace-nowrap">How We Work Together · The {steps.length}-Step Process</span>
          </div>

          <h2 className="font-bricolage text-[clamp(2rem,5vw,3.6rem)] font-extrabold tracking-[-0.035em] text-[#1a1a1a] leading-[1.15]">
            From First Conversation to{" "}
            <span className="text-[#12A36B]">Production Launch.</span>
          </h2>
          <p className="text-black/60 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
            Follow the path from Step 01 to production. No vague timelines, no hidden fees, and zero surprises.
          </p>
        </div>

        {/* ── Top-to-Bottom Connected Path Timeline with Notebook Paper Feel ── */}
        <div className="relative rounded-3xl p-4 sm:p-8 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_31px,rgba(0,0,0,0.03)_31px,rgba(0,0,0,0.03)_32px)] border border-black/6">
          
          {/* Continuous Center Dashed Path (Desktop >= 768px) */}
          <div className="hidden md:block absolute left-1/2 top-10 bottom-16 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-black/20 pointer-events-none" />

          {/* Continuous Left Dashed Path (Mobile < 768px) */}
          <div className="md:hidden absolute left-5 top-10 bottom-16 w-0.5 border-l-2 border-dashed border-black/20 pointer-events-none" />

          {/* Steps List flowing from Top to Bottom (01 to 05) */}
          <div className="space-y-10 sm:space-y-12">
            {steps.map((item, index) => {
              const Icon = ICON_MAP[item.icon] || HiOutlineCode;
              const colorConfig = COLOR_MAP[item.pinColor] || COLOR_MAP.emerald;
              const isEven = index % 2 === 0;
              const rotation = isEven ? "-rotate-1" : "rotate-1";
              const stepDisplay = item.step || String(index + 1).padStart(2, "0");

              return (
                <div
                  key={item._id || item.step || index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-6 md:gap-0`}
                >
                  {/* Card Container (Takes half width on desktop, full width on mobile) */}
                  <div className="w-full md:w-[calc(50%-2.5rem)] pl-10 md:pl-0">
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className={`group relative rounded-3xl bg-white border border-black/8 p-6 sm:p-7 shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 hover:-translate-y-1 ${rotation} hover:rotate-0`}
                    >
                      {/* Realistic 3D Pushpin on top */}
                      <div className="absolute -top-3.5 left-7 flex items-center justify-center z-20">
                        {/* Shadow underneath */}
                        <div className="absolute top-2.5 w-4 h-2 rounded-full bg-black/25 blur-[2.5px]" />
                        {/* 3D Pushpin Cap */}
                        <div
                          className={`relative h-7 w-7 rounded-full shadow-md ${colorConfig.pinColor} ${colorConfig.pinGlow} ring-2 ring-white flex items-center justify-center transition-transform group-hover:scale-110 duration-200`}
                        >
                          <div className="h-2 w-2 rounded-full bg-white/80" />
                        </div>
                      </div>

                      {/* Header row: Step & Icon */}
                      <div className="flex items-center justify-between pb-3 border-b border-black/5">
                        <span className={`font-mono text-2xl sm:text-3xl font-black italic tracking-tight ${colorConfig.numColor}`}>
                          {stepDisplay}
                        </span>

                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/4 border border-black/5 text-[#1a1a1a] transition-transform group-hover:scale-110 duration-200">
                          <Icon className="text-xl" />
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="space-y-2 pt-3">
                        <h3 className="font-bricolage text-xl font-extrabold text-[#1a1a1a] tracking-tight">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-xs font-mono font-semibold text-black/45">
                            {item.subtitle}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm text-black/65 font-sans leading-relaxed pt-1">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Footer (Strict Single Line Guaranteed) */}
                      <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-between gap-3 flex-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border whitespace-nowrap shrink-0 ${colorConfig.badgeBg}`}
                        >
                          {item.tag || "Milestone"}
                        </span>

                        <span className="text-[11px] font-mono text-black/40 font-semibold whitespace-nowrap shrink-0">
                          Step {stepDisplay} of {String(steps.length).padStart(2, "0")}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Center Node / Milestone Pin on the path line */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-10">
                    <div className="h-8 w-8 rounded-full bg-white border-2 border-black/15 shadow-sm flex items-center justify-center">
                      <span className={`h-2.5 w-2.5 rounded-full ${colorConfig.pinColor}`} />
                    </div>
                  </div>

                  {/* Mobile Left Pin Indicator on the line */}
                  <div className="md:hidden absolute left-5 -translate-x-1/2 top-7 z-10">
                    <div className="h-6 w-6 rounded-full bg-white border-2 border-black/15 shadow-xs flex items-center justify-center">
                      <span className={`h-2 w-2 rounded-full ${colorConfig.pinColor}`} />
                    </div>
                  </div>

                  {/* Spacer for the other side on desktop */}
                  <div className="hidden md:block w-[calc(50%-2.5rem)]" />
                </div>
              );
            })}
          </div>

          {/* Path Destination / Final Step 01 Consultation Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mt-14 relative rounded-3xl bg-gradient-to-r from-[#1FB57A] to-[#12A36B] text-white p-5 sm:p-6 shadow-xl shadow-[#12A36B]/25 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-full overflow-hidden ring-2 ring-white/60 shrink-0 shadow-md">
                <Image src={mainPic} alt="Zabed Mahmud" fill className="object-cover" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-white/80">
                  <HiOutlineSparkles className="text-xs" />
                  <span className="whitespace-nowrap">Your Project Starts With Step 01</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                  Looking to start a project? Book a free 30-min strategy call.
                </h3>
              </div>
            </div>

            <div className="shrink-0 pt-2 sm:pt-0">
              <Link
                href="/30-min"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0B3B2B] hover:bg-neutral-100 text-xs sm:text-sm font-mono font-extrabold shadow-md transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Book 30-Min Strategy Call</span>
                <HiOutlineArrowRight className="text-sm shrink-0" />
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
