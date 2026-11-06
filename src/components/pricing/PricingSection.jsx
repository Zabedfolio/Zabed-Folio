'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi";
import { PACKAGES, ADDONS, PRICING_COPY, formatCurrency } from "@/data/pricing";
import PackageCard from "./PackageCard";
import AddonCard from "./AddonCard";
import SummaryCard from "./SummaryCard";
import CurrencyToggle from "./CurrencyToggle";

export default function PricingSection() {
  const [selectedPackage, setSelectedPackage] = useState("business"); // default: Business
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [currency, setCurrency] = useState("BDT");
  const [hasMounted, setHasMounted] = useState(false);

  // SSR-safe locale and cached currency detection
  useEffect(() => {
    setHasMounted(true);
    try {
      const saved = localStorage.getItem("pricing_currency");
      if (saved && (saved === "BDT" || saved === "USD")) {
        setCurrency(saved);
        return;
      }
      const tz = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone;
      const lang = navigator?.language || "";
      if (tz === "Asia/Dhaka" || lang.startsWith("bn")) {
        setCurrency("BDT");
      } else {
        setCurrency("USD");
      }
    } catch (e) {
      // Fallback stays BDT
    }
  }, []);

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    try {
      localStorage.setItem("pricing_currency", newCurrency);
    } catch (e) {}
  };

  const handleToggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Calculations
  const selectedPkg = PACKAGES.find((p) => p.id === selectedPackage) || PACKAGES[1];
  const basePrice = selectedPkg.price[currency];

  const isFastTrack = selectedAddons.includes("fast");
  const fastTrackPrice = isFastTrack ? Math.round(basePrice * 0.4) : 0;

  const otherAddonPrices = selectedAddons
    .filter((id) => id !== "fast" && id !== "maintenance")
    .reduce((sum, id) => {
      const addon = ADDONS.find((a) => a.id === id);
      return sum + (addon ? addon.price[currency] : 0);
    }, 0);

  const totalOneTime = basePrice + fastTrackPrice + otherAddonPrices;

  const isMaintenance = selectedAddons.includes("maintenance");
  const recurringMonthly = isMaintenance
    ? ADDONS.find((a) => a.id === "maintenance").price[currency]
    : 0;

  const bookingUrl = `/30-min?package=${selectedPkg.id}&addons=${
    selectedAddons.length > 0 ? selectedAddons.join(",") : "none"
  }&currency=${currency}`;

  return (
    <section id="pricing" className="section-shell scroll-mt-24 pt-20 pb-28 sm:pt-28 sm:pb-36">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 sm:pb-16 border-b border-black/8">
        <div className="space-y-3 max-w-2xl">
          {/* Section label */}
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-[#12A36B]">
              {PRICING_COPY.sectionLabel}
            </span>
          </div>

          {/* Subheading */}
          <h2 className="text-[clamp(2.1rem,4.5vw,3.6rem)] font-extrabold text-[#1a1a1a] tracking-tight leading-[1.1]">
            {PRICING_COPY.heading}
          </h2>

          {/* Muted subtext */}
          <p className="text-sm sm:text-base text-black/60 leading-relaxed font-sans pt-1">
            {PRICING_COPY.subtext}
          </p>
        </div>

        {/* Currency Toggle */}
        <div className="shrink-0 flex items-center md:pb-1">
          <CurrencyToggle currency={currency} onCurrencyChange={handleCurrencyChange} />
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-10 sm:pt-14 items-start">
        {/* Left Column: Stack of Cards (approx 55% -> 7 cols on lg) */}
        <div className="lg:col-span-7 space-y-10">
          {/* Package Selection Group */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black/50">
                1. Select Package (Required)
              </h3>
              <span className="text-xs text-black/40 font-mono">One-time payment</span>
            </div>

            <div
              role="radiogroup"
              aria-label="Select web development package"
              className="space-y-3"
            >
              {PACKAGES.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isSelected={selectedPackage === pkg.id}
                  currency={currency}
                  onSelect={() => setSelectedPackage(pkg.id)}
                />
              ))}
            </div>
          </div>

          {/* Add-ons Selection Group */}
          <div className="space-y-4 pt-4 border-t border-black/8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black/50">
                2. Customize with Add-ons (Optional)
              </h3>
              <span className="text-xs text-black/40 font-mono">Multi-select</span>
            </div>

            <div className="space-y-3">
              {ADDONS.map((addon) => (
                <AddonCard
                  key={addon.id}
                  addon={addon}
                  isChecked={selectedAddons.includes(addon.id)}
                  currency={currency}
                  packageBasePrice={basePrice}
                  onToggle={() => handleToggleAddon(addon.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary Card (approx 45% -> 5 cols on lg) */}
        <div className="lg:col-span-5">
          <SummaryCard
            selectedPackage={selectedPkg}
            selectedAddons={selectedAddons}
            currency={currency}
            totalOneTime={totalOneTime}
            recurringMonthly={recurringMonthly}
          />
        </div>
      </div>

      {/* Mobile Compact Sticky Bottom Bar (< 1024px) */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-black/50">
              Total ({selectedPkg.name})
            </div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-lg font-bold font-bricolage text-[#1a1a1a]">
                {formatCurrency(totalOneTime, currency)}
              </span>
              {recurringMonthly > 0 && (
                <span className="text-[11px] font-mono text-[#12A36B] font-semibold">
                  + {formatCurrency(recurringMonthly, currency)}/mo
                </span>
              )}
            </div>
          </div>

          <Link
            href={bookingUrl}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#1a1a1a] hover:bg-black px-4 py-2.5 text-xs font-bold text-white visited:text-white shadow-md shadow-[#12A36B]/20 transition-transform active:scale-95"
          >
            <span className="text-white font-bold">Book Call</span>
            <HiOutlineArrowRight className="text-sm text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}

