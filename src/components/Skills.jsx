'use client';

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaAws, FaFigma, FaGitAlt, FaNodeJs, FaReact, FaJava } from "react-icons/fa";
import { RiDatabase2Line, RiLayoutMasonryLine, RiTailwindCssFill, RiJavascriptFill, RiJavascriptLine, RiJavaFill } from "react-icons/ri";
import { SiFramer, SiMongodb, SiNextdotjs, SiBetterauth, SiIconify, SiGooglecloud, SiTypescript, SiVercel, SiHeroui, SiDaisyui, SiExpress, SiJavascript } from "react-icons/si";
import { TbBrandJavascript } from "react-icons/tb";
import { DiJavascript, DiJavascript1, DiJava } from "react-icons/di";
import { BiLogoJavascript, BiLogoJava } from "react-icons/bi";
import { BsJavascript } from "react-icons/bs";
import { IoLogoJavascript } from "react-icons/io5";
import { fadeUp, scaleIn, staggerContainer } from "@/utils/motionVariants";

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
  SiTypescript,
  SiJavascript,
  FaJava,
  TbBrandJavascript,
  DiJavascript,
  DiJavascript1,
  DiJava,
  BiLogoJavascript,
  BiLogoJava,
  RiJavascriptFill,
  RiJavascriptLine,
  RiJavaFill,
  BsJavascript,
  IoLogoJavascript
};

const filters = ["All", "Frontend", "Backend", "Tools", "Design", "UI Library"];

const populateRow = (items, minItems = 10) => {
  if (!items || items.length === 0) return [];
  let repeated = [...items];
  while (repeated.length < minItems) {
    repeated = [...repeated, ...items];
  }
  return [...repeated, ...repeated];
};

function SkillCard({ skill }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[skill.icon] || (() => null);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden flex items-center gap-4 p-4 w-56 h-20 rounded-2xl glass-panel transition-all duration-300 cursor-default group"
      style={{
        borderColor: isHovered ? `${skill.color || '#ffffff'}33` : 'rgba(255, 255, 255, 0.05)',
        boxShadow: isHovered ? `0 0 25px ${skill.color || '#ffffff'}15` : 'none',
      }}
    >
      {/* Left: Icon */}
      <div className="relative z-10 flex-shrink-0">
        <Icon 
          className="text-3xl transition-all duration-300" 
          style={{ 
            color: skill.color || '#ffffff',
            transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
          }} 
        />
      </div>

      {/* Right: Info */}
      <div className="relative z-10 flex-grow min-w-0 h-10 flex flex-col justify-center">
        <h4 className="text-sm font-semibold text-white truncate transition-transform duration-300">
          {skill.name}
        </h4>
        
        {/* Inner container to hold Category and Percentage */}
        <div className="relative h-4 mt-0.5 overflow-hidden">
          {/* Category text (shows by default, slides up/fades out on hover) */}
          <span 
            className="absolute inset-0 block text-[9px] font-mono text-white/40 uppercase tracking-wider transition-all duration-300"
            style={{
              transform: isHovered ? 'translateY(-100%)' : 'translateY(0)',
              opacity: isHovered ? 0 : 1
            }}
          >
            {skill.category}
          </span>
          
          {/* Percentage & Progress track (slides up from bottom/fades in on hover) */}
          <div 
            className="absolute inset-0 flex items-center gap-2 transition-all duration-300"
            style={{
              transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
              opacity: isHovered ? 1 : 0
            }}
          >
            <span className="text-[10px] font-mono font-bold" style={{ color: skill.color || '#ffffff' }}>
              {skill.percentage !== undefined ? skill.percentage : 80}%
            </span>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: isHovered ? `${skill.percentage !== undefined ? skill.percentage : 80}%` : '0%', 
                  backgroundColor: skill.color || '#ffffff' 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillMarquee({ items, direction = "left" }) {
  const repeatedItems = populateRow(items, 10);
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="relative w-full overflow-hidden py-3">
      {/* Edge Fades for beautiful visual bleed */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

      <div className="flex w-max">
        <div className={`flex gap-4 px-2 ${animationClass}`}>
          {repeatedItems.map((skill, idx) => (
            <SkillCard key={`${skill._id || skill.name}-${idx}`} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [active, setActive] = useState("All");

  useEffect(() => {
    fetch("/api/public/skills")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSkills(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredSkills = active === "All" ? skills : skills.filter((skill) => skill.category === active);

  const row1 = filteredSkills.filter((_, idx) => idx % 2 === 0);
  const row2 = filteredSkills.filter((_, idx) => idx % 2 !== 0);

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

          <Tabs.Content value={active} className="mt-8 overflow-hidden select-none">
            {filteredSkills.length === 0 ? (
              <div className="p-12 text-center text-white/40 text-sm">
                No skills loaded yet.
              </div>
            ) : (
              <div className="space-y-2">
                <SkillMarquee items={row1} direction="left" />
                {row2.length > 0 && (
                  <SkillMarquee items={row2} direction="right" />
                )}
              </div>
            )}
          </Tabs.Content>
        </Tabs.Root>
      </motion.div>
    </div>
  );
}
