import Navbar from "@/components/Navbar";
import PricingSection from "@/components/pricing/PricingSection";

export const metadata = {
  title: "Pricing & Packages — Zabed Mahmud",
  description:
    "Transparent fixed pricing for web development, custom Next.js applications, e-commerce stores, and landing pages.",
};

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-[#eeeeee] text-[#1a1a1a] selection:bg-[#1FB57A]/20">
      <Navbar />
      <main className="relative z-10 pt-6 md:pl-16">
        <PricingSection />
      </main>
    </div>
  );
}

