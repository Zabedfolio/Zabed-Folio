'use client';

import { motion } from "framer-motion";
import { HiOutlineLightningBolt, HiOutlineColorSwatch, HiOutlineGlobeAlt, HiOutlineShieldCheck } from "react-icons/hi";
import { formatCurrency } from "@/data/pricing";

const ADDON_ICONS = {
  zap: HiOutlineLightningBolt,
  palette: HiOutlineColorSwatch,
  globe: HiOutlineGlobeAlt,
  shield: HiOutlineShieldCheck,
};

export default function AddonCard({ addon, isChecked, packageBasePrice, onToggle }) {
  const Icon = ADDON_ICONS[addon.icon] || HiOutlineLightningBolt;

  // Calculate price label
  let priceLabel = "";
  if (addon.isPercentage) {
    const calculatedAmount = Math.round(packageBasePrice * addon.percentage);
    priceLabel = `+${formatCurrency(calculatedAmount)} (+40%)`;
  } else if (addon.isRecurring) {
    priceLabel = `+${formatCurrency(addon.price)}/mo`;
  } else {
    priceLabel = `+${formatCurrency(addon.price)}`;
  }

  return (
    <div
      role="switch"
      aria-checked={isChecked}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12A36B] focus-visible:ring-offset-2 ${
        isChecked
          ? "bg-[#1FB57A]/[0.06] border-[#1FB57A] shadow-md shadow-[#12A36B]/10"
          : "bg-white border-black/8 hover:border-black/20 hover:shadow-sm"
      }`}
    >
      {/* Left: Icon Tile + Title + Subtitle */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 pr-3">
        <div
          className={`flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-xl transition-colors duration-300 shrink-0 ${
            isChecked
              ? "bg-[#1FB57A]/15 text-[#12A36B]"
              : "bg-black/5 text-black/60 group-hover:text-[#1a1a1a]"
          }`}
        >
          <Icon className="text-xl sm:text-2xl" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base sm:text-lg font-bold text-[#1a1a1a] tracking-tight">
              {addon.name}
            </h4>
            <span className="font-mono text-xs sm:text-sm font-semibold text-[#12A36B]">
              • {priceLabel}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-black/55 truncate mt-0.5">
            {addon.subtitle}
          </p>
        </div>
      </div>

      {/* Right: iOS-Style Switch */}
      <div className="shrink-0 pl-2">
        <div
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 p-0.5 ${
            isChecked ? "bg-[#1FB57A]" : "bg-black/15 group-hover:bg-black/25"
          }`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
              isChecked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

