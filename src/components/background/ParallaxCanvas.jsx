'use client';

import { motion, useTransform } from "framer-motion";
import { useScrollParallax } from "@/hooks/useScrollParallax";
import GlowBlobs from "./GlowBlobs";
import GridOverlay from "./GridOverlay";
import NoiseOverlay from "./NoiseOverlay";
import ParticleField from "./ParticleField";

export default function ParallaxCanvas() {
  const { scrollY } = useScrollParallax();
  const overlayOpacity = useTransform(scrollY, [0, 150], [0, 1]);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden [contain:paint]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_120%,#1a0800_0%,#0d0400_40%,#050505_100%)]" />
        <GridOverlay />
        <GlowBlobs />
        <ParticleField />
        <NoiseOverlay />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(5,5,5,0.6)_80%,rgba(5,5,5,0.95)_100%)]" />
      </div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="pointer-events-none fixed inset-x-0 top-0 z-20 h-52 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.85)_0%,rgba(5,5,5,0.4)_15%,transparent_35%)]"
      />
    </>
  );
}
