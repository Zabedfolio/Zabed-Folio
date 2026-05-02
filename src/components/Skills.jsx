'use client';

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaAws, FaFigma, FaGitAlt, FaNodeJs, FaReact } from "react-icons/fa";
import { RiDatabase2Line, RiLayoutMasonryLine, RiTailwindCssFill } from "react-icons/ri";
import { SiFramer, SiMongodb, SiNextdotjs, SiTypescript, SiVercel } from "react-icons/si";
import { fadeUp, scaleIn, staggerContainer } from "@/utils/motionVariants";

const filters = ["All", "Frontend", "Backend", "Tools", "Design"];

const skills = [
  { name: "Next.js", category: "Frontend", icon: SiNextdotjs, color: "#ffffff" },
  { name: "React", category: "Frontend", icon: FaReact, color: "#61dafb" },
  { name: "Tailwind CSS", category: "Frontend", icon: RiTailwindCssFill, color: "#38bdf8" },
  { name: "Framer Motion", category: "Frontend", icon: SiFramer, color: "#ff4d9c" },
  { name: "Node.js", category: "Backend", icon: FaNodeJs, color: "#79c15b" },
  { name: "MongoDB", category: "Backend", icon: SiMongodb, color: "#13aa52" },
  { name: "Database Design", category: "Backend", icon: RiDatabase2Line, color: "#ff8c00" },
  { name: "TypeScript", category: "Tools", icon: SiTypescript, color: "#3178c6" },
  { name: "Git", category: "Tools", icon: FaGitAlt, color: "#f1502f" },
  { name: "Vercel", category: "Tools", icon: SiVercel, color: "#ffffff" },
  { name: "AWS", category: "Tools", icon: FaAws, color: "#ff9900" },
  { name: "Figma", category: "Design", icon: FaFigma, color: "#f24e1e" },
  { name: "UI Systems", category: "Design", icon: RiLayoutMasonryLine, color: "#ff4d00" }
];

export default function Skills() {
  const [active, setActive] = useState("All");

  const filteredSkills = active === "All" ? skills : skills.filter((skill) => skill.category === active);

  return (
    <div id="skills" className="section-shell py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="space-y-10"
      >
        <motion.p variants={fadeUp} className="section-label">
          02 — Skills
        </motion.p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.h2 variants={fadeUp} className="section-title max-w-3xl">
            Building systems that feel engineered and cinematic.
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl text-white/55">
            My stack is shaped around premium interface craft, durable frontend architecture, and fast collaboration from
            concept to launch.
          </motion.p>
        </div>

        <Tabs.Root value={active} onValueChange={setActive}>
          <Tabs.List className="glass-panel flex w-fit flex-wrap gap-2 rounded-full p-1.5">
            {filters.map((filter) => (
              <Tabs.Trigger
                key={filter}
                value={filter}
                className="relative rounded-full px-4 py-2 text-sm text-white/55 transition data-[state=active]:text-white"
              >
                {active === filter && (
                  <motion.span
                    layoutId="skillTab"
                    className="absolute inset-0 rounded-full border border-[#ff4d00]/25 bg-[#ff4d00]/10"
                  />
                )}
                <span className="relative z-10">{filter}</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value={active} className="mt-8">
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {filteredSkills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <motion.div
                    key={skill.name}
                    variants={scaleIn}
                    whileHover={{ scale: 1.04, y: -3 }}
                    className="glass-panel hover-glow rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between">
                      <Icon className="text-[28px]" style={{ color: skill.color }} />
                      <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                        {skill.category}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-white">{skill.name}</h3>
                    <p className="mt-2 text-sm text-white/45">Production-focused implementation with polish, speed, and clarity.</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </Tabs.Content>
        </Tabs.Root>
      </motion.div>
    </div>
  );
}
