'use client';

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { fetchProjectById } from "@/utils/projectApi";

export default function ProjectDetails({ projectId }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setProject(null);
      const data = await fetchProjectById(projectId);
      if (!data) {
        setError("Project not found in API response.");
        return;
      }
      setProject(data);
    } catch {
      setError("Project details API is not responding. Try `npm run server` and retry.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  return (
    <div className="section-shell py-16 sm:py-24">
      <Link href="/#projects" className="mb-8 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70">
        ← Back to projects
      </Link>

      {loading ? (
        <div className="glass-panel overflow-hidden rounded-[2rem]">
          <div className="h-72 animate-pulse bg-white/[0.04]" />
          <div className="space-y-8 p-6 sm:p-10">
            <div className="h-3 w-32 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-12 w-2/3 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-20 animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>
      ) : error ? (
        <div className="glass-panel rounded-[2rem] p-8 text-white/65">
          <p>{error}</p>
          <button
            onClick={loadProject}
            className="mt-4 rounded-full border border-[#ff4d00]/30 bg-[#ff4d00]/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
          >
            Retry
          </button>
        </div>
      ) : project ? (
        <div className="glass-panel overflow-hidden rounded-[2rem]">
          <div className="relative h-72">
            <Image src={project.image} alt={project.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
          </div>

          <div className="space-y-8 p-6 sm:p-10">
            <div className="space-y-4">
              <p className="section-label">Project Detail</p>
              <h1 className="text-[clamp(2.6rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-white">{project.title}</h1>
              <p className="max-w-3xl text-lg leading-8 text-white/60">{project.description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="glass-panel rounded-2xl p-6">
                <p className="section-label">Challenge</p>
                <p className="mt-4 text-white/60">{project.challenge}</p>
              </div>
              <div className="glass-panel rounded-2xl p-6">
                <p className="section-label">Improvements</p>
                <p className="mt-4 text-white/60">{project.improvements}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#ff4d00]/20 bg-[#ff4d00]/10 px-6 py-3 text-sm text-white shadow-accent-glow"
              >
                Live Site ↗
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/80"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
