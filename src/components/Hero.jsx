'use client';

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import avtr from "@/assets/avtr.png"
import Link from "next/link";

const socialLinks = [
  { href: "https://github.com/Zabedfolio", icon: FaGithub, label: "GitHub" },
  { href: "https://www.linkedin.com/in/zabedfolio/", icon: FaLinkedinIn, label: "LinkedIn" },
  // { href: "https://twitter.com", icon: FaTwitter, label: "Twitter" },
  { href: "https://www.facebook.com/profile.php?id=61585623848571", icon: FaFacebookF, label: "Facebook" },
  { href: "https://www.instagram.com/zaabed_maahmud/", icon: FaInstagram, label: "Instagram" }
];

const marqueeItems = ["REACT", "VERCEL", "NEXT.JS", "BETTER AUTH", "FIGMA", "MONGODB", "NODEJS", "FRAMER MOTION", "HERO UI", "DAISY UI", "GRAVITY UI"];

export default function Hero() {
  const heroRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const blur = useTransform(scrollYProgress, [0, 0.7], reducedMotion ? ["blur(0px)", "blur(0px)"] : ["blur(0px)", "blur(20px)"]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.7], reducedMotion ? [1, 1] : [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.7], reducedMotion ? [0, 0] : [0, -60]);

  const badgeBlur = useTransform(scrollYProgress, [0.1, 0.5], reducedMotion ? ["blur(0px)", "blur(0px)"] : ["blur(0px)", "blur(16px)"]);
  const headlineBlur = useTransform(scrollYProgress, [0.2, 0.65], reducedMotion ? ["blur(0px)", "blur(0px)"] : ["blur(0px)", "blur(14px)"]);
  const subBlur = useTransform(scrollYProgress, [0.3, 0.75], reducedMotion ? ["blur(0px)", "blur(0px)"] : ["blur(0px)", "blur(10px)"]);
  const buttonsBlur = useTransform(scrollYProgress, [0.4, 0.85], reducedMotion ? ["blur(0px)", "blur(0px)"] : ["blur(0px)", "blur(8px)"]);

  return (
    <section ref={heroRef} className="relative z-10 flex min-h-[100dvh] items-center">
      <div className="section-shell">
        <motion.div style={{ filter: blur, opacity, scale, y }} className="mx-auto max-w-5xl text-center">
          <motion.div
            style={{ filter: badgeBlur }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 inline-flex items-center gap-3 rounded-full border border-[#ff4d00]/20 bg-[#ff4d00]/[0.08] px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-white/75"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff4d00]/70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#ff4d00]" />
            </span>
            Still Learning · May 2026
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-8 w-fit rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-2 shadow-accent-glow"
          >
            <motion.div
              animate={reducedMotion ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-28 w-28 overflow-hidden rounded-2xl"
            >
              <Image
                src={avtr}
                alt="Developer portrait"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.div>

          <motion.div style={{ filter: headlineBlur }} className="space-y-2">
            <h1 className="text-[clamp(3.5rem,8vw,6.9rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white">
              <motion.span initial={{ y: 60, opacity: 0, filter: "blur(8px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} className="block">
                I Build for
              </motion.span>
              <motion.span
                initial={{ y: 60, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.08 }}
                className="block bg-gradient-to-r from-white via-[#ff4d00] to-[#ff8c00] bg-clip-text text-transparent"
              >
                Excellence.
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            style={{ filter: subBlur }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/60 sm:text-xl"
          >
            Not just code. Craft. I build frontend experiences that perform as hard as they look — immersive, precise, and built to last.
          </motion.p>

          <motion.div
            style={{ filter: buttonsBlur }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.a
              href="#projects"
              whileHover={reducedMotion ? {} : { x: 10, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-[#ff4d00]/20 bg-[#ff4d00] px-7 py-4 text-sm font-medium text-white shadow-accent-glow"
            >
              View My Work
            </motion.a>
            <motion.a
              href="/resume.pdf"
              download
              whileHover={reducedMotion ? {} : { x: -6 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-white/15 bg-white/[0.03] px-7 py-4 text-sm font-medium text-white/80 backdrop-blur-xl"
            >
              Download Resume
            </motion.a>
            <motion.div
              whileHover={reducedMotion ? {} : { y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/more-about-page"
                className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-7 py-4 text-sm font-medium text-white/90 backdrop-blur-xl transition hover:bg-white/[0.1]"
              >
                More About Me
              </Link>
              
            </motion.div>
          </motion.div>

          <div className="mt-10 flex items-center justify-center gap-3">
            {socialLinks?.map(({ href, icon: Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                whileHover={reducedMotion ? {} : { y: -4, borderColor: "rgba(255,77,0,0.3)" }}
                className="rounded-full border border-white/10 bg-white/[0.03] p-3 text-white/60 transition hover:text-white"
              >
                <Icon />
              </motion.a>
            ))}
          </div>

          <div className="mt-16 overflow-hidden border-y border-white/10 py-5">
            <motion.div
              animate={reducedMotion ? {} : { x: ["0%", "-50%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="flex min-w-max gap-10 font-mono text-xs uppercase tracking-[0.3em] text-white/30"
            >
              {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </motion.div>
          </div>

          <motion.a
            href="#about"
            animate={reducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="mx-auto mt-10 flex w-fit flex-col items-center gap-2 text-white/35"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.24em]">Scroll</span>
            <FiChevronDown className="text-xl" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
