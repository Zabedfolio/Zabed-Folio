import Link from "next/link";
import Navbar from "@/components/Navbar";
import { HiOutlineHome, HiOutlineArrowRight } from "react-icons/hi";

export const metadata = {
  title: "404 — Page Not Found | Zabed Mahmud",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#eeeeee] text-[#1a1a1a] selection:bg-[#1FB57A]/20 flex flex-col">
      <Navbar />
      
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 md:pl-16 py-20">
        <div className="max-w-xl w-full text-center space-y-6">
          
          {/* 404 Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/8 shadow-xs text-xs font-mono font-bold text-black/70">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span>404 · Page Not Found</span>
          </div>

          {/* Headline */}
          <h1 className="font-bricolage text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold tracking-[-0.04em] text-[#1a1a1a] leading-[1.05]">
            Lost in the <span className="text-[#12A36B]">codebase?</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-black/60 font-sans max-w-md mx-auto leading-relaxed">
            The link you followed doesn&apos;t exist or might have moved. Let&apos;s get you back to the live projects or arrange a quick chat.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1a1a1a] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md shadow-black/10 transition-all hover:scale-105 active:scale-95"
            >
              <HiOutlineHome className="text-base" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/30-min"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1FB57A] to-[#12A36B] hover:from-[#19A36D] hover:to-[#0E8A5A] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#12A36B]/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>Book 30-min Call</span>
              <HiOutlineArrowRight className="text-sm" />
            </Link>
          </div>

          {/* Subtle note */}
          <p className="text-[11px] font-mono text-black/40 pt-4">
            Error Code: HTTP 404 · zabedmahmud.com
          </p>
        </div>
      </main>
    </div>
  );
}
