'use client';

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HiOutlineFolder, HiOutlineSparkles, HiOutlineLockClosed } from "react-icons/hi";
import { fetchProjects } from "@/utils/projectApi";
import { fallbackProjects } from "@/data/fallbackProjects";

const FILTERS = ["All", "SaaS & Web Apps", "E-Commerce", "Full Stack"];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      if (Array.isArray(data) && data.length > 0) {
        const liveProjects = data.filter((p) => p.status !== "upcoming");
        setProjects(liveProjects.length > 0 ? liveProjects : fallbackProjects);
      } else {
        setProjects(fallbackProjects);
      }
    } catch {
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Robust filter matcher that checks multiple categories and related tags
  const matchesFilter = (project, filter) => {
    if (filter === "All") return true;
    if (!project) return false;

    // Collect all category strings into a normalized list
    const categoriesList = [];
    if (Array.isArray(project.categories)) {
      categoriesList.push(...project.categories);
    }
    if (Array.isArray(project.category)) {
      categoriesList.push(...project.category);
    } else if (typeof project.category === "string" && project.category) {
      categoriesList.push(...project.category.split(",").map((c) => c.trim()));
    }

    const tags = Array.isArray(project.tags) ? project.tags.map((t) => t.toLowerCase()) : [];
    const catLower = categoriesList.map((c) => c.toLowerCase());

    if (filter === "SaaS & Web Apps") {
      return (
        catLower.some(
          (c) =>
            c === "saas & web apps" ||
            c.includes("saas") ||
            c.includes("web app") ||
            c.includes("ai") ||
            c === "frontend"
        ) ||
        tags.some((t) => t.includes("saas") || t.includes("ai") || t.includes("web app"))
      );
    }
    if (filter === "E-Commerce") {
      return (
        catLower.some(
          (c) =>
            c === "e-commerce" ||
            c.includes("commerce") ||
            c.includes("store") ||
            c.includes("shop")
        ) ||
        tags.some((t) => t.includes("commerce") || t.includes("store") || t.includes("shop"))
      );
    }
    if (filter === "Full Stack") {
      return (
        catLower.some(
          (c) => c === "full stack" || c.includes("full stack") || c.includes("fullstack")
        ) ||
        tags.some((t) => t.includes("full stack") || t.includes("node") || t.includes("express"))
      );
    }
    return categoriesList.includes(filter);
  };

  const getFilterCount = (filter) => {
    if (filter === "All") return projects.length;
    return projects.filter((p) => matchesFilter(p, filter)).length;
  };

  const filteredProjects = projects.filter((p) => matchesFilter(p, activeFilter));

  const renderProjectCard = (project, index) => (
    <motion.article
      layout
      key={project.id || project._id || index}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#1FB57A]/40 hover:shadow-2xl hover:shadow-[#12A36B]/15"
    >
      <div>
        <div className="relative h-56 w-full overflow-hidden bg-black/5">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title || "Project"}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#1a1a1a] to-black/80 flex items-center justify-center p-6 text-white font-bold text-lg">
              {project.title}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Floating Badges at Positions 1 & 2 */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
            {/* Position 1 (Top-Left): Project Status Tag */}
            <div>
              {project.status === "running" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-400 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Running
                </span>
              ) : project.status === "upcoming" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] font-mono font-bold text-amber-400 shadow-sm">
                  Upcoming
                </span>
              ) : null}
            </div>

            {/* Position 2 (Top-Right): Repository Status Tag */}
            <div>
              {project.isPrivateRepo ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] font-mono font-bold text-white/90 shadow-sm">
                  <HiOutlineLockClosed className="text-xs text-white/70" />
                  Private Repo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] font-mono font-bold text-white/80 shadow-sm">
                  Public Repo
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-black/40 gap-3">
            <span className="shrink-0 whitespace-nowrap">{String(index + 1).padStart(2, "0")} · {project.year || "2026"}</span>
            <span className="text-[#12A36B] font-semibold shrink-0 whitespace-nowrap">
              {Array.isArray(project.categories) && project.categories.length > 0
                ? project.categories.join(" · ")
                : typeof project.category === "string" && project.category.includes(",")
                ? project.category.split(",").map((c) => c.trim()).join(" · ")
                : project.category || "Full Stack"}
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-[#1a1a1a] group-hover:text-[#12A36B] transition-colors duration-200">
            {project.title}
          </h3>

          {/* Metric / Performance Badges */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {project.metrics.map((m, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-tight border ${
                    m.highlight
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/90 shadow-xs"
                      : "bg-black/[0.04] text-black/65 border-black/8"
                  }`}
                >
                  {m.highlight && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />}
                  {m.label}
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-black/60 leading-relaxed font-normal line-clamp-3">
            {project.description}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2">
        <div className="pt-4 border-t border-black/5 flex items-center justify-between">
          <Link
            href={`/projects/${project.id || project._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#12A36B] hover:text-[#1FB57A] hover:underline underline-offset-4"
          >
            Details <span aria-hidden>→</span>
          </Link>
          <div className="flex items-center gap-3">
            {!project.noLiveLink && project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-black/50 hover:text-black font-semibold uppercase tracking-wider transition-colors"
              >
                Live Link ↗
              </a>
            ) : project.noLiveLink ? (
              <span className="font-mono text-[10px] text-black/35 font-semibold uppercase tracking-wider select-none">
                Live Link Pending
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );

  return (
    <div id="projects" className="section-shell py-16 sm:py-24">
      <div className="space-y-10">
        <h2 className="font-bricolage text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#1a1a1a] max-w-4xl flex flex-wrap items-center gap-x-3 gap-y-2">
          <span>Selected work</span>
          <span className="inline-flex items-center justify-center h-10 w-10 sm:h-13 sm:w-13 rounded-2xl bg-[#1a1a1a] text-white shadow-lg shadow-black/10 transition-transform hover:scale-110 duration-300 shrink-0">
            <HiOutlineFolder className="h-5 w-5 sm:h-6 sm:w-6 text-[#1FB57A]" />
          </span>
          <span>with premium execution</span>
          <span className="inline-flex items-center justify-center h-10 w-10 sm:h-13 sm:w-13 rounded-2xl bg-[#1a1a1a] text-white shadow-lg shadow-black/10 transition-transform hover:scale-110 duration-300 shrink-0">
            <HiOutlineSparkles className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
          </span>
          <span>and product clarity.</span>
        </h2>

        {/* 1-Click Interactive Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {FILTERS.map((filter) => {
            const count = getFilterCount(filter);
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`group shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono font-bold transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-[#1a1a1a] text-white shadow-md shadow-black/10 ring-2 ring-[#1FB57A]/40"
                    : "bg-white/80 text-black/60 hover:text-black hover:bg-white border border-black/8 shadow-xs"
                }`}
              >
                <span>{filter}</span>
                <span
                  className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-mono leading-none transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-black/5 text-black/50 group-hover:bg-black/10"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-3xl border border-black/8 bg-white p-6 space-y-4 shadow-sm animate-pulse">
                <div className="h-48 rounded-2xl bg-black/5" />
                <div className="space-y-2">
                  <div className="h-3 w-28 rounded bg-black/10" />
                  <div className="h-6 w-2/3 rounded bg-black/10" />
                  <div className="h-12 rounded bg-black/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-black/8 bg-white/60 p-12 text-center space-y-3">
            <p className="font-mono text-sm text-black/60">No projects found in this category.</p>
            <button
              type="button"
              onClick={() => setActiveFilter("All")}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1a1a1a] px-4 py-2 text-xs font-mono font-bold text-white shadow-sm hover:bg-black transition-colors"
            >
              Show all projects
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => renderProjectCard(project, index))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
