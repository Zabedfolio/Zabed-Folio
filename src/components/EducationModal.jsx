'use client';

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineX } from "react-icons/hi";

export default function EducationModal({ open, onOpenChange }) {
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
                    My Education & Academic Journey
                  </h2>
                  <Dialog.Close asChild>
                    <button className="rounded-full border border-black/10 bg-black/4 p-2 text-[#1a1a1a] hover:bg-black/8 transition">
                      <HiOutlineX className="text-xl" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Story Body */}
                <div className="space-y-5 text-base sm:text-[1.05rem] leading-[1.85] text-black/80 font-normal">
                  {/* Paragraph 1 */}
                  <p>
                    I passed my SSC (Secondary School Certificate) from the{" "}
                    <span className="inline-flex items-center gap-2 align-middle mx-1 font-extrabold text-[#D97706]">
                      <img
                        src="/GMHS_Logo.png"
                        alt="Govt Muslim High School"
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-md object-contain shrink-0 shadow-sm align-middle transition-transform duration-300 hover:scale-125 hover:rotate-3 cursor-pointer"
                      />
                      <span>Govt Muslim High School</span>
                    </span>
                    .
                  </p>

                  {/* Paragraph 2 */}
                  <p>
                    Then the COVID pandemic came{" "}
                    <span className="opacity-100 text-black font-normal inline-block select-none">😤</span>.
                  </p>

                  {/* Paragraph 3 */}
                  <p>
                    During COVID, I got admitted to{" "}
                    <span className="inline-flex items-center gap-2 align-middle mx-1 font-extrabold text-[#1D4ED8]">
                      <img
                        src="/govt-city-college-logo-png_seeklogo-410326.png"
                        alt="Govt City College Chittagong"
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-md object-contain shrink-0 shadow-sm align-middle transition-transform duration-300 hover:scale-125 hover:rotate-3 cursor-pointer"
                      />
                      <span>Govt City College Chittagong</span>
                    </span>{" "}
                    and passed my HSC (Higher Secondary Certificate) in 2022. After that, I tried several times to get into public universities but failed. Although I never felt disappointed because of that, I eventually got admitted to{" "}
                    <span className="inline-flex items-center gap-2 align-middle mx-1 font-extrabold text-[#047857]">
                      <img
                        src="/iiuc-logo.webp"
                        alt="International Islamic University Chittagong"
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-md object-contain shrink-0 shadow-sm align-middle transition-transform duration-300 hover:scale-125 hover:rotate-3 cursor-pointer"
                      />
                      <span>International Islamic University Chittagong</span>
                    </span>{" "}
                    for a Bachelor's degree in Computer Science and Engineering.
                  </p>

                  {/* Paragraph 4 */}
                  <p>
                    Don't know why I chose this subject{" "}
                    <span className="opacity-100 text-black font-normal inline-block select-none">😂</span>. Still figuring it out.
                  </p>

                  {/* Paragraph 5 */}
                  <p className="pt-2 font-medium text-black/90">
                    I was never a highly talented student, but I never quit. I love myself for having this kind of mentality.
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
