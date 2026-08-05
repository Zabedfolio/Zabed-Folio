'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiWifi, FiBattery, FiSliders } from "react-icons/fi";

const GREETINGS = [
  { text: "Hello", lang: "English", isPacifico: true },
  { text: "Hola", lang: "Spanish", isPacifico: true },
  { text: "Ciao", lang: "Italian", isPacifico: true },
  { text: "Hallo", lang: "German", isPacifico: true },
  { text: "こんにちは", lang: "Japanese", isPacifico: false },
  { text: "Olá", lang: "Portuguese", isPacifico: true },
  { text: "Merhaba", lang: "Turkish", isPacifico: true }
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

    // Live digital clock for macOS bar
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 10000);

    // Boot progress loader simulation (~5.5s smooth macOS boot timing)
    const startTime = Date.now();
    const duration = 5500;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => handleFinish(), 400);
      }
    }, 30);

    // Fast language switch interval (800ms per greeting)
    const langInterval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 800);

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
    }, 850);
  };

  if (!hasLoaded || !isVisible) {
    return null;
  }

  const currentGreeting = GREETINGS[langIndex];
  const characters = currentGreeting.text.split("");

  // Helper status string for boot sequence
  const getStatusText = () => {
    if (progress < 25) return "Initializing Zabed-OS kernel...";
    if (progress < 55) return "Loading portfolio assets...";
    if (progress < 85) return "Applying Apple keynote shaders...";
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
            filter: "blur(24px)",
            transition: { duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }
          }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden bg-[#08070b] text-white selection:bg-[#ff4d00]/30 cursor-default"
        >
          {/* Apple-Inspired Soft Bokeh Color Gradients (Green, Orange, Red, Blue) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Orange Glow */}
            <motion.div
              animate={{
                x: [-15, 15, -15],
                y: [-15, 15, -15],
                scale: [1, 1.12, 1],
                opacity: [0.3, 0.45, 0.3]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-radial from-[#F97316]/30 via-[#FF4D00]/15 to-transparent blur-[80px] sm:blur-[140px]"
            />
            {/* Green Bokeh */}
            <motion.div
              animate={{
                x: [20, -15, 20],
                y: [15, -20, 15],
                opacity: [0.2, 0.35, 0.2]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-5 top-1/4 h-[240px] w-[240px] sm:h-[400px] sm:w-[400px] rounded-full bg-[#10B981]/20 blur-[90px] sm:blur-[150px]"
            />
            {/* Red / Crimson Bokeh */}
            <motion.div
              animate={{
                x: [-20, 20, -20],
                y: [20, -15, 20],
                opacity: [0.18, 0.3, 0.18]
              }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-5 bottom-1/4 h-[250px] w-[250px] sm:h-[420px] sm:w-[420px] rounded-full bg-[#EF4444]/18 blur-[95px] sm:blur-[160px]"
            />
            {/* Blue / Sapphire Bokeh */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-1/3 bottom-1/3 h-[280px] w-[280px] sm:h-[450px] sm:w-[450px] rounded-full bg-[#3B82F6]/22 blur-[90px] sm:blur-[150px]"
            />
            <div className="absolute inset-0 noise-mask opacity-20 pointer-events-none" />
          </div>

          {/* Top macOS Glass Status Bar */}
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-20 flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 backdrop-blur-xl bg-black/25 border-b border-white/[0.06] text-xs font-mono tracking-wider text-white/70"
          >
            {/* macOS Window Controls */}
            <div className="flex items-center space-x-2.5 sm:space-x-3.5">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <button
                  onClick={handleFinish}
                  title="Close / Skip"
                  className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#FF5F56] hover:brightness-110 border border-black/20 transition-transform active:scale-95 cursor-pointer"
                />
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#FFBD2E] border border-black/20" />
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#27C93F] border border-black/20" />
              </div>
              <span className="text-white/30 text-[10px]">|</span>
              <span className="font-medium text-white/90 text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d00] animate-pulse" />
                Zabed-OS
              </span>
            </div>

            {/* System Indicators & Skip Button */}
            <div className="flex items-center space-x-2 sm:space-x-4 text-white/80">
              <button
                onClick={handleFinish}
                className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 hover:bg-[#ff4d00]/20 hover:border-[#ff4d00]/40 hover:text-white active:scale-95 transition duration-200 text-[10px] sm:text-[11px] font-mono cursor-pointer"
              >
                Skip ↵
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3 text-white/60">
                <FiWifi className="h-3.5 w-3.5" />
                <FiSliders className="hidden xs:inline-block h-3.5 w-3.5" />
                <FiBattery className="h-4 w-4" />
                <span className="text-white/80 font-mono text-[10px] sm:text-[11px]">
                  {timeString || "10:45 AM"}
                </span>
              </div>
            </div>
          </motion.header>

          {/* Center Stage: Apple Keynote "Hello" Handwriting Type Reveal */}
          <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
            <div className="relative flex flex-col items-center justify-center min-h-[160px] sm:min-h-[220px] w-full max-w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentGreeting.text}
                  initial={{ scale: 0.97, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{
                    scale: 1.02,
                    opacity: 0,
                    filter: "blur(10px)",
                    transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }
                  }}
                  transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col items-center text-center relative w-full"
                >
                  {/* Handwritten Script Container */}
                  <div
                    className="relative flex items-center justify-center py-2 max-w-full"
                    style={{
                      filter:
                        "drop-shadow(0 0 15px rgba(255, 255, 255, 0.75)) drop-shadow(0 0 35px rgba(255, 255, 255, 0.35))"
                    }}
                  >
                    <div className="flex items-baseline overflow-hidden max-w-full px-2">
                      {characters.map((char, index) => (
                        <motion.span
                          key={`${currentGreeting.text}-${index}`}
                          initial={{
                            opacity: 0,
                            clipPath: "inset(0 100% 0 0)",
                            y: 4
                          }}
                          animate={{
                            opacity: 1,
                            clipPath: "inset(0 0% 0 0)",
                            y: 0
                          }}
                          transition={{
                            duration: 0.22,
                            ease: [0.25, 0.1, 0.25, 1],
                            delay: index * 0.04
                          }}
                          className={`text-5xl xs:text-6xl sm:text-8xl md:text-9xl text-white select-none ${
                            currentGreeting.isPacifico
                              ? "font-normal"
                              : "font-light"
                          }`}
                          style={{
                            fontFamily: currentGreeting.isPacifico
                              ? "var(--font-pacifico), 'Pacifico', cursive"
                              : '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                            lineHeight: 1.1,
                            paddingRight: currentGreeting.isPacifico ? "0.06em" : "0.02em"
                          }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>

                    {/* Glowing Pen Tip Indicator following character reveal */}
                    <motion.span
                      initial={{ left: "0%", opacity: 0 }}
                      animate={{
                        left: "100%",
                        opacity: [0, 1, 1, 0]
                      }}
                      transition={{
                        duration: Math.max(0.3, characters.length * 0.04 + 0.1),
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      className="pointer-events-none absolute -bottom-1 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-white shadow-[0_0_18px_#ffffff,0_0_35px_#ff4d00]"
                    />
                  </div>

                  {/* Subtitle Language Label */}
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.22,
                      delay: characters.length * 0.04 + 0.03,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className="mt-3 sm:mt-4 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#ff4d00] font-medium"
                  >
                    {currentGreeting.lang}
                  </motion.span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Apple Boot Progress Bar */}
            <div className="mt-10 sm:mt-16 flex flex-col items-center w-full max-w-[240px] sm:max-w-xs">
              <div className="relative h-1.5 w-full rounded-full bg-white/10 overflow-hidden backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#ff4d00] via-[#ff7700] to-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Status and Percentage Label */}
              <div className="mt-2.5 sm:mt-3.5 flex items-center justify-between w-full font-mono text-[10px] sm:text-[11px] text-white/50">
                <span className="truncate pr-2">{getStatusText()}</span>
                <span className="text-[#ff4d00] font-semibold">{progress}%</span>
              </div>
            </div>
          </main>

          {/* Bottom Footer Hint */}
          <footer className="relative z-20 flex flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-white/[0.04] text-[10px] sm:text-[11px] font-mono text-white/40">
            <span>© {new Date().getFullYear()} Zabed Mahmud</span>
            <button
              onClick={handleFinish}
              className="hover:text-white active:text-white transition duration-200 cursor-pointer underline decoration-[#ff4d00]/50 underline-offset-4"
            >
              Tap or press Enter to launch
            </button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
