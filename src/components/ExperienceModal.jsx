'use client';

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineAcademicCap,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineFire,
  HiOutlineExternalLink,
  HiOutlineEmojiHappy,
  HiOutlineX,
} from "react-icons/hi";

export default function ExperienceModal({ open, onOpenChange }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-x-4 top-[10%] sm:top-[12%] md:left-1/2 md:-translate-x-1/2 z-[101] w-full max-w-2xl rounded-3xl border border-black/10 bg-white p-6 sm:p-10 shadow-2xl max-h-[82vh] overflow-y-auto space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-black/8 pb-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/4 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black/60">
                      <HiOutlineSparkles className="h-3.5 w-3.5 text-[#ff5f1a]" />
                      Developer Story
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1a1a1a]">
                      My Experience & Journey
                    </h2>
                  </div>
                  <Dialog.Close asChild>
                    <button className="rounded-full border border-black/10 bg-black/4 p-2 text-[#1a1a1a] hover:bg-black/8 transition">
                      <HiOutlineX className="text-xl" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Narrative Story Body */}
                <div className="space-y-5 text-base sm:text-[1.05rem] leading-[1.85] text-black/75 font-normal">
                  {/* Paragraph 1 */}
                  <p>
                    In <span className="font-semibold text-[#1a1a1a]">January 2026</span>, my actual journey began. With little steps, I became a MERN Stack Developer with the help of{" "}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF8E7] border border-[#FFE082] text-sm sm:text-base font-extrabold text-[#D97706] shadow-sm align-middle mx-0.5">
                      <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-[#D97706] shrink-0" />
                      <span>Programming Hero</span>
                    </span>
                    .
                  </p>

                  {/* Paragraph 2 */}
                  <p>
                    Then, I started applying for multiple jobs while joining{" "}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-sm sm:text-base font-extrabold text-[#1D4ED8] shadow-sm align-middle mx-0.5">
                      <HiOutlineSparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#1D4ED8] shrink-0" />
                      <span>FlyRank AI</span>
                    </span>{" "}
                    as a Frontend Developer Intern. However, I wasn’t satisfied with their internship approach, as it wasn’t the common way of doing an internship and was mostly self-paced.
                  </p>

                  {/* Paragraph 3 */}
                  <p>
                    After that, I joined{" "}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-sm sm:text-base font-extrabold text-[#047857] shadow-sm align-middle mx-0.5">
                      <HiOutlineUserGroup className="h-4 w-4 sm:h-5 sm:w-5 text-[#047857] shrink-0" />
                      <span>Rise Together</span>
                    </span>{" "}
                    with a 1-month probation period, but unfortunately, due to my semester final exams, I couldn’t continue with them.
                  </p>

                  {/* Paragraph 4 */}
                  <p>
                    After that, I took part in Programming Hero{" "}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1a1a1a] border border-black/20 text-sm sm:text-base font-extrabold text-white shadow-md align-middle mx-0.5">
                      <HiOutlineFire className="h-4 w-4 sm:h-5 sm:w-5 text-[#ff5f1a] shrink-0" />
                      <span className="tracking-wide text-white">Endgame</span>
                    </span>
                    , where I led the scrum as a scrum leader and also worked as a team leader. There, I worked on{" "}
                    <a
                      href="https://flixora-client.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-extrabold text-[#ff5f1a] underline decoration-[#ff5f1a]/50 underline-offset-4 hover:decoration-[#ff5f1a] transition-all inline-flex items-baseline gap-1"
                    >
                      <span>Flixora</span>
                      <HiOutlineExternalLink className="h-3.5 w-3.5 inline text-[#ff5f1a]" />
                    </a>{" "}
                    as my first team project.
                  </p>

                  {/* Paragraph 5 */}
                  <p>
                    Currently, I’m working on a total of 3 projects, where 2 of them are real-life client projects. One is{" "}
                    <strong className="font-extrabold text-[#1a1a1a]">JerseyX</strong>, an e-commerce website, and another is a{" "}
                    <strong className="font-extrabold text-[#1a1a1a]">Payment Tracker</strong> for an Islamic Academy. I’m also working on a project that solves a real-life problem —{" "}
                    <strong className="font-extrabold text-[#1a1a1a]">Intelligent Collaborative Academic Workspace</strong>.
                  </p>

                  {/* Paragraph 6 (Closing) */}
                  <p className="pt-2 font-medium text-black/70">
                    That’s all about my experience so far. Still now, I’m a noob{" "}
                    <HiOutlineEmojiHappy className="inline h-5 w-5 text-[#ff5f1a] align-text-bottom ml-0.5" />
                    .
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-black/8 flex justify-end">
                  <Dialog.Close asChild>
                    <button className="rounded-full bg-[#1a1a1a] hover:bg-black px-6 py-2.5 text-xs font-bold text-white transition shadow-md">
                      Close Story
                    </button>
                  </Dialog.Close>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
