'use client';

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineExternalLink, HiOutlineX } from "react-icons/hi";
import { fetchProjects } from "@/utils/projectApi";

export default function ExperienceModal({ open, onOpenChange }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (open) {
      fetchProjects()
        .then((data) => {
          if (Array.isArray(data)) {
            setProjects(data);
          }
        })
        .catch(() => {});
    }
  }, [open]);

  const getProjectLink = (keyword) => {
    if (!projects || projects.length === 0) return null;
    const match = projects.find(
      (p) =>
        p.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        p.id?.toLowerCase().includes(keyword.toLowerCase()) ||
        p._id?.toLowerCase().includes(keyword.toLowerCase())
    );
    return match ? `/projects/${match._id || match.id}` : null;
  };

  const jerseyXHref = getProjectLink("jersey") || "/projects";
  const paymentTrackerHref = getProjectLink("payment") || getProjectLink("tracker") || "/projects";
  const academicWorkspaceHref = getProjectLink("academic") || getProjectLink("collaborative") || getProjectLink("intelligent") || "/projects";
  const flixoraHref = getProjectLink("flixora");

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

            <Dialog.Content className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 overflow-y-auto outline-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-2xl my-auto max-h-[85vh] overflow-y-auto rounded-3xl border border-black/10 bg-white p-6 sm:p-10 shadow-2xl space-y-6 text-[#1a1a1a]"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-black/8 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1a1a1a]">
                    My Experience & Journey
                  </h2>
                  <Dialog.Close asChild>
                    <button className="rounded-full border border-black/10 bg-black/4 p-2 text-[#1a1a1a] hover:bg-black/8 transition">
                      <HiOutlineX className="text-xl" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Narrative Story Body */}
                <div className="space-y-5 text-base sm:text-[1.05rem] leading-[1.85] text-black/80 font-normal">
                  {/* Paragraph 1 */}
                  <p>
                    In <span className="font-semibold text-[#1a1a1a]">January 2026</span>, my actual journey began. With little steps, I became a MERN Stack Developer with the help of{" "}
                    <span className="inline-flex items-center gap-2 align-middle mx-1 font-extrabold text-[#D97706]">
                      <img
                        src="/programming-hero.png"
                        alt="Programming Hero"
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl object-contain shrink-0 shadow-sm align-middle"
                      />
                      <span>Programming Hero</span>
                    </span>
                    .
                  </p>

                  {/* Paragraph 2 */}
                  <p>
                    Then, I started applying for multiple jobs while joining{" "}
                    <span className="inline-flex items-center gap-2 align-middle mx-1 font-extrabold text-[#1D4ED8]">
                      <img
                        src="/flyrank_logo.jpeg"
                        alt="FlyRank AI"
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl object-cover shrink-0 shadow-sm align-middle"
                      />
                      <span>FlyRank AI</span>
                    </span>{" "}
                    as a Frontend Developer Intern. However, I wasn’t satisfied with their internship approach, as it wasn’t the common way of doing an internship and was mostly self-paced.
                  </p>

                  {/* Paragraph 3 */}
                  <p>
                    After that, I joined{" "}
                    <span className="inline-flex items-center gap-2 align-middle mx-1 font-extrabold text-[#047857]">
                      <img
                        src="/risetogetherbd_logo.jpeg"
                        alt="Rise Together"
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl object-cover shrink-0 shadow-sm align-middle"
                      />
                      <span>Rise Together</span>
                    </span>{" "}
                    with a 1-month probation period, but unfortunately, due to my semester final exams, I couldn’t continue with them.
                  </p>

                  {/* Paragraph 4 */}
                  <p>
                    After that, I took part in Programming Hero{" "}
                    <span className="inline-flex items-center gap-2 align-middle mx-1 font-extrabold text-[#1a1a1a]">
                      <img
                        src="/endgame.webp"
                        alt="Endgame"
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl object-contain shrink-0 bg-[#1a1a1a] p-1 shadow-sm align-middle"
                      />
                      <span className="tracking-wide">Endgame</span>
                    </span>
                    , where I led the scrum as a scrum leader and also worked as a team leader. There, I worked on{" "}
                    {flixoraHref ? (
                      <Link
                        href={flixoraHref}
                        onClick={() => onOpenChange(false)}
                        className="font-extrabold text-[#ff5f1a] underline decoration-[#ff5f1a]/50 underline-offset-4 hover:decoration-[#ff5f1a] transition-all inline-flex items-baseline gap-1"
                      >
                        <span>Flixora</span>
                        <HiOutlineExternalLink className="h-3.5 w-3.5 inline text-[#ff5f1a]" />
                      </Link>
                    ) : (
                      <a
                        href="https://flixora-client.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-extrabold text-[#ff5f1a] underline decoration-[#ff5f1a]/50 underline-offset-4 hover:decoration-[#ff5f1a] transition-all inline-flex items-baseline gap-1"
                      >
                        <span>Flixora</span>
                        <HiOutlineExternalLink className="h-3.5 w-3.5 inline text-[#ff5f1a]" />
                      </a>
                    )}{" "}
                    as my first team project.
                  </p>

                  {/* Paragraph 5 */}
                  <p>
                    Currently, I’m working on a total of 3 projects, where 2 of them are real-life client projects. One is{" "}
                    <Link
                      href={jerseyXHref}
                      onClick={() => onOpenChange(false)}
                      className="font-extrabold text-[#ff5f1a] hover:underline underline-offset-4 transition-all"
                    >
                      JerseyX
                    </Link>
                    , an e-commerce website, and another is a{" "}
                    <Link
                      href={paymentTrackerHref}
                      onClick={() => onOpenChange(false)}
                      className="font-extrabold text-[#ff5f1a] hover:underline underline-offset-4 transition-all"
                    >
                      Payment Tracker
                    </Link>{" "}
                    for an Islamic Academy. I’m also working on a project that solves a real-life problem —{" "}
                    <Link
                      href={academicWorkspaceHref}
                      onClick={() => onOpenChange(false)}
                      className="font-extrabold text-[#ff5f1a] hover:underline underline-offset-4 transition-all"
                    >
                      Intelligent Collaborative Academic Workspace
                    </Link>
                    .
                  </p>

                  {/* Paragraph 6 (Closing) */}
                  <p className="pt-2 font-medium text-black/70">
                    That’s all about my experience so far. Still now, I’m a noob haha 😂.
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
