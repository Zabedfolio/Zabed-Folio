"use client";

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
} from "react-icons/hi";

export default function AdminLearnedSkills() {
  const [learned, setLearned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLearned, setEditingLearned] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    label: "",
    note: "",
  });

  // Drag State
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchLearned();
  }, []);

  const fetchLearned = async () => {
    try {
      const res = await fetch("/api/admin/learned-skills");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLearned(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingLearned(null);
    setFormData({
      label: "",
      note: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingLearned(item);
    setFormData({
      label: item.label || "",
      note: item.note || "",
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
      if (editingLearned) {
        res = await fetch(`/api/admin/learned-skills/${editingLearned._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/admin/learned-skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        fetchLearned();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this learned skill?")) return;

    try {
      const res = await fetch(`/api/admin/learned-skills/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLearned((prev) => prev.filter((item) => item._id !== id));
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

    const list = [...learned];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setLearned(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const reorderedList = learned.map((item, idx) => ({
      id: item._id,
      order: idx,
    }));

    try {
      await fetch("/api/admin/learned-skills/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderedList),
      });
    } catch (err) {
      console.error("Failed saving learned skills order:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Learned Skills</h1>
          <p className="mt-2 text-sm text-white/55">Rearrange chronology items shown on More About page</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#ff4d00] hover:bg-[#e04300] text-sm font-semibold text-white transition active:scale-[0.98] self-start sm:self-auto"
        >
          <HiOutlinePlus className="text-lg" /> Add Entry
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl glass-panel animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-white/5 bg-[#0a0808]/40 rounded-2xl overflow-hidden">
          {learned.length === 0 ? (
            <div className="p-12 text-center text-white/40 text-sm">
              No learned skills entries found. Click "Add Entry" to create one.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {learned.map((item, idx) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-4 sm:p-5 transition hover:bg-white/[0.01] ${
                    draggedIndex === idx ? "opacity-35 bg-white/[0.05]" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="cursor-grab text-white/20 hover:text-[#ff4d00] p-1 transition active:cursor-grabbing">
                      <HiOutlineSelector className="text-lg" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate text-sm">{item.label}</h3>
                      <p className="text-xs text-white/40 mt-1 truncate">{item.note}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.05] transition"
                    >
                      <HiOutlinePencil className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel border border-white/10 bg-[#0a0808] rounded-3xl p-6 sm:p-8 shadow-card-soft">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingLearned ? "Edit Learned Skill" : "Add Learned Skill Entry"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  required
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  placeholder="e.g. Next.js"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5 focus:ring-1 focus:ring-[#ff4d00]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Short Note / Context
                </label>
                <input
                  type="text"
                  required
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="e.g. full-stack React"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50"
                />
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
                    "Save Entry"
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
