"use client";

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
  HiOutlineEye,
  HiOutlineCode,
  HiOutlineCheck,
} from "react-icons/hi";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    year: "",
    image: "",
    description: "",
    challenge: "",
    improvements: "",
    liveUrl: "",
    githubUrl: "",
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
      category: "Full Stack",
      year: new Date().getFullYear().toString(),
      image: "",
      description: "",
      challenge: "",
      improvements: "",
      liveUrl: "",
      githubUrl: "",
      tags: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      category: project.category || "",
      year: project.year || "",
      image: project.image || "",
      description: project.description || "",
      challenge: project.challenge || "",
      improvements: project.improvements || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags || "",
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      id: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    try {
      let res;
      if (editingProject) {
        // Update
        res = await fetch(`/api/admin/projects/${editingProject._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
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

  // HTML5 Drag and Drop handlers
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
    // Persist new order in DB
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
          <h1 className="text-3xl font-bold tracking-tight text-white">Projects Showcase</h1>
          <p className="mt-2 text-sm text-white/55">Drag items to rearrange public sorting order</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#ff4d00] hover:bg-[#e04300] text-sm font-semibold text-white transition active:scale-[0.98] self-start sm:self-auto"
        >
          <HiOutlinePlus className="text-lg" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl glass-panel animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-white/5 bg-[#0a0808]/40 rounded-2xl overflow-hidden">
          {projects.length === 0 ? (
            <div className="p-12 text-center text-white/40 text-sm">
              No projects added yet. Click "Add Project" to get started.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {projects.map((project, idx) => (
                <div
                  key={project._id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-4 sm:p-5 transition hover:bg-white/[0.01] ${
                    draggedIndex === idx ? "opacity-35 bg-white/[0.05]" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="cursor-grab text-white/30 hover:text-[#ff4d00] p-1 transition active:cursor-grabbing">
                      <HiOutlineSelector className="text-xl" />
                    </span>
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover bg-white/5 border border-white/10 hidden sm:block"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate">{project.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-white/60">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 truncate max-w-lg mt-1">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.05] transition"
                    >
                      <HiOutlinePencil className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-2 text-white/40 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition"
                    >
                      <HiOutlineTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl glass-panel border border-white/10 bg-[#0a0808] rounded-3xl p-6 sm:p-8 my-8 shadow-card-soft">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingProject ? "Edit Project Details" : "Create New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Taskly"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5 focus:ring-1 focus:ring-[#ff4d00]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Design">Design</option>
                    <option value="UI Library">UI Library</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                    Release Year
                  </label>
                  <input
                    type="text"
                    required
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g. 2026"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                    Mockup Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/mockup.png"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Tags / Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Next.js, React, Tailwind CSS, MongoDB"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Short Description
                </label>
                <textarea
                  required
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="A brief overview of the project scope and purpose..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Development Challenges
                </label>
                <textarea
                  name="challenge"
                  rows={3}
                  value={formData.challenge}
                  onChange={handleInputChange}
                  placeholder="What was the main engineering challenge you solved?"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Future Improvements
                </label>
                <textarea
                  name="improvements"
                  rows={2}
                  value={formData.improvements}
                  onChange={handleInputChange}
                  placeholder="What would you add or refactor in future versions?"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                    Live Booking / App URL
                  </label>
                  <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleInputChange}
                    placeholder="https://myproject.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                    GitHub Code Repository URL
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/Zabedfolio/..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/[0.03] text-sm font-semibold text-white/80 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff4d00] hover:bg-[#e04300] text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
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
