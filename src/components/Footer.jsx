'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ────────────────────────────────────────────────────────────
   DATA
──────────────────────────────────────────────────────────── */
const COLS = [
  {
    id: 'nav',
    label: 'Index',
    links: [
      { href: '#about',    text: 'About' },
      { href: '#skills',   text: 'Skills' },
      { href: '#projects', text: 'Projects' },
    ],
  },
  {
    id: 'work',
    label: 'Work',
    links: [
      { href: '#education',  text: 'Timeline' },
      { href: '#contact',    text: 'Contact' },
      { href: '/resume.pdf', text: 'Resume ↗', download: true },
    ],
  },
  {
    id: 'connect',
    label: 'Connect',
    links: [
      { href: 'https://github.com/Zabedfolio',             text: 'GitHub ↗',    external: true },
      { href: 'https://www.linkedin.com/in/zabedfolio/',   text: 'LinkedIn ↗',  external: true },
      { href: 'https://www.instagram.com/zaabed_maahmud/', text: 'Instagram ↗', external: true },
      { href: 'mailto:zabedfolio@gmail.com',               text: 'Email' },
    ],
  },
];

/* ────────────────────────────────────────────────────────────
   HOOKS
──────────────────────────────────────────────────────────── */
function useInView(threshold = 0.05) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight) { setVisible(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useScramble(text, active, delayMs = 0) {
  const [out, setOut] = useState(() => text.replace(/\S/g, '█'));
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&?';
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now() + delayMs;
    const duration = 900;
    const tick = (now) => {
      if (now < start) { raf = requestAnimationFrame(tick); return; }
      const t = Math.min((now - start) / duration, 1);
      const revealed = Math.floor(t * text.length * 1.4);
      setOut(
        text.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < revealed - 3) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('')
      );
      if (t < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, text, delayMs]);
  return out;
}

function useCounter(to, active, delayMs = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now() + delayMs;
    const dur = 1600;
    const tick = (now) => {
      if (now < start) { raf = requestAnimationFrame(tick); return; }
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      setVal(Math.round(ease * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to, delayMs]);
  return val;
}

/* ────────────────────────────────────────────────────────────
   SUB-COMPONENTS
──────────────────────────────────────────────────────────── */

// Cursor-reactive noise canvas
function NoiseCanvas({ active }) {
  const cvs = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(0);

  useEffect(() => {
    const el = cvs.current;
    if (!el || !active) return;
    const ctx = el.getContext('2d');
    let w = 0, h = 0;

    const resize = () => {
      const rect = el.getBoundingClientRect();
      w = el.width  = rect.width;
      h = el.height = rect.height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouse.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top)  / rect.height,
      };
    };
    el.parentElement?.addEventListener('mousemove', onMove);

    let frame = 0;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (frame++ % 3 !== 0) return; // ~20fps for noise
      if (!w || !h) return;
      const img = ctx.createImageData(w, h);
      const d = img.data;
      const mx = mouse.current.x, my = mouse.current.y;
      for (let i = 0; i < d.length; i += 4) {
        const px = (i / 4) % w;
        const py = Math.floor(i / 4 / w);
        const dist = Math.hypot(px / w - mx, py / h - my);
        const proximity = Math.max(0, 1 - dist * 2.5);
        const v = Math.random() * 255;
        const a = proximity * 18 + 4;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = a;
      }
      ctx.putImageData(img, 0, 0);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      el.parentElement?.removeEventListener('mousemove', onMove);
    };
  }, [active]);

  return (
    <canvas
      ref={cvs}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', display: 'block',
      }}
    />
  );
}

