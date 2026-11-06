'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  HiOutlineClock,
  HiOutlineRefresh,
  HiOutlineSupport,
  HiOutlineCheck,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { formatCurrency, PRICING_COPY, ADDONS } from "@/data/pricing";

export default function SummaryCard({
  selectedPackage,
  selectedAddons,
  currency,
  totalOneTime,
  recurringMonthly,
}) {
  const prefersReducedMotion = useReducedMotion();
  const [displayPrice, setDisplayPrice] = useState(totalOneTime);
  const prevPriceRef = useRef(totalOneTime);

  // Animated tween for price count
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayPrice(totalOneTime);
      prevPriceRef.current = totalOneTime;
      return;
    }

    const start = prevPriceRef.current;
    const end = totalOneTime;
    if (start === end) return;

    const duration = 350; // ms
    const startTime = performance.now();

    let animationFrameId;
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (end - start) * ease);
      setDisplayPrice(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        prevPriceRef.current = end;
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [totalOneTime, prefersReducedMotion]);

  // Turnaround text (halved if Fast Track is selected)
  const isFastTrack = selectedAddons.includes("fast");
  const turnaroundText = isFastTrack
    ? selectedPackage.turnaround.fastTrack
    : selectedPackage.turnaround.standard;

  // Active badge determination
  let badgeText = selectedPackage.badge || "Standard";
  if (isFastTrack) {
    badgeText = "Fast Track";
  }

  // Build query string for /30-min CTA link
  const addonQuery = selectedAddons.length > 0 ? selectedAddons.join(",") : "none";
  const bookingUrl = `/30-min?package=${selectedPackage.id}&addons=${addonQuery}&currency=${currency}`;

  // Gather all add-on check items
  const addonFeatureItems = ADDONS.filter((a) => selectedAddons.includes(a.id)).map(
    (a) => a.featureText
  );

  return (
    <div className="sticky top-28 space-y-4">
      {/* Main Glass/Gradient Card */}
      <div className="relative rounded-3xl border border-black/8 bg-gradient-to-b from-white via-white to-[#1FB57A]/[0.08] p-6 sm:p-8 shadow-xl shadow-black/5 overflow-hidden">
        {/* Subtle top-right ambient glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#1FB57A]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        {/* Top Row: Package Name + Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-black/50">
              Selected Package
            </span>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
              isFastTrack
                ? "bg-[#12A36B] text-white shadow-sm"
                : "bg-[#1FB57A]/15 text-[#12A36B] border border-[#1FB57A]/30"
            }`}
          >
            {badgeText}
          </span>
        </div>

        {/* Big Animated Price Region */}
        <div className="py-6 sm:py-8 text-center" aria-live="polite">
          <h3 className="font-bricolage text-5xl sm:text-6xl font-extrabold tracking-tight text-[#1a1a1a]">
            {formatCurrency(displayPrice, currency)}
          </h3>

          {/* Separate recurring line if monthly maintenance is selected */}
          {recurringMonthly > 0 ? (
            <div className="mt-2 text-sm font-mono font-bold text-[#12A36B] inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1FB57A]/10 border border-[#1FB57A]/25 animate-fadeIn">
              <span>+ {formatCurrency(recurringMonthly, currency)} / month</span>
              <span className="text-black/40 font-normal text-xs">(maintenance)</span>
            </div>
          ) : (
            <p className="mt-1.5 text-xs sm:text-sm font-mono text-black/45">
              One-time investment
            </p>
          )}
        </div>

        {/* Deliverables & Turnaround Details */}
        <div className="space-y-3.5 pt-2 pb-6 border-t border-black/5">
          {/* Turnaround with clock icon */}
          <div className="flex items-center gap-3 text-sm text-[#1a1a1a] font-medium">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1FB57A]/15 text-[#12A36B] shrink-0">
              <HiOutlineClock className="text-base" />
            </span>
            <span>
              <strong className="font-bold text-[#1a1a1a]">{turnaroundText}</strong>{" "}
              turnaround {isFastTrack && <span className="text-[#12A36B] font-mono text-xs">(Rush)</span>}
            </span>
          </div>

          {/* Revisions with refresh icon */}
          <div className="flex items-center gap-3 text-sm text-[#1a1a1a] font-medium">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1FB57A]/15 text-[#12A36B] shrink-0">
              <HiOutlineRefresh className="text-base" />
            </span>
            <span>{selectedPackage.revisions}</span>
          </div>

          {/* Support with headphones/support icon */}
          <div className="flex items-center gap-3 text-sm text-[#1a1a1a] font-medium">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1FB57A]/15 text-[#12A36B] shrink-0">
              <HiOutlineSupport className="text-base" />
            </span>
            <span>{selectedPackage.support}</span>
          </div>
        </div>

        {/* Features Checklist with Cross-Fade */}
        <div className="pt-4 pb-6 border-t border-black/5 min-h-[180px]">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-black/40 mb-3">
            What&apos;s Included:
          </div>

          <AnimatePresence mode="wait">
            <motion.ul
              key={`${selectedPackage.id}-${addonFeatureItems.join("-")}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5 text-xs sm:text-sm text-black/75"
            >
              {/* Package features */}
              {selectedPackage.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <HiOutlineCheck className="text-[#12A36B] text-base shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}

              {/* Addon features */}
              {addonFeatureItems.map((addonFeature, i) => (
                <li key={`addon-${i}`} className="flex items-start gap-2.5 font-semibold text-[#1a1a1a]">
                  <HiOutlineCheck className="text-[#12A36B] text-base shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>{addonFeature}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        {/* CTA Button with Bottom Green Glow */}
        <div className="pt-2">
          <Link
            href={bookingUrl}
            className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a1a1a] hover:bg-black py-4 px-6 text-center font-bold text-white visited:text-white shadow-[0_8px_25px_-5px_rgba(31,181,122,0.45)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12A36B] focus-visible:ring-offset-2"
          >
            <span className="relative z-10 text-sm sm:text-base font-bold text-white tracking-wide">
              {PRICING_COPY.ctaText}
            </span>
            <HiOutlineArrowRight className="text-lg text-white transition-transform duration-300 group-hover:translate-x-1" />
            {/* Bottom edge neon gradient reflection */}
            <span className="absolute inset-x-8 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#1FB57A] to-transparent opacity-80" />
          </Link>
        </div>
      </div>

      {/* Small Muted Notes Under Summary Card */}
      <div className="space-y-2 px-2 text-xs text-black/50 leading-relaxed font-sans">
        {PRICING_COPY.notes.map((note, index) => (
          <p key={index} className="flex items-start gap-2">
            <span className="text-[#12A36B] shrink-0 font-bold">•</span>
            <span>{note}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

