"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSelector } from "react-icons/hi";

const emptyForm = {
  title: "",
  subtitle: "",
  summary: "",
  liveUrl: "",
  heroSubtitle: "",
  category: "Case Study",
  year: new Date().getFullYear().toString(),
  image: "",
  tags: "",
  marketStats: "",
  chartData: "",
  evidenceCards: "",
  sources: "",
};

export default function AdminCaseStudies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/case-studies");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      subtitle: item.subtitle || "",
      summary: item.summary || "",
      liveUrl: item.liveUrl || "",
      heroSubtitle: item.heroSubtitle || "",
      marketStats: item.marketStats ? JSON.stringify(item.marketStats, null, 2) : "",
      chartData: item.chartData ? JSON.stringify(item.chartData, null, 2) : "",
      evidenceCards: item.evidenceCards ? JSON.stringify(item.evidenceCards, null, 2) : "",
      category: item.category || "Case Study",
      year: item.year || "",
      image: item.image || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
      sources: Array.isArray(item.sources) ? item.sources.join(", ") : item.sources || "",
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidUrl = (value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!isValidUrl(formData.liveUrl)) {
      toast.error("Please enter a valid live URL");
      setSaving(false);
      return;
    }

    // parse JSON inputs and normalize arrays
    let marketStats = [];
    let chartData = {};
    let evidenceCards = [];
    try {
      marketStats = formData.marketStats ? JSON.parse(formData.marketStats) : [];
    } catch (err) {
      toast.error("Invalid JSON in Market stats");
      setSaving(false);
      return;
    }
    try {
      chartData = formData.chartData ? JSON.parse(formData.chartData) : {};
    } catch (err) {
      toast.error("Invalid JSON in Chart data");
      setSaving(false);
      return;
    }
    try {
      evidenceCards = formData.evidenceCards ? JSON.parse(formData.evidenceCards) : [];
    } catch (err) {
      toast.error("Invalid JSON in Evidence cards");
      setSaving(false);
      return;
    }

    const payload = {
      ...formData,
      id: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      marketStats,
      chartData,
      evidenceCards,
      sources: formData.sources
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = editingItem
        ? await fetch(`/api/admin/case-studies/${editingItem._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/case-studies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (res.ok) {
        fetchItems();
        setModalOpen(false);
        toast.success(`Case study ${editingItem ? "updated" : "created"} successfully.`);
      } else {
        toast.error("Unable to save case study.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save case study.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this case study?")) return;
    try {
      const res = await fetch(`/api/admin/case-studies/${id}`, { method: "DELETE" });
      if (res.ok) setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (index) => setDraggedIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const list = [...items];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setItems(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const reordered = items.map((item, index) => ({ id: item._id, order: index }));
    try {
      await fetch("/api/admin/case-studies/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reordered),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Case Studies</h1>
          <p className="mt-2 text-sm text-white/55">Manage portfolio case studies and their public detail pages.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#ff4d00] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e04300]"
        >
          <HiOutlinePlus className="text-lg" /> Add Case Study
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl glass-panel animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0a0808]/40">
          {items.length === 0 ? (
            <div className="p-12 text-center text-sm text-white/40">No case studies yet.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {items.map((item, index) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className="flex items-center justify-between p-4 sm:p-5 transition hover:bg-white/[0.01]"
                >
                  <div className="flex items-center gap-4">
                    <span className="cursor-grab p-1 text-white/30 hover:text-[#ff4d00]">
                      <HiOutlineSelector className="text-xl" />
                    </span>
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="mt-1 text-xs text-white/40">{item.subtitle || item.summary}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(item)} className="rounded-lg p-2 text-white/50 transition hover:bg-white/[0.05] hover:text-white">
                      <HiOutlinePencil className="text-lg" />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="rounded-lg p-2 text-white/40 transition hover:bg-red-500/5 hover:text-red-400">
                      <HiOutlineTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md sm:p-6">
          <div className="glass-panel my-8 w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0a0808]/95 p-6 sm:p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{editingItem ? "Edit Case Study" : "Create Case Study"}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">Title</label>
                  <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">Subtitle</label>
                  <input name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">Summary</label>
                <textarea name="summary" rows={4} value={formData.summary} onChange={handleInputChange} required className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">Live project URL</label>
                  <input name="liveUrl" value={formData.liveUrl} onChange={handleInputChange} className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">Year</label>
                  <input name="year" value={formData.year} onChange={handleInputChange} className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white" />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">Image URL</label>
                  <input name="image" value={formData.image} onChange={handleInputChange} className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">Tags</label>
                  <input name="tags" value={formData.tags} onChange={handleInputChange} className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">Hero subtitle</label>
                <input name="heroSubtitle" value={formData.heroSubtitle} onChange={handleInputChange} className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">Market stats (JSON array)</label>
                <textarea name="marketStats" rows={3} value={formData.marketStats} onChange={handleInputChange} placeholder='[{ "label": "Market value", "value": "$12B+", "detail": "~7.9%" }]' className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">Evidence cards (JSON array)</label>
                <textarea name="evidenceCards" rows={3} value={formData.evidenceCards} onChange={handleInputChange} placeholder='[{ "title": "68–80% renters", "description": "..." }]' className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">Chart data (JSON object)</label>
                <textarea name="chartData" rows={5} value={formData.chartData} onChange={handleInputChange} placeholder='{"holdings":[{ "city":"Dhaka","holdings":592000 }]}' className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">Sources (comma separated)</label>
                <input name="sources" value={formData.sources} onChange={handleInputChange} className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white" />
              </div>

              <div className="flex justify-end gap-3 border-t border-white/5 pt-5">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.03]">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-[#ff4d00] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e04300] disabled:opacity-50">
                  {saving ? "Saving..." : "Save Case Study"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" theme="dark" toastClassName="toast-theme" />
    </div>
  );
}
