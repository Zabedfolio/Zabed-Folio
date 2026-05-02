import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Timeline from "@/components/Timeline";
import ParallaxCanvas from "@/components/background/ParallaxCanvas";
import ScrollBlurProvider from "@/components/scroll/ScrollBlurProvider";
import ScrollBlurSection from "@/components/scroll/ScrollBlurSection";

export default function HomePage() {
  return (
    <ScrollBlurProvider>
      <div className="relative min-h-screen bg-transparent text-white">
        <ParallaxCanvas />
        <Navbar />
        <main className="relative z-10">
          <Hero />
          <ScrollBlurSection>
            <About />
          </ScrollBlurSection>
          <ScrollBlurSection>
            <Skills />
          </ScrollBlurSection>
          <ScrollBlurSection>
            <Process />
          </ScrollBlurSection>
          <ScrollBlurSection>
            <Projects />
          </ScrollBlurSection>
          <ScrollBlurSection>
            <Timeline />
          </ScrollBlurSection>
          <ScrollBlurSection maxBlur={8}>
            <Contact />
          </ScrollBlurSection>
        </main>
        <Footer />
      </div>
    </ScrollBlurProvider>
  );
}