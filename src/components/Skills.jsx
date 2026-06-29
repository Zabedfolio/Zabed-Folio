'use client';

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaAws, FaFigma, FaGitAlt, FaNodeJs, FaReact } from "react-icons/fa";
import { RiDatabase2Line, RiLayoutMasonryLine, RiTailwindCssFill } from "react-icons/ri";
import { SiFramer, SiMongodb, SiNextdotjs,SiBetterauth,SiIconify,SiGooglecloud, SiTypescript, SiVercel,SiHeroui,SiDaisyui, SiExpress } from "react-icons/si";
import { fadeUp, scaleIn, staggerContainer } from "@/utils/motionVariants";
import skillsData from "@/data/skills.json";

const iconMap = {
  SiNextdotjs,
  FaReact,
  SiExpress,
  RiTailwindCssFill,
  SiFramer,
  FaNodeJs,
  SiMongodb,
  SiBetterauth,
  FaGitAlt,
  SiVercel,
  FaFigma,
  RiLayoutMasonryLine,
  SiHeroui,
  SiDaisyui,
  SiIconify,
  SiGooglecloud,
  FaAws,
  RiDatabase2Line,
  SiTypescript
};

const filters = ["All", "Frontend", "Backend", "Tools", "Design", "UI Library"];

const skills = skillsData;

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
          <Tabs.List className="glass-panel flex w-full max-w-full flex-wrap justify-center gap-1.5 rounded-2xl p-1.5 sm:w-fit sm:gap-2 sm:rounded-full">
            {filters.map((filter) => (
              <Tabs.Trigger
                key={filter}
                value={filter}
                className="relative whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-white/55 transition data-[state=active]:text-white sm:px-4 sm:py-2 sm:text-sm"
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
              {filteredSkills?.map((skill) => {
                const Icon = iconMap[skill.icon] || (() => null);
                return (
                  <motion.div
                    key={skill.name}
                    variants={scaleIn}
                    whileHover={{ scale: 1.04, y: -3 }}
                    className="glass-panel hover-glow rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between">
                      <Icon className="text-[28px]" style={{ color: skill.color }} />
                      <span className="whitespace-nowrap rounded-full border border-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35 sm:text-[10px] sm:tracking-[0.22em]">
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