function Marquee() {
  const txt = 'Available for new projects · React · TypeScript · UI/UX Design · Front-end Engineering · ';
  const repeated = txt.repeat(4);
  return (
    <div style={{
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '10px 0',
      background: 'rgba(255,75,0,0.04)',
    }}>
      <div style={{ display: 'flex', width: 'max-content', animation: 'f-marquee 28s linear infinite' }}>
        {[repeated, repeated].map((t, i) => (
          <span key={i} style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: i === 0 ? 'rgba(255,95,0,0.5)' : 'rgba(255,255,255,0.12)',
            whiteSpace: 'nowrap',
            paddingRight: '2em',
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function Stat({ n, suffix, label, active, delay }) {
  const val = useCounter(n, active, delay);
  return (
    <div style={{
      opacity: active ? 1 : 0,
      transform: active ? 'none' : 'translateY(18px)',
      transition: `opacity .6s ${delay + 200}ms, transform .6s ${delay + 200}ms cubic-bezier(.22,1,.36,1)`,
    }}>
      <div style={{
        fontFamily: "'Bebas Neue', cursive",
        fontSize: 'clamp(36px, 5.5vw, 64px)',
        lineHeight: 1,
        color: '#ff4d00',
        letterSpacing: '-0.02em',
      }}>
        {val}{suffix}
      </div>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '9px',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
        marginTop: '5px',
      }}>
        {label}
      </div>
    </div>
  );
}

function LinkItem({ href, text, external, download, active, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{
      marginBottom: '10px',
      opacity: active ? 1 : 0,
      transform: active ? 'none' : 'translateX(-10px)',
      transition: `opacity .45s ${delay}ms, transform .45s ${delay}ms cubic-bezier(.22,1,.36,1)`,
    }}>
      <a
        href={href}
        download={download || undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontFamily: "'DM Mono', monospace",
          fontSize: '12px',
          color: hovered ? '#fff' : 'rgba(255,255,255,0.42)',
          textDecoration: 'none',
          transition: 'color .2s',
          position: 'relative',
          paddingBottom: '2px',
        }}
      >
        {/* Animated underline */}
        <span style={{
          position: 'absolute',
          bottom: 0, left: 0,
          height: '1px',
          background: '#ff4d00',
          width: hovered ? '100%' : '0%',
          transition: 'width .3s cubic-bezier(.22,1,.36,1)',
        }} />
        {text}
      </a>
    </div>
  );
}

function LinkColumn({ col, active, baseDelay }) {
  return (
    <div>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '9px',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.2)',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        opacity: active ? 1 : 0,
        transition: `opacity .5s ${baseDelay}ms`,
      }}>
        {col.label}
      </p>
      {col.links.map((l, i) => (
        <LinkItem
          key={l.href}
          {...l}
          active={active}
          delay={baseDelay + 60 + i * 55}
        />
      ))}
    </div>
  );
}

function BackToTop() {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: "'DM Mono', monospace",
        fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
        color: hovered ? '#ff4d00' : 'rgba(255,255,255,0.22)',
        transition: 'color .2s',
        padding: '4px 0',
      }}
    >
      <span style={{
        width: '22px', height: '22px',
        border: `1px solid ${hovered ? '#ff4d00' : 'rgba(255,255,255,0.18)'}`,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'transform .3s cubic-bezier(.22,1,.36,1), border-color .2s',
      }}>↑</span>
      Back to top
    </button>
  );
}

