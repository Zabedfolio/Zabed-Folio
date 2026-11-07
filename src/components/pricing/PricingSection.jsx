'use client';

import { useState } from "react";
import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi";
import { PACKAGES, ADDONS, PRICING_COPY, formatCurrency } from "@/data/pricing";
import PackageCard from "./PackageCard";
import AddonCard from "./AddonCard";
import SummaryCard from "./SummaryCard";
import FAQAccordion from "./FAQAccordion";

export default function PricingSection() {
  const [selectedPackage, setSelectedPackage] = useState("business"); // default: Business
  const [selectedAddons, setSelectedAddons] = useState([]);

  const handleToggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Calculations (standardized in USD)
  const selectedPkg = PACKAGES.find((p) => p.id === selectedPackage) || PACKAGES[1];
  const basePrice = typeof selectedPkg.price === "number" ? selectedPkg.price : (selectedPkg.price?.USD || 0);

  const isFastTrack = selectedAddons.includes("fast");
  const fastTrackPrice = isFastTrack ? Math.round(basePrice * 0.4) : 0;

  const otherAddonPrices = selectedAddons
    .filter((id) => id !== "fast" && id !== "maintenance")
    .reduce((sum, id) => {
      const addon = ADDONS.find((a) => a.id === id);
      if (!addon) return sum;
      const p = typeof addon.price === "number" ? addon.price : (addon.price?.USD || 0);
      return sum + p;
    }, 0);

  const totalOneTime = basePrice + fastTrackPrice + otherAddonPrices;

  const isMaintenance = selectedAddons.includes("maintenance");
  const maintenanceAddon = ADDONS.find((a) => a.id === "maintenance");
  const recurringMonthly = isMaintenance
    ? (typeof maintenanceAddon?.price === "number" ? maintenanceAddon.price : (maintenanceAddon?.price?.USD || 0))
    : 0;

  const bookingUrl = `/30-min?package=${selectedPkg.id}&addons=${
    selectedAddons.length > 0 ? selectedAddons.join(",") : "none"
  }&currency=USD`;

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

        {/* Currency Badge */}
        <div className="shrink-0 flex items-center md:pb-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-black/8 px-4 py-2 text-xs font-mono font-bold text-[#1a1a1a] shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#12A36B] animate-pulse" />
            All rates in USD ($)
          </span>
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
            totalOneTime={totalOneTime}
            recurringMonthly={recurringMonthly}
          />
        </div>
      </div>

      {/* Client FAQs Accordion */}
      <FAQAccordion />

      {/* Mobile Compact Sticky Bottom Bar (< 1024px) */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-black/50">
              Total ({selectedPkg.name})
            </div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-lg font-bold font-bricolage text-[#1a1a1a]">
                {formatCurrency(totalOneTime)}
              </span>
              {recurringMonthly > 0 && (
                <span className="text-[11px] font-mono text-[#12A36B] font-semibold">
                  + {formatCurrency(recurringMonthly)}/mo
                </span>
              )}
            </div>
          </div>

          <Link
            href={bookingUrl}
            style={{ color: "#ffffff" }}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#1a1a1a] hover:bg-black px-4 py-2.5 text-xs font-bold !text-white text-white visited:!text-white visited:text-white shadow-md shadow-[#12A36B]/20 transition-transform active:scale-95"
          >
            <span style={{ color: "#ffffff" }} className="!text-white text-white font-bold">Book Call</span>
            <HiOutlineArrowRight style={{ color: "#ffffff" }} className="text-sm !text-white text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}
