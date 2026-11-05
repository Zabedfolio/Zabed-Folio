import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";

export const metadata = {
  title: "Book 30 Min Meeting — Zabed Mahmud",
  description: "Schedule a 30-minute consultation with Zabed Mahmud to discuss full-stack projects, architecture, or tech collaborations.",
};

export default function BookingPage() {
  return (
    <div className="relative min-h-screen bg-[#eeeeee] text-[#1a1a1a] selection:bg-[#1FB57A]/20">
      <Navbar />
      <main className="relative z-10 pt-6 md:pl-16">
        <Contact />
      </main>
    </div>
  );
}

