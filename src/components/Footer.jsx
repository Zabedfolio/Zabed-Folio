'use client';

import { useEffect, useRef, useState } from 'react';

const navLinks = [
  { href: '#about',     label: 'About' },
  { href: '#skills',    label: 'Skills' },
  { href: '#projects',  label: 'Projects' },
];

const workLinks = [
  { href: '#education', label: 'Timeline' },
  { href: '#contact',   label: 'Contact' },
  { href: '/resume.pdf',label: 'Resume', download: true },
];

const connectLinks = [
  { href: 'https://github.com/Zabedfolio',              label: 'GitHub',              external: true },
  { href: 'https://www.linkedin.com/in/zabedfolio/',    label: 'LinkedIn',            external: true },
  { href: 'https://www.instagram.com/zaabed_maahmud/',  label: 'Instagram',           external: true },
  { href: 'mailto:zabedfolio@gmail.com',                label: 'zabedfolio@gmail.com' },
];

/* ─── Animated name row ─────────────────────────────────────── */
function NameRow({ word, triggered, rowClass = '', staggerBase = 0 }) {
  return (
    <div className={`footer-name-row ${rowClass}`} aria-label={word} aria-hidden="true">
      {word.split('').map((char, i) => (
        <span
          key={i}
          className={`footer-letter ${triggered ? 'footer-letter--go' : ''}`}
          style={{ '--d': `${staggerBase + i * 80}ms` }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

/* ─── Link column helper ────────────────────────────────────── */
function LinkCol({ label, links }) {
  return (
    <div>
      <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.26em] text-white/[0.22]">
        {label}
      </p>
      {links.map(({ href, label: text, external, download }) => (
        <a
          key={href}
          href={href}
          download={download || undefined}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          className="footer-a mb-1.5 block font-mono text-[13px] text-white/50"
        >
          {text}
        </a>
      ))}
    </div>
  );
}

/* ─── Main Footer ───────────────────────────────────────────── */
export default function Footer() {
  const blockRef = useRef(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { setTriggered(true); return; }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setTriggered(true); io.disconnect(); }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        .footer-dots {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .footer-name-row {
          display: flex;
          line-height: 0.82;
          padding: 0 2rem;
          overflow: hidden;
        }

        .footer-letter {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(88px, 18.5vw, 200px);
          color: rgba(255,255,255,0.07);
          display: inline-block;
          opacity: 0;
          letter-spacing: -0.01em;
          user-select: none;
          will-change: transform, opacity;
        }

        .row-mahmud .footer-letter {
          color: rgba(255,77,0,0.12);
        }

        .footer-letter--go {
          animation: fl1 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: var(--d);
        }

        .row-mahmud .footer-letter--go {
          animation-name: fl2;
        }

        @keyframes fl1 {
          0%   { opacity: 1; color: #ff4d00;               transform: translateY(10px); }
          55%  { color: rgba(255,255,255,0.07); }
          100% { opacity: 1; color: rgba(255,255,255,0.07); transform: translateY(0); }
        }

        @keyframes fl2 {
          0%   { opacity: 1; color: #ff8c00;               transform: translateY(10px); }
          55%  { color: rgba(255,77,0,0.12); }
          100% { opacity: 1; color: rgba(255,77,0,0.12);   transform: translateY(0); }
        }

        .footer-a {
          display: inline-block;
          transition: color 0.18s ease, padding-left 0.18s ease;
        }
        .footer-a:hover {
          color: #fff !important;
          padding-left: 5px;
        }

        @keyframes fp-ping {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50%       { transform: scale(2); opacity: 0; }
        }
      `}</style>

      <footer className="relative z-30 overflow-hidden border-t border-white/5 bg-[#050505]">

        {/* Dot grid */}
        <div className="footer-dots" />

        {/* Giant name */}
        <div ref={blockRef} className="pt-10">
          <NameRow word="ZABED"  rowClass="row-zabed"  triggered={triggered} staggerBase={0} />
          <NameRow word="MAHMUD" rowClass="row-mahmud" triggered={triggered} staggerBase={5 * 80 + 60} />
        </div>

        {/* Info bar */}
        

      </footer>
    </>
  );
}