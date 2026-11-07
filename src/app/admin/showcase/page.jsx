"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
  HiOutlineSparkles,
  HiOutlineExternalLink,
  HiOutlineCheck,
  HiOutlineRefresh,
} from "react-icons/hi";
import { defaultShowcase } from "@/data/defaultShowcase";

export default function AdminShowcase() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tagline: "",
    story: "",
    highlightsText: "",
    metric1Label: "",
    metric1Value: "",
    metric2Label: "",
    metric2Value: "",
    liveUrl: "",
    githubUrl: "",
    caseStudyUrl: "",
    image: "",
    logo: "jerseyx",
    active: true,
  });

  // Drag State
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/showcase");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to fetch showcase items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (
      items.length > 0 &&
      !confirm("You already have items. Adding initial defaults will append them. Proceed?")
    ) {
      return;
    }

    try {
      setSaving(true);
      for (const def of defaultShowcase) {
        await fetch("/api/admin/showcase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(def),
        });
      }
      await fetchItems();
    } catch (err) {
      console.error("Failed seeding defaults:", err);
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      category: "E-Commerce · Production 2026",
      tagline: "",
      story: "",
      highlightsText: "",
      metric1Label: "Mobile Latency",
      metric1Value: "-70%",
      metric2Label: "Checkout",
      metric2Value: "Sub-Second",
      liveUrl: "",
      githubUrl: "",
      caseStudyUrl: "",
      image: "",
      logo: "jerseyx",
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    const m1 = item.metrics?.[0] || { label: "", value: "" };
    const m2 = item.metrics?.[1] || { label: "", value: "" };
    const highlights = Array.isArray(item.highlights)
      ? item.highlights.join("\n")
      : "";

    setFormData({
      title: item.title || "",
      category: item.category || "",
      tagline: item.tagline || "",
      story: item.story || "",
      highlightsText: highlights,
      metric1Label: m1.label || "",
      metric1Value: m1.value || "",
      metric2Label: m2.label || "",
      metric2Value: m2.value || "",
      liveUrl: item.liveUrl || "",
      githubUrl: item.githubUrl || "",
      caseStudyUrl: item.caseStudyUrl || "",
      image: item.image || "",
      logo: item.logo || "jerseyx",
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

    const highlights = formData.highlightsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const metrics = [];
    if (formData.metric1Value || formData.metric1Label) {
      metrics.push({
        value: formData.metric1Value,
        label: formData.metric1Label,
      });
    }
    if (formData.metric2Value || formData.metric2Label) {
      metrics.push({
        value: formData.metric2Value,
        label: formData.metric2Label,
      });
    }

    const payload = {
      title: formData.title,
      category: formData.category,
      tagline: formData.tagline,
      story: formData.story,
      highlights,
      metrics,
      liveUrl: formData.liveUrl,
      githubUrl: formData.githubUrl,
      caseStudyUrl: formData.caseStudyUrl,
      image: formData.image,
      logo: formData.logo,
      active: formData.active,
    };

    try {
      let res;
      if (editingItem) {
        res = await fetch(`/api/admin/showcase/${editingItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/showcase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        await fetchItems();
        setModalOpen(false);
      } else {
        const err = await res.json();
        alert("Error saving showcase item: " + (err.error || res.statusText));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save showcase item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this showcase item?")) return;

    try {
      const res = await fetch(`/api/admin/showcase/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
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

    const list = [...items];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setItems(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const reorderedList = items.map((item, idx) => ({
      id: item._id,
      order: idx,
    }));

    try {
      await fetch("/api/admin/showcase/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderedList),
      });
    } catch (err) {
      console.error("Failed saving showcase order:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1a1a1a]">
              Production Showcase
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#12A36B]/10 px-2.5 py-0.5 text-xs font-mono font-bold text-[#12A36B]">
              <HiOutlineSparkles className="text-sm" />
              Home Page
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-medium text-black/50">
            Manage flagship works displayed with flat logo tabs on the Home page
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {items.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-black/10 bg-white hover:bg-black/5 text-xs sm:text-sm font-bold text-black/70 transition shadow-sm"
              title="Populate with the 4 default flagships"
            >
              <HiOutlineRefresh className="text-base" />
              <span>Seed 4 Defaults</span>
            </button>
          )}

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 p-2.5 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#1FB57A] to-[#12A36B] hover:from-[#19A36D] hover:to-[#0E8A5A] text-xs sm:text-sm font-bold text-white transition active:scale-[0.98] shadow-sm"
            title="Add Showcase Item"
          >
            <HiOutlinePlus className="text-lg" />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        </div>
      </div>

      {/* List Container */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-white border border-black/8 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="border border-black/8 bg-white rounded-2xl overflow-hidden shadow-sm">
          {items.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-black/50 text-sm">
                No custom showcase items in MongoDB yet. The Home page is currently using the 4 built-in defaults (JerseyX, Hatkhola Bazar, NeighborNotes, ICAW).
              </p>
              <button
                onClick={handleSeedDefaults}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12A36B] text-white text-xs font-bold shadow-sm hover:bg-[#0E8A5A] transition"
              >
                <HiOutlineRefresh className="text-base" />
                <span>Seed 4 Defaults into Database to Edit</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {items.map((item, idx) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 transition hover:bg-black/2 ${
                    draggedIndex === idx ? "opacity-35 bg-black/5" : ""
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <button
                      className="cursor-grab active:cursor-grabbing text-black/30 hover:text-black/70 p-1 mt-1 sm:mt-0"
                      title="Drag to reorder"
                    >
                      <HiOutlineSelector className="text-xl" />
                    </button>

                    {item.image ? (
                      <div className="relative h-12 w-16 sm:h-14 sm:w-20 rounded-xl overflow-hidden bg-black/5 border border-black/10 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-16 sm:h-14 sm:w-20 rounded-xl bg-black/5 border border-black/10 flex items-center justify-center shrink-0 text-black/30 text-xs font-mono">
                        No Img
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#1a1a1a] text-sm sm:text-base">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/5 text-black/60 font-semibold">
                          {item.category}
                        </span>
                        {item.active === false ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                            Hidden
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-black/60 line-clamp-2 max-w-xl font-sans">
                        {item.story}
                      </p>
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#12A36B] hover:underline"
                        >
                          <span>{item.liveUrl}</span>
                          <HiOutlineExternalLink />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 sm:px-3 sm:py-2 rounded-xl border border-black/10 bg-white hover:bg-black/5 text-xs font-bold text-[#1a1a1a] transition shadow-xs flex items-center gap-1.5"
                    >
                      <HiOutlinePencil className="text-sm" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 sm:px-3 sm:py-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-xs font-bold text-rose-600 transition shadow-xs flex items-center gap-1.5"
                    >
                      <HiOutlineTrash className="text-sm" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-black/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-black/8">
              <h2 className="text-xl font-extrabold text-[#1a1a1a]">
                {editingItem ? "Edit Showcase Item" : "New Showcase Item"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-black/40 hover:text-[#1a1a1a] text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-black/60 font-mono">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. JerseyX"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-black/2 focus:bg-white focus:border-[#12A36B] outline-none text-sm transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-black/60 font-mono">
                    Category Badge *
                  </label>
                  <input
                    type="text"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g. E-Commerce · Production 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-black/2 focus:bg-white focus:border-[#12A36B] outline-none text-sm transition"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black/60 font-mono">
                  Tagline / Short Subtitle
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="e.g. High-Performance Sports Apparel Platform"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-black/2 focus:bg-white focus:border-[#12A36B] outline-none text-sm transition"
                />
              </div>

              {/* Outcome Story */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black/60 font-mono">
                  Outcome & Performance Story * (LinkedIn-style narrative)
                </label>
                <textarea
                  name="story"
                  required
                  rows={4}
                  value={formData.story}
                  onChange={handleInputChange}
                  placeholder="e.g. A high-performance sports apparel e-commerce store. Slashed mobile load times by 70% to make checkout feel instant, significantly lowering bounce rates on mobile networks."
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-black/2 focus:bg-white focus:border-[#12A36B] outline-none text-sm transition leading-relaxed"
                />
              </div>

              {/* Highlights */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black/60 font-mono">
                  Engineering Highlights (1 bullet per line)
                </label>
                <textarea
                  name="highlightsText"
                  rows={3}
                  value={formData.highlightsText}
                  onChange={handleInputChange}
                  placeholder="Sub-second 4G load times with edge-rendered Next.js catalog queries&#10;Instant cart state management with zero cumulative layout shifts&#10;Automated WebP/AVIF image pipeline delivering ultra-light mobile payloads"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-black/2 focus:bg-white focus:border-[#12A36B] outline-none text-xs sm:text-sm font-mono transition leading-relaxed"
                />
              </div>

              {/* Floating Metric Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-black/60 font-mono">
                  Impact Metric Chips (Shown as floating badges on mockup)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-black/8 bg-black/2 space-y-2">
                    <span className="text-[11px] font-bold text-black/60 font-mono block">Metric Chip #1</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="metric1Value"
                        value={formData.metric1Value}
                        onChange={handleInputChange}
                        placeholder="Value (e.g. -70%)"
                        className="px-3 py-1.5 rounded-lg border border-black/10 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        name="metric1Label"
                        value={formData.metric1Label}
                        onChange={handleInputChange}
                        placeholder="Label (e.g. Load Time)"
                        className="px-3 py-1.5 rounded-lg border border-black/10 bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-black/8 bg-black/2 space-y-2">
                    <span className="text-[11px] font-bold text-black/60 font-mono block">Metric Chip #2</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="metric2Value"
                        value={formData.metric2Value}
                        onChange={handleInputChange}
                        placeholder="Value (e.g. Instant)"
                        className="px-3 py-1.5 rounded-lg border border-black/10 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        name="metric2Label"
                        value={formData.metric2Label}
                        onChange={handleInputChange}
                        placeholder="Label (e.g. Checkout)"
                        className="px-3 py-1.5 rounded-lg border border-black/10 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* URLs: Live, GitHub, Case Study */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-black/60 font-mono">Live URL</label>
                  <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-black/10 text-xs bg-black/2 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-black/60 font-mono">GitHub URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-black/10 text-xs bg-black/2 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-black/60 font-mono">Case Study Path</label>
                  <input
                    type="text"
                    name="caseStudyUrl"
                    value={formData.caseStudyUrl}
                    onChange={handleInputChange}
                    placeholder="/case-study/..."
                    className="w-full px-3 py-2 rounded-xl border border-black/10 text-xs bg-black/2 focus:bg-white"
                  />
                </div>
              </div>

              {/* Image & Logo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-black/60 font-mono">Mockup Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-black/10 text-xs bg-black/2 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-black/60 font-mono">Logo Preset / URL</label>
                  <select
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 text-xs bg-black/2 focus:bg-white"
                  >
                    <option value="jerseyx">JerseyX Logo Preset</option>
                    <option value="hatkhola">Hatkhola Bazar Logo Preset</option>
                    <option value="neighbornotes">NeighborNotes Logo Preset</option>
                    <option value="icaw">ICAW Logo Preset</option>
                    <option value="custom">Generic Custom Mark</option>
                  </select>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-black/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#12A36B]"></div>
                </label>
                <span className="text-xs font-bold text-[#1a1a1a]">
                  Active (Visible on Home page)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/8">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-black/60 hover:text-[#1a1a1a] hover:bg-black/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1FB57A] to-[#12A36B] hover:from-[#19A36D] hover:to-[#0E8A5A] text-xs font-bold text-white transition shadow-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingItem ? "Update Item" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

