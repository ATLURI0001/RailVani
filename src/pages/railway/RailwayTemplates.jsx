import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Copy, Trash2, Edit2, Play, AlertCircle, Check, ArrowLeft, Layers, Sparkles } from "lucide-react";
import Header from "../../components/Header";
import { RAILWAY_URL, authFetch } from "../../utils/api";

const RAILWAY_PAGES = [
  { to: "/railway", label: "Announcement Generator" },
  { to: "/railway/add-train", label: "Fleet Database Editor" },
  { to: "/railway/templates", label: "Templates Editor", end: true },
  { to: "/metro", label: "Metros of India" }
];

const DEFAULT_TEMPLATES = [
  {
    _id: "1",
    name: "Is On",
    label: "Is On Platform",
    description: "Train is standing on designated platform ready for passenger boarding.",
    needs: { platform: true }
  },
  {
    _id: "2",
    name: "Has Arrived",
    label: "Has Arrived",
    description: "Train has just arrived on the platform track.",
    needs: { platform: true }
  },
  {
    _id: "3",
    name: "Will Arrive",
    label: "Arriving Shortly",
    description: "Train is entering station premises and approaching platform.",
    needs: { platform: true }
  },
  {
    _id: "4",
    name: "Is Late",
    label: "Running Late",
    description: "Train is delayed by specified hours and minutes.",
    needs: { delay: true, expectedTime: true, platform: true }
  }
];

