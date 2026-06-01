'use client';

import Image from 'next/image';
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaArrowUp,
} from 'react-icons/fa';

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
  ];

  return (
    <footer className="relative overflow-hidden bg-[#050505] pt-40">
      {/* Top Shape */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          className="h-[80px] w-full fill-[#080808]"
          preserveAspectRatio="none"
        >
          <path d="M0,96L120,85.3C240,75,480,53,720,53.3C960,53,1200,75,1320,85.3L1440,96L1440,0L0,0Z" />
        </svg>
      </div>

      {/* Background Text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <h2 className="text-[18vw] font-black uppercase tracking-tighter text-white/[0.03]">
          ZABED
        </h2>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-10">
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
          {/* Glow */}
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#ff4d00]/20 blur-[120px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 grid gap-12 p-8 md:p-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            {/* Left */}
            <div>
              <div className="mb-8 flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#ff4d00]">
                    Available For Work
                  </p>

                  <h3 className="mt-1 text-3xl font-bold text-white md:text-5xl">
                    Let&apos;s Build Something Remarkable
                  </h3>
                </div>
              </div>

              <p className="max-w-xl text-base leading-relaxed text-white/70">
                Frontend developer focused on crafting premium digital
                experiences with React, Next.js and modern UI engineering.
                Building products that feel as good as they look.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="mailto:zabedfolio@gmail.com"
                  className="rounded-full bg-[#ff4d00] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
                >
                  Start a Project
                </a>

                <a
                  href="/resume.pdf"
                  download
                  className="rounded-full border border-white/10 px-8 py-4 text-sm font-medium text-white/80 transition-all duration-300 hover:border-[#ff4d00]/50 hover:text-white"
                >
                  Download Resume
                </a>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col items-start lg:items-end">
              <span className="mb-5 text-xs uppercase tracking-[0.35em] text-white/30">
                CONNECT
              </span>

              <div className="flex flex-wrap gap-3">
                {socials.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-full border border-white/10 px-5 py-3 text-white/80 transition-all duration-300 hover:border-[#ff4d00]/50 hover:bg-[#ff4d00]/10 hover:text-white"
                    >
                      <Icon className="text-sm transition-transform duration-300 group-hover:rotate-12" />
                      <span className="text-sm">{social.name}</span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-10 rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
                <p className="text-6xl font-bold text-white">20+</p>
                <span className="mt-2 block text-sm text-white/50">
                  Projects Completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <p className="text-white/40">
            © {new Date().getFullYear()} Zabed Mahmud. Crafted with precision.
          </p>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
            className="group flex items-center gap-2 self-start text-white/40 transition-colors hover:text-[#ff4d00]"
          >
            <FaArrowUp className="transition-transform duration-300 group-hover:-translate-y-1" />
            Back To Top
          </button>
        </div>
      </div>
    </footer>
  );
}