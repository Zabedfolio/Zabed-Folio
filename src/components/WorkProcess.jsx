'use client';

import { motion } from "framer-motion";
import {
  HiOutlineVideoCamera,
  HiOutlineDocumentText,
  HiOutlineColorSwatch,
  HiOutlineCode,
  HiOutlineSparkles,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";

const STEPS = [
  {
    step: "01",
    title: "Discovery Call",
    subtitle: "30-Min Strategy Session",
    icon: HiOutlineVideoCamera,
    description:
      "We sit together on a 30-minute Google Meet or call to discuss your product vision, required features, timeline, and tech stack. No sales pressure—just clarity on whether we're a good fit.",
    pinColor: "bg-gradient-to-br from-[#1FB57A] to-[#12A36B]",
    pinGlow: "shadow-[#12A36B]/40",
    numColor: "text-[#12A36B]",
    badgeBg: "bg-[#12A36B]/10 text-[#0F8A5A] border-[#12A36B]/20",
    tag: "Start Here",
  },
  {
    step: "02",
    title: "Proposal & Scope",
    subtitle: "Fixed Pricing & Roadmap",
    icon: HiOutlineDocumentText,
    description:
      "You receive a clear, comprehensive project roadmap outlining exact deliverable milestones, architecture decisions, and transparent fixed pricing. Zero hidden fees or surprise hourly billing.",
    pinColor: "bg-gradient-to-br from-blue-400 to-blue-600",
    pinGlow: "shadow-blue-500/40",
    numColor: "text-blue-600",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    tag: "Timeline & Cost",
  },
  {
    step: "03",
    title: "Design Concept",
    subtitle: "UI/UX & User Flows",
    icon: HiOutlineColorSwatch,
    description:
      "We craft high-fidelity, modern designs with clean typography, intuitive user flows, and brand-tailored aesthetics that your customers will actually love and remember.",
    pinColor: "bg-gradient-to-br from-purple-400 to-purple-600",
    pinGlow: "shadow-purple-500/40",
    numColor: "text-purple-600",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
    tag: "Customer-Centric",
  },
  {
    step: "04",
    title: "Full-Stack Build",
    subtitle: "Weekly Interactive Demos",
    icon: HiOutlineCode,
    description:
      "Engineered with clean Next.js, robust database schemas, and scalable APIs. You get private staging URLs and direct updates on WhatsApp or Telegram to test real progress at every step.",
    pinColor: "bg-gradient-to-br from-teal-400 to-emerald-600",
    pinGlow: "shadow-teal-500/40",
    numColor: "text-teal-600",
    badgeBg: "bg-teal-50 text-teal-700 border-teal-200",
    tag: "Fast & Scalable",
  },
  {
    step: "05",
    title: "Production Launch",
    subtitle: "Audited & Handed Over",
    icon: HiOutlineRocketLaunch,
    description:
      "Rigorous audits for speed (sub-second 4G loads), SEO indexing, and cross-browser testing. We connect your custom domain, transfer 100% code ownership, and provide launch support.",
    pinColor: "bg-gradient-to-br from-amber-400 to-orange-500",
    pinGlow: "shadow-amber-500/40",
    numColor: "text-amber-600",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    tag: "Live & Protected",
  },
];

export default function WorkProcess() {
  return (
    <section id="process" className="relative z-10 pt-16 pb-12 sm:pt-24 sm:pb-16 border-t border-black/8">
      <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/8 shadow-xs text-xs font-mono font-medium text-black/70">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12A36B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12A36B]"></span>
            </span>
            <span>How We Work Together · The 5-Step Process</span>
          </div>

          <h2 className="font-bricolage text-[clamp(2rem,5vw,3.6rem)] font-extrabold tracking-[-0.035em] text-[#1a1a1a] leading-[1.15]">
            From First Conversation to{" "}
            <span className="text-[#12A36B]">Production Launch.</span>
          </h2>
          <p className="text-black/60 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
            No vague timelines or messy handoffs. Here is the exact path we follow to take your idea from a 30-minute chat to a fast, reliable, revenue-ready product.
          </p>
        </div>

        {/* Pinned Note Cards Flow Grid */}
        <div className="relative">
          {/* Subtle curved dashed path connector in background (Desktop only) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            <svg
              className="w-full h-full stroke-black/15"
              fill="none"
              strokeDasharray="6 6"
              strokeWidth="2"
            >
              <path d="M 120 100 Q 250 40 450 100 T 800 100" />
              <path d="M 800 140 Q 600 320 300 360" />
              <path d="M 300 420 Q 550 460 750 460" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9">
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative rounded-3xl bg-white border border-black/8 p-6 sm:p-7 shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                    index === 3 || index === 4 ? "lg:col-span-1" : ""
                  }`}
                >
                  {/* Realistic 3D Pushpin on top */}
                  <div className="absolute -top-3.5 left-7 flex items-center justify-center z-20">
                    {/* Shadow underneath */}
                    <div className="absolute top-2.5 w-4 h-2 rounded-full bg-black/25 blur-[2.5px]" />
                    {/* 3D Pushpin Cap */}
                    <div
                      className={`relative h-7 w-7 rounded-full shadow-md ${item.pinColor} ${item.pinGlow} ring-2 ring-white flex items-center justify-center transition-transform group-hover:scale-110 duration-200`}
                    >
                      {/* Highlight reflection */}
                      <div className="h-2 w-2 rounded-full bg-white/75" />
                    </div>
                  </div>

                  {/* Card Content Top */}
                  <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between">
                      {/* Step Number in Italic Serif/Mono style */}
                      <span className={`font-mono text-2xl font-black italic tracking-tight ${item.numColor}`}>
                        {item.step}
                      </span>

                      {/* Icon Container */}
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/4 border border-black/5 text-[#1a1a1a] transition-transform group-hover:scale-110 duration-200">
                        <Icon className="text-xl" />
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bricolage text-xl font-extrabold text-[#1a1a1a] tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs font-mono font-semibold text-black/45 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-black/65 font-sans leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Bottom Tag */}
                  <div className="pt-5 mt-4 border-t border-black/5 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${item.badgeBg}`}
                    >
                      <span>{item.tag}</span>
                    </span>

                    <span className="text-[11px] font-mono text-black/35 font-semibold group-hover:text-[#12A36B] transition-colors">
                      Step {item.step} of 05 →
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Final CTA Mini-Card inside the grid on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#252525] text-white p-6 sm:p-7 shadow-xl shadow-black/15 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1FB57A]">
                  <HiOutlineSparkles className="text-sm" />
                  Ready to Start?
                </span>
                <h3 className="font-bricolage text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                  Your project starts with Step 01.
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                  Book a free 30-minute discovery call directly to discuss roadmap, tech stack, and fixed scope.
                </p>
              </div>

              <div className="pt-6">
                <a
                  href="/30-min"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#1FB57A] to-[#12A36B] hover:from-[#19A36D] hover:to-[#0E8A5A] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#12A36B]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Book 30-min Strategy Call</span>
                  <HiOutlineArrowRight className="text-sm" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
