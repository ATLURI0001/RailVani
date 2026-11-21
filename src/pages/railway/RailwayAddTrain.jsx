import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Check, AlertCircle, Search, Edit3, Trash2, ArrowLeft, Volume2, RotateCcw, Sparkles, Train, Radio, Sliders } from "lucide-react";
import Header from "../../components/Header";
import { ViaStationsInput } from "../../components/Combobox";
import {
  getFleetTrains,
  saveCustomTrain,
  deleteCustomTrain,
  resetFleetToDefault,
  VOICE_AUDIO_PROFILES
} from "../../utils/trainDatabase";

const RAILWAY_PAGES = [
  { to: "/railway", label: "Announcement Generator" },
  { to: "/railway/add-train", label: "Fleet Database Editor", end: true },
  { to: "/metro", label: "Metros of India" }
];

const TRAIN_TYPES = [
  "Vande Bharat Express",
  "Rajdhani Express",
  "Shatabdi Express",
  "Duronto Express",
  "Superfast Express",
  "Express",
  "Mail",
  "Intercity Express",
  "Passenger",
  "MEMU / DEMU",
  "Special Express"
];

export default function RailwayAddTrain() {
  const navigate = useNavigate();
  const [fleetList, setFleetList] = useState(() => getFleetTrains());
  const [editingTrainNo, setEditingTrainNo] = useState(null);

  // Form states
  const [trainNo, setTrainNo] = useState("");
  const [trainName, setTrainName] = useState("");
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [trainType, setTrainType] = useState("Superfast Express");
  const [viaStations, setViaStations] = useState([]);
  const [voiceEngine, setVoiceEngine] = useState("20677");
  const [description, setDescription] = useState("");

  const [tableSearch, setTableSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Sync when fleet changes
  useEffect(() => {
    const handleUpdate = () => {
      setFleetList(getFleetTrains());
    };
    window.addEventListener("railvani_fleet_updated", handleUpdate);
    return () => window.removeEventListener("railvani_fleet_updated", handleUpdate);
  }, []);

  const clearForm = () => {
    setEditingTrainNo(null);
    setTrainNo("");
    setTrainName("");
    setFromStation("");
    setToStation("");
    setTrainType("Superfast Express");
    setViaStations([]);
    setVoiceEngine("20677");
    setDescription("");
    setError(null);
  };

  const handleEdit = (train) => {
    setEditingTrainNo(train["Train No"]);
    setTrainNo(train["Train No"]);
    setTrainName(train["Train Name"] || "");
    setFromStation(train.FROM || "");
    setToStation(train.TO || "");
    setTrainType(train["Train Type"] || "Superfast Express");
    setViaStations(Array.isArray(train.VIA) ? [...train.VIA] : []);
    setVoiceEngine(train.voiceEngine || "20677");
    setDescription(train.description || "");
    setError(null);
    setMessage(`Editing train: ${train["Train No"]} — ${train["Train Name"]}`);
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!trainNo.trim() || !fromStation.trim() || !toStation.trim()) {
      setError("Please fill in Train Number, Origin (FROM), and Destination (TO).");
      return;
    }

    try {
      const trainPayload = {
        "Train No": trainNo.trim(),
        "Train Name": trainName.trim() || `Express (${trainNo})`,
        FROM: fromStation.trim(),
        TO: toStation.trim(),
        "Train Type": trainType,
        VIA: viaStations.filter(Boolean),
        voiceEngine,
        description: description.trim()
      };

      const saved = saveCustomTrain(trainPayload);
      setFleetList(getFleetTrains());
      setMessage(`Train ${saved["Train No"]} (${saved["Train Name"]}) saved to fleet database!`);
      clearForm();
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setError(err.message || "Could not save train.");
    }
  };

  const handleDelete = (tNo) => {
    if (window.confirm(`Are you sure you want to remove train ${tNo} from the custom database?`)) {
      deleteCustomTrain(tNo);
      setFleetList(getFleetTrains());
      setMessage(`Train ${tNo} removed from database.`);
      if (editingTrainNo === tNo) clearForm();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleResetFleet = () => {
    if (window.confirm("Reset entire fleet database to default verified operational trains? Custom additions will be cleared.")) {
      resetFleetToDefault();
      setFleetList(getFleetTrains());
      clearForm();
      setMessage("Fleet database restored to factory default!");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredFleet = fleetList.filter((t) => {
    const q = tableSearch.toLowerCase().trim();
    const match =
      !q ||
      t["Train No"].includes(q) ||
      t["Train Name"].toLowerCase().includes(q) ||
      t.FROM.toLowerCase().includes(q) ||
      t.TO.toLowerCase().includes(q);

    if (!match) return false;
    if (typeFilter === "custom") return t.isCustom;
    if (typeFilter === "vande_bharat") return t["Train Name"].includes("Vande Bharat");
    if (typeFilter === "rajdhani") return t["Train Type"].includes("Rajdhani") || t["Train Name"].includes("Rajdhani");
    return true;
  });

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
              <span>INDIAN RAILWAYS FLEET DATABASE DISPATCH CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider flex items-center gap-3">
              <Sliders className="text-amber-400" size={28} />
              Train Fleet Database Manager
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-0.5 max-w-2xl font-sans font-medium">
              Visitors have full edit access: add new trains, modify routes, change destinations, and assign master human voice audio engines.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/railway"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-amber-300 border-2 border-amber-400/80 rounded-xl text-xs font-black shadow-[0_0_15px_rgba(245,158,11,0.3)] transition"
            >
              <ArrowLeft size={16} />
              <span>RETURN TO ANNUNCIATOR</span>
            </Link>
            <button
              type="button"
              onClick={handleResetFleet}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/80 rounded-xl text-xs font-bold transition"
              title="Reset fleet database to default verified trains"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-7 mt-2">

        {/* ================= EDIT / CREATE TRAIN CONSOLE ================= */}
        <div className="rounded-3xl bg-neutral-950/95 backdrop-blur-2xl border-4 border-amber-500/80 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400">
                <Edit3 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white font-mono uppercase tracking-wide">
                  {editingTrainNo ? `EDITING TRAIN [ ${editingTrainNo} ]` : "ADD NEW TRAIN TO FLEET DATABASE"}
                </h2>
                <p className="text-xs text-neutral-400 font-mono">
                  {editingTrainNo ? "Update parameters and save changes to active database" : "Enter train information and assign a human voice audio engine"}
                </p>
              </div>
            </div>

            {editingTrainNo && (
              <button
                type="button"
                onClick={clearForm}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono font-bold"
              >
                Cancel Edit Mode
              </button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-950/90 border-2 border-red-600 text-red-200 rounded-xl text-xs font-mono flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="p-4 bg-emerald-950/90 border-2 border-emerald-500 text-emerald-200 rounded-xl text-xs font-mono flex items-start gap-2.5">
              <Check size={18} className="shrink-0 text-emerald-400 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6 font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="trainNoInput" className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  Train Number *
                </label>
                <input
                  id="trainNoInput"
                  type="text"
                  required
                  value={trainNo}
                  onChange={(e) => setTrainNo(e.target.value)}
                  placeholder="e.g. 20679 or 12301"
                  className="w-full px-4 py-2.5 bg-black border-2 border-neutral-700 rounded-xl text-amber-300 text-sm font-bold focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="trainNameInput" className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  Train Name *
                </label>
                <input
                  id="trainNameInput"
                  type="text"
                  required
                  value={trainName}
                  onChange={(e) => setTrainName(e.target.value)}
                  placeholder="e.g. Vande Bharat Express"
                  className="w-full px-4 py-2.5 bg-black border-2 border-neutral-700 rounded-xl text-white text-sm font-bold focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="trainTypeInput" className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  Train Type / Category
                </label>
                <select
                  id="trainTypeInput"
                  value={trainType}
                  onChange={(e) => setTrainType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black border-2 border-neutral-700 rounded-xl text-amber-300 text-sm font-bold focus:border-amber-400 focus:outline-none"
                >
                  {TRAIN_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fromStationInput" className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  Origin Station (FROM) *
                </label>
                <input
                  id="fromStationInput"
                  type="text"
                  required
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                  placeholder="e.g. Secunderabad Junction"
                  className="w-full px-4 py-2.5 bg-black border-2 border-neutral-700 rounded-xl text-white text-sm font-bold focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="toStationInput" className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  Destination Station (TO) *
                </label>
                <input
                  id="toStationInput"
                  type="text"
                  required
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  placeholder="e.g. Tirupati"
                  className="w-full px-4 py-2.5 bg-black border-2 border-neutral-700 rounded-xl text-white text-sm font-bold focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Exact Human Voice Engine Selector */}
              <div>
                <label htmlFor="voiceEngineInput" className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                  <Volume2 size={14} className="text-amber-300" />
                  <span>Exact Human Voice Audio Profile</span>
                </label>
                <select
                  id="voiceEngineInput"
                  value={voiceEngine}
                  onChange={(e) => setVoiceEngine(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black border-2 border-amber-500/70 rounded-xl text-amber-300 text-sm font-bold focus:border-amber-400 focus:outline-none"
                >
                  {VOICE_AUDIO_PROFILES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.tag})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="descInput" className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Service Description & Route Notes (Optional)
              </label>
              <input
                id="descInput"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Premier express connecting major commercial junctions with dedicated pantry car."
                className="w-full px-4 py-2.5 bg-black border-2 border-neutral-700 rounded-xl text-neutral-300 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Save Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] transition text-sm tracking-wider uppercase cursor-pointer"
              >
                <Check size={18} />
                <span>{editingTrainNo ? "UPDATE TRAIN IN DATABASE" : "SAVE NEW TRAIN TO FLEET"}</span>
              </button>

              {editingTrainNo && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="w-full sm:w-auto px-5 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-2 border-neutral-700 rounded-xl text-xs font-bold uppercase"
                >
                  Discard Changes
                </button>
              )}
            </div>
          </form>
        </div>


        {/* ================= FULL INTERACTIVE FLEET DATABASE TABLE ================= */}
        <div className="rounded-3xl bg-neutral-950/95 backdrop-blur-2xl border-4 border-neutral-700 p-6 sm:p-8 space-y-5 font-mono shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-neutral-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Train size={20} className="text-amber-400" />
                <span>ALL FLEET TRAINS DIRECTORY ({filteredFleet.length} / {fleetList.length})</span>
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Click "Edit" on any train to modify its numbers, route, or assigned voice engine.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 bg-black border border-neutral-700 rounded-xl text-xs text-amber-300 focus:outline-none"
              >
                <option value="all">All Trains ({fleetList.length})</option>
                <option value="vande_bharat">Vande Bharat Trains</option>
                <option value="rajdhani">Rajdhani Expresses</option>
                <option value="custom">Visitor Customized</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 text-neutral-500" size={16} />
            <input
              type="text"
              placeholder="Filter database by train number, name, origin, or destination…"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black border-2 border-neutral-800 rounded-xl text-xs text-amber-200 placeholder-neutral-600 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border-2 border-neutral-800">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-black text-amber-400 uppercase tracking-wider text-[11px] border-b-2 border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Train No</th>
                  <th className="py-3 px-4">Train Name</th>
                  <th className="py-3 px-4">Corridor (FROM ➔ TO)</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Voice Audio Engine</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 bg-neutral-950/80">
                {filteredFleet.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-neutral-500">
                      No trains matching your search query. Add a new train above.
                    </td>
                  </tr>
                ) : (
                  filteredFleet.map((t) => (
                    <tr key={t["Train No"]} className="hover:bg-neutral-900/60 transition">
                      <td className="py-3 px-4 font-bold text-amber-400 font-mono text-sm">
                        {t["Train No"]}
                        {t.isCustom && (
                          <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600">
                            Custom
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-white max-w-xs truncate">
                        {t["Train Name"]}
                      </td>
                      <td className="py-3 px-4 text-neutral-300 text-[11px]">
                        <span className="font-semibold text-white">{t.FROM}</span>
                        <span className="text-amber-500 mx-1.5">➔</span>
                        <span className="font-semibold text-white">{t.TO}</span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-neutral-400">
                        {t["Train Type"]}
                      </td>
                      <td className="py-3 px-4 text-[10px] text-amber-300 font-mono">
                        {t.voiceEngine ? `Profile #${t.voiceEngine}` : `Native #${t["Train No"]}`}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleEdit(t)}
                          className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-600 text-xs font-bold transition inline-flex items-center gap-1"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigate(`/railway?train=${t["Train No"]}`);
                          }}
                          className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 text-xs font-bold transition inline-flex items-center gap-1"
                        >
                          <Volume2 size={12} />
                          <span>Broadcast</span>
                        </button>
                        {t.isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDelete(t["Train No"])}
                            className="px-2 py-1 rounded bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800 text-xs transition inline-flex items-center"
                            title="Delete custom train"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}