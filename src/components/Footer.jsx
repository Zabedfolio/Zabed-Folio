const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Timeline" },
  { href: "#contact", label: "Contact" }
];

export default function Footer() {
  return (
    <footer className="relative z-30 border-t border-white/5 bg-[rgba(5,5,5,0.8)] py-12 backdrop-blur-xl">
      <div className="section-shell">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.35em] text-white">ZABED</div>
            <div className="text-sm font-bold uppercase tracking-[0.35em] text-[#ff4d00]">MAHMUD</div>
            <p className="mt-4 max-w-sm text-white/45">Cinematic digital experiences for brands and products that need more than a template.</p>
          </div>

          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-white/55 transition hover:text-white">
                {link.label}
              </a>
            ))}
          </div>

          <div className="space-y-3 text-white/55">
            <a href="https://github.com/Zabedfolio" target="_blank" rel="noreferrer" className="block transition hover:text-white">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/zabedfolio/" target="_blank" rel="noreferrer" className="block transition hover:text-white">
              LinkedIn
            </a>
            <a href="mailto:hello@zabed.dev" className="block transition hover:text-white">
              zabedfolio@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 font-mono text-xs uppercase tracking-[0.2em] text-white/15">
          © 2026 Zabed Hossain · Made with Next.js & ♥
        </div>
      </div>
    </footer>
  );
}
