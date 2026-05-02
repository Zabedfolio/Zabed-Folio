'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { projectCategories } from "@/data/projects";
import { fetchProjects } from "@/utils/projectApi";
import { fadeUp, staggerContainer } from "@/utils/motionVariants";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setError("Projects API is not responding. Try `npm run server` and reload.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    return activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  return (
    <div id="projects" className="section-shell py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="space-y-10"
      >
        <motion.p variants={fadeUp} className="section-label">
          03 — Projects
        </motion.p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.h2 variants={fadeUp} className="section-title max-w-3xl">
            Selected work with premium execution and product clarity.
          </motion.h2>
          <motion.div variants={fadeUp} className="glass-panel flex w-fit flex-wrap gap-2 rounded-full p-1.5">
            {projectCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="relative rounded-full px-4 py-2 text-sm text-white/55 transition hover:text-white"
              >
                {activeCategory === category && (
                  <motion.span
                    layoutId="projectFilter"
                    className="absolute inset-0 rounded-full border border-[#ff4d00]/25 bg-[#ff4d00]/10"
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="glass-panel overflow-hidden rounded-2xl">
                <div className="h-52 animate-pulse bg-white/[0.04]" />
                <div className="space-y-4 p-6">
                  <div className="h-3 w-28 animate-pulse rounded bg-white/[0.06]" />
                  <div className="h-8 w-2/3 animate-pulse rounded bg-white/[0.06]" />
                  <div className="h-16 animate-pulse rounded bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass-panel rounded-2xl p-6 text-white/65">
            <p>{error}</p>
            <button
              onClick={loadProjects}
              className="mt-4 rounded-full border border-[#ff4d00]/30 bg-[#ff4d00]/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
            >
              Retry
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-white/65">
            <p>No projects found in data source.</p>
            <button
              onClick={loadProjects}
              className="mt-4 rounded-full border border-[#ff4d00]/30 bg-[#ff4d00]/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
            >
              Reload
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="glass-panel hover-glow overflow-hidden rounded-2xl"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                </div>
                <div className="space-y-4 p-6">
                  <div className="font-mono text-xs uppercase tracking-[0.24em] text-[#ff4d00]">
                    {String(index + 1).padStart(2, "0")} · {project.year}
                  </div>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">{project.title}</h3>
                  <p className="text-white/55">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-2 text-sm text-white transition hover:text-[#ff8c00]">
                    View Details <span aria-hidden>→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
