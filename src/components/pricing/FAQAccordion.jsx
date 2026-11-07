'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChevronDown, HiOutlineArrowUpRight } from "react-icons/hi2";
import mainPic from "@/assets/main-pic.jpg";

const FAQ_ITEMS = [
  {
    id: "discovery-call",
    question: "What happens on the 30-minute discovery call?",
    answer:
      "We'll do a 30-minute deep dive into your product vision, tech stack requirements, and timeline to see if we're a good fit. You'll walk away with architectural clarity and concrete milestone recommendations with zero sales pressure.",
  },
  {
    id: "payment",
    question: "How does payment work?",
    answer:
      "We work on a standard 50/50 milestone model: 50% upfront deposit to initiate architecture, sprint planning, and design setup, and the remaining 50% upon final sign-off, live staging demo approval, and deployment handover. We accept Stripe, Wise, international bank wire, and major credit cards.",
  },
  {
    id: "ownership",
    question: "Do I get full source code and GitHub repository access?",
    answer:
      "Yes, 100% intellectual property ownership. You are invited as a collaborator to a private GitHub repository from Day 1. Upon project handover, full administrative ownership of the repository, deployment configurations, environment credentials, and documentation are transferred entirely to you.",
  },
  {
    id: "figma",
    question: "Can you work with my existing design or Figma file?",
    answer:
      "Absolutely. If you already have designs in Figma, Sketch, or Adobe XD, I translate them into clean, accessible, pixel-perfect Next.js and Tailwind CSS code with responsive layouts, micro-interactions, and modern performance optimizations.",
  },
  {
    id: "custom-scope",
    question: "What if I need custom features not listed in the packages?",
    answer:
      "Every product is unique. If you need complex features such as AI LLM pipelines, real-time WebSockets, multi-vendor marketplaces, or bespoke third-party API integrations, we can tailor a custom scope with transparent milestone pricing. Book a free 30-minute discovery call and we'll scope it out together.",
  },
  {
    id: "hosting-maintenance",
    question: "What about domain setup, hosting, and ongoing maintenance?",
    answer:
      "Every package includes complete cloud deployment setup on Vercel, Railway, Supabase, or your preferred infrastructure provider with custom domain routing and SSL certificates. For ongoing feature additions, security patching, and uptime monitoring, you can easily add the Monthly Retainer.",
  },
  {
    id: "revisions",
    question: "What is your revision and handover policy?",
    answer:
      "Each milestone includes dedicated iterative review rounds during staging to ensure the design, responsiveness, and functionality match your exact requirements before public launch. You also receive 14 days of complimentary post-launch bug-fix support.",
  },
];

export default function FAQAccordion() {
  const [openId, setOpenId] = useState("discovery-call"); // Keep first question open by default

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mt-20 sm:mt-28 pt-14 sm:pt-20 border-t border-black/8">
      {/* 2-Column Responsive Layout Matching Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column (lg:col-span-5): Heading + "Still have a question?" card */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
          <div className="space-y-3">
            <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-[#12A36B]">
              Clear Answers
            </span>
            <h3 className="font-bricolage text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] tracking-tight leading-[1.1]">
              Questions about working together.
            </h3>
          </div>

          {/* Mint-tinted "Still have a question?" Callout Card */}
          <div className="rounded-3xl p-6 sm:p-7 bg-[#EAF6F0] border border-[#1FB57A]/25 shadow-sm space-y-4">
            {/* Avatar */}
            <div className="relative h-14 w-14 rounded-full overflow-hidden ring-4 ring-white shadow-md shrink-0">
              <Image
                src={mainPic}
                alt="Zabed Mahmud"
                width={56}
                height={56}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            {/* Copy */}
            <div className="space-y-1.5">
              <h4 className="font-bricolage text-lg sm:text-xl font-bold text-[#0B3B2B] tracking-tight">
                Still have a question?
              </h4>
              <p className="text-xs sm:text-sm text-[#0B3B2B]/75 leading-relaxed font-sans">
                Send me a note or book a quick call. I&apos;ll help you work out if this is right for your project. No pressure. Just clarity.
              </p>
            </div>

            {/* Dark Green CTA Button */}
            <div className="pt-2">
              <Link
                href="/30-min"
                style={{ color: "#ffffff" }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0B3B2B] hover:bg-black px-5 py-3 text-xs sm:text-sm font-bold !text-white text-white visited:!text-white visited:text-white shadow-md shadow-[#0B3B2B]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span style={{ color: "#ffffff" }} className="!text-white text-white font-bold">
                  Ask me a question
                </span>
                <HiOutlineArrowUpRight style={{ color: "#ffffff" }} className="text-sm !text-white text-white" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-7): Sleek Accordion List with Dividers */}
        <div className="lg:col-span-7 divide-y divide-black/8 border-y border-black/8">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left group transition-colors"
                >
                  <span className="font-bricolage text-base sm:text-lg font-bold text-[#1a1a1a] group-hover:text-[#12A36B] transition-colors tracking-tight">
                    {item.question}
                  </span>
                  <span
                    className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-transform duration-200 text-black/40 group-hover:text-black ${
                      isOpen ? "rotate-180 text-black" : ""
                    }`}
                  >
                    <HiOutlineChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm sm:text-[15px] leading-relaxed text-black/70 font-sans">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
