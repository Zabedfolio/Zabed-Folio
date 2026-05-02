'use client';

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/utils/motionVariants";

const steps = [
  { id: "01", title: "Discovery", description: "Clarify the product signal, audience, and premium positioning before any interface decisions are made." },
  { id: "02", title: "Design Concept", description: "Shape the visual language, motion rhythm, and layout hierarchy into a system that feels distinct." },
  { id: "03", title: "Development", description: "Translate the concept into responsive, maintainable, high-performance components and flows." },
  { id: "04", title: "Launch", description: "Polish the final details, validate quality, and prepare a deployment that feels production-ready on day one." }
];

const rotations = [2, -1.5, 1, -2];

export default function Process() {
  return (
    <div className="section-shell py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="space-y-12"
      >
        <motion.p variants={fadeUp} className="section-label">
          02A — Process
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="section-title max-w-3xl">A refined workflow from first signal to launch.</h2>
          <p className="max-w-xl text-white/55">
            I use a clear delivery structure so the project keeps its creative edge without becoming chaotic underneath.
          </p>
        </motion.div>

        <div className="relative grid gap-6 lg:grid-cols-4">
          <svg className="pointer-events-none absolute left-0 top-1/2 hidden h-16 w-full -translate-y-1/2 lg:block" viewBox="0 0 1200 100" fill="none">
            <path d="M40 50 C 200 10, 280 90, 420 50 S 640 10, 780 50 S 1000 90, 1160 50" stroke="rgba(255,77,0,0.3)" strokeDasharray="7 8" />
          </svg>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={fadeUp}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="glass-panel hover-glow relative rounded-2xl p-7 shadow-card-soft"
              style={{ rotate: rotations[index] }}
            >
              <div className="absolute left-6 top-[-14px] h-8 w-8 rounded-full border border-white/10 bg-[#0d0d0d]">
                <div className={`absolute inset-2 rounded-full ${index % 2 === 0 ? "bg-[#ff4d00]" : "bg-white/70"}`} />
              </div>
              <div className="font-mono text-3xl italic text-[#ff4d00]/70">{step.id}</div>
              <h3 className="mt-6 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-white/55">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
