'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp, slideRight, staggerContainer } from "@/utils/motionVariants";
import pic from "@/assets/zabed.png"

const stats = [
  { value: "6+", label: "Months" },
  { value: "10+", label: "Projects" },
  // { value: "10+", label: "Clients" }
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
        <div className="space-y-8 lg:col-span-3">
          <motion.p variants={fadeUp} className="section-label">
            01 — About
          </motion.p>
          <motion.h2 variants={fadeUp} className="section-title max-w-3xl">
            The person behind the code.
          </motion.h2>
          <motion.div variants={fadeUp} className="space-y-5 text-lg leading-8 text-white/58">
          <p>Hi, I'm <span className="font-bold text-[#ff5f1a]">Zabed Mahmud</span></p>
            <p>
              I started by obsessing over how interfaces feel, not just how they function. That curiosity evolved into a
              practice built around <span className="font-medium text-white">precision, atmosphere, and storytelling</span>.
            </p>
            <p>
              The work I enjoy most lives at the intersection of <span className="font-medium text-white">design systems,
              motion, and product strategy</span>, where every detail helps a brand feel more intentional.
            </p>
            <p>
              Outside of building, I spend time exploring visual references, refining creative direction, and studying how
              strong digital experiences create trust before a single word is read.
            </p>
            <p>
              I bring a calm, structured workflow with a bias for craftsmanship, clear communication, and solutions that
              feel <span className="font-medium text-white">elevated rather than merely complete</span>.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
            {stats?.map((stat) => (
              <div key={stat.label} className="glass-panel hover-glow rounded-2xl border-l-2 border-l-[#ff4d00] p-5">
                <div className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.04em] text-white">{stat.value}</div>
                <div className="font-mono text-xs uppercase tracking-[0.24em] text-white/35">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={slideRight} className="lg:col-span-2">
          <motion.div
            whileHover={{ y: -6 }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass-panel hover-glow relative aspect-[3/4] overflow-hidden rounded-[2rem] p-3"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[1.4rem]">
              <Image
                src={pic}
                alt="Portrait"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
