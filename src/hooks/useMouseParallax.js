'use client';

import { useEffect, useMemo } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function useMouseParallax() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const mouseX = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.8 });
  const mouseY = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.8 });

  const isInteractive = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia("(hover: none)").matches;
  }, []);

  useEffect(() => {
    if (!isInteractive) return undefined;

    const handleMove = (event) => {
      const nextX = event.clientX / window.innerWidth - 0.5;
      const nextY = event.clientY / window.innerHeight - 0.5;
      rawX.set(nextX);
      rawY.set(nextY);
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [isInteractive, rawX, rawY]);

  return { mouseX, mouseY, isInteractive };
}
