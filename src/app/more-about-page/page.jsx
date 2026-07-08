'use client';

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Motion helpers ───────────────────────────────────────────────────────────
const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

// ─── Journey start: Jan 1 2026 00:00:00 UTC+6 (Bangladesh) ───────────────────
const JOURNEY_START = new Date("2026-01-01T00:00:00+06:00").getTime();

// ─── Social links ─────────────────────────────────────────────────────────────
const socials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61585623848571",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/zabedfolio/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/Zabedfolio",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/zaabed_maahmud/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/zabedfolio/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
  },
];

// ─── Live seconds timer ───────────────────────────────────────────────────────
function useJourneySeconds() {
  const [mounted, setMounted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setMounted(true);
    setSeconds(Math.floor((Date.now() - JOURNEY_START) / 1000));
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - JOURNEY_START) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return mounted ? seconds : null;
}

function formatSeconds(s) {
  return s.toLocaleString("en-US");
}

// ─── Animated digit (slot-machine flip) ──────────────────────────────────────
function AnimatedDigit({ char }) {
  const isDigit = /\d/.test(char);

  if (!isDigit) {
    return (
      <span className="inline-block text-[#ff5f1a]/50">{char}</span>
    );
  }

  return (
    <span
      className="relative inline-block overflow-hidden"
      style={{ height: "1.15em", width: "0.62em", verticalAlign: "bottom" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── Hover image popup component ─────────────────────────────────────────────
function HoverImage({ src, alt, label }) {
  const [visible, setVisible] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMouse({ x: e.clientX, y: e.clientY });
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
    >
      <span className="cursor-default font-semibold text-[#1a1a1a] underline decoration-dashed decoration-[#ff5f1a]/60 underline-offset-4">
        {label}
      </span>

      {visible && (
        <span
          className="pointer-events-none fixed z-50"
          style={{ left: mouse.x + 20, top: mouse.y - 100 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="block overflow-hidden rounded-2xl border border-black/10 shadow-2xl shadow-black/20"
            style={{ width: 260, height: 170 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-1.5 block text-center font-mono text-[10px] tracking-widest text-black/40"
          >
            {alt}
          </motion.span>
        </span>
      )}
    </span>
  );
}

function GithubContributions() {
  const [contributions, setContributions] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2026);

  useEffect(() => {
    fetch('/api/github-stats')
      .then((res) => res.json())
      .then((data) => setContributions(data.contributions))
      .catch((err) => console.error('GitHub stats error:', err));
  }, []);

  const displayContributions = selectedYear === 2025 ? 42 : (contributions || 764);

  return (
    <div className="flex-1 min-h-[380px] group relative overflow-hidden rounded-3xl border border-black/8 bg-white flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:border-[#ff5f1a]/30 hover:shadow-xl hover:shadow-[#ff5f1a]/5">
      
      {/* Top Visual Half */}
      <div className="relative h-[220px] w-full bg-[#fcfcfc] border-b border-black/5 flex items-center justify-center p-4 overflow-hidden select-none">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        {/* Dynamic Background wave path */}
        <svg className="absolute bottom-0 left-0 right-0 h-16 w-full select-none pointer-events-none z-0 opacity-40 group-hover:opacity-50 transition-opacity duration-300" viewBox="0 0 400 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="glow-2025" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff5f1a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ff5f1a" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="glow-2026" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d={selectedYear === 2025 
              ? "M 0 50 Q 50 46 100 48 T 200 44 T 300 46 T 400 42 L 400 60 L 0 60 Z"
              : "M 0 50 Q 50 38 100 28 T 200 18 T 300 8 T 400 2 L 400 60 L 0 60 Z"
            }
            fill={selectedYear === 2025 ? "url(#glow-2025)" : "url(#glow-2026)"}
            stroke={selectedYear === 2025 ? "#ff5f1a" : "#10b981"}
            strokeWidth="1.5"
            className="transition-all duration-700 ease-in-out"
          />
        </svg>

        {/* Floating Glassmorphic Panel */}
        <div className="relative z-10 w-full max-w-[210px] rounded-2xl border border-white/60 bg-white/75 p-4 shadow-lg shadow-black/5 backdrop-blur-md flex flex-col gap-3.5 transition-all duration-300">
          
          {/* Top row: Badge and small text */}
          <div className="flex justify-between items-center w-full">
            <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">Metrics</span>
            <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full border transition-all duration-300 ${
              selectedYear === 2026 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
            }`}>
              {selectedYear === 2026 ? '+1719% Growth' : 'Baseline'}
            </span>
          </div>

          {/* Middle row: Hero Number */}
          <div className="text-center">
            <span className="font-mono text-3xl font-extrabold tracking-tight text-[#1a1a1a]">
              {displayContributions}
              <span className={selectedYear === 2026 ? "text-[#10b981] ml-0.5" : "text-[#ff5f1a] ml-0.5"}>+</span>
            </span>
          </div>

          {/* Bottom row: Sliding Glass Switch */}
          <div 
            onClick={() => setSelectedYear(selectedYear === 2025 ? 2026 : 2025)}
            className="relative flex items-center bg-black/5 p-0.5 rounded-full w-full h-6 cursor-pointer select-none transition-colors border border-black/5 hover:bg-black/8"
          >
            <div 
              className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out" 
              style={{ transform: selectedYear === 2026 ? 'translateX(100%)' : 'translateX(0%)' }} 
            />
            <span className={`w-1/2 text-center text-[9px] font-mono z-10 transition-colors ${selectedYear === 2025 ? 'text-black font-semibold' : 'text-black/35'}`}>
              2025
            </span>
            <span className={`w-1/2 text-center text-[9px] font-mono z-10 transition-colors ${selectedYear === 2026 ? 'text-black font-semibold' : 'text-black/35'}`}>
              2026
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Content Half */}
      <div className="p-6 flex flex-col justify-between flex-grow text-left gap-4">
        <div>
          <h3 className="text-base font-bold text-[#1a1a1a] mb-1.5 uppercase tracking-wider text-[12px] font-mono">
            GitHub Contributions
          </h3>
          <p className="text-[11.5px] text-black/50 leading-relaxed font-normal">
            Monitoring repository contribution frequencies, codebase versions, open-source commits, and active workflow cycles across my portfolio.
          </p>
        </div>
        <span className="font-mono text-[9px] text-[#ff5f1a]/70 uppercase tracking-widest font-bold">
          Year {selectedYear} active
        </span>
      </div>
    </div>
  );
}

function LeetcodeStats() {
  const [stats, setStats] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    fetch('/api/leetcode-stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (data.status === 'success') {
          setStats(data);
        }
      })
      .catch((err) => console.error('LeetCode API error:', err));
  }, []);

  const totalSolved = stats?.totalSolved || 0;
  const totalQuestions = stats?.totalQuestions || 3300;
  
  // Dynamic milestone target for progress bar
  const getMilestone = (solved) => {
    if (solved < 100) return 100;
    if (solved < 250) return 250;
    if (solved < 500) return 500;
    return 1000;
  };
  const target = getMilestone(totalSolved);
  const progressPercent = Math.min((totalSolved / target) * 100, 100);

  return (
    <div className="flex-1 min-h-[380px] group relative overflow-hidden rounded-3xl border border-black/8 bg-white flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:border-[#ff5f1a]/30 hover:shadow-xl hover:shadow-[#ff5f1a]/5">
      
      {/* Top Visual Half */}
      <div className="relative h-[220px] w-full bg-[#fcfcfc] border-b border-black/5 flex items-center justify-center p-4 overflow-hidden select-none">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        {/* Ambient Glow */}
        <div className="absolute w-24 h-24 rounded-full bg-[#ff5f1a]/5 blur-2xl pointer-events-none" />

        {/* Floating Glassmorphic Panel */}
        <div className="relative z-10 w-full max-w-[210px] rounded-2xl border border-white/60 bg-white/75 p-4 shadow-lg shadow-black/5 backdrop-blur-md flex flex-col gap-3 transition-all duration-300">
          
          {/* Top row */}
          <div className="flex justify-between items-center w-full">
            <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">Solved</span>
            {stats && (
              <span className="text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                {stats.acceptanceRate}% Accept
              </span>
            )}
          </div>

          {/* Middle row */}
          <div className="text-center">
            <span className="font-mono text-3xl font-extrabold tracking-tight text-[#1a1a1a]">
              {stats ? (
                <>
                  {totalSolved}
                  <span className="text-[#ff5f1a] font-normal text-[15px] ml-0.5">/ {target}</span>
                </>
              ) : (
                '--'
              )}
            </span>
          </div>

          {/* Progress Track */}
          {stats && (
            <div className="space-y-1">
              <div className="relative h-1.5 w-full rounded-full bg-black/5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#ff8a00] to-[#ff4d00] rounded-full shadow-md transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[7.5px] font-mono text-black/35 px-0.5">
                <span>Milestone Target</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
            </div>
          )}

          {/* Toggle Details & Breakdown */}
          {stats && (
            <div className="space-y-2">
              <div 
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex items-center justify-between text-[8px] font-mono text-black/45 hover:text-black cursor-pointer border-t border-black/5 pt-2 select-none"
              >
                <span>Breakdown stats</span>
                <div className={`relative w-6 h-3.5 rounded-full transition-colors duration-300 ${showBreakdown ? 'bg-[#ff5f1a]' : 'bg-black/10'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300 ${showBreakdown ? 'translate-x-2.5' : 'translate-x-0'}`} />
                </div>
              </div>

              {showBreakdown && (
                <div className="space-y-1.5 pt-1">
                  {/* Easy */}
                  <div className="flex items-center justify-between text-[8px] font-mono">
                    <span className="text-emerald-600 font-bold">Easy</span>
                    <span className="text-black/50">{stats.easySolved}/{stats.totalEasy}</span>
                  </div>
                  {/* Medium */}
                  <div className="flex items-center justify-between text-[8px] font-mono">
                    <span className="text-amber-500 font-bold">Med</span>
                    <span className="text-black/50">{stats.mediumSolved}/{stats.totalMedium}</span>
                  </div>
                  {/* Hard */}
                  <div className="flex items-center justify-between text-[8px] font-mono">
                    <span className="text-red-500 font-bold">Hard</span>
                    <span className="text-black/50">{stats.hardSolved}/{stats.totalHard}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Content Half */}
      <div className="p-6 flex flex-col justify-between flex-grow text-left gap-4">
        <div>
          <h3 className="text-base font-bold text-[#1a1a1a] mb-1.5 uppercase tracking-wider text-[12px] font-mono">
            LeetCode Solutions
          </h3>
          <p className="text-[11.5px] text-black/50 leading-relaxed font-normal">
            Solving algorithm puzzles, learning memory structure rules, and analyzing Big O time complexity execution to refine coding capabilities.
          </p>
        </div>
        <span className="font-mono text-[9px] text-[#ff5f1a]/70 uppercase tracking-widest font-bold">
          Milestone progress
        </span>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MoreAboutPage() {
  const seconds = useJourneySeconds();
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch("/api/public/skills")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSkills(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    // bg: #EEEEEE mixed toward white — use #F4F4F4 as base, white as surface
    <main className="min-h-screen bg-[#eeeeee] text-[#1a1a1a]">

      {/* ── Back link ── */}
      {/* ── Top Navigation (Back + Resume) ── */}
      <div className="section-shell pt-10 flex items-center justify-between">

        {/* Back Home */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-black/35 transition-colors hover:text-black/70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3 w-3 rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5"
          >
            <path
              fillRule="evenodd"
              d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
              clipRule="evenodd"
            />
          </svg>
          Back home
        </Link>

        {/* My Resume Button */}
        <Link href="/resume">
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="group relative inline-flex items-center gap-2 rounded-full border border-[#ff5f1a]/30 bg-white px-5 py-2.5 text-xs font-semibold tracking-wide text-[#1a1a1a] shadow-sm transition-all hover:border-[#ff5f1a] hover:bg-[#ff5f1a] hover:text-white hover:shadow-md hover:shadow-[#ff5f1a]/20"
          >
            <span className="relative z-10">My Resume</span>

            <svg
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M6 3l5 5-5 5V3z" />
            </svg>

            {/* subtle glow */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff5f1a]/0 via-[#ff5f1a]/10 to-[#ff5f1a]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </motion.div>
        </Link>

      </div>

      {/* ── Hero ── */}
      <section className="section-shell pb-16 pt-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-w-3xl space-y-6"
        >
          <motion.p
            variants={fade(0)}
            className="font-mono text-xs uppercase tracking-[0.24em] text-[#ff5f1a]"
          >
            A little more about me
          </motion.p>

          <motion.h1
            variants={fade(0.05)}
            className="text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#1a1a1a]"
          >
            Hey, I'm{" "}
            <span className="inline-flex items-center gap-4 flex-wrap">
              <span className="text-[#ff5f1a]">Zabed.</span>
              <span
                className="relative inline-block"
                style={{
                  transform: "rotate(-4deg)",
                  transformOrigin: "bottom center",
                }}
              >
                <img
                  src="/og-image.png"
                  alt="Zabed"
                  className="rounded-2xl object-cover shadow-lg shadow-black/15 border border-black/8"
                  style={{
                    width: "clamp(3.5rem, 7vw, 5.5rem)",
                    height: "clamp(3.5rem, 7vw, 5.5rem)",
                  }}
                  draggable={false}
                />
              </span>
            </span>
            <br />
            <span className="text-black/30">Still learning. Always building.</span>
          </motion.h1>

          {/* ── Live timer ── */}
          {/* ── Live Stats ── */}
          <motion.div
            variants={fade(0.1)}
            className="flex flex-col gap-4 md:flex-row md:items-stretch w-full"
          >

            {/* Journey Timer */}
            <div className="flex-1 min-h-[380px] group relative overflow-hidden rounded-3xl border border-black/8 bg-white flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:border-[#ff5f1a]/30 hover:shadow-xl hover:shadow-[#ff5f1a]/5">
              
              {/* Top Visual Half */}
              <div className="relative h-[220px] w-full bg-[#fcfcfc] border-b border-black/5 flex items-center justify-center p-4 overflow-hidden select-none">
                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
                
                {/* Accent glow */}
                <div className="absolute w-24 h-24 rounded-full bg-[#ff5f1a]/5 blur-2xl pointer-events-none" />

                {/* Floating Glassmorphic Panel */}
                <div className="relative z-10 w-full max-w-[210px] rounded-2xl border border-white/60 bg-white/75 p-4 shadow-lg shadow-black/5 backdrop-blur-md flex flex-col gap-3.5 transition-all duration-300">
                  
                  {/* Top row */}
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">Timeline</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>

                  {/* Middle row: Live Timer */}
                  <div className="text-center py-1">
                    <span className="font-mono text-[1.45rem] font-bold tracking-tight text-[#ff5f1a] tabular-nums flex items-center justify-center">
                      {seconds !== null ? (
                        formatSeconds(seconds).split("").map((char, i) => (
                          <AnimatedDigit key={i} char={char} />
                        ))
                      ) : (
                        <span>&nbsp;</span>
                      )}
                    </span>
                  </div>

                  {/* Bottom row */}
                  <div className="border-t border-black/5 pt-2 text-center">
                    <span className="text-[8px] font-mono text-black/35">
                      ticking since Jan 1, 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Content Half */}
              <div className="p-6 flex flex-col justify-between flex-grow text-left gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#1a1a1a] mb-1.5 uppercase tracking-wider text-[12px] font-mono">
                    Coding Journey
                  </h3>
                  <p className="text-[11.5px] text-black/50 leading-relaxed font-normal">
                    Continually counting every second of development practice, backend implementation, and design execution since committing to web engineering.
                  </p>
                </div>
                <span className="font-mono text-[9px] text-[#ff5f1a]/70 uppercase tracking-widest font-bold">
                  Live Counter active
                </span>
              </div>
            </div>

            {/* GitHub Contributions */}
            <GithubContributions />

            {/* LeetCode Stats */}
            <LeetcodeStats />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── Journey + Stack ── */}
      <section className="section-shell py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
          variants={stagger}
          className="grid gap-16 lg:grid-cols-2 lg:items-start"
        >

          {/* Left: paragraphs */}
          <div>
            <motion.p variants={fade()} className="mb-12 font-mono text-xs uppercase tracking-[0.24em] text-black/35">
              The journey
            </motion.p>
            <div className="space-y-8 text-[1.05rem] leading-[1.9] text-black/55">
              <motion.p variants={fade(0.05)}>
                It started in <span className="font-semibold text-[#1a1a1a]">March 2024</span> — I came across a full web development playlist online. Something about it pulled me in. I started watching, started trying things out, copying HTML into a file and seeing it appear in a browser. It was small, but it felt like unlocking a door.
              </motion.p>

              {/* July 2024 — hover image popup */}
              <motion.p variants={fade(0.1)} className="relative">
                Then came{" "}
                <HoverImage
                  src="https://i.ibb.co.com/rf7qNgB2/credit-prothom-alo.webp"
                  alt="July Uprising"
                  label="July 2024"
                />
                . Bangladesh saw a massive student uprising, the internet was cut off, and everything went still. That gap wasn't just a pause — it was a full stop. Weeks passed with nothing. The momentum I had built quietly faded away.
              </motion.p>

              <motion.p variants={fade(0.15)}>
                By <span className="font-semibold text-[#1a1a1a]">September 2024</span>, I picked it back up. But I'll be honest — I wasn't consistent. Between then and December 2025, I watched maybe 50–60 videos total. No rhythm, no plan. I'd go weeks without touching it. I knew I wanted to build things, but I hadn't yet committed to actually doing it.
              </motion.p>
              <motion.p variants={fade(0.2)}>
                Then on <span className="font-semibold text-[#1a1a1a]">December 24, 2025</span>, a Facebook video caught my attention — Programming Hero's web development course. It was the last day to enroll. I didn't overthink it. I signed up.
              </motion.p>
              <motion.p variants={fade(0.25)}>
                <span className="font-semibold text-[#1a1a1a]">January 1, 2026.</span> Class started. And this time, something was different. HTML, CSS, Tailwind, JavaScript — actually understanding it, not just copying it. Then React, Next.js, Express.js, REST APIs, MongoDB. Each one harder than the last. Each one making the ones before it make more sense.
              </motion.p>
              <motion.p variants={fade(0.3)}>
                I'm still in it. My{" "}
                <a
                  href="https://zabedfolio.github.io/Knowledge_A01/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link relative inline-flex items-baseline gap-1 font-semibold text-[#1a1a1a] underline decoration-[#ff5f1a]/50 underline-offset-4 transition-all hover:decoration-[#ff5f1a]"
                >
                  first project
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="currentColor" className="mb-0.5 h-2.5 w-2.5 opacity-40 transition-opacity group-hover/link:opacity-100">
                    <path d="M3.5 1.5a.5.5 0 0 0 0 1H8.29L1.65 9.15a.5.5 0 1 0 .7.7L9 3.21V8a.5.5 0 0 0 1 0V2a.5.5 0 0 0-.5-.5H3.5Z" />
                  </svg>
                </a>
                {" "}after I started learning was a knowledge-base site. There's a lot I haven't learned yet — a lot I will get wrong before I get right. But I'm not going to stop this time. I'll work hard for this.
              </motion.p>
            </div>
            <motion.blockquote
              variants={fade(0.35)}
              className="mt-14 border-l-2 border-[#ff5f1a]/40 pl-6 text-base italic leading-8 text-black/35"
            >
              "The best time to start was March 2024. The second best time is{" "}
              <span className="font-semibold not-italic text-black/60">right now.</span>"
            </motion.blockquote>
          </div>

          {/* Right: stack — sticky so it stays in view while you read */}
          <div className="lg:sticky lg:top-24">
            <motion.p variants={fade()} className="mb-8 font-mono text-xs uppercase tracking-[0.24em] text-black/35">
              What I've learned so far
            </motion.p>
            <div className="space-y-3">
              {skills.map((item, i) => (
                <motion.div
                  key={item.name}
                  variants={fade(i * 0.05)}
                  className="group flex items-center justify-between rounded-xl border border-black/8 bg-white px-5 py-4 shadow-sm transition-all hover:border-[#ff5f1a]/30 hover:shadow-md hover:shadow-[#ff5f1a]/8"
                >
                  <span className="font-medium text-black/70 transition-colors group-hover:text-[#1a1a1a]">
                    {item.name}
                  </span>
                  <span className="font-mono text-xs text-black/35 transition-colors group-hover:text-black/50">
                    {item.category}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="section-shell">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* ── Social links ── */}
      <section className="section-shell py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="flex flex-col items-start gap-6"
        >
          <motion.p variants={fade()} className="font-mono text-xs uppercase tracking-[0.24em] text-black/35">
            Find me on
          </motion.p>
          <motion.div variants={fade(0.05)} className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-0 overflow-hidden rounded-full border border-black/10 bg-white p-3 text-black/40 shadow-sm transition-all duration-300 hover:border-[#ff5f1a]/40 hover:bg-[#ff5f1a] hover:text-white hover:gap-2 hover:pl-4 hover:pr-5 hover:shadow-md hover:shadow-[#ff5f1a]/25"
              >
                {s.icon}
                <span className="max-w-0 overflow-hidden whitespace-nowrap font-mono text-xs font-medium tracking-wide transition-all duration-300 group-hover:max-w-[80px]">
                  {s.name}
                </span>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── CTA strip ── */}
      <section className="section-shell pb-24 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-black/8 bg-white p-10 text-center shadow-sm"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-black/35">
            Want to work together?
          </p>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-[#1a1a1a]">
            Let's build something{" "}
            <span className="text-[#ff5f1a]">memorable.</span>
          </h2>
          <Link href="/#contact">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-[#ff5f1a] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#ff5f1a]/25 transition-opacity hover:opacity-90"
            >
              Get in touch
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}