'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { fadeUp, slideRight, staggerContainer } from "@/utils/motionVariants";
import pic from "@/assets/zabed.png";

const stats = [
  { value: "6+", label: "Months" },
  { value: "20+", label: "Projects" },
];

export default function About() {
  return (
    <div id="about" className="section-shell py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="grid gap-16 lg:grid-cols-5"
      >
        {/* ── Text column ── */}
        <div className="space-y-8 lg:col-span-3">
          <motion.p variants={fadeUp} className="section-label">
            01 — About
          </motion.p>
          <motion.h2 variants={fadeUp} className="section-title max-w-3xl">
            The person behind the code.
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="space-y-5 text-lg leading-8 text-white/58"
          >
            <p>
              Hi, I'm{" "}
              <span className="font-bold text-[#ff5f1a]">Zabed Mahmud</span>
            </p>
            <p>
              I started by obsessing over how interfaces{" "}
              <span className="font-medium text-white">feel</span>, not just how
              they function. That curiosity evolved into a practice built around{" "}
              <span className="font-medium text-white">
                precision, atmosphere, and storytelling
              </span>
              .
            </p>
            <p>
              The work I enjoy most lives at the intersection of{" "}
              <span className="font-medium text-white">
                design systems, motion, and product strategy
              </span>{" "}
              — where every detail helps a brand feel more intentional.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="grid gap-4 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-panel hover-glow rounded-2xl border-l-2 border-l-[#ff4d00] p-5"
              >
                <div className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.04em] text-white">
                  {stat.value}
                </div>
                <div className="font-mono text-xs uppercase tracking-[0.24em] text-white/35">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* ── More about me button ── */}
          <motion.div variants={fadeUp}>
            <Link href="/more-about-page">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-colors hover:border-[#ff5f1a]/40 hover:text-white"
              >
                {/* animated fill on hover */}
                <span className="absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-[#ff4d00]/20 to-transparent transition-transform duration-500 group-hover:translate-x-0" />

                <span className="relative">More about me</span>

                {/* arrow icon */}
                <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#ff5f1a]/20 text-[#ff5f1a] transition-transform duration-300 group-hover:translate-x-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* ── Portrait column ── */}
        <motion.div variants={slideRight} className="lg:col-span-2">
          <motion.div
            whileHover={{ y: -6 }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass-panel hover-glow relative aspect-[3/4] overflow-hidden rounded-[2rem] p-3"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[1.4rem]">
              <Image src={pic} alt="Portrait of Zabed" fill className="object-cover" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}