'use client';

import { motion } from "framer-motion";
import { useRef } from "react";
import { useScrollBlur } from "@/hooks/useScrollBlur";

export default function ScrollBlurSection({ children, className = "", maxBlur = 14 }) {
  const ref = useRef(null);
  const { blur, opacity, scale, y } = useScrollBlur({ ref, maxBlur });

  return (
    <motion.section
      ref={ref}
      style={{
        filter: blur,
        opacity,
        scale,
        y,
        transformOrigin: "center top",
        willChange: "filter, transform, opacity"
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
