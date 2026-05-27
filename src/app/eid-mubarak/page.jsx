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

            starsRef.current = Array.from({ length: 120 }).map(() => ({
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
            const gradient = ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
            );

            gradient.addColorStop(0, '#050816');
            gradient.addColorStop(1, '#0b1120');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Stars
            // Stars
            starsRef.current.forEach((s) => {
                ctx.beginPath();
                ctx.fillStyle = `rgba(255,255,255,${s.a})`;
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Moon glow
            const moonX = canvas.width * 0.82;
            const moonY = canvas.height * 0.18;
            const moonRadius =
                window.innerWidth < 640 ? 38 : 55;

            const glow = ctx.createRadialGradient(
                moonX,
                moonY,
                moonRadius * 0.2,
                moonX,
                moonY,
                moonRadius * 2.2
            );

            glow.addColorStop(0, 'rgba(255,255,220,0.25)');
            glow.addColorStop(1, 'rgba(255,255,220,0)');

            ctx.fillStyle = glow;

            ctx.beginPath();
            ctx.arc(
                moonX,
                moonY,
                moonRadius * 2.2,
                0,
                Math.PI * 2
            );
            ctx.fill();

            // Crescent moon
            ctx.save();

            ctx.fillStyle = '#fff7d6';
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#ffd166';

            ctx.beginPath();
            ctx.arc(
                moonX,
                moonY,
                moonRadius,
                0,
                Math.PI * 2
            );
            ctx.fill();

            // Cut part to make crescent
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

                // trail
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255,77,0,0.4)';
                ctx.moveTo(r.x, r.y + 14);
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

                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                ctx.fill();

                if (p.life <= 0) {
                    particlesRef.current.splice(i, 1);
                }
            });

            // Text particles
            textParticlesRef.current.forEach((p, i) => {
                p.progress += 0.02;

                p.x += (p.tx - p.x) * 0.05;
                p.y += (p.ty - p.y) * 0.05;

                if (p.fade) {
                    p.alpha -= 0.008;
                }

                ctx.beginPath();

                ctx.fillStyle = `rgba(255,140,0,${p.alpha})`;

                ctx.shadowBlur = 10;
                ctx.shadowColor = '#ff4d00';

                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                ctx.fill();

                if (p.alpha <= 0) {
                    textParticlesRef.current.splice(i, 1);
                }
            });

            animationRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    const createExplosion = (x, y) => {
        for (let i = 0; i < 70; i++) {
            const angle = (Math.PI * 2 * i) / 70;

            const speed = Math.random() * 4 + 1;

            const color =
                COLORS[Math.floor(Math.random() * COLORS.length)];

            const rgb = hexToRgb(color);

            particlesRef.current.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 2 + 1,
                life: 100,
                color: `${rgb.r},${rgb.g},${rgb.b}`,
            });
        }
    };

    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.replace('#', ''), 16);

        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    };

    const createText = () => {
        if (!name.trim()) return;

        const canvas = canvasRef.current;
        const offscreen = document.createElement('canvas');

        offscreen.width = canvas.width;
        offscreen.height = canvas.height;

        const ctx = offscreen.getContext('2d');

        const text = `Eid Mubarak ${name}`;

        const fontSize =
            window.innerWidth < 640
                ? 32
                : window.innerWidth < 1024
                    ? 54
                    : 82;

        ctx.fillStyle = 'white';

        ctx.textAlign = 'center';

        ctx.font = `900 ${fontSize}px Arial`;

        ctx.fillText(
            text,
            offscreen.width / 2,
            offscreen.height / 2
        );

        const data = ctx.getImageData(
            0,
            0,
            offscreen.width,
            offscreen.height
        ).data;

        textParticlesRef.current = [];

        for (let y = 0; y < offscreen.height; y += 6) {
            for (let x = 0; x < offscreen.width; x += 6) {
                const index = (y * offscreen.width + x) * 4;

                if (data[index + 3] > 128) {
                    textParticlesRef.current.push({
                        x: canvas.width / 2,
                        y: canvas.height + 50,
                        tx: x,
                        ty: y,
                        size: Math.random() * 2 + 1,
                        alpha: 1,
                        progress: 0,
                        fade: false,
                    });
                }
            }
        }

        // launch rockets
        for (let i = 0; i < 12; i++) {
            rocketsRef.current.push({
                x:
                    canvas.width / 2 +
                    (Math.random() - 0.5) * 300,
                y: canvas.height + Math.random() * 100,
                targetY:
                    canvas.height / 2 -
                    Math.random() * 120,
                speed: Math.random() * 4 + 4,
            });
        }

        // fade text after few seconds
        setTimeout(() => {
            textParticlesRef.current.forEach((p) => {
                p.fade = true;
            });
        }, 4500);
    };

    return (
        <main className="relative h-screen w-full overflow-hidden bg-[#050816]">
            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full"
            />

            {/* Bottom Input */}
            <div className="absolute bottom-0 left-0 z-20 w-full p-4 sm:p-6">
                <div className="mx-auto flex max-w-2xl flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl sm:flex-row">
                    <input
                        type="text"
                        placeholder="Enter a name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-14 flex-1 rounded-2xl border border-white/10 bg-black/20 px-5 text-white outline-none placeholder:text-white/30"
                    />

                    <button
                        onClick={createText}
                        className="h-14 rounded-2xl bg-gradient-to-r from-[#ff4d00] to-[#ff8c00] px-8 font-semibold text-white transition hover:scale-[1.02]"
                    >
                        Launch
                    </button>
                </div>
            </div>
        </main>
    );
}