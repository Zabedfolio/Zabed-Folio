'use client';

import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useScrollParallax } from "@/hooks/useScrollParallax";

function createParticles(count) {
  return Array.from({ length: count }, (_, index) => {
    const type = index % 3;
    return {
      id: index,
      type,
      left: `${(index * 7.7) % 100}%`,
      top: `${(index * 11.3) % 100}%`,
      duration: 4 + (index % 6),
      delay: (index % 5) * 0.4
    };
  });
}

export default function ParticleField() {
  const reducedMotion = useReducedMotion();
  const { mouseX, isInteractive } = useMouseParallax();
  const { scrollY } = useScrollParallax();
  const [count, setCount] = useState(40);
  const xDrift = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const emberScrollDrift = useTransform(scrollY, [0, 2000], [0, -120]);
  const streakScrollDrift = useTransform(scrollY, [0, 2000], [0, -60]);
  const emberFade = useTransform(scrollY, [0, 600], [1, 0.5]);
  const ambientFade = useTransform(scrollY, [0, 600], [1, 0.9]);

  useEffect(() => {
    if (window.innerWidth < 768 || window.matchMedia("(hover: none)").matches) {
      setCount(12);
    }
  }, []);

  const particles = createParticles(count);

  return (
    <div className="absolute inset-0">
      {particles.map((particle) => {
        if (particle.type === 0) {
          return (
            <motion.span key={particle.id} style={{ x: isInteractive ? xDrift : 0, y: emberScrollDrift, opacity: emberFade }}>
              <motion.span
                className="absolute rounded-full bg-gradient-to-r from-[#ff4d00] to-[#ff8c00]"
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: particle.id % 2 === 0 ? 4 : 2,
                  height: particle.id % 2 === 0 ? 4 : 2
                }}
                animate={
                  reducedMotion
                    ? { opacity: 0.35 }
                    : {
                        y: [0, -200],
                        x: [0, 10, -6, 4],
                        opacity: [0, 0.7, 0.7, 0]
                      }
                }
                transition={{
                  duration: reducedMotion ? 0.01 : particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeOut"
                }}
              />
            </motion.span>
          );
        }

        if (particle.type === 1) {
          return (
            <motion.span key={particle.id} style={{ opacity: ambientFade }}>
              <motion.span
                className="absolute h-px w-px rounded-full bg-white/70"
                style={{
                  left: particle.left,
                  top: particle.top
                }}
                animate={reducedMotion ? { opacity: 0.22 } : { opacity: [0.12, 0.4, 0.16] }}
                transition={{ duration: reducedMotion ? 0.01 : 12 + (particle.id % 8), repeat: Infinity }}
              />
            </motion.span>
          );
        }

        return (
          <motion.span key={particle.id} style={{ y: streakScrollDrift }}>
            <motion.span
              className="absolute h-8 w-px bg-gradient-to-b from-[#ff4d00]/40 to-transparent"
              style={{
                left: particle.left,
                top: particle.top
              }}
              animate={reducedMotion ? { opacity: 0.25 } : { y: [0, -300], opacity: [0, 0.6, 0] }}
              transition={{
                duration: reducedMotion ? 0.01 : 2 + (particle.id % 3),
                repeat: Infinity,
                delay: particle.delay
              }}
            />
          </motion.span>
        );
      })}
    </div>
  );
}
