export const baseEase = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { y: 40, opacity: 0, filter: "blur(4px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: baseEase }
  }
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
};

export const slideLeft = {
  hidden: { x: -50, opacity: 0, filter: "blur(4px)" },
  show: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: baseEase }
  }
};

export const slideRight = {
  hidden: { x: 50, opacity: 0, filter: "blur(4px)" },
  show: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: baseEase }
  }
};

export const scaleIn = {
  hidden: { scale: 0.85, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: baseEase }
  }
};
