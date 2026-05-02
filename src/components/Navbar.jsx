'use client';

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineMenuAlt4, HiOutlineX } from "react-icons/hi";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Timeline" },
  { href: "#contact", label: "Contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#about");
  const { scrollY } = useScroll();

  const navBg = useTransform(scrollY, [0, 200], ["rgba(5,5,5,0)", "rgba(5,5,5,0.85)"]);
  const navBorder = useTransform(scrollY, [0, 200], ["rgba(255,255,255,0)", "rgba(255,255,255,0.07)"]);
  const navBlur = useTransform(scrollY, [0, 200], [0, 24]);

  return (
    <motion.header
      style={{
        backgroundColor: navBg,
        borderBottomColor: navBorder,
        backdropFilter: useTransform(navBlur, (value) => `blur(${value}px) saturate(180%)`)
      }}
      className="sticky top-0 z-50 border-b"
    >
      <div className="section-shell">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="#" className="relative z-10 leading-tight">
            <div className="text-sm font-bold uppercase tracking-[0.35em] text-white">ZABED</div>
            <div className="text-sm font-bold uppercase tracking-[0.35em] text-[#ff4d00]">MAHMUD</div>
          </Link>

          <nav className="hidden rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-xl md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActive(item.href)}
                className="relative px-4 py-1.5 text-sm text-white/55 transition hover:text-white"
              >
                {active === item.href && (
                  <motion.span
                    layoutId="navPill"
                    className="absolute inset-0 rounded-full border border-[#ff4d00]/30 bg-[#ff4d00]/10 shadow-accent-glow"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <motion.a
              href="#contact"
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-white/10 border-l-[3px] border-l-[#ff4d00] bg-white/[0.04] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#ff4d00]/10"
            >
              Book a Call
            </motion.a>
          </div>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="rounded-full border border-white/10 bg-white/[0.04] p-3 text-white md:hidden">
                <HiOutlineMenuAlt4 className="text-xl" />
              </button>
            </Dialog.Trigger>

            <AnimatePresence>
              {open ? (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild>
                    <motion.div
                      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  </Dialog.Overlay>
                  <Dialog.Content asChild>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="fixed inset-0 z-[60] flex flex-col justify-between p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold uppercase tracking-[0.35em] text-white">Navigation</div>
                        <Dialog.Close asChild>
                          <button className="rounded-full border border-white/10 bg-white/[0.04] p-3 text-white">
                            <HiOutlineX className="text-xl" />
                          </button>
                        </Dialog.Close>
                      </div>

                      <div className="flex flex-1 flex-col items-start justify-center gap-6">
                        {navItems.map((item, index) => (
                          <motion.a
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setActive(item.href);
                              setOpen(false);
                            }}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="text-4xl font-semibold tracking-[-0.04em] text-white/90"
                          >
                            {item.label}
                          </motion.a>
                        ))}
                      </div>

                      <a
                        href="#contact"
                        onClick={() => setOpen(false)}
                        className="rounded-full border border-[#ff4d00]/20 bg-[#ff4d00]/10 px-5 py-4 text-center text-white"
                      >
                        Book a 45-min Call
                      </a>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              ) : null}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </div>
    </motion.header>
  );
}
