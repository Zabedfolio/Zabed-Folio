"use client";

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
  HiOutlineLockClosed,
} from "react-icons/hi";

const UPCOMING_PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23222226'/%3E%3Cpath d='M0 0l800 500M800 0L0 500' stroke='%232b2b30' stroke-width='1.5'/%3E%3Ccircle cx='400' cy='250' r='60' fill='%231a1a1c' stroke='%2338383e' stroke-width='2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' font-weight='bold' fill='%23ff5f1a' letter-spacing='4'%3EUPCOMING PROJECT%3C/text%3E%3C/svg%3E";

const AVAILABLE_CATEGORIES = [
  "Full Stack",
  "SaaS & Web Apps",
  "E-Commerce",
  "Frontend",
  "Backend",
  "Mobile",
  "Design",
  "AI / Web3",
  "UI Library",
  "Upcoming",
];

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    status: "completed",
    categories: ["Full Stack"],
    category: "Full Stack",
    year: "",
    image: "",
    description: "",
    challenge: "",
    improvements: "",
    liveUrl: "",
    githubUrl: "",
    isPrivateRepo: false,
    noLiveLink: false,
    tags: "",
  });

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      status: "completed",
      categories: ["Full Stack"],
      category: "Full Stack",
      year: new Date().getFullYear().toString(),
      image: "",
      description: "",
      challenge: "",
      improvements: "",
      liveUrl: "",
      githubUrl: "",
      isPrivateRepo: false,
      noLiveLink: false,
      tags: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);

    // Extract categories cleanly from either categories array or category string
    let initialCategories = [];
    if (Array.isArray(project.categories) && project.categories.length > 0) {
      initialCategories = project.categories;
    } else if (typeof project.category === "string" && project.category) {
      initialCategories = project.category
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    }
    if (initialCategories.length === 0) {
      initialCategories = [project.status === "upcoming" ? "Upcoming" : "Full Stack"];
    }

    setFormData({
      title: project.title || "",
      status: project.status || "completed",
      categories: initialCategories,
      category: initialCategories.join(", "),
      year: project.year || "",
      image: project.image || "",
      description: project.description || "",
      challenge: project.challenge || "",
      improvements: project.improvements || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      isPrivateRepo: Boolean(project.isPrivateRepo),
      noLiveLink: Boolean(project.noLiveLink),
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags || "",
    });
    setModalOpen(true);
  };

  const toggleCategory = (cat) => {
    setFormData((prev) => {
      const current = prev.categories || [];
      const updated = current.includes(cat)
        ? current.filter((c) => c !== cat)
        : [...current, cat];
      return {
        ...prev,
        categories: updated,
        category: updated.join(", "),
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const isUpcoming = formData.status === "upcoming";
    const selectedCategories =
      Array.isArray(formData.categories) && formData.categories.length > 0
        ? formData.categories
        : isUpcoming
        ? ["Upcoming"]
        : ["Full Stack"];

    const payload = {
      ...formData,
      isPrivateRepo: Boolean(formData.isPrivateRepo),
      noLiveLink: Boolean(formData.noLiveLink),
      status: formData.status || "completed",
      categories: selectedCategories,
      category: selectedCategories.join(", "),
      year: formData.year || new Date().getFullYear().toString(),
      image: formData.image || (isUpcoming ? UPCOMING_PLACEHOLDER_IMAGE : ""),
      description: formData.description || (isUpcoming ? "Upcoming project currently in architectural planning phase." : ""),
      id: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
        : [],
    };

    try {
      let res;
      if (editingProject) {
        res = await fetch(`/api/admin/projects/${editingProject._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        fetchProjects();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const list = [...projects];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setProjects(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const reorderedList = projects.map((p, idx) => ({
      id: p._id,
      order: idx,
    }));

    try {
      await fetch("/api/admin/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderedList),
      });
    } catch (err) {
      console.error("Reorder save failed:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1a1a1a]">Projects Showcase</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-black/50">Drag items to rearrange public sorting order</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 p-2.5 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#1FB57A] to-[#12A36B] hover:from-[#19A36D] hover:to-[#0E8A5A] text-xs font-bold text-white shadow-md shadow-[#12A36B]/20 transition active:scale-[0.98] self-end sm:self-auto"
          title="Add Project"
        >
          <HiOutlinePlus className="text-lg" />
          <span className="hidden sm:inline">Add Project</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-3xl bg-white border border-black/8 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="border border-black/8 bg-white rounded-3xl p-12 text-center text-black/40 text-sm font-medium shadow-sm">
          No projects added yet. Click &quot;Add Project&quot; to get started.
        </div>
      ) : (
        <div className="space-y-3.5">
          {projects.map((project, idx) => (
            <div
              key={project._id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`rounded-2xl sm:rounded-3xl border border-black/8 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md hover:border-[#1FB57A]/40 ${
                draggedIndex === idx ? "opacity-35 bg-black/5" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Drag Handle, Image Thumbnail & Title Info */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <span
                    className="cursor-grab text-black/30 hover:text-[#12A36B] p-1.5 rounded-lg hover:bg-black/5 transition active:cursor-grabbing shrink-0 mt-0.5 sm:mt-0"
                    title="Drag to reorder"
                  >
                    <HiOutlineSelector className="text-xl" />
                  </span>

                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover bg-black/4 border border-black/8 shrink-0"
                    />
                  )}

                  <div className="min-w-0 flex-1 space-y-1.5">
                    {/* Title & Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-[#1a1a1a] truncate">
                        {project.title}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-black/4 border border-black/8 text-black/60">
                        {Array.isArray(project.categories) && project.categories.length > 0
                          ? project.categories.join(", ")
                          : project.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                          project.status === "upcoming"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : project.status === "running"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {project.status === "upcoming"
                          ? "Upcoming"
                          : project.status === "running"
                          ? "Running"
                          : "Completed"}
                      </span>
                      {project.isPrivateRepo && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                          <HiOutlineLockClosed className="text-xs text-stone-500" />
                          Private Repo
                        </span>
                      )}
                      {project.year && (
                        <span className="text-[10px] font-mono text-black/40">
                          {project.year}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {project.description && (
                      <p className="text-xs text-black/50 line-clamp-2 max-w-2xl font-normal leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 border-t border-black/5 sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-2 text-black/60 hover:text-[#1a1a1a] rounded-xl hover:bg-black/5 transition"
                    title="Edit project"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 text-black/40 hover:text-red-600 rounded-xl hover:bg-red-500/10 transition"
                    title="Delete project"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-start">
          <div className="relative w-full max-w-4xl bg-white border border-black/10 rounded-3xl p-6 sm:p-8 my-8 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-6">
              {editingProject ? "Edit Project Details" : "Create New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Status Selector */}
              <div className="rounded-2xl border border-black/8 bg-black/2 p-4 space-y-2">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black/60">
                  Project Status / Type
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full sm:w-1/2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-[#1a1a1a] transition focus:border-[#1FB57A] focus:outline-none"
                >
                  <option value="completed">Completed Project</option>
                  <option value="running">Running / In Development</option>
                  <option value="upcoming">Upcoming Project</option>
                </select>
                {formData.status === "upcoming" && (
                  <p className="text-xs font-semibold text-[#12A36B] pt-1">
                    Note: For upcoming projects, only Project Title is required. A sleek default gray banner will be assigned automatically if no mockup URL is provided.
                  </p>
                )}
              </div>

              {/* Row 1: Title & Release Year */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. JerseyXSports"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#1FB57A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1FB57A]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Release Year
                  </label>
                  <input
                    type="text"
                    required={formData.status !== "upcoming"}
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g. 2026"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#1FB57A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1FB57A]/20"
                  />
                </div>
              </div>

              {/* Row 2: Multi-Category Pill Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50">
                    Categories (Select all that apply)
                  </label>
                  <span className="text-[11px] font-mono text-[#12A36B] font-semibold">
                    {formData.categories?.length || 0} selected
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl border border-black/10 bg-black/2 flex flex-wrap gap-2">
                  {AVAILABLE_CATEGORIES.map((cat) => {
                    const isSelected = formData.categories?.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 active:scale-95 ${
                          isSelected
                            ? "bg-[#1FB57A] text-white shadow-sm ring-2 ring-[#12A36B]/30"
                            : "bg-white text-black/65 hover:text-black hover:bg-black/5 border border-black/8 shadow-xs"
                        }`}
                      >
                        <span className="text-[11px]">{isSelected ? "✓" : "+"}</span>
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Image URL, Tech tags */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Mockup Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/mockup.png"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#1FB57A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1FB57A]/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Tags / Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Next.js, React, Tailwind CSS, MongoDB"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#1FB57A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1FB57A]/20"
                  />
                </div>
              </div>

              {/* Row 3: Short Description */}
              <div>
                <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                  Short Description
                </label>
                <textarea
                  required={formData.status !== "upcoming"}
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="A brief overview of the project scope and purpose..."
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#1FB57A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1FB57A]/20"
                />
              </div>

              {/* Row 4: Challenges & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Development Challenges
                  </label>
                  <textarea
                    name="challenge"
                    rows={3}
                    value={formData.challenge}
                    onChange={handleInputChange}
                    placeholder="What was the main engineering challenge you solved?"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#1FB57A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1FB57A]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Future Improvements
                  </label>
                  <textarea
                    name="improvements"
                    rows={3}
                    value={formData.improvements}
                    onChange={handleInputChange}
                    placeholder="What would you add or refactor in future versions?"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#1FB57A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1FB57A]/20"
                  />
                </div>
              </div>

              {/* Row 5: Live URL, Github URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50">
                      Live Booking / App URL
                    </label>
                    {formData.noLiveLink && (
                      <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Live Link Not Created Yet
                      </span>
                    )}
                  </div>
                  <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleInputChange}
                    disabled={formData.noLiveLink}
                    placeholder={formData.noLiveLink ? "Live link not created yet (Deployment pending)" : "https://myproject.com"}
                    className={`w-full rounded-2xl border border-black/10 px-4 py-3 text-sm transition focus:border-[#1FB57A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1FB57A]/20 ${
                      formData.noLiveLink
                        ? "bg-black/5 text-black/40 cursor-not-allowed placeholder-black/30 border-dashed"
                        : "bg-black/3 text-[#1a1a1a] placeholder-black/30"
                    }`}
                  />
                  <label className="mt-2.5 flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="noLiveLink"
                      checked={formData.noLiveLink}
                      onChange={handleInputChange}
                      className="rounded border-black/20 text-[#12A36B] focus:ring-[#1FB57A] h-4 w-4"
                    />
                    <span className="text-xs text-black/60 font-medium">
                      Live link not created yet (Tick if in development or pending)
                    </span>
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50">
                      GitHub Code Repository URL
                    </label>
                    {formData.isPrivateRepo && (
                      <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Private Mode Active
                      </span>
                    )}
                  </div>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    disabled={formData.isPrivateRepo}
                    placeholder={formData.isPrivateRepo ? "Repository is private (public link hidden)" : "https://github.com/Zabedfolio/..."}
                    className={`w-full rounded-2xl border border-black/10 px-4 py-3 text-sm transition focus:border-[#1FB57A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1FB57A]/20 ${
                      formData.isPrivateRepo
                        ? "bg-black/5 text-black/40 cursor-not-allowed placeholder-black/30 border-dashed"
                        : "bg-black/3 text-[#1a1a1a] placeholder-black/30"
                    }`}
                  />
                </div>
              </div>

              {/* Private Repository Option */}
              <div className="rounded-2xl border border-black/8 bg-black/2 p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 transition hover:bg-black/3">
                <div className="flex items-start gap-3.5">
                  <div className={`mt-0.5 p-2.5 rounded-xl transition ${formData.isPrivateRepo ? "bg-[#1FB57A]/10 text-[#12A36B]" : "bg-black/5 text-black/40"}`}>
                    <HiOutlineLockClosed className="text-xl" />
                  </div>
                  <div>
                    <label htmlFor="isPrivateRepo" className="text-sm font-bold text-[#1a1a1a] cursor-pointer flex items-center gap-2">
                      Private Repository
                      {formData.isPrivateRepo && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#1FB57A]/10 text-[#12A36B] border border-[#1FB57A]/20">
                          LOCKED
                        </span>
                      )}
                    </label>
                    <p className="text-xs text-black/50 mt-1 font-normal max-w-xl leading-relaxed">
                      Tick this option if the source code is proprietary or in a private repository. The public site will render a protected &ldquo;Private Repository&rdquo; lock badge instead of a GitHub repository link.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1 sm:mt-0">
                  <input
                    type="checkbox"
                    id="isPrivateRepo"
                    name="isPrivateRepo"
                    checked={formData.isPrivateRepo}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-black/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12A36B]"></div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-black/8">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-2xl border border-black/10 bg-black/4 text-xs font-bold text-[#1a1a1a] hover:bg-black/8 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1FB57A] to-[#12A36B] hover:from-[#19A36D] hover:to-[#0E8A5A] text-xs font-bold text-white transition active:scale-[0.98] disabled:opacity-50 shadow-md shadow-[#12A36B]/20"
                >
                  {saving ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Save Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
