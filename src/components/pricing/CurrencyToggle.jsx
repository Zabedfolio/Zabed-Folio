'use client';

import { motion } from "framer-motion";

export default function CurrencyToggle({ currency, onCurrencyChange }) {
  const options = [
    { code: "BDT", label: "BDT (৳)" },
    { code: "USD", label: "USD ($)" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Select currency"
      className="inline-flex items-center p-1 rounded-full bg-black/5 border border-black/8 shadow-inner"
    >
      {options.map((opt) => {
        const isSelected = currency === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onCurrencyChange(opt.code)}
            className={`relative px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12A36B] ${
              isSelected ? "text-[#1a1a1a]" : "text-black/50 hover:text-black/80"
            }`}
          >
            {isSelected && (
              <motion.span
                layoutId="currencyPill"
                className="absolute inset-0 rounded-full bg-white shadow-sm border border-black/5"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

