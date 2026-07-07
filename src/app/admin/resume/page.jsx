"use client";

import { useEffect, useState } from "react";
import {
  HiOutlineDocumentDownload,
  HiOutlineSave,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
} from "react-icons/hi";

export default function AdminResume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await fetch("/api/admin/resume");
      const data = await res.json();
      if (data && !data.error) {
        setResume(data);
      }
    } catch (err) {
      console.error("Error fetching resume:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setResume((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const { name, value } = e.target;
    setResume((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [name]: value,
      },
    }));
  };

  // Education helpers
  const handleEducationChange = (index, field, value) => {
    setResume((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", year: "" }],
    }));
  };

  const removeEducation = (index) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const moveEducation = (index, direction) => {
    setResume((prev) => {
      const list = [...prev.education];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const [moved] = list.splice(index, 1);
      list.splice(targetIndex, 0, moved);
      return { ...prev, education: list };
    });
  };

  // Languages helpers
  const handleLanguageChange = (index, field, value) => {
    setResume((prev) => {
      const updated = [...prev.languages];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, languages: updated };
    });
  };

  const addLanguage = () => {
    setResume((prev) => ({
      ...prev,
      languages: [...prev.languages, { language: "", proficiency: "" }],
    }));
  };

  const removeLanguage = (index) => {
    setResume((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  // Projects helpers
  const handleProjectChange = (index, field, value) => {
    setResume((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const handleProjectFeatureChange = (projIndex, featIndex, value) => {
    setResume((prev) => {
      const updatedProjects = [...prev.projects];
      const updatedFeatures = [...updatedProjects[projIndex].features];
      updatedFeatures[featIndex] = value;
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        features: updatedFeatures,
      };
      return { ...prev, projects: updatedProjects };
    });
  };

  const addProjectFeature = (projIndex) => {
    setResume((prev) => {
      const updatedProjects = [...prev.projects];
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        features: [...updatedProjects[projIndex].features, ""],
      };
      return { ...prev, projects: updatedProjects };
    });
  };

  const removeProjectFeature = (projIndex, featIndex) => {
    setResume((prev) => {
      const updatedProjects = [...prev.projects];
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        features: updatedProjects[projIndex].features.filter((_, i) => i !== featIndex),
      };
      return { ...prev, projects: updatedProjects };
    });
  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          liveLink: "",
          clientLink: "",
          serverLink: "",
          description: "",
          technologies: "",
          features: [""],
        },
      ],
    }));
  };

  const removeProject = (index) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const moveProject = (index, direction) => {
    setResume((prev) => {
      const list = [...prev.projects];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const [moved] = list.splice(index, 1);
      list.splice(targetIndex, 0, moved);
      return { ...prev, projects: list };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error saving resume:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = () => {
    window.open("/resume?print=true", "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-10 w-48 bg-white/5 rounded-lg" />
        <div className="h-96 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Resume Builder</h1>
          <p className="mt-2 text-sm text-white/55">
            Modify your professional ATS-compliant resume and export it to PDF instantly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#ff4d00]/30 bg-[#ff4d00]/5 text-[#ff4d00] hover:bg-[#ff4d00]/10 font-medium transition"
          >
            <HiOutlineDocumentDownload className="text-lg" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff4d00] text-white hover:bg-[#ff5d14] font-medium transition disabled:opacity-50"
          >
            <HiOutlineSave className="text-lg" />
            <span>{saving ? "Saving..." : "Save Resume"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm">
          ✓ Resume changes saved successfully to MongoDB database!
        </div>
      )}

      {/* Grid Layout for Header Details */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">Header Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/60 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={resume?.name || ""}
              onChange={handleHeaderChange}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
              placeholder="e.g. Zabed Mahmud"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/60 font-medium">Professional Role</label>
            <input
              type="text"
              name="role"
              value={resume?.role || ""}
              onChange={handleHeaderChange}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
              placeholder="e.g. MERN Stack Developer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/60 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={resume?.phone || ""}
              onChange={handleHeaderChange}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
              placeholder="e.g. +8801979333880"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/60 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={resume?.email || ""}
              onChange={handleHeaderChange}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
              placeholder="e.g. zabedfolio@gmail.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/60 font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={resume?.location || ""}
              onChange={handleHeaderChange}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
              placeholder="e.g. Chittagong, Bangladesh"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/60 font-medium">LinkedIn Link</label>
            <input
              type="text"
              name="linkedin"
              value={resume?.linkedin || ""}
              onChange={handleHeaderChange}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
              placeholder="LinkedIn URL"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/60 font-medium">GitHub Link</label>
            <input
              type="text"
              name="github"
              value={resume?.github || ""}
              onChange={handleHeaderChange}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
              placeholder="GitHub URL"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/60 font-medium">Portfolio Link</label>
            <input
              type="text"
              name="portfolio"
              value={resume?.portfolio || ""}
              onChange={handleHeaderChange}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
              placeholder="Portfolio URL"
            />
          </div>
        </div>
      </div>

      {/* Objective */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
        <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">Career Objective</h2>
        <div className="flex flex-col gap-2">
          <textarea
            name="objective"
            rows={3}
            value={resume?.objective || ""}
            onChange={handleHeaderChange}
            className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition resize-none leading-relaxed"
            placeholder="Introduce your focus, drive and qualifications..."
          />
        </div>
      </div>

      {/* Technical Skills */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/60 font-medium">Frontend Skills</label>
            <textarea
              name="frontend"
              rows={2}
              value={resume?.skills?.frontend || ""}
              onChange={handleSkillsChange}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition resize-none leading-relaxed"
              placeholder="e.g. HTML5, CSS3, JavaScript (ES6+)..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/60 font-medium">Backend & APIs Skills</label>
            <textarea
              name="backend"
              rows={2}
              value={resume?.skills?.backend || ""}
              onChange={handleSkillsChange}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition resize-none leading-relaxed"
              placeholder="e.g. Node.js, Express.js..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/60 font-medium">Tools & Version Control</label>
            <textarea
              name="tools"
              rows={2}
              value={resume?.skills?.tools || ""}
              onChange={handleSkillsChange}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition resize-none leading-relaxed"
              placeholder="e.g. Git & GitHub, VS Code..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/60 font-medium">Soft Skills</label>
            <textarea
              name="softSkills"
              rows={2}
              value={resume?.skills?.softSkills || ""}
              onChange={handleSkillsChange}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition resize-none leading-relaxed"
              placeholder="e.g. Problem Solving, Team Collaboration..."
            />
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h2 className="text-lg font-bold text-white">Projects Showcase</h2>
          <button
            onClick={addProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-semibold text-white/80 transition"
          >
            <HiOutlinePlus /> Add Project
          </button>
        </div>

        {resume?.projects?.map((project, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-4 relative"
          >
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <button
                onClick={() => moveProject(idx, -1)}
                disabled={idx === 0}
                className="p-1 rounded bg-white/5 border border-white/10 text-white/60 hover:text-white transition disabled:opacity-30"
              >
                <HiOutlineArrowUp className="text-sm" />
              </button>
              <button
                onClick={() => moveProject(idx, 1)}
                disabled={idx === (resume.projects.length - 1)}
                className="p-1 rounded bg-white/5 border border-white/10 text-white/60 hover:text-white transition disabled:opacity-30"
              >
                <HiOutlineArrowDown className="text-sm" />
              </button>
              <button
                onClick={() => removeProject(idx)}
                className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
              >
                <HiOutlineTrash className="text-sm" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/60 font-medium">Project Title</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                  className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
                  placeholder="e.g. SportNest - Sports Facility Booking Platform"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/60 font-medium">Live Demo Link</label>
                <input
                  type="text"
                  value={project.liveLink}
                  onChange={(e) => handleProjectChange(idx, "liveLink", e.target.value)}
                  className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/60 font-medium">Client Code Repository</label>
                <input
                  type="text"
                  value={project.clientLink}
                  onChange={(e) => handleProjectChange(idx, "clientLink", e.target.value)}
                  className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/60 font-medium">Server Code Repository</label>
                <input
                  type="text"
                  value={project.serverLink}
                  onChange={(e) => handleProjectChange(idx, "serverLink", e.target.value)}
                  className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-white/60 font-medium">Description</label>
              <textarea
                rows={2}
                value={project.description}
                onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition resize-none leading-relaxed"
                placeholder="A full-stack sports facility booking platform..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-white/60 font-medium">Technologies Used</label>
              <input
                type="text"
                value={project.technologies}
                onChange={(e) => handleProjectChange(idx, "technologies", e.target.value)}
                className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
                placeholder="e.g. Next.js, React.js, Node.js..."
              />
            </div>

            {/* Key Features bullet points list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/60 font-medium">Key Features (Bullet Points)</label>
                <button
                  onClick={() => addProjectFeature(idx)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 hover:bg-white/5 text-[10px] font-semibold text-white/80 transition"
                >
                  <HiOutlinePlus /> Add Bullet
                </button>
              </div>

              <div className="space-y-2.5">
                {project.features?.map((feature, featIdx) => (
                  <div key={featIdx} className="flex items-center gap-3">
                    <span className="text-white/40 text-sm">•</span>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleProjectFeatureChange(idx, featIdx, e.target.value)}
                      className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
                      placeholder="e.g. Browse & Book — Explore facilities..."
                    />
                    <button
                      onClick={() => removeProjectFeature(idx, featIdx)}
                      className="p-1 rounded hover:bg-red-500/10 text-white/40 hover:text-red-400 transition"
                    >
                      <HiOutlineTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Education & Languages side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h2 className="text-lg font-bold text-white">Education History</h2>
            <button
              onClick={addEducation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-semibold text-white/80 transition"
            >
              <HiOutlinePlus /> Add Education
            </button>
          </div>

          <div className="space-y-4">
            {resume?.education?.map((edu, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3 relative"
              >
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => moveEducation(idx, -1)}
                    disabled={idx === 0}
                    className="p-0.5 rounded bg-white/5 border border-white/10 text-white/60 hover:text-white transition disabled:opacity-30"
                  >
                    <HiOutlineArrowUp className="text-xs" />
                  </button>
                  <button
                    onClick={() => moveEducation(idx, 1)}
                    disabled={idx === (resume.education.length - 1)}
                    className="p-0.5 rounded bg-white/5 border border-white/10 text-white/60 hover:text-white transition disabled:opacity-30"
                  >
                    <HiOutlineArrowDown className="text-xs" />
                  </button>
                  <button
                    onClick={() => removeEducation(idx)}
                    className="p-1 rounded hover:bg-red-500/15 text-white/40 hover:text-red-400 transition"
                  >
                    <HiOutlineTrash className="text-xs" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Institution</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleEducationChange(idx, "school", e.target.value)}
                    className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
                    placeholder="e.g. International Islamic University Chattogram"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Degree / Field</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
                      className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
                      placeholder="B.Sc. in Computer Science"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Time Duration</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => handleEducationChange(idx, "year", e.target.value)}
                      className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
                      placeholder="e.g. 2023 - 2027"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h2 className="text-lg font-bold text-white">Languages</h2>
            <button
              onClick={addLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-semibold text-white/80 transition"
            >
              <HiOutlinePlus /> Add Language
            </button>
          </div>

          <div className="space-y-4">
            {resume?.languages?.map((lang, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.01] relative group"
              >
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <input
                    type="text"
                    value={lang.language}
                    onChange={(e) => handleLanguageChange(idx, "language", e.target.value)}
                    className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
                    placeholder="e.g. Bengali"
                  />
                  <input
                    type="text"
                    value={lang.proficiency}
                    onChange={(e) => handleLanguageChange(idx, "proficiency", e.target.value)}
                    className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff4d00]/50 transition"
                    placeholder="e.g. Native"
                  />
                </div>
                <button
                  onClick={() => removeLanguage(idx)}
                  className="p-1.5 rounded hover:bg-red-500/15 text-white/40 hover:text-red-400 transition"
                >
                  <HiOutlineTrash className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button Floating / Footer */}
      <div className="flex justify-end pt-4 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff4d00] text-white hover:bg-[#ff5d14] font-semibold transition disabled:opacity-50"
        >
          <HiOutlineSave className="text-lg" />
          <span>{saving ? "Saving changes..." : "Save Resume"}</span>
        </button>
      </div>
    </div>
  );
}
