'use client';

import Image from 'next/image';
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaArrowUp,
} from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

export default function Footer() {
  const socials = [
    {
      name: 'GitHub',
      href: 'https://github.com/Zabedfolio',
      icon: FaGithub,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/zabedfolio/',
      icon: FaLinkedinIn,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/zaabed_maahmud/',
      icon: FaInstagram,
    },
    {
      name: 'LeetCode',
      href: 'https://leetcode.com/u/zabedfolio/',
      icon: SiLeetcode,
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#050505] pt-24 md:pt-40">
      {/* Top Shape */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          className="h-[60px] md:h-[80px] w-full fill-[#080808]"
          preserveAspectRatio="none"
        >
          <path d="M0,96L120,85.3C240,75,480,53,720,53.3C960,53,1200,75,1320,85.3L1440,96L1440,0L0,0Z" />
        </svg>
      </div>

      {/* Background Text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <h2 className="text-[28vw] md:text-[18vw] font-black uppercase tracking-tighter text-white/[0.03]">
          ZABED
        </h2>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-10">
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
          {/* Glow */}
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-24 md:-top-32 left-1/2 h-52 md:h-72 w-52 md:w-72 -translate-x-1/2 rounded-full bg-[#ff4d00]/20 blur-[100px] md:blur-[120px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 grid gap-10 md:gap-12 p-6 md:p-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">

            {/* Left */}
            <div>
              <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative h-14 w-14 md:h-16 md:w-16 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div>
                  <p className="text-xs md:text-sm font-medium uppercase tracking-[0.25em] md:tracking-[0.3em] text-[#ff4d00]">
                    Available For Work
                  </p>

                  <h3 className="mt-1 text-2xl md:text-5xl font-bold text-white leading-tight">
                    Let&apos;s Build Something Remarkable
                  </h3>
                </div>
              </div>

              {/* FIX: inline style used to override any global/parent color inheritance */}
              <p
                className="max-w-xl text-sm md:text-base leading-relaxed"
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                Frontend developer focused on crafting premium digital
                experiences with React, Next.js and modern UI engineering.
                Building products that feel as good as they look.
              </p>

              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                <a
                  href="mailto:zabedfolio@gmail.com"
                  className="rounded-full bg-[#ff4d00] px-6 md:px-8 py-3 md:py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 text-center"
                >
                  Start a Project
                </a>

                <a
                  href="/resume.pdf"
                  download
                  className="rounded-full border border-white/10 px-6 md:px-8 py-3 md:py-4 text-sm font-medium text-white/80 transition-all duration-300 hover:border-[#ff4d00]/50 hover:text-white text-center"
                >
                  Download Resume
                </a>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col items-start lg:items-end">
              <span className="mb-4 md:mb-5 text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.35em] text-white/30">
                CONNECT
              </span>

              <div className="flex flex-wrap justify-start lg:justify-end gap-3">
                {socials.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 md:gap-3 rounded-full border border-white/10 px-4 md:px-5 py-2 md:py-3 text-white/80 transition-all duration-300 hover:border-[#ff4d00]/50 hover:bg-[#ff4d00]/10 hover:text-white"
                    >
                      <Icon className="text-xs md:text-sm transition-transform duration-300 group-hover:rotate-12" />
                      <span className="text-xs md:text-sm">{social.name}</span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-8 md:mt-10 w-full lg:w-auto rounded-3xl border border-white/10 bg-black/30 p-6 md:p-8 backdrop-blur-xl text-left lg:text-right">
                <p className="text-4xl md:text-6xl font-bold text-white">
                  20+
                </p>
                <span className="mt-2 block text-xs md:text-sm text-white/50">
                  Projects Completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 md:mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 md:pt-6 text-xs md:text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Zabed Mahmud. Crafted with precision.
          </p>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
            className="group flex items-center justify-center md:justify-start gap-2 transition-colors hover:text-[#ff4d00]"
          >
            <FaArrowUp className="transition-transform duration-300 group-hover:-translate-y-1" />
            Back To Top
          </button>
        </div>
      </div>
    </footer>
  );
}