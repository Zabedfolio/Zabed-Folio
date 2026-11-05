import About from "@/components/About";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#eeeeee] text-[#1a1a1a] selection:bg-[#1FB57A]/20">
      <Navbar />
      <main className="relative z-10 md:pl-16">
        <About />
      </main>
    </div>
  );
}