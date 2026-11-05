'use client';

import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { HiOutlineCalendar, HiOutlineExternalLink } from "react-icons/hi";

export default function BookingCalendar() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const calLink = process.env.NEXT_PUBLIC_CAL_LINK || "zabed-mahmud/30min";
  const directCalUrl = `https://cal.com/${calLink}`;

  useEffect(() => {
    let isMounted = true;

    async function initCal() {
      try {
        const cal = await getCalApi({ namespace: "30min" });
        if (isMounted && cal) {
          cal("ui", {
            theme: "light",
            hideEventTypeDetails: false,
            layout: "month_view",
            cssVarsPerTheme: {
              light: { "cal-brand": "#12A36B" },
              dark: { "cal-brand": "#12A36B" },
            },
          });
        }
      } catch (err) {
        console.error("Cal.com embed init error:", err);
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          // Allow a brief moment for the iframe to mount smoothly
          const timer = setTimeout(() => setIsLoading(false), 500);
          return () => clearTimeout(timer);
        }
      }
    }

    initCal();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl border border-black/8 bg-white p-2 sm:p-5 md:p-6 shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Responsive height wrapper: 720px on mobile for full slot list, 700px on desktop */}
      <div className="relative w-full h-[720px] sm:h-[700px] overflow-hidden rounded-xl sm:rounded-2xl">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm p-6 text-center space-y-4 animate-pulse">
            <div className="h-12 w-12 rounded-2xl bg-[#12A36B]/10 text-[#12A36B] flex items-center justify-center">
              <HiOutlineCalendar className="h-6 w-6 animate-spin" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-[#1a1a1a]">Loading booking calendar...</p>
              <p className="text-xs text-black/40">Connecting with Google Calendar & Google Meet</p>
            </div>
          </div>
        )}

        {/* Fallback if embed encounters an error */}
        {hasError ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 sm:p-8 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-black/5 text-[#12A36B] flex items-center justify-center">
              <HiOutlineCalendar className="h-7 w-7" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-base font-bold text-[#1a1a1a]">Calendar failed to load</h3>
              <p className="text-xs text-black/50">
                You can still book directly on my Cal.com scheduling page.
              </p>
            </div>
            <a
              href={directCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1FB57A] to-[#12A36B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#12A36B]/25 hover:from-[#19A36D] hover:to-[#0E8A5A] transition"
            >
              <span>Open booking page</span>
              <HiOutlineExternalLink className="text-sm" />
            </a>
          </div>
        ) : (
          <Cal
            namespace="30min"
            calLink={calLink}
            config={{ layout: "month_view", theme: "light" }}
            style={{ width: "100%", height: "100%", minHeight: "100%", overflow: "auto" }}
          />
        )}
      </div>

      {/* Responsive Footer Note */}
      <div className="mt-3 pt-3 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-black/40 px-2 text-center sm:text-left">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#12A36B] animate-pulse" />
          <span>Real-time availability synced with Google Calendar</span>
        </span>
        <a
          href={directCalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#12A36B] transition-colors inline-flex items-center gap-1 font-semibold"
        >
          Direct link ↗
        </a>
      </div>
    </div>
  );
}
