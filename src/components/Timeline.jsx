'use client';

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, slideLeft, slideRight, staggerContainer } from "@/utils/motionVariants";

const education = [
  { date: "2023 — Present", institution: "BSc in Computer Science & Engineering", detail: "International Islamic University Chittagong" },
  { date: "January,2026 — Present", institution: "Complete Web Development Batch 13", detail: "Programming Hero" }
];

const experience = [
  { date: "Present", institution: "Learning", detail: "Programming hero web development batch 13" },
  // { date: "2025 — Present", institution: "Freelance Creative Developer", detail: "Delivering premium portfolio, product, and brand websites for startups and independent founders." },
  // { date: "2023 — 2025", institution: "Frontend Developer", detail: "Built scalable UI systems, responsive dashboards, and polished marketing surfaces for client work." }
];

export default function Timeline() {
  const [activeTab, setActiveTab] = useState("education");
  const items = activeTab === "education" ? education : experience;

  return (
    <div id="education" className="section-shell py-24 sm:py-32">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="space-y-10">
        <motion.p variants={fadeUp} className="section-label">
          04 — Education & Experience
        </motion.p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.h2 variants={fadeUp} className="section-title max-w-3xl">
            Milestones that shaped the way I build.
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl text-white/55">
            A blend of academic structure and hands-on delivery has shaped a workflow grounded in discipline and polish.
          </motion.p>
        </div>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="glass-panel flex w-fit rounded-full p-1.5">
            {["education", "experience"]?.map((tab) => (
              <Tabs.Trigger key={tab} value={tab} className="relative rounded-full px-5 py-2 text-sm capitalize text-white/55 data-[state=active]:text-white">
                {activeTab === tab && <motion.span layoutId="timelineTab" className="absolute inset-0 rounded-full border border-[#ff4d00]/25 bg-[#ff4d00]/10" />}
                <span className="relative z-10">{tab}</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value={activeTab} className="mt-10">
            <div className="relative space-y-8 pl-8 sm:pl-12">
              <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-[#ff4d00] via-[#ff4d00]/30 to-transparent sm:left-5" />
              {items.map((item, index) => (
                <motion.div
                  key={item.institution}
                  variants={index % 2 === 0 ? slideLeft : slideRight}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.35 }}
                  className="relative"
                >
                  <div className="absolute left-[-24px] top-8 sm:left-[-28px]">
                    <span className="relative flex h-3 w-3 rounded-full bg-[#ff4d00]">
                      <span className="absolute inset-[-7px] animate-ping rounded-full border border-[#ff4d00]/20" />
                    </span>
                  </div>
                  <div className="glass-panel hover-glow rounded-2xl p-6">
                    <div className="font-mono text-xs uppercase tracking-[0.24em] text-[#ff4d00]">{item.date}</div>
                    <h3 className="mt-3 text-lg font-bold text-white">{item.institution}</h3>
                    <p className="mt-3 text-white/55">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </motion.div>
    </div>
  );
}
