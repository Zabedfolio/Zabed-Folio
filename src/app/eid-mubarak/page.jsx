'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const FIREWORK_COLORS = [
  '255, 214, 102',
  '255, 244, 184',
  '124, 243, 255',
  '255, 160, 122',
  '194, 143, 255',
  '120, 255, 184',
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function makeStars(width, height) {
  const total = Math.max(80, Math.floor((width * height) / 22000));
  return Array.from({ length: total }, () => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.75,
    r: Math.random() * 1.7 + 0.3,
    base: Math.random() * 0.6 + 0.2,
    speed: Math.random() * 0.9 + 0.2,
    phase: Math.random() * Math.PI * 2,
  }));
}

function spawnBurst(width, height, x, y, sparksRef, amount = 72) {
  const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
  const count = amount + Math.floor(Math.random() * 26);
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.18;
    const speed = 1.5 + Math.random() * 5.8;
    sparksRef.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 70 + Math.floor(Math.random() * 26),
      age: 0,
      size: Math.random() * 2.2 + 0.8,
      color,
      gravity: 0.055 + Math.random() * 0.03,
      drag: 0.985 + Math.random() * 0.008,
      glow: 10 + Math.random() * 16,
    });
  }
}

function createTextParticles(message, width, height) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  const sampleW = 1600;
  const sampleH = 680;
  canvas.width = sampleW;
  canvas.height = sampleH;

  ctx.clearRect(0, 0, sampleW, sampleH);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 228, 144, 0.95)';
  ctx.shadowBlur = 18;

  const lines = ['Eid Mubarak', message];
  const line1Size = clamp(102 - message.length * 0.35, 74, 104);
  const line2Size = clamp(92 - message.length * 1.15, 52, 84);

  ctx.font = `900 ${line1Size}px Inter, Arial, sans-serif`;
  ctx.fillText(lines[0], sampleW / 2, sampleH / 2 - 84);

  ctx.font = `800 ${line2Size}px Inter, Arial, sans-serif`;
  ctx.fillText(lines[1], sampleW / 2, sampleH / 2 + 48);

  const image = ctx.getImageData(0, 0, sampleW, sampleH).data;
  const points = [];
  const step = 6;
  const scaleX = width / sampleW;
  const scaleY = height / sampleH;
  const startX = width / 2;
  const startY = height + 40;

  for (let y = 0; y < sampleH; y += step) {
    for (let x = 0; x < sampleW; x += step) {
      const alpha = image[(y * sampleW + x) * 4 + 3];
      if (alpha > 35) {
        points.push({
          sx: startX + (Math.random() - 0.5) * 180,
          sy: startY + Math.random() * 90,
          tx: x * scaleX,
          ty: y * scaleY,
          delay: Math.random() * 0.95,
          duration: 1.9 + Math.random() * 1.1,
          phase: Math.random() * Math.PI * 2,
          size: Math.random() * 1.7 + 0.9,
          color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        });
      }
    }
  }

  return points.slice(0, 1800);
}

