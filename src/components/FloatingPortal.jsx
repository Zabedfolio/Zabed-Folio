"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSparkles, HiOutlineTerminal } from "react-icons/hi";
import { useSession } from "@/lib/auth-client";

export default function FloatingPortal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [isAdminLocal, setIsAdminLocal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdminLocal(localStorage.getItem("admin_logged_in") === "true");
    }
  }, [session]);

  const showNotes = !!(session?.user || isAdminLocal);

  // Hidden on admin paths
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 select-none font-mono print:hidden"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="relative flex items-center justify-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mr-3 flex gap-2"
            >
              {/* Journey Option */}
              <Link href="/more-about-page">
                <div className="relative overflow-hidden skew-x-[-12deg] border border-white/10 hover:border-[#ff4d00]/40 bg-[#0a0808]/90 hover:bg-[#ff4d00]/5 backdrop-blur-xl px-4 py-2.5 transition duration-300 group shadow-lg shadow-black/40 cursor-pointer">
                  {/* Neon Indicator line */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="skew-x-[12deg] flex flex-col items-start leading-none">
                    <span className="text-[10px] text-white/45 tracking-wider uppercase">01 — Journey</span>
                    <span className="text-xs font-bold text-white mt-1 group-hover:text-[#ff4d00] transition">
                      MY STORY
                    </span>
                  </div>
                </div>
              </Link>

              {/* Notes Option */}
              {showNotes && (
                <Link href="/notes">
                  <div className="relative overflow-hidden skew-x-[-12deg] border border-white/10 hover:border-[#ff4d00]/40 bg-[#0a0808]/90 hover:bg-[#ff4d00]/5 backdrop-blur-xl px-4 py-2.5 transition duration-300 group shadow-lg shadow-black/40 cursor-pointer">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="skew-x-[12deg] flex flex-col items-start leading-none">
                      <span className="text-[10px] text-white/45 tracking-wider uppercase">02 — Thoughts</span>
                      <span className="text-xs font-bold text-white mt-1 group-hover:text-[#ff4d00] transition">
                        NOTES & IDEAS
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger Button - Slanted Parallelogram */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={`relative overflow-hidden skew-x-[-12deg] border transition-all duration-300 cursor-default px-5 py-3 shadow-lg shadow-black/60 ${
            isOpen 
              ? "border-[#ff4d00]/40 bg-[#ff4d00]/10 text-white" 
              : "border-white/10 bg-[#0a0808]/85 text-white/80 hover:text-white hover:border-[#ff4d00]/30"
          }`}
        >
          {/* Subtle pulse light */}
          {!isOpen && (
            <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5 skew-x-[12deg]">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4d00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff4d00]"></span>
            </span>
          )}

          <div className="skew-x-[12deg] flex items-center gap-2">
            {isOpen ? (
              <HiOutlineTerminal className="text-base text-[#ff4d00] animate-pulse" />
            ) : (
              <HiOutlineSparkles className="text-base text-[#ff4d00]" />
            )}
            <span className="text-xs font-bold tracking-[0.18em] uppercase">
              {isOpen ? "PORTAL.active" : "PORTAL"}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
