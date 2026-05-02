'use client';

import { useScroll, useTransform } from "framer-motion";

export function useScrollParallax() {
  const { scrollY } = useScroll();
  return { scrollY };
}

export function useParallax(value, inputRange, outputRange) {
  return useTransform(value, inputRange, outputRange);
}
