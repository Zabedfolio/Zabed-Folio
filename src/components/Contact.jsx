'use client';

import BookingCalendar from "@/components/BookingCalendar";

export default function Contact() {
  return (
    <div id="contact" className="section-shell pt-16 pb-20 sm:pt-24 sm:pb-32">
      {/* Accessible h1 heading for screen readers & SEO without visible text */}
      <h1 className="sr-only">Book a meeting</h1>

      {/* Full-width responsive booking calendar */}
      <div className="w-full">
        <BookingCalendar />
      </div>
    </div>
  );
}
