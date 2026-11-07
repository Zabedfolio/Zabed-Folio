'use client';

import Image from "next/image";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import mainPic from "@/assets/main-pic.jpg";
import BookingCalendar from "@/components/BookingCalendar";

export default function Contact() {
  return (
    <div id="contact" className="section-shell pt-8 pb-16 sm:pt-14 sm:pb-24">
      {/* Header section with Bricolage Grotesque headline */}
      <div className="text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
        {/* Availability Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/8 shadow-sm text-xs font-mono font-medium text-black/70 mb-4 sm:mb-5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12A36B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12A36B]"></span>
          </span>
          <span>Open for Collaborations &amp; Consultations</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-bricolage text-[clamp(1.9rem,5vw,3.6rem)] font-extrabold tracking-[-0.035em] text-[#1a1a1a] leading-[1.15] flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5 gap-y-2">
          <span>Book a 30-min</span>{" "}
          <span className="inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap">
            <span>Call</span>
            <span className="relative inline-block h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full overflow-hidden shadow-md shadow-black/10 ring-2 ring-white shrink-0 align-middle transition-transform duration-300 hover:scale-110 hover:rotate-3">
              <Image
                src={mainPic}
                alt="Zabed Mahmud"
                fill
                className="object-cover"
                priority
              />
            </span>
          </span>
        </h1>

        {/* Description */}
        <p className="mt-3.5 sm:mt-4 text-[0.95rem] sm:text-base md:text-lg text-black/70 max-w-xl mx-auto leading-relaxed font-sans">
          A 30-minute conversation to explore your ideas, requirements, and potential project. We&apos;ll discuss your vision, tech stack, and timeline to see if we&apos;re a good fit.
        </p>

        {/* Highlight punchline pill with Free Consultation on the side */}
        <div className="mt-4 inline-flex items-center gap-2 sm:gap-2.5 px-4 py-1.5 rounded-full bg-white border border-black/8 shadow-xs text-xs sm:text-sm font-mono text-[#1a1a1a]">
          <span className="font-medium text-black/75">No pressure. Just clarity</span>
          <span className="text-black/30 font-normal">·</span>
          <span className="font-semibold text-[#12A36B]">Free Consultation</span>
        </div>

        {/* Direct text alternatives */}
        <p className="mt-4 text-xs sm:text-sm text-black/50 max-w-xl mx-auto leading-relaxed">
          <span>Select a date and time below, or message directly on </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap align-baseline">
            <a
              href="https://wa.me/8801979333880"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs"
            >
              <FaWhatsapp className="text-[#25D366] text-xs shrink-0" />
              <span>WhatsApp</span>
            </a>
            <span>or</span>
            <a
              href="https://t.me/Zabed_Mahmud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0077b5] font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs"
            >
              <FaTelegramPlane className="text-[#0088cc] text-xs shrink-0" />
              <span>Telegram</span>
            </a>
          </span>
        </p>
      </div>

      {/* Full-width responsive booking calendar */}
      <div className="w-full">
        <BookingCalendar />
      </div>
    </div>
  );
}
