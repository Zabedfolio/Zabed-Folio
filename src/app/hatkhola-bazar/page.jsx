import Navbar from "@/components/Navbar";
import Link from "next/link";
import { HiOutlineArrowLeft, HiOutlineShoppingBag } from "react-icons/hi";

export const metadata = {
  title: "Hatkhola Bazar — Zabed Mahmud",
  description: "Hatkhola Bazar - Digital commerce and market platform by Zabed Mahmud.",
};

export default function HatkholaBazarPage() {
  return (
    <div className="relative min-h-screen bg-[#eeeeee] text-[#1a1a1a] selection:bg-[#ff5f1a]/20">
      <Navbar />
      <main className="relative z-10 min-h-screen px-4 py-12 md:pl-28 md:pr-12 lg:px-24 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-black/60 hover:text-[#ff5f1a] transition-colors"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* Main Card */}
          <div className="rounded-3xl border border-black/10 bg-white/70 p-8 md:p-12 shadow-xl shadow-black/5 backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff5f1a]/20 bg-[#ff5f1a]/10 px-3.5 py-1 text-xs font-semibold text-[#ff5f1a] mb-6">
              <HiOutlineShoppingBag className="w-4 h-4" />
              <span>Project Showcase</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1a1a] mb-4">
              Hatkhola Bazar
            </h1>

            <p className="text-base md:text-lg text-black/60 max-w-2xl leading-relaxed mb-8">
              A modern digital marketplace initiative empowering local commerce, smart trading, and seamless shopping experiences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-black/5">
              <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-5">
                <span className="text-xs uppercase tracking-wider text-black/40 font-semibold block mb-1">
                  Status
                </span>
                <span className="text-sm font-semibold text-[#1a1a1a] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Active Development
                </span>
              </div>

              <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-5">
                <span className="text-xs uppercase tracking-wider text-black/40 font-semibold block mb-1">
                  Route
                </span>
                <span className="text-sm font-mono font-medium text-black/80">
                  /hatkhola-bazar
                </span>
              </div>

              <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-5">
                <span className="text-xs uppercase tracking-wider text-black/40 font-semibold block mb-1">
                  Platform
                </span>
                <span className="text-sm font-semibold text-[#1a1a1a]">
                  Next.js & Modern Web
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

