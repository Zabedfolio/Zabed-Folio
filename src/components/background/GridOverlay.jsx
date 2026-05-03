'use client';

import { motion, useTransform } from "framer-motion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useScrollParallax } from "@/hooks/useScrollParallax";

export default function GridOverlay() {
  const { scrollY } = useScrollParallax();
  const { mouseX } = useMouseParallax();

  const translateY = useTransform(scrollY, [0, 3000], [0, -400]);
  const blur = useTransform(scrollY, [0, 400], ["blur(0px)", "blur(3px)"]);
  const translateX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);

  return (
    <motion.div
      style={{ y: translateY, x: translateX, filter: blur }}
      className="absolute inset-x-0 bottom-[-12%] h-[62vh] opacity-70"
    >
      <svg
        className="bg-grid-tilt h-full w-full"
        viewBox="0 0 1600 800"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,77,0,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1600" height="800" fill="url(#grid-pattern)" />
      </svg>
    </motion.div>
  );
}
