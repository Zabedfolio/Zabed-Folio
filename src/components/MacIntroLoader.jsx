'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiWifi, FiBattery, FiSliders } from "react-icons/fi";

const GREETINGS = [
  { text: "hello", lang: "English", font: "font-serif italic" },
  { text: "hola", lang: "Spanish", font: "font-serif italic" },
  { text: "bonjour", lang: "French", font: "font-serif italic" },
  { text: "ciao", lang: "Italian", font: "font-serif italic" },
  { text: "hallo", lang: "German", font: "font-serif italic" },
  { text: "সালাম", lang: "Bengali", font: "font-sans font-semibold tracking-wide" },
  { text: "こんにちは", lang: "Japanese", font: "font-sans font-medium" },
  { text: "안녕하세요", lang: "Korean", font: "font-sans font-medium" },
  { text: "olá", lang: "Portuguese", font: "font-serif italic" },
  { text: "merhaba", lang: "Turkish", font: "font-serif italic" }
];

export default function MacIntroLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [langIndex, setLangIndex] = useState(0);
  const [timeString, setTimeString] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Check if intro has already been shown in this session
    const seen = sessionStorage.getItem("hasSeenMacIntro");
    if (seen === "true") {
      setIsVisible(false);
      setHasLoaded(true);
      return;
    }

    setHasLoaded(true);

    // Format current time for macOS bar
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 10000);

    // Progress counter simulation (smooth macOS boot up)
    const startTime = Date.now();
    const duration = 3200; // total intro duration in ms

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => handleFinish(), 400);
      }
    }, 40);

    // Cycle through multilingual greetings
    const langInterval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 550);

    return () => {
      clearInterval(clockInterval);
      clearInterval(progressInterval);
      clearInterval(langInterval);
    };
  }, []);

  const handleFinish = () => {
    setIsExiting(true);
    sessionStorage.setItem("hasSeenMacIntro", "true");
    setTimeout(() => {
      setIsVisible(false);
    }, 700);
  };

  if (!hasLoaded || !isVisible) {
    return null;
  }

  const currentGreeting = GREETINGS[langIndex];

  // Helper status string for boot sequence
  const getStatusText = () => {
    if (progress < 25) return "Initializing Zabed-OS kernel...";
    if (progress < 55) return "Loading portfolio assets...";
    if (progress < 85) return "Applying neon theme shaders...";
    if (progress < 100) return "Starting desktop shell...";
    return "Welcome";
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="mac-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(16px)",
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden bg-[#0a0808] text-white selection:bg-[#ff4d00]/30 cursor-default"
        >
          {/* Ambient Lighting Background Blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.25, 0.4, 0.25]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-radial from-[#ff4d00]/35 via-[#ff6a00]/15 to-transparent blur-[110px]"
            />
            <div className="absolute right-10 bottom-10 h-[300px] w-[300px] rounded-full bg-[#ff4d00]/10 blur-[130px]" />
            <div className="absolute left-10 top-10 h-[250px] w-[250px] rounded-full bg-[#ffaa00]/10 blur-[120px]" />
            <div className="absolute inset-0 noise-mask opacity-30 pointer-events-none" />
          </div>

          {/* Top macOS Status Bar */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-20 flex items-center justify-between px-4 py-2.5 backdrop-blur-md bg-black/20 border-b border-white/[0.06] text-xs font-mono tracking-wider text-white/70"
          >
            {/* Window Controls & App Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleFinish}
                  title="Close / Skip"
                  className="h-3 w-3 rounded-full bg-[#FF5F56] hover:brightness-110 border border-black/20 transition-transform active:scale-95 cursor-pointer"
                />
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-black/20" />
                <div className="h-3 w-3 rounded-full bg-[#27C93F] border border-black/20" />
              </div>
              <span className="text-white/40 text-[10px]">|</span>
              <span className="font-semibold text-white/90 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d00] animate-pulse" />
                Zabed-OS v14.5
              </span>
            </div>

            {/* macOS System Indicators */}
            <div className="flex items-center space-x-4 text-white/80">
              <button
                onClick={handleFinish}
                className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 hover:bg-[#ff4d00]/20 hover:border-[#ff4d00]/40 hover:text-white transition duration-200 text-[11px]"
              >
                Skip Intro ↵
              </button>
              <div className="flex items-center space-x-2.5 text-white/60">
                <FiWifi className="h-3.5 w-3.5" />
                <FiSliders className="h-3.5 w-3.5" />
                <FiBattery className="h-4 w-4" />
                <span className="text-white/80 font-mono text-[11px]">
                  {timeString || "10:45 AM"}
                </span>
              </div>
            </div>
          </motion.header>

          {/* Center Stage: macOS Cursive Multilingual "hello" Animation */}
          <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
            <div className="relative flex flex-col items-center justify-center">
              {/* Animated Cursive Stroke Drawing SVG */}
              <div className="relative mb-4 flex items-center justify-center">
                <svg
                  className="w-[280px] sm:w-[380px] h-[120px] sm:h-[150px] overflow-visible"
                  viewBox="0 0 240 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="helloGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff4d00" />
                      <stop offset="50%" stopColor="#ff7700" />
                      <stop offset="100%" stopColor="#ffaa00" />
                    </linearGradient>
                    <filter id="helloGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Soft Background Path Shadow */}
                  <path
                    d="M 25 65 C 25 35, 35 15, 48 15 C 58 15, 52 45, 46 80 C 46 88, 42 92, 45 92 C 50 92, 60 62, 70 52 C 80 42, 88 48, 84 58 C 82 65, 72 72, 70 78 C 68 83, 74 85, 80 80 C 86 75, 98 50, 108 20 C 112 8, 105 38, 98 80 C 98 88, 102 88, 110 80 C 118 72, 130 50, 140 20 C 145 8, 138 38, 131 80 C 131 88, 135 88, 143 80 C 152 72, 162 55, 174 55 C 188 55, 188 80, 174 80 C 162 80, 162 55, 174 55 M 174 68 Q 188 65, 200 65"
                    stroke="rgba(255, 77, 0, 0.15)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Primary Handwritten Cursive Line */}
                  <motion.path
                    d="M 25 65 C 25 35, 35 15, 48 15 C 58 15, 52 45, 46 80 C 46 88, 42 92, 45 92 C 50 92, 60 62, 70 52 C 80 42, 88 48, 84 58 C 82 65, 72 72, 70 78 C 68 83, 74 85, 80 80 C 86 75, 98 50, 108 20 C 112 8, 105 38, 98 80 C 98 88, 102 88, 110 80 C 118 72, 130 50, 140 20 C 145 8, 138 38, 131 80 C 131 88, 135 88, 143 80 C 152 72, 162 55, 174 55 C 188 55, 188 80, 174 80 C 162 80, 162 55, 174 55 M 174 68 Q 188 65, 200 65"
                    stroke="url(#helloGradient)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#helloGlow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2.2,
                      ease: [0.45, 0, 0.2, 1]
                    }}
                  />
                </svg>

                {/* Glowing Pen Tip Dot */}
                <motion.div
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.8, 1.4, 1]
                  }}
                  transition={{ duration: 2.2 }}
                  className="pointer-events-none absolute h-3 w-3 rounded-full bg-[#ffaa00] shadow-[0_0_15px_#ff4d00]"
                  style={{
                    top: "60%",
                    right: "15%"
                  }}
                />
              </div>

              {/* Multilingual Text Cycling Carousel */}
              <div className="h-16 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentGreeting.text}
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex flex-col items-center text-center"
                  >
                    <span
                      className={`text-4xl sm:text-5xl tracking-wide bg-gradient-to-r from-white via-white/95 to-[#ffaa00] bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(255,77,0,0.35)] ${currentGreeting.font}`}
                    >
                      {currentGreeting.text}
                    </span>
                    <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#ff4d00]/80">
                      {currentGreeting.lang}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* macOS Boot Progress Bar */}
            <div className="mt-12 flex flex-col items-center w-full max-w-xs">
              <div className="relative h-1.5 w-full rounded-full bg-white/10 overflow-hidden backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(255,77,0,0.15)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#ff4d00] via-[#ff7700] to-[#ffaa00] shadow-[0_0_12px_#ff4d00]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Status and Percentage Label */}
              <div className="mt-3 flex items-center justify-between w-full font-mono text-[11px] text-white/50">
                <span className="truncate pr-2">{getStatusText()}</span>
                <span className="text-[#ff4d00] font-semibold">{progress}%</span>
              </div>
            </div>
          </main>

          {/* Bottom Footer Hint */}
          <footer className="relative z-20 flex items-center justify-between px-6 py-4 border-t border-white/[0.04] text-[11px] font-mono text-white/40">
            <span>© {new Date().getFullYear()} Zabed Mahmud</span>
            <button
              onClick={handleFinish}
              className="hover:text-white transition duration-200 cursor-pointer underline decoration-[#ff4d00]/50 underline-offset-4"
            >
              Click anywhere or press Enter to launch
            </button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
