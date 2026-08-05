'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiWifi, FiBattery, FiSliders } from "react-icons/fi";

const GREETINGS = [
  { text: "Hello", lang: "English" },
  { text: "Hola", lang: "Spanish" },
  { text: "Bonjour", lang: "French" },
  { text: "Ciao", lang: "Italian" },
  { text: "Hallo", lang: "German" },
  { text: "নমস্কার", lang: "Bengali" },
  { text: "こんにちは", lang: "Japanese" },
  { text: "안녕하세요", lang: "Korean" },
  { text: "Olá", lang: "Portuguese" },
  { text: "Merhaba", lang: "Turkish" }
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

    // Format current time for macOS top bar
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 10000);

    // Progress counter simulation (smooth macOS boot timing ~6.5s)
    const startTime = Date.now();
    const duration = 6500; // 6.5s pacing for a calm, luxurious intro

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => handleFinish(), 500);
      }
    }, 40);

    // Cycle through multilingual greetings every 1.3s for smooth reading
    const langInterval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 1300);

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
    }, 800);
  };

  if (!hasLoaded || !isVisible) {
    return null;
  }

  const currentGreeting = GREETINGS[langIndex];

  // Boot sequence status messages
  const getStatusText = () => {
    if (progress < 25) return "Initializing Zabed-OS kernel...";
    if (progress < 55) return "Loading portfolio assets...";
    if (progress < 85) return "Applying theme shaders...";
    if (progress < 100) return "Finalizing desktop environment...";
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
            scale: 1.04,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden bg-[#0a0808] text-white selection:bg-[#ff4d00]/30 cursor-default"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Geist", system-ui, sans-serif'
          }}
        >
          {/* Ambient Lighting Background Blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.25, 0.38, 0.25]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-radial from-[#ff4d00]/30 via-[#ff6a00]/12 to-transparent blur-[120px]"
            />
            <div className="absolute right-12 bottom-12 h-[350px] w-[350px] rounded-full bg-[#ff4d00]/10 blur-[140px]" />
            <div className="absolute left-12 top-12 h-[300px] w-[300px] rounded-full bg-[#ffaa00]/08 blur-[130px]" />
            <div className="absolute inset-0 noise-mask opacity-25 pointer-events-none" />
          </div>

          {/* Top macOS Status Bar */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-20 flex items-center justify-between px-5 py-3 backdrop-blur-md bg-black/20 border-b border-white/[0.06] text-xs font-mono tracking-wider text-white/70"
          >
            {/* macOS Window Controls & Title */}
            <div className="flex items-center space-x-3.5">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleFinish}
                  title="Close / Skip"
                  className="h-3 w-3 rounded-full bg-[#FF5F56] hover:brightness-110 border border-black/20 transition-transform active:scale-95 cursor-pointer"
                />
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-black/20" />
                <div className="h-3 w-3 rounded-full bg-[#27C93F] border border-black/20" />
              </div>
              <span className="text-white/30 text-[10px]">|</span>
              <span className="font-medium text-white/90 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d00] animate-pulse" />
                Zabed-OS v14.5
              </span>
            </div>

            {/* macOS System Indicators */}
            <div className="flex items-center space-x-4 text-white/80">
              <button
                onClick={handleFinish}
                className="hidden sm:inline-block px-3 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-[#ff4d00]/20 hover:border-[#ff4d00]/40 hover:text-white transition duration-200 text-[11px] font-mono"
              >
                Skip Intro ↵
              </button>
              <div className="flex items-center space-x-3 text-white/60">
                <FiWifi className="h-3.5 w-3.5" />
                <FiSliders className="h-3.5 w-3.5" />
                <FiBattery className="h-4 w-4" />
                <span className="text-white/80 font-mono text-[11px]">
                  {timeString || "10:45 AM"}
                </span>
              </div>
            </div>
          </motion.header>

          {/* Center Stage: Multilingual SF Pro Typography Hello Animation */}
          <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
            <div className="relative flex flex-col items-center justify-center min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentGreeting.text}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)", scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, y: -16, filter: "blur(8px)", scale: 1.04 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center"
                >
                  <h1
                    className="text-6xl sm:text-7xl md:text-8xl font-light text-white tracking-[0.03em] leading-none drop-shadow-[0_0_40px_rgba(255,77,0,0.35)]"
                    style={{
                      fontWeight: 300,
                      letterSpacing: "0.03em"
                    }}
                  >
                    <span className="bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent">
                      {currentGreeting.text}
                    </span>
                  </h1>
                  <span className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-[#ff4d00] font-medium">
                    {currentGreeting.lang}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* macOS Boot Progress Bar */}
            <div className="mt-14 flex flex-col items-center w-full max-w-xs">
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
