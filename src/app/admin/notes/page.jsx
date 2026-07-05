"use client";

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
  HiOutlineCalendar,
  HiOutlinePhotograph,
  HiOutlineGlobeAlt,
} from "react-icons/hi";

const toDatetimeLocal = (date) => {
  const d = date ? new Date(date) : new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
};

export default function AdminNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  
  // Tab within the modal to switch language fields
  const [formLanguage, setFormLanguage] = useState("En"); // "En" or "Bn"

  // Form State
  const [formData, setFormData] = useState({
    titleEn: "",
    titleBn: "",
    descEn: "",
    descBn: "",
    image: "",
    createdAt: "",
  });

  // Drag State
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/admin/notes");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingNote(null);
    setFormLanguage("En");
    setFormData({
      titleEn: "",
      titleBn: "",
      descEn: "",
      descBn: "",
      image: "",
      createdAt: toDatetimeLocal(new Date()),
    });
    setModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setFormLanguage("En");
    setFormData({
      titleEn: note.titleEn || "",
      titleBn: note.titleBn || "",
      descEn: note.descEn || "",
      descBn: note.descBn || "",
      image: note.image || "",
      createdAt: toDatetimeLocal(note.createdAt),
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
      // Parse the local datetime string into a proper Date object on client (respecting client timezone)
      // and format it to ISO string so the server stores it as UTC correctly.
      const payload = {
        ...formData,
        createdAt: formData.createdAt ? new Date(formData.createdAt).toISOString() : new Date().toISOString()
      };

      let res;
      if (editingNote) {
        res = await fetch(`/api/admin/notes/${editingNote._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        fetchNotes();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const res = await fetch(`/api/admin/notes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n._id !== id));
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

    const list = [...notes];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setNotes(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const reorderedList = notes.map((n, idx) => ({
      id: n._id,
      order: idx,
    }));

    try {
      await fetch("/api/admin/notes/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderedList),
      });
    } catch (err) {
      console.error("Failed saving notes order:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Notes Showcase</h1>
          <p className="mt-2 text-sm text-white/55 font-sans">
            Manage your bilingual notes stream. Drag rows to reorder.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#ff4d00] hover:bg-[#e04300] text-sm font-semibold text-white transition active:scale-[0.98] self-start sm:self-auto"
        >
          <HiOutlinePlus className="text-lg" /> Add Note
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl glass-panel animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-white/5 bg-[#0a0808]/40 rounded-2xl overflow-hidden">
          {notes.length === 0 ? (
            <div className="p-12 text-center text-white/40 text-sm">
              No notes found. Click "Add Note" to create one.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notes.map((note, idx) => (
                <div
                  key={note._id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-4 sm:p-5 transition hover:bg-white/[0.01] ${
                    draggedIndex === idx ? "opacity-35 bg-white/[0.05]" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-grow">
                    <span className="cursor-grab text-white/20 hover:text-[#ff4d00] p-1 transition active:cursor-grabbing">
                      <HiOutlineSelector className="text-lg" />
                    </span>
                    
                    {note.image && (
                      <div className="w-12 h-12 rounded-lg border border-white/10 overflow-hidden bg-white/5 flex-shrink-0">
                        <img src={note.image} alt={note.titleEn} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="min-w-0 flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                        <h3 className="font-semibold text-white truncate text-sm">
                          {note.titleEn || "Untitled En"}
                        </h3>
                        {note.titleBn && (
                          <span className="text-[11px] font-mono text-[#ff4d00]/75 bg-[#ff4d00]/5 border border-[#ff4d00]/15 px-2 py-0.5 rounded sm:ml-2 self-start">
                            {note.titleBn}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/40 mt-1 line-clamp-1">
                        {note.descEn || note.descBn || "No description"}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-white/30 font-mono">
                        <HiOutlineCalendar />
                        <span>
                          {note.createdAt ? new Date(note.createdAt).toLocaleString() : "Just now"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(note)}
                      className="p-2 text-white/50 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition"
                    >
                      <HiOutlinePencil className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="p-2 text-white/40 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition"
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
          <div className="w-full max-w-lg glass-panel border border-white/10 bg-[#0a0808] rounded-3xl p-6 sm:p-8 shadow-card-soft">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingNote ? "Edit Note" : "Add New Note"}
              </h2>
              
              {/* Language toggle tab within the form */}
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setFormLanguage("En")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition duration-200 ${
                    formLanguage === "En"
                      ? "bg-[#ff4d00] text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setFormLanguage("Bn")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition duration-200 ${
                    formLanguage === "Bn"
                      ? "bg-[#ff4d00] text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Bengali
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Image URL (Option for Picture) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Picture URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] pl-10 pr-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5"
                  />
                  <HiOutlinePhotograph className="absolute left-3.5 top-3.5 text-white/40 text-lg" />
                </div>
              </div>

              {/* Date and Time (Manual with Auto Button) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Date & Time
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="datetime-local"
                      name="createdAt"
                      value={formData.createdAt}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] pl-10 pr-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5"
                    />
                    <HiOutlineCalendar className="absolute left-3.5 top-3.5 text-white/40 text-lg" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, createdAt: toDatetimeLocal(new Date()) }))}
                    className="px-4 py-3 rounded-xl border border-white/10 hover:border-[#ff4d00]/30 bg-white/[0.02] hover:bg-[#ff4d00]/5 text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white transition whitespace-nowrap"
                  >
                    Auto / Now
                  </button>
                </div>
              </div>

              {/* Dynamic inputs based on Form Language selector */}
              {formLanguage === "En" ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                      Title (English)
                    </label>
                    <input
                      type="text"
                      required
                      name="titleEn"
                      value={formData.titleEn}
                      onChange={handleInputChange}
                      placeholder="Enter note title in English"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                      Description (English)
                    </label>
                    <textarea
                      required
                      rows={5}
                      name="descEn"
                      value={formData.descEn}
                      onChange={handleInputChange}
                      placeholder="Enter description in English..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#ff4d00] mb-2">
                      Title (Bengali / বাংলা)
                    </label>
                    <input
                      type="text"
                      required
                      name="titleBn"
                      value={formData.titleBn}
                      onChange={handleInputChange}
                      placeholder="বাংলায় নোটের শিরোনাম লিখুন"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#ff4d00] mb-2">
                      Description (Bengali / বাংলা)
                    </label>
                    <textarea
                      required
                      rows={5}
                      name="descBn"
                      value={formData.descBn}
                      onChange={handleInputChange}
                      placeholder="বাংলায় বিবরণ লিখুন..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[10px] font-mono text-white/30 flex items-center gap-1">
                  <HiOutlineGlobeAlt className="text-xs" /> Bilingual Form
                </span>
                
                <div className="flex items-center gap-3">
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
                      "Save Note"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
