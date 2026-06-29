"use client";

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
} from "react-icons/hi";

export default function AdminEducation() {
  const [edu, setEdu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    date: "",
    institution: "",
    detail: "",
    active: true,
  });

  // Drag State
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchEdu();
  }, []);

  const fetchEdu = async () => {
    try {
      const res = await fetch("/api/admin/education");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEdu(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingEdu(null);
    setFormData({
      date: "",
      institution: "",
      detail: "",
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingEdu(item);
    setFormData({
      date: item.date || "",
      institution: item.institution || "",
      detail: item.detail || "",
      active: item.active !== false,
    });
    setModalOpen(true);
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

    try {
      let res;
      if (editingEdu) {
        res = await fetch(`/api/admin/education/${editingEdu._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/admin/education", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        fetchEdu();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;

    try {
      const res = await fetch(`/api/admin/education/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEdu((prev) => prev.filter((item) => item._id !== id));
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

    const list = [...edu];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setEdu(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const reorderedList = edu.map((item, idx) => ({
      id: item._id,
      order: idx,
    }));

    try {
      await fetch("/api/admin/education/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderedList),
      });
    } catch (err) {
      console.error("Failed saving education order:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Timeline: Education</h1>
          <p className="mt-2 text-sm text-white/55">Rearrange timeline order of your academic credentials</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#ff4d00] hover:bg-[#e04300] text-sm font-semibold text-white transition active:scale-[0.98] self-start sm:self-auto"
        >
          <HiOutlinePlus className="text-lg" /> Add Education
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl glass-panel animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-white/5 bg-[#0a0808]/40 rounded-2xl overflow-hidden">
          {edu.length === 0 ? (
            <div className="p-12 text-center text-white/40 text-sm">
              No education records found. Click "Add Education" to create one.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {edu.map((item, idx) => (
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
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white truncate text-sm">
                          {item.institution}
                        </h3>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                            item.active
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-white/5 text-white/40 border-white/5"
                          }`}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-1 truncate">
                        {item.date} &bull; {item.detail}
                      </p>
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
              {editingEdu ? "Edit Education Entry" : "Add Education Entry"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Degree / Certificate / Course Name
                </label>
                <input
                  type="text"
                  required
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="e.g. BSc in Computer Science"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5 focus:ring-1 focus:ring-[#ff4d00]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Duration / Date Range
                </label>
                <input
                  type="text"
                  required
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="e.g. 2023 — Present"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Institution / Detail Context
                </label>
                <input
                  type="text"
                  required
                  name="detail"
                  value={formData.detail}
                  onChange={handleInputChange}
                  placeholder="e.g. International Islamic University Chittagong"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50"
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="h-4.5 w-4.5 rounded border-white/10 bg-transparent text-[#ff4d00] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="active" className="text-sm font-semibold text-white/70 cursor-pointer">
                  Active (show this entry in the timeline)
                </label>
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