export default function RailwayTemplates() {
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem("railvani_custom_templates");
      return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  // Form for new/edited template
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [needPlatform, setNeedPlatform] = useState(true);
  const [needDelay, setNeedDelay] = useState(false);
  const [needExpectedTime, setNeedExpectedTime] = useState(false);

  useEffect(() => {
    // Try to sync with backend if available
    authFetch(`${RAILWAY_URL}/api/templates`)
      .then((res) => (res.ok ? res.json() : []))
      .then((serverData) => {
        if (Array.isArray(serverData) && serverData.length > 0) {
          const merged = [...DEFAULT_TEMPLATES];
          serverData.forEach((s) => {
            if (!merged.some((m) => m.name === s.name)) merged.push(s);
          });
          setTemplates(merged);
        }
      })
      .catch(() => {});
  }, []);

  const saveToStorage = (list) => {
    setTemplates(list);
    localStorage.setItem("railvani_custom_templates", JSON.stringify(list));
  };

  const handleEdit = (tpl) => {
    setEditingId(tpl._id || tpl.name);
    setName(tpl.name);
    setLabel(tpl.label || tpl.name);
    setDescription(tpl.description || "");
    setNeedPlatform(!!tpl.needs?.platform);
    setNeedDelay(!!tpl.needs?.delay);
    setNeedExpectedTime(!!tpl.needs?.expectedTime);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !label.trim()) {
      setError("Please fill in template code name and display label.");
      return;
    }

    const tplObj = {
      _id: editingId || String(Date.now()),
      name: name.trim(),
      label: label.trim(),
      description: description.trim(),
      needs: {
        platform: needPlatform,
        delay: needDelay,
        expectedTime: needExpectedTime
      },
      isCustom: true
    };

    let updated;
    if (editingId) {
      updated = templates.map((t) => ((t._id || t.name) === editingId ? tplObj : t));
      setStatusMsg(`Template "${tplObj.label}" updated in database!`);
    } else {
      updated = [tplObj, ...templates];
      setStatusMsg(`New template "${tplObj.label}" created!`);
    }

    saveToStorage(updated);
    clearForm();
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setLabel("");
    setDescription("");
    setNeedPlatform(true);
    setNeedDelay(false);
    setNeedExpectedTime(false);
    setError(null);
  };

  const handleClone = (tpl) => {
    const clone = {
      ...tpl,
      _id: String(Date.now()),
      name: `${tpl.name}_copy`,
      label: `${tpl.label} (Copy)`,
      isCustom: true
    };
    const updated = [clone, ...templates];
    saveToStorage(updated);
    setStatusMsg(`Cloned template "${clone.label}"!`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDelete = (tpl) => {
    if (window.confirm(`Delete announcement template "${tpl.label || tpl.name}"?`)) {
      const updated = templates.filter((t) => (t._id || t.name) !== (tpl._id || tpl.name));
      saveToStorage(updated);
      setStatusMsg(`Template removed.`);
      if (editingId === (tpl._id || tpl.name)) clearForm();
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  return (
    <div
      className="min-h-screen text-slate-100 font-sans pb-28 relative"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.40) 0%, rgba(2, 6, 23, 0.50) 45%, rgba(2, 6, 23, 0.68) 100%), url("/images/railway-platform-bg.jpg")',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center top'
      }}
    >
      <Header pages={RAILWAY_PAGES} />

      {/* Hero Header */}
      <div className="bg-black/90 backdrop-blur-md border-b-2 border-amber-500/60 py-4 px-4 font-mono shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>INDIAN RAILWAYS TEMPLATE DISPATCH ARCHITECTURE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider flex items-center gap-3">
              <Layers className="text-amber-400" size={28} />
              Announcement Templates Editor
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-0.5 max-w-2xl font-sans font-medium">
              Configure sentence templates, required dispatch parameters (platform, delay, ETA), and sequence triggers.
            </p>
          </div>

          <Link
            to="/railway"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-amber-300 border-2 border-amber-400/80 rounded-xl text-xs font-black shadow-[0_0_15px_rgba(245,158,11,0.3)] transition font-mono"
          >
            <ArrowLeft size={16} />
            <span>RETURN TO ANNUNCIATOR</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-7 mt-2">
        {/* ================= EDIT / CREATE TEMPLATE FORM ================= */}
        <div className="rounded-3xl bg-neutral-950/95 backdrop-blur-2xl border-4 border-amber-500/80 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-5 font-mono">
          <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wide">
              {editingId ? `EDITING TEMPLATE: [ ${label} ]` : "CREATE NEW ANNOUNCEMENT TEMPLATE"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={clearForm}
                className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-bold hover:bg-neutral-700"
              >
                Cancel
              </button>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-950 border border-red-600 text-red-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {statusMsg && (
            <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-amber-400 mb-1">
                  Template ID / Code Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Standing_On_Platform"
                  className="w-full px-4 py-2 bg-black border-2 border-neutral-700 rounded-xl text-amber-300 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-400 mb-1">
                  Display Label *
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Is On Platform (Ready to Depart)"
                  className="w-full px-4 py-2 bg-black border-2 border-neutral-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of when this announcement triggers"
                className="w-full px-4 py-2 bg-black border-2 border-neutral-700 rounded-xl text-neutral-300 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Parameter Requirements */}
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-amber-300 uppercase block">
                Required Dispatch Parameters for this Template:
              </span>
              <div className="flex flex-wrap gap-4 text-xs text-neutral-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needPlatform}
                    onChange={(e) => setNeedPlatform(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Platform Number</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needDelay}
                    onChange={(e) => setNeedDelay(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Delay Hours & Minutes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needExpectedTime}
                    onChange={(e) => setNeedExpectedTime(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Expected Arrival Time (ETA)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-black px-6 py-3 rounded-xl text-xs uppercase shadow-[0_0_15px_rgba(245,158,11,0.5)] transition"
            >
              <Check size={16} />
              <span>{editingId ? "Update Template" : "Save Template to Database"}</span>
            </button>
          </form>
        </div>

        {/* ================= EXISTING TEMPLATES GRID ================= */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
          {templates.map((tpl) => (
            <div
              key={tpl._id || tpl.name}
              className="rounded-2xl bg-neutral-950/90 backdrop-blur-xl border-3 border-neutral-800 p-5 flex flex-col justify-between hover:border-amber-400/80 transition shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-black text-sm">{tpl.label || tpl.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-400">
                    {tpl.name}
                  </span>
                </div>
                <p className="text-neutral-400 text-xs font-sans font-medium line-clamp-2">
                  {tpl.description || "Standard train announcement sequence"}
                </p>
                <div className="flex flex-wrap gap-1 pt-1 text-[10px]">
                  {tpl.needs?.platform && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      PF Required
                    </span>
                  )}
                  {tpl.needs?.delay && (
                    <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-700">
                      Delay Active
                    </span>
                  )}
                  {tpl.needs?.expectedTime && (
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                      ETA Clock
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-neutral-800 mt-4 pt-3 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleEdit(tpl)}
                  className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-neutral-700 text-[11px] font-bold"
                >
                  Edit
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleClone(tpl)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded"
                    title="Clone"
                  >
                    <Copy size={14} />
                  </button>
                  {tpl.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDelete(tpl)}
                      className="p-1.5 text-red-400 hover:text-red-300 rounded"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}