/* ────────────────────────────────────────────────────────────
   MAIN FOOTER
──────────────────────────────────────────────────────────── */
export default function Footer() {
  const { ref, visible } = useInView(0.05);
  const z1 = useScramble('ZABED',  visible, 80);
  const z2 = useScramble('MAHMUD', visible, 380);
  const [cursorX, setCursorX] = useState(50);
  const [cursorY, setCursorY] = useState(50);

  const onMouseMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setCursorX(((e.clientX - r.left) / r.width) * 100);
    setCursorY(((e.clientY - r.top)  / r.height) * 100);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        @keyframes f-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes f-lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes f-pulse-ring {
          0%, 100% { transform: scale(1); opacity: .6; }
          50%       { transform: scale(2.4); opacity: 0; }
        }
        @keyframes f-slideUp {
          from { opacity: 0; transform: translateY(40px) skewY(1.5deg); }
          to   { opacity: 1; transform: translateY(0) skewY(0); }
        }
        @keyframes f-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .footer-root ::selection {
          background: #ff4d00;
          color: #000;
        }
      `}</style>

      <footer
        ref={ref}
        onMouseMove={onMouseMove}
        className="footer-root"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#08080a',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Cursor-reactive noise */}
        <NoiseCanvas active={visible} />

        {/* Cursor spotlight */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: `radial-gradient(ellipse 45% 40% at ${cursorX}% ${cursorY}%, rgba(255,70,0,0.07) 0%, transparent 70%)`,
        }} />

        {/* Sweeping accent line */}
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #ff4d00 25%, #ff9500 55%, #ff4d00 80%, transparent 100%)',
          transformOrigin: 'left',
          animation: visible ? 'f-lineGrow 1.1s cubic-bezier(.22,1,.36,1) both .1s' : 'none',
          transform: visible ? undefined : 'scaleX(0)',
        }} />

        {/* ── GIANT NAME ── */}
        <div style={{ position: 'relative', zIndex: 1, paddingTop: '48px', overflow: 'hidden' }}>

          {/* ZABED row */}
          <div style={{
            display: 'flex', alignItems: 'baseline',
            paddingLeft: 'clamp(20px, 3vw, 48px)',
            paddingRight: 'clamp(20px, 3vw, 48px)',
            overflow: 'hidden',
          }}>
            <span style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 'clamp(80px, 17.5vw, 210px)',
              letterSpacing: '-0.025em',
              lineHeight: 0.88,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.1)',
              userSelect: 'none',
              animation: visible ? 'f-slideUp .9s cubic-bezier(.22,1,.36,1) both .05s' : 'none',
              opacity: visible ? undefined : 0,
            }}>
              {z1}
            </span>
            <span style={{
              marginLeft: 'auto',
              alignSelf: 'flex-end',
              paddingBottom: '0.8rem',
              fontFamily: "'DM Mono', monospace",
              fontSize: 'clamp(9px, 1.2vw, 13px)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.18)',
              animation: visible ? 'f-fadeIn .8s both 1.2s' : 'none',
              opacity: visible ? undefined : 0,
              whiteSpace: 'nowrap',
            }}>
              Portfolio · 2026
            </span>
          </div>

          {/* MAHMUD row — right-aligned for asymmetric tension */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: 'clamp(20px, 3vw, 48px)',
            paddingLeft: 'clamp(20px, 3vw, 48px)',
            overflow: 'hidden',
            marginTop: '-0.06em',
          }}>
            <span style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 'clamp(80px, 17.5vw, 210px)',
              letterSpacing: '-0.025em',
              lineHeight: 0.88,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,77,0,0.22)',
              userSelect: 'none',
              animation: visible ? 'f-slideUp .9s cubic-bezier(.22,1,.36,1) both .18s' : 'none',
              opacity: visible ? undefined : 0,
            }}>
              {z2}
            </span>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          margin: '48px clamp(20px,3vw,48px) 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '28px 0',
        }}>
          {[
            { n: 20,  suffix: '+', label: 'Projects built',      delay: 300 },
            { n: 6,   suffix: '+', label: 'Months learning experience',    delay: 420 },
            // { n: 100, suffix: '%', label: 'Client satisfaction', delay: 540 },
          ].map((s, i) => (
            <div key={i} style={{
              paddingLeft:  i === 0 ? 0 : 'clamp(16px,2.5vw,36px)',
              paddingRight: 'clamp(16px,2.5vw,36px)',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <Stat {...s} active={visible} />
            </div>
          ))}
        </div>

        {/* ── MARQUEE ── */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: '48px' }}>
          <Marquee />
        </div>

        {/* ── LINKS ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'clamp(24px, 4vw, 56px)',
          padding: 'clamp(28px,4vw,52px) clamp(20px,3vw,48px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {COLS.map((col, i) => (
            <LinkColumn key={col.id} col={col} active={visible} baseDelay={400 + i * 80} />
          ))}
        </div>

        {/* ── BOTTOM BAR ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '18px clamp(20px,3vw,48px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity .8s 1s',
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '10px', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.16)',
          }}>
            © 2026 Zabed Mahmud
          </span>

          {/* Pulsing availability badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <span style={{ position: 'relative', width: '8px', height: '8px', flexShrink: 0, display: 'inline-block' }}>
              <span style={{
                position: 'absolute', inset: '-3px', borderRadius: '50%',
                background: '#22c55e', opacity: 0.35,
                animation: 'f-pulse-ring 2.2s ease-in-out infinite',
              }} />
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#22c55e' }} />
            </span>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '10px', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
            }}>
              Open to work
            </span>
          </div>

          <BackToTop />
        </div>
      </footer>
    </>
  );
}