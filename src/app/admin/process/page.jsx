"use client";

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
} from "react-icons/hi";

export default function AdminProcess() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
  });

  // Drag State
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      const res = await fetch("/api/admin/process");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSteps(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingStep(null);
    setFormData({
      id: (steps.length + 1).toString().padStart(2, "0"),
      title: "",
      description: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingStep(item);
    setFormData({
      id: item.id || "",
      title: item.title || "",
      description: item.description || "",
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
      if (editingStep) {
        res = await fetch(`/api/admin/process/${editingStep._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/admin/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        fetchSteps();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
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
        setSteps((prev) => prev.filter((item) => item._id !== id));
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

    const list = [...steps];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setSteps(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);

    // Update numbers on drag to keep "01", "02", "03" sequence logic
    const updatedSteps = steps.map((item, idx) => ({
      ...item,
      id: (idx + 1).toString().padStart(2, "0"),
    }));
    setSteps(updatedSteps);

    // Persist new order & dynamic id updates to DB
    const reorderedList = updatedSteps.map((item, idx) => ({
      id: item._id,
      order: idx,
      // Pass updated sequence step numbers
      stepIdUpdate: item.id,
    }));

    // Wait! Since standard reorder endpoint in Route Factory just updates `order` field, we want to make sure it can update the `id` field too if needed.
    // However, our process route handles updates. We can update each step's order and number ID.
    // Let's call standard reorder PUT. But wait! The reorder endpoint in Route Factory just does `$set: { order }`. If we want to update the `id` field, we can do PUT updates, or just keep it simple.
    // Actually, in Process.jsx, it renders steps. The process steps have `id` ("01", "02", "03") and order.
    // Let's look at Process.jsx. It maps over steps and renders `step.id` and `step.title`.
    // So if the admin drags and reorders steps, we want the `id` to match the sequence ("01", "02", "03", "04") so it displays properly on the front page.
    // Let's modify the processSteps reorder API endpoint or just handle it on the client during Save Reorder!
    // Since we want the public API or front-page client to just display them in sequence, we can either hardcode sequence rendering on the front page (e.g. index + 1 formatted to 2 digits) OR update the database step `id` fields.
    // Let's send updates for all steps to ensure database matches. Since process steps list is very small (always 3-5 items), we can just update them using a custom `reorder` API endpoint or make individual PUT requests.
    // Wait, let's write a custom reorder PUT handler in `src/app/api/admin/process/reorder/route.js` that updates both `order` AND `id` field! That is extremely easy and bulletproof!
    // Let's see:
    // in `src/app/api/admin/process/reorder/route.js`:
    // ops = body.map(({ id, order, stepIdUpdate }) => ({ updateOne: { filter: { _id: id }, update: { $set: { order, id: stepIdUpdate } } } }))
    // This is super clean! Let's make sure the reorder request sends `stepIdUpdate`. Yes!
    const payload = updatedSteps.map((item, idx) => ({
      id: item._id,
      order: idx,
      stepIdUpdate: item.id,
    }));

    try {
      await fetch("/api/admin/process/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed saving process steps order:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Process Workflow</h1>
          <p className="mt-2 text-sm text-white/55">Rearrange development process workflow steps</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#ff4d00] hover:bg-[#e04300] text-sm font-semibold text-white transition active:scale-[0.98] self-start sm:self-auto"
        >
          <HiOutlinePlus className="text-lg" /> Add Step
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
          {steps.length === 0 ? (
            <div className="p-12 text-center text-white/40 text-sm">
              No process steps found. Click "Add Step" to create one.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {steps.map((item, idx) => (
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
                    <span className="font-mono text-xs text-[#ff4d00] font-bold border border-[#ff4d00]/20 bg-[#ff4d00]/5 px-2 py-1 rounded">
                      {item.id}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate text-sm">{item.title}</h3>
                      <p className="text-xs text-white/40 mt-1 truncate">{item.description}</p>
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
              {editingStep ? "Edit Process Step" : "Add Process Step"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                    Step ID
                  </label>
                  <input
                    type="text"
                    required
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="01"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                    Step Title
                  </label>
                  <input
                    type="text"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Discovery"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition focus:border-[#ff4d00]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Step Description
                </label>
                <textarea
                  required
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Summarize the action workflow in this step..."
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
                    "Save Step"
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
