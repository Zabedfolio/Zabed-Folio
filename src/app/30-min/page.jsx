import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";

export const metadata = {
  title: "Book a Free 30-Min Project Discovery Call — Zabed Mahmud",
  description:
    "A 30-minute conversation to explore your ideas, requirements, and potential project. We'll discuss your vision, tech stack, and timeline to see if we're a good fit. No pressure. Just clarity.",
  openGraph: {
    title: "Book a Free 30-Min Project Discovery Call — Zabed Mahmud",
    description:
      "A 30-minute conversation to explore your ideas, requirements, and potential project. No pressure. Just clarity.",
    url: "/30-min",
    images: [
      {
        url: "/30-min.png",
        width: 1200,
        height: 627,
        alt: "Book a 30-min call with Zabed Mahmud",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Free 30-Min Project Discovery Call — Zabed Mahmud",
    description:
      "A 30-minute conversation to explore your ideas, requirements, and potential project. No pressure. Just clarity.",
    images: ["/30-min.png"],
  },
};

export default function BookingPage() {
  return (
    <div className="relative min-h-screen bg-[#eeeeee] text-[#1a1a1a] selection:bg-[#1FB57A]/20">
      <Navbar />
      <main className="relative z-10 pt-12 sm:pt-16 md:pl-16">
        <Contact />
      </main>
    </div>
  );
}
