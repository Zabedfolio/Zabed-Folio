'use client';

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
} from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import avtr from '@/assets/avtr.png';
import Link from 'next/link';

const socialLinks = [
  {
    href: 'https://github.com/Zabedfolio',
    icon: FaGithub,
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/zabedfolio/',
    icon: FaLinkedinIn,
    label: 'LinkedIn',
  },
  {
    href: 'https://www.facebook.com/profile.php?id=61585623848571',
    icon: FaFacebookF,
    label: 'Facebook',
  },
  {
    href: 'https://www.instagram.com/zaabed_maahmud/',
    icon: FaInstagram,
    label: 'Instagram',
  },
];

const marqueeItems = [
  'REACT',
  'VERCEL',
  'NEXT.JS',
  'BETTER AUTH',
  'FIGMA',
  'MONGODB',
  'NODEJS',
  'FRAMER MOTION',
  'HERO UI',
  'DAISY UI',
  'GRAVITY UI',
];

export default function Hero() {
  const heroRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const blur = useTransform(
    scrollYProgress,
    [0, 0.7],
    reducedMotion
      ? ['blur(0px)', 'blur(0px)']
      : ['blur(0px)', 'blur(20px)']
  );

  const opacity = useTransform(scrollYProgress, [0.1, 0.8], [1, 0]);

  const scale = useTransform(
    scrollYProgress,
    [0, 0.7],
    reducedMotion ? [1, 1] : [1, 0.9]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.7],
    reducedMotion ? [0, 0] : [0, -60]
  );

  return (
    <section
      ref={heroRef}
      className="relative z-10 flex min-h-screen items-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <div className="section-shell w-full">
        <motion.div
          style={{ filter: blur, opacity, scale, y }}
          className="mx-auto max-w-6xl text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 sm:gap-3 rounded-full border border-[#ff4d00]/20 bg-[#ff4d00]/[0.08] px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.24em] text-white/75"
          >
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff4d00]/70" />
              <span className="relative inline-flex h-full w-full rounded-full bg-[#ff4d00]" />
            </span>
            Still Learning · May 2026
          </motion.div>

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mx-auto mb-8 w-fit rounded-[1.5rem] sm:rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-2 shadow-accent-glow"
          >
            {/* Handwritten Arrow */}
            <div className="absolute hidden lg:flex top-1/2 -right-32 -translate-y-1/2 flex-col items-center">
              <span className="text-sm text-white/70 italic font-[Imperial Script] rotate-[-6deg] whitespace-nowrap">
                Take a Look <br /> at My Journey
              </span>

              <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                className="text-white/70"
                fill="none"
              >
                <path
                  d="M90 10 C 40 10, 40 80, 10 80"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <path
                  d="M10 80 L18 72 M10 80 L18 88"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <motion.div
              animate={reducedMotion ? {} : { y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 overflow-hidden rounded-2xl cursor-pointer"
            >
              <Link href="https://zabedfolio.vercel.app/more-about-page">
                <Image
                  src={avtr}
                  alt="Developer portrait"
                  fill
                  className="object-cover"
                  priority
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Headline */}
          <div className="space-y-1 sm:space-y-2">
            <motion.h1 className="font-extrabold leading-[0.9] tracking-[-0.05em] text-white">
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="block text-[3rem] xs:text-[3.6rem] sm:text-[4.8rem] md:text-[6rem] lg:text-[7rem]"
              >
                I Build for
              </motion.span>

              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08 }}
                className="block text-[3rem] xs:text-[3.6rem] sm:text-[4.8rem] md:text-[6rem] lg:text-[7rem] bg-gradient-to-r from-white via-[#ff4d00] to-[#ff8c00] bg-clip-text text-transparent"
              >
                Excellence.
              </motion.span>
            </motion.h1>
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 sm:mt-8 max-w-3xl px-2 text-base leading-7 text-white/60 sm:text-lg sm:leading-8 md:text-xl"
          >
            Not just code. Craft. I build frontend experiences that
            perform as hard as they look — immersive, precise, and built
            to last.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <motion.a
              href="#projects"
              whileHover={reducedMotion ? {} : { y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto rounded-full border border-[#ff4d00]/20 bg-[#ff4d00] px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-medium text-white shadow-accent-glow"
            >
              View My Work
            </motion.a>

            <motion.a
              href="/resume.pdf"
              download
              whileHover={reducedMotion ? {} : { y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto rounded-full border border-white/15 bg-white/[0.03] px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-medium text-white/80 backdrop-blur-xl"
            >
              Download Resume
            </motion.a>
          </motion.div>

          {/* Socials */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                whileHover={reducedMotion ? {} : { y: -4 }}
                className="rounded-full border border-white/10 bg-white/[0.03] p-3 text-white transition hover:text-white"
              >
                <Icon className="text-sm sm:text-base" />
              </motion.a>
            ))}
          </div>

          {/* Marquee */}
          <div className="mt-14 sm:mt-16 overflow-hidden border-y border-white/10 py-4 sm:py-5">
            <motion.div
              animate={reducedMotion ? {} : { x: ['0%', '-50%'] }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="flex min-w-max gap-6 sm:gap-10 font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.3em] text-white/30"
            >
              {[...marqueeItems, ...marqueeItems].map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </motion.div>
          </div>

          {/* Scroll */}
          <motion.a
            href="#about"
            animate={reducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
            }}
            className="mx-auto mt-8 sm:mt-10 flex w-fit flex-col items-center gap-2 text-white/35"
          >
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em]">
              Scroll
            </span>

            <FiChevronDown className="text-lg sm:text-xl" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}