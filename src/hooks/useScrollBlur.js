'use client';

import { useMemo } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";

export function useScrollBlur({ ref, maxBlur = 14 }) {
  const reducedMotion = useReducedMotion();

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768 || window.matchMedia("(hover: none)").matches;
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const blur = useTransform(
    scrollYProgress,
    [0.5, 1],
    reducedMotion || isMobile ? ["blur(0px)", "blur(0px)"] : ["blur(0px)", `blur(${maxBlur}px)`]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0.4, 0.95],
    reducedMotion ? [1, 0.6] : [1, isMobile ? 0.5 : 0.2]
  );

  const scale = useTransform(
    scrollYProgress,
    [0.5, 1],
    reducedMotion || isMobile ? [1, 1] : [1, 0.95]
  );

  const y = useTransform(
    scrollYProgress,
    [0.5, 1],
    reducedMotion || isMobile ? [0, 0] : [0, -30]
  );

  return { blur, opacity, scale, y, scrollYProgress, isMobile, reducedMotion };
}
