"use client";

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
  HiOutlineSparkles,
  HiOutlineCheck,
  HiOutlineRefresh,
  HiOutlineVideoCamera,
  HiOutlineDocumentText,
  HiOutlineColorSwatch,
  HiOutlineCode,
  HiOutlineGlobeAlt,
  HiOutlineBriefcase,
  HiOutlineCog,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineEye,
} from "react-icons/hi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { defaultProcess } from "@/data/defaultProcess";

const ICON_OPTIONS = [
  { key: "video", label: "Meeting / Call", icon: HiOutlineVideoCamera },
  { key: "document", label: "Proposal / Scope", icon: HiOutlineDocumentText },
  { key: "design", label: "UI/UX / Design", icon: HiOutlineColorSwatch },
  { key: "code", label: "Code / Tech", icon: HiOutlineCode },
  { key: "rocket", label: "Launch / Prod", icon: HiOutlineRocketLaunch },
  { key: "sparkles", label: "Sparkles / AI", icon: HiOutlineSparkles },
  { key: "globe", label: "Web / Deploy", icon: HiOutlineGlobeAlt },
  { key: "briefcase", label: "Business / Case", icon: HiOutlineBriefcase },
  { key: "cog", label: "Setup / Config", icon: HiOutlineCog },
];

const PIN_OPTIONS = [
  {
    key: "emerald",
    label: "Emerald",
    gradient: "from-[#1FB57A] to-[#12A36B]",
    text: "text-[#12A36B]",
    border: "border-[#12A36B]/30",
    bg: "bg-[#12A36B]/10 text-[#0F8A5A]",
    dot: "bg-[#12A36B]",
  },
  {
    key: "blue",
    label: "Blue",
    gradient: "from-blue-400 to-blue-600",
    text: "text-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50 text-blue-700",
    dot: "bg-blue-600",
  },
  {
    key: "purple",
    label: "Purple",
    gradient: "from-purple-400 to-purple-600",
    text: "text-purple-600",
    border: "border-purple-200",
    bg: "bg-purple-50 text-purple-700",
    dot: "bg-purple-600",
  },
  {
    key: "teal",
    label: "Teal",
    gradient: "from-teal-400 to-emerald-600",
    text: "text-teal-600",
    border: "border-teal-200",
    bg: "bg-teal-50 text-teal-700",
    dot: "bg-teal-600",
  },
  {
    key: "amber",
    label: "Amber",
    gradient: "from-amber-400 to-orange-500",
    text: "text-amber-600",
    border: "border-amber-200",
    bg: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  {
    key: "rose",
    label: "Rose",
    gradient: "from-rose-400 to-red-500",
    text: "text-rose-600",
    border: "border-rose-200",
    bg: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
];

export default function AdminProcessManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const [formData, setFormData] = useState({
    step: "01",
    title: "",
    subtitle: "",
    description: "",
    tag: "",
    icon: "video",
    pinColor: "emerald",
    active: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/process");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to fetch process items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (
      items.length > 0 &&
      !confirm("You already have steps. Appending initial defaults will add them. Proceed?")
    ) {
      return;
    }

    try {
      setSaving(true);
      for (const def of defaultProcess) {
        await fetch("/api/admin/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(def),
        });
      }
      await fetchItems();
    } catch (err) {
      console.error("Failed seeding process defaults:", err);
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    const nextNum = String(items.length + 1).padStart(2, "0");
    setFormData({
      step: nextNum,
      title: "",
      subtitle: "",
      description: "",
      tag: "",
      icon: "video",
      pinColor: "emerald",
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      step: item.step || "01",
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      tag: item.tag || "",
      icon: item.icon || "video",
      pinColor: item.pinColor || "emerald",
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

    const payload = {
      step: formData.step.trim(),
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      description: formData.description.trim(),
      tag: formData.tag.trim(),
      icon: formData.icon,
      pinColor: formData.pinColor,
      active: formData.active,
    };

    try {
      let res;
      if (editingItem) {
        res = await fetch(`/api/admin/process/${editingItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/process", {
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
        alert("Error saving step: " + (err.error || res.statusText));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save step");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this process step?")) return;

    try {
      const res = await fetch(`/api/admin/process/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMove = async (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= items.length) return;
    const list = [...items];
    const item = list.splice(fromIndex, 1)[0];
    list.splice(toIndex, 0, item);
    setItems(list);

    const reorderedList = list.map((it, idx) => ({
      id: it._id,
      order: idx,
    }));

    try {
      await fetch("/api/admin/process/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: reorderedList }),
      });
    } catch (err) {
      console.error("Failed saving reorder:", err);
    }
  };

  // Drag and drop
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
      await fetch("/api/admin/process/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: reorderedList }),
      });
    } catch (err) {
      console.error("Failed to reorder process steps:", err);
    }
  };

  const selectedPin =
    PIN_OPTIONS.find((p) => p.key === formData.pinColor) || PIN_OPTIONS[0];
  const SelectedIcon =
    (ICON_OPTIONS.find((i) => i.key === formData.icon) || ICON_OPTIONS[0]).icon;

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-white border border-black/8 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
            <span>Work Process Steps</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#12A36B]/10 text-[#0F8A5A] font-mono font-bold">
              {items.length} {items.length === 1 ? "Step" : "Steps"}
            </span>
          </h2>
          <p className="text-xs text-black/50 font-sans mt-0.5">
            Manage the sequential top-to-bottom roadmap cards shown on the homepage. Drag or use arrows to reorder.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {items.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/10 bg-black/4 hover:bg-black/8 text-xs font-semibold text-[#1a1a1a] transition"
            >
              <HiOutlineRefresh className="text-sm" />
              <span>Seed Initial 5 Steps</span>
            </button>
          )}

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#12A36B] hover:bg-[#0E8A5A] text-white text-xs font-bold shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <HiOutlinePlus className="text-sm" />
            <span>Add New Step</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-black/40">
          Loading process steps...
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border-2 border-dashed border-black/10 bg-white/50 p-8 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#12A36B]/10 text-[#12A36B] flex items-center justify-center">
            <HiOutlineSparkles className="text-2xl" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#1a1a1a]">No custom steps found in database</h3>
            <p className="text-xs text-black/50 max-w-sm mx-auto">
              Your site currently displays the 5 default steps. Click below to load them into the database so you can edit, customize, or add new steps!
            </p>
          </div>
          <button
            onClick={handleSeedDefaults}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#12A36B] text-white text-xs font-bold shadow-md hover:bg-[#0E8A5A] transition"
          >
            <HiOutlineRefresh className="text-sm" />
            <span>Load Default 5 Steps</span>
          </button>
        </div>
      ) : (
        /* Steps List */
        <div className="space-y-3">
          {items.map((item, index) => {
            const iconObj =
              ICON_OPTIONS.find((i) => i.key === item.icon) || ICON_OPTIONS[0];
            const StepIcon = iconObj.icon;
            const pinObj =
              PIN_OPTIONS.find((p) => p.key === item.pinColor) || PIN_OPTIONS[0];

            return (
              <div
                key={item._id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-black/8 shadow-xs hover:shadow-md transition-all duration-200"
              >
                {/* Left: Drag Handle, Step Number, Icon, Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="cursor-grab active:cursor-grabbing text-black/30 hover:text-black/70 p-1 shrink-0"
                    title="Drag to reorder"
                  >
                    <HiOutlineSelector className="text-lg" />
                  </div>

                  {/* Step Badge with Pin dot */}
                  <div className="relative shrink-0 flex items-center justify-center">
                    <div
                      className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${pinObj.gradient} shadow-sm text-white flex flex-col items-center justify-center ring-2 ring-white`}
                    >
                      <span className="text-[10px] font-mono font-black tracking-tight leading-none">
                        {item.step || String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Icon & Details */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#1a1a1a] tracking-tight truncate">
                        {item.title}
                      </h4>
                      {item.subtitle && (
                        <span className="text-[11px] font-mono text-black/45">
                          · {item.subtitle}
                        </span>
                      )}
                      {item.active === false && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-100 text-neutral-500 border border-neutral-200">
                          Hidden
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-black/60 line-clamp-1 max-w-xl font-sans">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 pt-0.5">
                      {item.tag && (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border whitespace-nowrap ${pinObj.bg} ${pinObj.border}`}
                        >
                          {item.tag}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-black/40">
                        Icon: {iconObj.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* Up / Down Reorder Arrows */}
                  <button
                    onClick={() => handleMove(index, index - 1)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-black/8 hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none text-black/60 transition"
                    title="Move up"
                  >
                    <HiOutlineArrowUp className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleMove(index, index + 1)}
                    disabled={index === items.length - 1}
                    className="p-1.5 rounded-lg border border-black/8 hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none text-black/60 transition"
                    title="Move down"
                  >
                    <HiOutlineArrowDown className="text-xs" />
                  </button>

                  <button
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/10 hover:bg-black/5 text-xs font-semibold text-[#1a1a1a] transition"
                  >
                    <HiOutlinePencil className="text-xs text-[#12A36B]" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg border border-black/10 hover:bg-red-50 text-red-500 hover:text-red-600 transition"
                    title="Delete step"
                  >
                    <HiOutlineTrash className="text-xs" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/10 my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-black/8 flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[#12A36B]/10 text-[#12A36B]">
                  <HiOutlineSparkles className="text-base" />
                </span>
                <h3 className="text-base font-bold text-[#1a1a1a]">
                  {editingItem ? `Edit Step ${editingItem.step || ""}` : "Add New Process Step"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-black/40 hover:text-[#1a1a1a] text-lg font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Step Number + Title */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-black/70">
                    Step No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="step"
                    value={formData.step}
                    onChange={handleInputChange}
                    required
                    placeholder="01"
                    className="w-full px-3 py-2 rounded-xl border border-black/10 text-sm font-mono font-bold focus:outline-none focus:border-[#12A36B]"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-mono font-bold text-black/70">
                    Step Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Discovery Call"
                    className="w-full px-3 py-2 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-[#12A36B]"
                  />
                </div>
              </div>

              {/* Subtitle + Tag Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-black/70">
                    Subtitle / Scope
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="e.g. 30-Min Strategy Session"
                    className="w-full px-3 py-2 rounded-xl border border-black/10 text-xs focus:outline-none focus:border-[#12A36B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-black/70">
                    Footer Badge (Single Line Pill)
                  </label>
                  <input
                    type="text"
                    name="tag"
                    value={formData.tag}
                    onChange={handleInputChange}
                    placeholder="e.g. 30-Min Strategy Call"
                    className="w-full px-3 py-2 rounded-xl border border-black/10 text-xs font-mono font-semibold focus:outline-none focus:border-[#12A36B]"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-black/70">
                  Step Icon
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {ICON_OPTIONS.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = formData.icon === opt.key;
                    return (
                      <button
                        type="button"
                        key={opt.key}
                        onClick={() => setFormData((p) => ({ ...p, icon: opt.key }))}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition ${
                          isSelected
                            ? "bg-[#12A36B]/10 border-[#12A36B] text-[#12A36B] font-bold shadow-xs"
                            : "bg-black/2 border-black/8 hover:bg-black/5 text-black/70"
                        }`}
                      >
                        <IconComp className="text-xl mb-1" />
                        <span className="text-[10px] leading-tight font-medium">
                          {opt.label.split("/")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pin Color Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-black/70">
                  3D Pushpin Color & Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {PIN_OPTIONS.map((pin) => {
                    const isSelected = formData.pinColor === pin.key;
                    return (
                      <button
                        type="button"
                        key={pin.key}
                        onClick={() => setFormData((p) => ({ ...p, pinColor: pin.key }))}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                          isSelected
                            ? "bg-white border-[#1a1a1a] shadow-xs ring-1 ring-[#1a1a1a]"
                            : "bg-black/2 border-black/8 hover:bg-black/5"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-gradient-to-br ${pin.gradient} shrink-0 shadow-xs`}
                        />
                        <span className="text-xs font-semibold text-[#1a1a1a]">
                          {pin.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-black/70">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Explain what happens in this step clearly and concisely..."
                  className="w-full px-3 py-2 rounded-xl border border-black/10 text-xs leading-relaxed focus:outline-none focus:border-[#12A36B]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded text-[#12A36B] focus:ring-[#12A36B]"
                />
                <label htmlFor="active" className="text-xs font-medium text-black/75 cursor-pointer">
                  Active (show this step on live website)
                </label>
              </div>

              {/* Live Preview Card */}
              <div className="pt-2 border-t border-black/8 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-black/40">
                  <HiOutlineEye className="text-xs" />
                  <span>Live Card Preview:</span>
                </div>
                <div className="relative rounded-3xl bg-white border border-black/10 p-5 shadow-md max-w-sm mx-auto">
                  {/* Pushpin Preview */}
                  <div className="absolute -top-3 left-6 flex items-center justify-center">
                    <div
                      className={`h-6 w-6 rounded-full shadow-md bg-gradient-to-br ${selectedPin.gradient} ring-2 ring-white flex items-center justify-center`}
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-white/80" />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-black/5">
                    <span className={`font-mono text-2xl font-black italic ${selectedPin.text}`}>
                      {formData.step || "01"}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/4 border border-black/5">
                      <SelectedIcon className="text-base text-[#1a1a1a]" />
                    </span>
                  </div>

                  {/* Body */}
                  <div className="space-y-1 pt-2">
                    <h4 className="font-bricolage text-base font-extrabold text-[#1a1a1a]">
                      {formData.title || "Step Title"}
                    </h4>
                    {formData.subtitle && (
                      <p className="text-[11px] font-mono font-semibold text-black/45">
                        {formData.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-black/65 line-clamp-2 leading-relaxed pt-0.5">
                      {formData.description || "Description preview appears here..."}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 mt-3 border-t border-black/5 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border whitespace-nowrap ${selectedPin.bg} ${selectedPin.border}`}
                    >
                      {formData.tag || "Milestone"}
                    </span>
                    <span className="text-[10px] font-mono text-black/40 whitespace-nowrap">
                      Step {formData.step || "01"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-black/8">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-black/10 text-xs font-semibold text-black/70 hover:bg-black/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#12A36B] hover:bg-[#0E8A5A] text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingItem ? "Update Step" : "Create Step"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
