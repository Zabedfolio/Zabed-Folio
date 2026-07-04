"use client";

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
} from "react-icons/hi";

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    icon: "",
    color: "#ffffff",
  });

  // Drag State
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSkills(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category: "Frontend",
      icon: "",
      color: "#ffffff",
    });
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || "",
      category: skill.category || "Frontend",
      icon: skill.icon || "",
      color: skill.color || "#ffffff",
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

    try {
      let res;
      if (editingSkill) {
        res = await fetch(`/api/admin/skills/${editingSkill._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        fetchSkills();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Drag and Drop
  const handleDragStart = (idx) => {
    setDraggedIndex(idx);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const list = [...skills];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setSkills(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const reorderedList = skills.map((s, idx) => ({
      id: s._id,
      order: idx,
    }));

    try {
      await fetch("/api/admin/skills/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderedList),
      });
    } catch (err) {
      console.error("Failed saving skill order:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Skills Directory</h1>
          <p className="mt-2 text-sm text-white/55">Rearrange skills shown in the Skills section</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#ff4d00] hover:bg-[#e04300] text-sm font-semibold text-white transition active:scale-[0.98] self-start sm:self-auto"
        >
          <HiOutlinePlus className="text-lg" /> Add Skill
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl glass-panel animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {skills.length === 0 ? (
            <div className="col-span-full p-12 text-center text-white/40 text-sm">
              No skills found. Click "Add Skill" to create one.
            </div>
          ) : (
            skills.map((skill, idx) => (
              <div
                key={skill._id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-4 rounded-xl glass-panel border border-white/5 transition hover:bg-white/[0.01] ${
                  draggedIndex === idx ? "opacity-35 bg-white/[0.05]" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="cursor-grab text-white/20 hover:text-[#ff4d00] transition active:cursor-grabbing">
                    <HiOutlineSelector className="text-lg" />
                  </span>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: skill.color || "#ffffff" }}
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white truncate text-sm">{skill.name}</h3>
                    <p className="text-[10px] font-mono text-white/40 mt-0.5">{skill.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(skill)}
                    title="Edit Skill"
                    className="p-2 text-white/50 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition duration-200"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    title="Delete Skill"
                    className="p-2 text-white/40 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition duration-200"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel border border-white/10 bg-[#0a0808] rounded-3xl p-6 sm:p-8 shadow-card-soft">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingSkill ? "Edit Skill" : "Add New Skill"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Next.js"
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
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Tools">Tools</option>
                  <option value="Design">Design</option>
                  <option value="UI Library">UI Library</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Icon Identifier (React Icons className string name)
                </label>
                <input
                  type="text"
                  required
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="e.g. SiNextdotjs, FaReact"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Theme HEX Color (used for circles/glows)
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-12 h-11 bg-transparent border-0 cursor-pointer rounded-xl flex-shrink-0"
                  />
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="#ffffff"
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
                    "Save Skill"
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
