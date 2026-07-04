"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiArrowLeft,
  HiCalendar,
  HiClock,
  HiX,
} from "react-icons/hi";
import ParallaxCanvas from "@/components/background/ParallaxCanvas";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("En"); // "En" or "Bn"
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    async function fetchPublicNotes() {
      try {
        const res = await fetch("/api/public/notes");
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotes(data);
        }
      } catch (err) {
        console.error("Failed fetching notes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPublicNotes();
  }, []);

  const formatDate = (dateStr, lang) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (lang === "Bn") {
      return date.toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr, lang) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (lang === "Bn") {
      // Localize time representation
      return date.toLocaleTimeString("bn-BD", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5] overflow-x-hidden select-none font-sans">
      <ParallaxCanvas />

      {/* Floating Fades */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#ff4d00]/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-[#ff4d00]/3 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Navigation / Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-16 border-b border-white/5 pb-8">
          <div className="space-y-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-white/55 hover:text-white uppercase tracking-[0.2em] group transition"
            >
              <HiArrowLeft className="text-sm group-hover:-translate-x-1 transition duration-200" />
              {language === "En" ? "Back to Portfolio" : "পোর্টফোলিওতে ফিরে যান"}
            </Link>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-sans bg-clip-text bg-gradient-to-r from-white via-white to-white/40">
                {language === "En" ? "Notes & Thoughts" : "নোট এবং চিন্তাভাবনা"}
              </h1>
              <p className="mt-2 text-sm text-white/55 font-sans max-w-xl">
                {language === "En" 
                  ? "A high-fidelity bento grid of scribbles, snippets, and creative updates." 
                  : "আমার সৃজনশীল কাজ, চিন্তাভাবনা এবং টুকরো সংবাদের একটি হাই-ফিডেলিটি বেন্টো গ্রিড।"}
              </p>
            </div>
          </div>

          {/* Futuristic Language Toggle Button */}
          <div className="flex bg-[#0a0808] border border-white/10 rounded-2xl p-1 relative z-20 self-start sm:self-auto font-mono">
            <button
              onClick={() => setLanguage("En")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                language === "En"
                  ? "bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/20"
                  : "text-white/50 hover:text-white"
              }`}
            >
              ENGLISH
            </button>
            <button
              onClick={() => setLanguage("Bn")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                language === "Bn"
                  ? "bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/20"
                  : "text-white/50 hover:text-white"
              }`}
            >
              বাংলা
            </button>
          </div>
        </header>

        {/* Bento Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-60 rounded-3xl glass-panel animate-pulse" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20 border border-white/5 bg-[#0a0808]/20 rounded-3xl glass-panel">
            <p className="text-white/40 text-sm">
              {language === "En" ? "No notes available yet." : "এখনো কোনো নোট নেই।"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]">
            {notes.map((note, idx) => {
              // Custom grid item shapes based on index to create a beautiful Bento Grid
              const isLarge = idx % 4 === 0 || idx % 7 === 0;
              const colSpan = isLarge ? "sm:col-span-2" : "col-span-1";
              const rowSpan = isLarge ? "row-span-2" : "row-span-1";
              
              const title = language === "En" ? note.titleEn : note.titleBn || note.titleEn;
              const desc = language === "En" ? note.descEn : note.descBn || note.descEn;

              return (
                <motion.div
                  key={note._id}
                  layoutId={`note-card-${note._id}`}
                  onClick={() => setSelectedNote(note)}
                  className={`group relative overflow-hidden rounded-3xl glass-panel border border-white/5 bg-[#0a0808]/65 hover-glow cursor-pointer transition-all duration-300 p-6 flex flex-col justify-between ${colSpan} ${rowSpan}`}
                >
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Image Background Layer (if present in bento layout) */}
                  {note.image && isLarge && (
                    <div className="absolute right-0 top-0 bottom-0 w-2/5 md:w-1/2 overflow-hidden border-l border-white/5 hidden sm:block">
                      <img 
                        src={note.image} 
                        alt={title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0808] to-transparent" />
                    </div>
                  )}

                  {/* Note info wrapper */}
                  <div className={`space-y-3 z-10 ${note.image && isLarge ? "sm:max-w-[55%]" : ""}`}>
                    {/* Timestamp */}
                    <div className="flex items-center gap-4 text-[10px] text-white/35 font-mono">
                      <span className="flex items-center gap-1">
                        <HiCalendar className="text-xs text-[#ff4d00]" />
                        {formatDate(note.createdAt, language)}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiClock className="text-xs text-[#ff4d00]" />
                        {formatTime(note.createdAt, language)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#ff4d00] transition duration-300 leading-snug line-clamp-2">
                      {title}
                    </h3>
                    
                    <p className={`text-xs text-white/45 leading-relaxed ${isLarge ? "line-clamp-6" : "line-clamp-3"}`}>
                      {desc}
                    </p>
                  </div>

                  {/* Read More HUD trigger */}
                  <div className="flex justify-end pt-4 z-10">
                    <span className="text-[10px] font-mono text-white/30 group-hover:text-white uppercase tracking-wider transition-colors">
                      {language === "En" ? "// VIEW_THOUGHT" : "// নোট_দেখুন"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cinematic Slide-Over Overlay Panel */}
      <AnimatePresence>
        {selectedNote && (() => {
          const title = language === "En" ? selectedNote.titleEn : selectedNote.titleBn || selectedNote.titleEn;
          const desc = language === "En" ? selectedNote.descEn : selectedNote.descBn || selectedNote.descEn;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-end">
              {/* Dimmed backdrop filter click trigger */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNote(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Dynamic panel content */}
              <motion.div
                initial={{ x: "100%", opacity: 0.9 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0.9 }}
                transition={{ type: "spring", damping: 30, stiffness: 220 }}
                className="relative z-10 w-full max-w-xl h-full bg-[#0a0808] border-l border-white/10 shadow-2xl p-6 sm:p-10 flex flex-col justify-between overflow-y-auto"
              >
                <div>
                  {/* Close header */}
                  <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-8">
                    <span className="text-xs font-mono text-[#ff4d00] tracking-[0.25em] uppercase font-bold">
                      {language === "En" ? "READING NOTE" : "নোটের বিবরণ"}
                    </span>
                    <button
                      onClick={() => setSelectedNote(null)}
                      className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/5 transition"
                    >
                      <HiX className="text-lg" />
                    </button>
                  </div>

                  {/* Feature Image */}
                  {selectedNote.image && (
                    <div className="w-full h-56 rounded-2xl border border-white/5 overflow-hidden mb-8">
                      <img 
                        src={selectedNote.image} 
                        alt={title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  {/* Text Details */}
                  <div className="space-y-5">
                    {/* Timestamp */}
                    <div className="flex items-center gap-5 text-[11px] text-white/40 font-mono">
                      <span className="flex items-center gap-1">
                        <HiCalendar className="text-xs text-[#ff4d00]" />
                        {formatDate(selectedNote.createdAt, language)}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiClock className="text-xs text-[#ff4d00]" />
                        {formatTime(selectedNote.createdAt, language)}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                      {title}
                    </h2>

                    {/* Pre-wrap preserves paragraphs and formatting */}
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans whitespace-pre-wrap">
                      {desc}
                    </p>
                  </div>
                </div>

                {/* Footer panel info */}
                <div className="pt-8 border-t border-white/5 mt-12 text-[10px] text-white/20 font-mono flex items-center justify-between">
                  <span>© {new Date().getFullYear()} ZABED MAHMUD</span>
                  <span>{language === "En" ? "BILINGUAL THOUGHTS" : "দ্বিভাষিক চিন্তাধারা"}</span>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
