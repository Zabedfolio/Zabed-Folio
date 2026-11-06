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
            <span className="relative inline-block h-9 w-9 sm:h-11 sm:w-11 md:h-13 md:w-13 rounded-full overflow-hidden shadow-md shadow-black/10 ring-2 ring-white shrink-0 align-middle transition-transform duration-300 hover:scale-110 hover:rotate-3">
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

        {/* Subtitle with WhatsApp & Telegram interactive links */}
        <p className="mt-3.5 sm:mt-4 text-[0.95rem] sm:text-base md:text-lg text-black/60 max-w-xl mx-auto leading-relaxed">
          Please select a date and time for the call, or just text me on{" "}
          <a
            href="https://wa.me/8801979333880"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-medium text-[0.92em] border border-[#25D366]/25 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs align-baseline"
          >
            <FaWhatsapp className="text-[#25D366] text-sm shrink-0" />
            <span>WhatsApp</span>
          </a>{" "}
          or{" "}
          <a
            href="https://t.me/Zabed_Mahmud"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0077b5] font-medium text-[0.92em] border border-[#0088cc]/25 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs align-baseline"
          >
            <FaTelegramPlane className="text-[#0088cc] text-sm shrink-0" />
            <span>Telegram</span>
          </a>
        </p>
      </div>

      {/* Full-width responsive booking calendar */}
      <div className="w-full">
        <BookingCalendar />
      </div>
    </div>
  );
}