export default function EidMubarakPage() {
  const canvasRef = useRef(null);
  const engineRef = useRef({
    width: 0,
    height: 0,
    dpr: 1,
    stars: [],
    sparks: [],
    textParticles: [],
    raf: 0,
    burstInterval: 0,
  });

  const [name, setName] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hint, setHint] = useState('Enter a name and launch the sky greeting.');

  const shareLink = useMemo(() => {
    if (typeof window === 'undefined') return '/eid-mubarak';
    const value = name.trim();
    if (!value) return `${window.location.origin}${window.location.pathname}`;
    return `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(value)}`;
  }, [name]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      engineRef.current.width = width;
      engineRef.current.height = height;
      engineRef.current.dpr = dpr;
      engineRef.current.stars = makeStars(width, height);
    };

    const drawMoon = (width, height, t) => {
      const x = width * 0.82;
      const y = height * 0.17;
      const radius = Math.min(width, height) * 0.07;

      const g = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 1.9);
      g.addColorStop(0, 'rgba(255, 245, 196, 0.95)');
      g.addColorStop(0.35, 'rgba(255, 236, 170, 0.28)');
      g.addColorStop(1, 'rgba(255, 236, 170, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.shadowColor = 'rgba(255, 236, 170, 0.95)';
      ctx.shadowBlur = 18;
      ctx.fillStyle = 'rgba(255, 248, 211, 0.98)';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x + radius * 0.35, y - radius * 0.1, radius * 0.95, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.5 + Math.sin(t * 2.5) * 0.08;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      for (let i = 0; i < 5; i += 1) {
        const sx = x - radius * 2 + i * radius * 0.9;
        const sy = y - radius * 1.1 + Math.sin(t + i) * 4;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.2 + (i % 2) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const render = (now) => {
      const { width, height, stars, sparks, textParticles } = engineRef.current;
      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#030514');
      sky.addColorStop(0.55, '#07142d');
      sky.addColorStop(1, '#12081f');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(width * 0.5, height * 0.82, 0, width * 0.5, height * 0.82, Math.max(width, height) * 0.55);
      glow.addColorStop(0, 'rgba(122, 92, 255, 0.18)');
      glow.addColorStop(0.5, 'rgba(43, 182, 255, 0.08)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      for (const star of stars) {
        const alpha = star.base + Math.sin(t * star.speed + star.phase) * 0.35;
        ctx.globalAlpha = clamp(alpha, 0.08, 0.95);
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      drawMoon(width, height, t);

      if (isLive) {
        if (Math.random() < 0.012) {
          const fx = width * (0.22 + Math.random() * 0.56);
          const fy = height * (0.16 + Math.random() * 0.28);
          spawnBurst(width, height, fx, fy, engineRef.current.sparks, 58);
        }
      }

      ctx.save();
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const p = sparks[i];
        p.age += 1;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;

        const lifeRatio = 1 - p.age / p.life;
        if (lifeRatio <= 0 || p.x < -50 || p.x > width + 50 || p.y > height + 80) {
          sparks.splice(i, 1);
          continue;
        }

        const alpha = Math.pow(clamp(lifeRatio, 0, 1), 1.3);
        ctx.globalAlpha = alpha;
        ctx.shadowColor = `rgba(${p.color}, ${alpha})`;
        ctx.shadowBlur = p.glow;
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      for (let i = 0; i < textParticles.length; i += 1) {
        const p = textParticles[i];
        const progress = clamp((t - p.delay) / p.duration, 0, 1);
        const eased = easeOutCubic(progress);
        const drift = Math.sin(t * 4 + p.phase) * (1 - progress) * 6;
        const settle = Math.sin(t * 2.4 + p.phase) * 1.25;
        p.x = lerp(p.sx, p.tx, eased) + drift * 0.15;
        p.y = lerp(p.sy, p.ty, eased) + drift * 0.1 + settle;

        const alpha = progress < 0.12 ? progress / 0.12 : 1;
        ctx.globalAlpha = clamp(alpha, 0, 1);
        ctx.shadowColor = `rgba(${p.color}, 0.95)`;
        ctx.shadowBlur = 14;
        ctx.fillStyle = `rgba(${p.color}, 1)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      const halo = ctx.createRadialGradient(width * 0.5, height * 0.42, 0, width * 0.5, height * 0.42, width * 0.4);
      halo.addColorStop(0, 'rgba(255, 234, 160, 0.08)');
      halo.addColorStop(0.45, 'rgba(255, 234, 160, 0.02)');
      halo.addColorStop(1, 'rgba(255, 234, 160, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      engineRef.current.raf = requestAnimationFrame(render);
    };

    resize();
    render(0);
    window.addEventListener('resize', resize);

    const params = new URLSearchParams(window.location.search);
    const preset = params.get('name');
    if (preset) {
      setName(preset);
      const cleaned = preset.trim().replace(/\s+/g, ' ');
      setTimeout(() => {
        if (cleaned) {
          const { width, height } = engineRef.current;
          engineRef.current.textParticles = createTextParticles(cleaned, width, height);
          engineRef.current.sparks.length = 0;
          spawnBurst(width, height, width * 0.5, height * 0.58, engineRef.current.sparks, 96);
          spawnBurst(width, height, width * 0.36, height * 0.36, engineRef.current.sparks, 76);
          spawnBurst(width, height, width * 0.66, height * 0.34, engineRef.current.sparks, 76);
          setIsLive(true);
          setHint(`Celebrating Eid for ${cleaned}.`);
          const nextUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(cleaned)}`;
          window.history.replaceState({}, '', nextUrl);
        }
      }, 120);
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(engineRef.current.raf);
      if (engineRef.current.burstInterval) {
        clearInterval(engineRef.current.burstInterval);
      }
    };
  }, []);

  const startCelebration = () => {
    const cleaned = name.trim().replace(/\s+/g, ' ');
    if (!cleaned) {
      setHint('Please enter a name first.');
      return;
    }

    const { width, height } = engineRef.current;
    engineRef.current.textParticles = createTextParticles(cleaned, width, height);
    engineRef.current.sparks.length = 0;

    spawnBurst(width, height, width * 0.5, height * 0.58, engineRef.current.sparks, 98);
    spawnBurst(width, height, width * 0.31, height * 0.39, engineRef.current.sparks, 74);
    spawnBurst(width, height, width * 0.69, height * 0.36, engineRef.current.sparks, 74);

    if (engineRef.current.burstInterval) {
      clearInterval(engineRef.current.burstInterval);
    }

    engineRef.current.burstInterval = window.setInterval(() => {
      const x = width * (0.2 + Math.random() * 0.6);
      const y = height * (0.14 + Math.random() * 0.28);
      spawnBurst(width, height, x, y, engineRef.current.sparks, 52 + Math.floor(Math.random() * 18));
    }, 920);

    setIsLive(true);
    setCopied(false);
    setHint(`Celebrating Eid for ${cleaned}.`);

    const nextUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(cleaned)}`;
    window.history.replaceState({}, '', nextUrl);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setHint('Share link copied.');
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setHint('Copy failed. You can select the link manually.');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040712] text-white">
      <canvas ref={canvasRef} className="fixed inset-0 h-full w-full pointer-events-none" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),linear-gradient(to_bottom,rgba(7,10,22,0.14),rgba(7,10,22,0.6))]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
              <span className="text-amber-300">✦</span>
              Personalized Eid sky greeting
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Make your visitor&apos;s name rise into the sky.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
              Type any name, and the page will paint <span className="text-white">“Eid Mubarak”</span> before it in glowing fireworks.
              It feels personal, shareable, and memorable.
            </p>

            <div className="mt-8 rounded-3xl border border-white/12 bg-white/8 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
              <label className="block text-sm font-medium text-white/70">Enter name</label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') startCelebration();
                  }}
                  placeholder="Rahim"
                  className="h-14 flex-1 rounded-2xl border border-white/12 bg-[#09111f]/90 px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/20"
                />
                <button
                  onClick={startCelebration}
                  className="h-14 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 px-6 font-semibold text-slate-950 shadow-lg shadow-amber-300/20 transition hover:scale-[1.01] active:scale-[0.99]"
                >
                  Launch sky
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={copyLink}
                  className="rounded-2xl border border-white/12 bg-white/6 px-5 py-3 text-sm text-white/85 transition hover:bg-white/10"
                >
                  {copied ? 'Link copied' : 'Copy share link'}
                </button>
                <a
                  href={shareLink}
                  className="rounded-2xl border border-white/12 bg-white/6 px-5 py-3 text-sm text-white/85 transition hover:bg-white/10"
                >
                  Open share URL
                </a>
              </div>

              <p className="mt-4 text-sm text-white/55">{hint}</p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-amber-300/15 via-transparent to-cyan-300/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/8 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/45">Live preview</p>
                  <p className="mt-2 text-lg font-semibold text-white/85">Eid sky greeting</p>
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/65">
                  {isLive ? 'live' : 'ready'}
                </div>
              </div>

              <div className="mt-7 rounded-[1.5rem] border border-white/8 bg-[#050816]/85 p-5 sm:p-6">
                <div className="flex items-center justify-between text-sm text-white/45">
                  <span>Current message</span>
                  <span>Firework mode</span>
                </div>
                <div className="mt-6 min-h-[180px] rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,236,170,0.16),rgba(255,255,255,0.02)_45%,transparent_75%)] p-5 text-center">
                  <div className="text-xs uppercase tracking-[0.4em] text-amber-200/70">Eid Mubarak</div>
                  <div className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                    {name.trim() ? name.trim() : 'Your Name'}
                  </div>
                  <div className="mt-5 text-sm leading-6 text-white/55">
                    The canvas will build this greeting from particles, then burst fireworks around it.
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-white/70">
                  Personalized text sky
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-white/70">
                  Shareable URL
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-white/70">
                  No extra library needed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
