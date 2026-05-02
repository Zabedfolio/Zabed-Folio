'use client';

import { motion, useTransform } from "framer-motion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useScrollParallax } from "@/hooks/useScrollParallax";

const blobs = [
  {
    className: "bottom-[-8rem] left-1/2 h-[600px] w-[900px] -translate-x-1/2",
    background:
      "radial-gradient(circle, rgba(255,77,0,0.35) 0%, rgba(255,100,0,0.15) 35%, transparent 70%)",
    duration: 12,
    xRange: [-20, 30, -10, 20, -20],
    yRange: [0, -30, 10, -20, 0],
    scaleRange: [1, 1.15, 0.95, 1.1, 1]
  },
  {
    className: "right-[-6rem] top-[5%] h-[500px] w-[600px]",
    background: "radial-gradient(circle, rgba(255,120,20,0.22) 0%, rgba(255,120,20,0.08) 45%, transparent 72%)",
    duration: 15,
    xRange: [0, -20, 10, -12, 0],
    yRange: [0, 10, -20, 14, 0],
    scaleRange: [1, 1.08, 0.95, 1.1, 1]
  },
  {
    className: "left-[-3rem] top-[8%] h-[350px] w-[400px]",
    background: "radial-gradient(circle, rgba(180,40,0,0.18) 0%, rgba(180,40,0,0.05) 40%, transparent 72%)",
    duration: 8,
    xRange: [0, 10, -12, 8, 0],
    yRange: [0, -12, 6, -8, 0],
    scaleRange: [1, 1.2, 1]
  },
  {
    className: "right-[8%] top-[38%] h-[300px] w-[300px]",
    background: "radial-gradient(circle, rgba(255,60,0,0.1) 0%, rgba(255,60,0,0.04) 40%, transparent 75%)",
    duration: 10,
    xRange: [0, 8, -6, 10, 0],
    yRange: [0, -10, 12, -4, 0],
    scaleRange: [1, 1.3, 1]
  },
  {
    className: "left-[10%] top-[48%] h-[200px] w-[500px]",
    background: "radial-gradient(circle, rgba(100,20,0,0.14) 0%, rgba(100,20,0,0.06) 45%, transparent 72%)",
    duration: 20,
    xRange: [0, -12, 8, -6, 0],
    yRange: [0, 12, -8, 6, 0],
    scaleRange: [1, 1.1, 0.96, 1.05, 1]
  }
];

export default function GlowBlobs() {
  const { scrollY } = useScrollParallax();
  const { mouseX, mouseY, isInteractive } = useMouseParallax();

  const heroOpacity = useTransform(scrollY, [0, 800], [0.35, 0.2]);
  const heroLift = useTransform(scrollY, [0, 600], [0, 80]);
  const parallaxStrong = useTransform(mouseX, [-0.5, 0.5], [-35, 35]);
  const parallaxReverse = useTransform(mouseX, [-0.5, 0.5], [25, -25]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {blobs.map((blob, index) => {
        return (
          <motion.div
            key={blob.className}
            style={{
              x: isInteractive ? (index % 2 === 0 ? parallaxStrong : parallaxReverse) : 0,
              y: index === 0 ? heroLift : isInteractive ? parallaxY : 0
            }}
          >
            <motion.div
              className={`absolute rounded-full ${blob.className}`}
              style={{
                background: blob.background,
                filter: "blur(80px)",
                mixBlendMode: "screen",
                opacity: index === 0 ? heroOpacity : undefined
              }}
              animate={{
                x: blob.xRange,
                y: blob.yRange,
                scale: blob.scaleRange
              }}
              transition={{
                duration: blob.duration,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
