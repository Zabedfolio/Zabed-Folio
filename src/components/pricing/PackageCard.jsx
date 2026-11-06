'use client';

import { motion } from "framer-motion";
import { HiOutlineCode, HiOutlineBriefcase, HiOutlineSparkles } from "react-icons/hi";
import { formatCurrency } from "@/data/pricing";

const PACKAGE_ICONS = {
  starter: HiOutlineCode,
  business: HiOutlineBriefcase,
  premium: HiOutlineSparkles,
};

export default function PackageCard({ pkg, isSelected, currency, onSelect }) {
  const Icon = PACKAGE_ICONS[pkg.id] || HiOutlineCode;
  const priceDisplay = formatCurrency(pkg.price[currency], currency);

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12A36B] focus-visible:ring-offset-2 ${
        isSelected
          ? "bg-[#1FB57A]/[0.06] border-[#1FB57A] shadow-md shadow-[#12A36B]/10"
          : "bg-white border-black/8 hover:border-black/20 hover:shadow-sm"
      }`}
    >
      {/* Left: Icon Tile + Title + Subtitle */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 pr-3">
        {/* Soft tinted icon tile */}
        <div
          className={`flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-xl transition-colors duration-300 shrink-0 ${
            isSelected
              ? "bg-[#1FB57A]/15 text-[#12A36B]"
              : "bg-black/5 text-black/60 group-hover:text-[#1a1a1a]"
          }`}
        >
          <Icon className="text-xl sm:text-2xl" />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base sm:text-lg font-bold text-[#1a1a1a] tracking-tight">
              {pkg.name}
            </h4>
            {pkg.badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#12A36B]/15 text-[#12A36B] border border-[#12A36B]/25">
                {pkg.badge}
              </span>
            )}
            <span className="font-mono text-xs sm:text-sm font-semibold text-black/45">
              • {priceDisplay}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-black/55 truncate mt-0.5">
            {pkg.tagline}
          </p>
        </div>
      </div>

      {/* Right: iOS-Style Switch */}
      <div className="shrink-0 pl-2">
        <div
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 p-0.5 ${
            isSelected ? "bg-[#1FB57A]" : "bg-black/15 group-hover:bg-black/25"
          }`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
              isSelected ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

