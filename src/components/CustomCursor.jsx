'use client';

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ringX = useSpring(x, { stiffness: 150, damping: 20 });
  const ringY = useSpring(y, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    setEnabled(!isCoarse);
    if (isCoarse) return undefined;

    const handleMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };

    const handleMouseOver = (event) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        setHovered(Boolean(target.closest("a, button")));
      }
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("pointerleave", handleLeave);
    };
  }, [ringX, ringY, x, y]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <motion.span
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hovered ? 0 : 1, opacity: visible ? (hovered ? 0 : 1) : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-[#ff4d00]"
      />
      <motion.span
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: hovered ? 2.5 : 1,
          opacity: visible ? 1 : 0,
          backgroundColor: hovered ? "rgba(255,77,0,0.1)" : "rgba(255,77,0,0)",
          borderColor: hovered ? "rgba(255,77,0,0.6)" : "rgba(255,77,0,0.4)"
        }}
        className="pointer-events-none fixed left-0 top-0 z-[99] h-8 w-8 rounded-full border"
      />
    </>
  );
}
