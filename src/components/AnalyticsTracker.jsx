'use client';

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef(null);

  useEffect(() => {
    // Never track admin panel or internal API routes
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Prevent duplicate triggers for the exact same path in the same state
    if (lastTracked.current === pathname) {
      return;
    }
    lastTracked.current = pathname;

    try {
      // Session ID: Random UUID stored per browser session to count unique visitors
      let sid = sessionStorage.getItem("za_sid");
      if (!sid) {
        sid = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem("za_sid", sid);
      }

      // Categorize Referrer
      let ref = "Direct";
      if (typeof document !== "undefined" && document.referrer) {
        const raw = document.referrer.toLowerCase();
        if (raw.includes("linkedin.")) ref = "LinkedIn";
        else if (raw.includes("github.")) ref = "GitHub";
        else if (raw.includes("t.co") || raw.includes("twitter.") || raw.includes("x.com")) ref = "Twitter / X";
        else if (raw.includes("google.")) ref = "Google";
        else if (raw.includes("facebook.") || raw.includes("fb.")) ref = "Facebook";
        else if (raw.includes("whatsapp.")) ref = "WhatsApp";
        else if (raw.includes("instagram.")) ref = "Instagram";
        else {
          try {
            ref = new URL(document.referrer).hostname.replace(/^www\./, "");
          } catch {
            ref = "Other";
          }
        }
      }

      // Check URL parameters for campaign tracking e.g. ?ref=linkedin
      if (typeof window !== "undefined" && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const queryRef = params.get("ref") || params.get("source") || params.get("utm_source");
        if (queryRef) {
          ref = queryRef.charAt(0).toUpperCase() + queryRef.slice(1);
        }
      }

      // Determine Device Type
      const isMobile =
        (typeof window !== "undefined" && window.innerWidth < 768) ||
        (typeof navigator !== "undefined" && /Mobi|Android|iPhone/i.test(navigator.userAgent));
      const device = isMobile ? "Mobile" : "Desktop";

      // Non-blocking fire-and-forget beacon
      fetch("/api/public/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: ref,
          device,
          sessionId: sid,
          timestamp: new Date().toISOString(),
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Fails silently without interrupting user experience
    }
  }, [pathname]);

  return null;
}
