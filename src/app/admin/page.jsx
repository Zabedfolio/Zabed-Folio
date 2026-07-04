"use client";

import { useEffect, useState } from "react";
import Link from "next/navigation";
import {
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineCollection,
  HiOutlineCog,
  HiOutlineCube,
  HiOutlineDatabase,
  HiOutlineChevronRight,
} from "react-icons/hi";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    learnedSkills: 0,
    education: 0,
    experience: 0,
    processSteps: 0,
    notes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [proj, skl, edu, exp, prc, nts] = await Promise.all([
          fetch("/api/admin/projects").then((r) => r.json()),
          fetch("/api/admin/skills").then((r) => r.json()),
          fetch("/api/admin/education").then((r) => r.json()),
          fetch("/api/admin/experience").then((r) => r.json()),
          fetch("/api/admin/process").then((r) => r.json()),
          fetch("/api/admin/notes").then((r) => r.json()),
        ]);

        setStats({
          projects: Array.isArray(proj) ? proj.length : 0,
          skills: Array.isArray(skl) ? skl.length : 0,
          education: Array.isArray(edu) ? edu.length : 0,
          experience: Array.isArray(exp) ? exp.length : 0,
          processSteps: Array.isArray(prc) ? prc.length : 0,
          notes: Array.isArray(nts) ? nts.length : 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Projects Showcase",
      count: stats.projects,
      desc: "Work case studies, details & tech tags",
      icon: HiOutlineBriefcase,
      color: "from-orange-500/20 to-orange-600/5",
      borderColor: "border-orange-500/20",
      href: "/admin/projects",
    },
    {
      title: "Skills Directory",
      count: stats.skills,
      desc: "Icons, categories and color schemes",
      icon: HiOutlineCog,
      color: "from-blue-500/20 to-blue-600/5",
      borderColor: "border-blue-500/20",
      href: "/admin/skills",
    },

    {
      title: "Timeline: Education",
      count: stats.education,
      desc: "Institutions, certificates & duration",
      icon: HiOutlineAcademicCap,
      color: "from-green-500/20 to-green-600/5",
      borderColor: "border-green-500/20",
      href: "/admin/education",
    },
    {
      title: "Timeline: Experience",
      count: stats.experience,
      desc: "Freelance & formal employment roles",
      icon: HiOutlineCube,
      color: "from-pink-500/20 to-pink-600/5",
      borderColor: "border-pink-500/20",
      href: "/admin/experience",
    },
    {
      title: "Process Workflow",
      count: stats.processSteps,
      desc: "Steps from discovery to final launch",
      icon: HiOutlineCube,
      color: "from-amber-500/20 to-amber-600/5",
      borderColor: "border-amber-500/20",
      href: "/admin/process",
    },
    {
      title: "Notes & Ideas",
      count: stats.notes,
      desc: "Thought stream, translations & pictures",
      icon: HiOutlineCollection,
      color: "from-purple-500/20 to-purple-600/5",
      borderColor: "border-purple-500/20",
      href: "/admin/notes",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-white/55">Quickly manage your dynamic portfolio contents</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl glass-panel animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <a
                  key={idx}
                  href={card.href}
                  className={`group relative flex flex-col justify-between p-6 rounded-2xl glass-panel border ${card.borderColor} bg-gradient-to-br ${card.color} hover-glow cursor-pointer transition-all duration-300`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-white group-hover:text-[#ff4d00] transition">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-xs text-white/50">{card.desc}</p>
                    </div>
                    <span className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-white/60 group-hover:text-[#ff4d00] transition duration-300">
                      <Icon className="text-xl" />
                    </span>
                  </div>

                  <div className="mt-8 flex items-baseline justify-between">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      {card.count}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/45 group-hover:text-white transition duration-300 font-mono uppercase tracking-wider">
                      Manage <HiOutlineChevronRight />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0a0808]/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="p-4 rounded-full bg-[#13aa52]/10 border border-[#13aa52]/20 text-[#13aa52]">
                <HiOutlineDatabase className="text-2xl" />
              </span>
              <div>
                <h4 className="font-semibold text-white">Database Integrity</h4>
                <p className="text-xs text-white/50 mt-0.5">Connected to MongoDB Atlas Cluster0</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#13aa52]/10 text-[#13aa52] border border-[#13aa52]/25">
                Active
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.05] text-white/70 border border-white/10">
                SSL Secured
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
