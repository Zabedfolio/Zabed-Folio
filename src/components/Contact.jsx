'use client';

import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import BookingCalendar from "@/components/BookingCalendar";

const contactCards = [
  {
    label: "Email",
    value: "zabedfolio@gmail.com",
    icon: FaEnvelope,
    href: "mailto:zabedfolio@gmail.com"
  },
  {
    label: "Phone",
    value: "+880 1979 333880",
    icon: FaPhoneAlt,
    href: "tel:+8801979333880"
  },
  {
    label: "WhatsApp",
    value: "+880 1979 333880",
    icon: FaWhatsapp,
    href: "https://wa.me/8801979333880"
  }
];

export default function Contact() {
  return (
    <div id="contact" className="section-shell pt-20 pb-24 sm:pt-28 sm:pb-32">
      {/* Accessible h1 heading for screen readers & SEO without visible text */}
      <h1 className="sr-only">Book a meeting</h1>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Contact Info Cards (Left ~35% on Desktop, Stacks 2nd on Mobile) */}
        <div className="order-2 lg:order-1 lg:col-span-4 space-y-4">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#12A36B] font-semibold">
              Get In Touch
            </span>
            <p className="text-xs text-black/50 font-normal">
              Prefer a direct message? Reach out through any of these channels anytime.
            </p>
          </div>

          <div className="space-y-3">
            {contactCards.map(({ label, value, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-4 shadow-sm transition hover:border-[#1FB57A]/40 hover:shadow-md cursor-pointer group">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1FB57A]/10 text-[#12A36B] transition-transform group-hover:scale-110 flex-shrink-0">
                    <Icon className="text-lg" />
                  </div>

                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-black/40 font-bold">
                      {label}
                    </div>
                    <div className="mt-0.5 text-sm font-semibold text-[#1a1a1a] group-hover:text-[#12A36B] transition-colors truncate">
                      {value}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Quick FAQ / note card */}
          <div className="rounded-2xl border border-black/8 bg-white/70 p-5 shadow-sm space-y-2">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#1a1a1a]">
              What to expect
            </h3>
            <ul className="text-xs leading-relaxed text-black/60 space-y-1.5 list-disc list-inside">
              <li>30-minute Google Meet video consultation</li>
              <li>Project scope, tech stack & timeline discussion</li>
              <li>Free architecture advice & instant invite confirmation</li>
            </ul>
          </div>
        </div>

        {/* Cal.com Booking Calendar (Right ~65% on Desktop, Stacks 1st on Mobile) */}
        <div className="order-1 lg:order-2 lg:col-span-8">
          <BookingCalendar />
        </div>
      </div>
    </div>
  );
}
