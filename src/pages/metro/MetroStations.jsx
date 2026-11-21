import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, ArrowUp, ArrowDown, Check, Train, MapPin, Layers, Sparkles } from "lucide-react";
import Header from "../../components/Header";
import { ALL_INDIAN_METROS } from "../../data/indianMetros";

const METRO_PAGES = [
  { to: "/metro", label: "Metro Annunciator" },
  { to: "/metro/stations", label: "All 16 Indian Metros Directory", end: true }
];

export default function MetroStations() {
  const [selectedMetroId, setSelectedMetroId] = useState("delhi");
  const currentMetro = ALL_INDIAN_METROS.find((m) => m.id === selectedMetroId) || ALL_INDIAN_METROS[0];

  const [activeLineName, setActiveLineName] = useState(() => currentMetro.lines[0]?.name || "");
  const [stations, setStations] = useState(() => currentMetro.lines[0]?.stations || []);
  const [newStationName, setNewStationName] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setActiveLineName(currentMetro.lines[0]?.name || "");
    setStations(currentMetro.lines[0]?.stations || []);
    setSuccess(null);
  }, [selectedMetroId]);

  const handleSelectLine = (name) => {
    setActiveLineName(name);
    const line = currentMetro.lines.find((l) => l.name === name);
    setStations(line?.stations || []);
    setSuccess(null);
  };

  const moveStation = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= stations.length) return;
    const copy = [...stations];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setStations(copy);
  };

  const removeStation = (index) => {
    setStations(stations.filter((_, i) => i !== index));
  };

  const addStation = (e) => {
    e.preventDefault();
    if (!newStationName.trim()) return;
    setStations([...stations, { name: newStationName.trim(), extras: [] }]);
    setNewStationName("");
  };

  const handleSave = () => {
    setSuccess(`Stations updated for ${activeLineName} in ${currentMetro.name}!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const lineObj = currentMetro.lines.find((l) => l.name === activeLineName) || currentMetro.lines[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <Header pages={METRO_PAGES} />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Train size={13} />
                Transit Network Explorer
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                All 16 Indian Metro Lines & Stations Directory
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Explore lines, interchange hubs, and station sequences across Delhi DMRC, Bengaluru Namma Metro, Mumbai Metro, Kolkata Metro, and all operational rapid transit networks.
              </p>
            </div>
            <Link
              to="/metro"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-cyan-600/20"
            >
              ← Back to Annunciator
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-6">
        {/* 16 Metro Systems Grid */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select Metro Network ({ALL_INDIAN_METROS.length} Cities)
            </span>
            <span className="text-xs text-cyan-400 font-mono">
              Current: {currentMetro.name}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {ALL_INDIAN_METROS.map((metro) => {
              const isSelected = selectedMetroId === metro.id;
              return (
                <button
                  key={metro.id}
                  type="button"
                  onClick={() => setSelectedMetroId(metro.id)}
                  className={`p-2.5 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                    isSelected
                      ? "bg-cyan-950 border-cyan-500 text-white font-bold ring-1 ring-cyan-500"
                      : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="truncate font-medium">{metro.name.replace(" Metro", "")}</div>
                  <div className={`text-[10px] truncate ${isSelected ? "text-cyan-300" : "text-slate-500"}`}>
                    {metro.city}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Metro Network Overview */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="text-cyan-400" size={20} />
                {currentMetro.name} ({currentMetro.city})
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">{currentMetro.blurb}</p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium px-4 py-2 rounded-xl text-xs border border-slate-700 transition"
            >
              <Check size={14} />
              Save Sequence Changes
            </button>
          </div>

          {success && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <Check size={14} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Line Selector Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Corridor / Line
            </label>
            <div className="flex flex-wrap gap-2">
              {currentMetro.lines.map((l) => {
                const isSelected = l.name === activeLineName;
                return (
                  <button
                    key={l.name}
                    type="button"
                    onClick={() => handleSelectLine(l.name)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                      isSelected
                        ? "bg-slate-800 text-white border-cyan-500 ring-1 ring-cyan-500 shadow-md"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800/60"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: l.color, boxShadow: `0 0 8px ${l.color}aa` }}
                    />
                    <span>{l.name} Line</span>
                    <span className="text-[10px] text-slate-400 font-mono">({l.stations.length})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Station Input */}
          <form onSubmit={addStation} className="flex gap-2">
            <input
              type="text"
              value={newStationName}
              onChange={(e) => setNewStationName(e.target.value)}
              placeholder={`Add custom station to ${activeLineName}…`}
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Plus size={15} /> Add Station
            </button>
          </form>

          {/* Stations List */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800/80 overflow-hidden">
            {stations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No stations on this line. Add the first station above.
              </div>
            ) : (
              stations.map((station, idx) => (
                <div
                  key={station.name + idx}
                  className="p-3 sm:px-4 flex items-center justify-between gap-4 hover:bg-slate-900/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-mono text-slate-500 font-semibold">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: lineObj?.color || "#06b6d4" }}
                    />
                    <div>
                      <span className="font-semibold text-white text-xs sm:text-sm">{station.name}</span>
                      {station.extras?.length > 0 && (
                        <span className="ml-2 text-[10px] text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded-full">
                          {station.extras.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveStation(idx, -1)}
                      className="p-1.5 hover:text-white disabled:opacity-20 rounded"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === stations.length - 1}
                      onClick={() => moveStation(idx, 1)}
                      className="p-1.5 hover:text-white disabled:opacity-20 rounded"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStation(idx)}
                      className="p-1.5 hover:text-red-400 rounded ml-1"
                      title="Remove Station"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}