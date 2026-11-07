'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChevronDown } from "react-icons/hi";

const FAQ_ITEMS = [
  {
    id: "payment",
    question: "How does payment work?",
    answer:
      "We work on a standard 50/50 milestone model: 50% upfront deposit to initiate architecture, sprint planning, and design setup, and the remaining 50% upon final sign-off, live staging demo approval, and deployment handover. We accept Stripe, Wise, international bank wire, and local Bangladeshi methods (bKash, Nagad).",
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
  const [openId, setOpenId] = useState("payment"); // Keep first question open by default

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mt-20 sm:mt-28 pt-14 sm:pt-20 border-t border-black/8">
      {/* Header */}
      <div className="max-w-2xl mb-10 sm:mb-14">
        <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-[#12A36B]">
          Clear Answers
        </span>
        <h3 className="font-bricolage text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a1a1a] tracking-tight mt-2">
          Frequently Asked Questions
        </h3>
        <p className="text-sm sm:text-base text-black/60 font-sans mt-2">
          Everything you need to know about milestone delivery, ownership, and how we collaborate.
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl space-y-3.5">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-[#1FB57A]/40 bg-white shadow-md shadow-[#12A36B]/5"
                  : "border-black/8 bg-white/70 hover:bg-white hover:border-black/15"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors"
              >
                <span className="font-bricolage text-base sm:text-lg font-bold text-[#1a1a1a] tracking-tight">
                  {item.question}
                </span>
                <span
                  className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-transform duration-200 ${
                    isOpen
                      ? "bg-[#1a1a1a] text-white border-black rotate-180"
                      : "bg-black/5 text-black/60 border-black/5"
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
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-sm sm:text-[15px] leading-relaxed text-black/70 border-t border-black/5 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
