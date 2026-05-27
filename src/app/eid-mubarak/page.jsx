'use client';

import { useEffect, useRef, useState } from 'react';

const COLORS = [
  '#ff4d00',
  '#ff8c00',
  '#ffffff',
  '#ffd166',
];

export default function EidMubarakPage() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [name, setName] = useState('');

  const particlesRef = useRef([]);
  const rocketsRef = useRef([]);
  const textParticlesRef = useRef([]);
  const starsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      starsRef.current = Array.from({ length: 140 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5,
        a: Math.random(),
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#040816');
      gradient.addColorStop(1, '#0b1120');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      starsRef.current.forEach((s) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Moon
      const moonX = canvas.width * 0.82;
      const moonY = canvas.height * 0.16;
      const moonRadius = window.innerWidth < 640 ? 32 : 50;

      const glow = ctx.createRadialGradient(
        moonX, moonY, moonRadius * 0.2,
        moonX, moonY, moonRadius * 2.2
      );
      glow.addColorStop(0, 'rgba(255,245,200,0.22)');
      glow.addColorStop(1, 'rgba(255,245,200,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.fillStyle = '#fff7d6';
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#ffd166';
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(
        moonX + moonRadius * 0.35,
        moonY - moonRadius * 0.1,
        moonRadius * 0.95,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      // Rockets
      rocketsRef.current.forEach((r, i) => {
        r.y -= r.speed;
        ctx.beginPath();
        ctx.fillStyle = '#ff4d00';
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,77,0,0.45)';
        ctx.lineWidth = 2;
        ctx.moveTo(r.x, r.y + 18);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();
        if (r.y <= r.targetY) {
          createExplosion(r.x, r.y);
          rocketsRef.current.splice(i, 1);
        }
      });

      // Explosion particles
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.life -= 1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color},${p.life / 100})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${p.color},1)`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) particlesRef.current.splice(i, 1);
      });

      // Text particles
      textParticlesRef.current.forEach((p, i) => {
        p.x += (p.tx - p.x) * 0.05;
        p.y += (p.ty - p.y) * 0.05;
        if (p.fade) p.alpha -= 0.008;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,140,0,${p.alpha})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#ff4d00';
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.alpha <= 0) textParticlesRef.current.splice(i, 1);
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const createExplosion = (x, y) => {
    for (let i = 0; i < 70; i++) {
      const angle = (Math.PI * 2 * i) / 70;
      const speed = Math.random() * 4 + 1;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const rgb = hexToRgb(color);
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2 + 1,
        life: 100,
        color: `${rgb.r},${rgb.g},${rgb.b}`,
      });
    }
  };

  const createText = () => {
    if (!name.trim()) return;

    const canvas = canvasRef.current;
    const isMobile = window.innerWidth < 640;

    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const ctx = offscreen.getContext('2d');

    // ── MOBILE: bigger font, tighter line spacing ──
    const fontSize = isMobile
      ? 48                                      // was 34 → now 48
      : window.innerWidth < 1024
      ? 58
      : 84;

    const lineSpacing = isMobile
      ? fontSize * 1.25                         // generous but not overlapping
      : 0;

    ctx.clearRect(0, 0, offscreen.width, offscreen.height);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${fontSize}px Arial`;

    if (isMobile) {
      // centre the two-line block vertically
      const totalH = lineSpacing;
      const midY = offscreen.height / 2;
      ctx.fillText('Eid Mubarak', offscreen.width / 2, midY - totalH / 2);
      ctx.fillText(name,          offscreen.width / 2, midY + totalH / 2);
    } else {
      ctx.fillText(
        `Eid Mubarak ${name}`,
        offscreen.width / 2,
        offscreen.height / 2
      );
    }

    const data = ctx.getImageData(0, 0, offscreen.width, offscreen.height).data;

    textParticlesRef.current = [];

    // ── MOBILE: denser sampling (gap 3 vs 6) for crystal-clear letters ──
    const gap = isMobile ? 3 : 6;

    for (let y = 0; y < offscreen.height; y += gap) {
      for (let x = 0; x < offscreen.width; x += gap) {
        const index = (y * offscreen.width + x) * 4;
        if (data[index + 3] > 128) {
          textParticlesRef.current.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 120,
            y: canvas.height + Math.random() * 120,
            tx: x,
            ty: y,
            // ── smaller dots on mobile so dense grid stays crisp ──
            size: isMobile
              ? Math.random() * 1.2 + 0.8
              : Math.random() * 2.2 + 1,
            alpha: 1,
            fade: false,
          });
        }
      }
    }

    // ── More rockets on mobile for a livelier launch ──
    const rocketCount = isMobile ? 14 : 12;

    for (let i = 0; i < rocketCount; i++) {
      rocketsRef.current.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * (isMobile ? 200 : 320),
        y: canvas.height + Math.random() * 120,
        targetY: canvas.height / 2 - Math.random() * (isMobile ? 80 : 140),
        speed: Math.random() * 4 + 4,
      });
    }

    setTimeout(() => {
      textParticlesRef.current.forEach((p) => { p.fade = true; });
    }, 4500);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#050816]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="absolute bottom-0 left-0 z-20 w-full px-4 pb-5 sm:px-6 sm:pb-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-[2rem] border border-white/10 bg-black/20 p-3 backdrop-blur-2xl sm:flex-row sm:items-center sm:p-4">
          <input
            type="text"
            placeholder="Enter a name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createText()}
            className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-base text-white outline-none transition placeholder:text-white/30 focus:border-[#ff4d00]/40"
          />
          <button
            onClick={createText}
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-[#ff4d00] to-[#ff8c00] px-8 font-semibold text-white transition hover:scale-[1.01] sm:w-auto"
          >
            Launch 🚀
          </button>
        </div>
      </div>
    </main>
  );
}