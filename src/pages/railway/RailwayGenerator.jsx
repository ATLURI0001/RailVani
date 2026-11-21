import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Train, Volume2, Download, Search, Sparkles, Clock, AlertCircle, Radio, Activity, Check, ChevronRight, Zap, Shield, Gauge, Sliders } from "lucide-react";
import Header from "../../components/Header";
import { TrainSuggestInput, ViaStationsInput } from "../../components/Combobox";
import { RAILWAY_URL } from "../../utils/api";
import { getFleetTrains, resolveAudioTrainNumber } from "../../utils/trainDatabase";
import { useAuth } from "../../context/AuthContext";

const RAILWAY_PAGES = [
  { to: "/railway", label: "Announcement Generator", end: true },
  { to: "/railway/add-train", label: "Fleet Database Editor", admin: true },
  { to: "/railway/templates", label: "Templates Editor", admin: true },
  { to: "/metro", label: "Metros of India" }
];

const cleanViaStations = (arr) => [...new Set(arr.map((s) => s.trim()).filter(Boolean))];

const QUICK_FLEET = [
  { no: "20677", name: "Vande Bharat Exp", from: "Vijayawada", to: "Chennai" },
  { no: "12077", name: "Jan Shatabdi Exp", from: "Chennai", to: "Vijayawada" },
  { no: "12615", name: "Grand Trunk Exp", from: "Chennai", to: "New Delhi" },
  { no: "12727", name: "Godavari Exp", from: "Visakhapatnam", to: "Hyderabad" },
  { no: "11019", name: "Konark Exp", from: "Mumbai", to: "Bhubaneswar" },
  { no: "12603", name: "Charminar Exp", from: "Chennai", to: "Hyderabad" }
];

const PLATFORMS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export default function RailwayGenerator() {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const urlTrain = searchParams.get("train");
  const [fleetList, setFleetList] = useState(() => getFleetTrains());
  const [trainNumber, setTrainNumber] = useState(() => urlTrain || "20677");
  const [platformNumber, setPlatformNumber] = useState("1");
  const [anncType, setAnncType] = useState("Is On");
  const [delayHours, setDelayHours] = useState("");
  const [delayMinutes, setDelayMinutes] = useState("");
  const [expectedTime, setExpectedTime] = useState("");
  const [trainData, setTrainData] = useState(() => {
    const list = getFleetTrains();
    const initialNo = urlTrain || "20677";
    return list.find((t) => t["Train No"] === initialNo) || list[0];
  });
  const [announceVia, setAnnounceVia] = useState(false);
  const [viaStations, setViaStations] = useState([]);
  const [allStations, setAllStations] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [clockTime, setClockTime] = useState("");
  const audioRef = useRef(null);
  const playerSectionRef = useRef(null);

  // Sync when visitors edit or add trains in the fleet database
  useEffect(() => {
    const handleUpdate = () => {
      const updated = getFleetTrains();
      setFleetList(updated);
      const match = updated.find((t) => String(t["Train No"]) === trainNumber.trim());
      if (match) setTrainData(match);
    };
    window.addEventListener("railvani_fleet_updated", handleUpdate);
    return () => window.removeEventListener("railvani_fleet_updated", handleUpdate);
  }, [trainNumber]);

  // Live Digital Station Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString("en-IN", { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const match = fleetList.find((t) => String(t["Train No"]) === trainNumber.trim());
    if (match) {
      setTrainData(match);
      if (Array.isArray(match.VIA) && match.VIA.length) {
        setViaStations(match.VIA);
      }
    }
  }, [trainNumber, fleetList]);

  useEffect(() => {
    fetch(`${RAILWAY_URL}/api/trains/stations`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const trainStations = new Set(data);
        fleetList.forEach((t) => {
          if (t.FROM) trainStations.add(t.FROM);
          if (t.TO) trainStations.add(t.TO);
          if (Array.isArray(t.VIA)) t.VIA.forEach((s) => trainStations.add(s));
        });
        setAllStations(Array.from(trainStations).sort());
      })
      .catch(() => setAllStations([]));
  }, [fleetList]);

  useEffect(() => {
    fetch(`${RAILWAY_URL}/api/templates`)
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => {
        const visible = list.filter((t) => !t.hidden);
        setTemplates(visible);
        if (visible.length && !visible.some((t) => t.name === anncType)) {
          setAnncType(visible[0].name);
        }
      })
      .catch(() => setTemplates([]));
  }, []);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch((e) => console.error("Audio playback error:", e));
      playerSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [audioUrl]);

  const activeTemplate = templates.find((t) => t.name === anncType);
  const needs = activeTemplate?.needs || {};
  const needsPlatform = !activeTemplate || !!needs.platform;
  const needsDelay = !!needs.delay;
  const needsExpectedTime = !!needs.expectedTime;
  const showTimeOptions = needsDelay || needsExpectedTime;

  // Filter available operational fleet trains (No "recorded" wording)
  const availableFleetTrains = useMemo(() => {
    return fleetList.filter((t) => {
      const q = searchFilter.toLowerCase();
      const matchQuery =
        !q ||
        t["Train No"].includes(q) ||
        t["Train Name"].toLowerCase().includes(q) ||
        t.FROM.toLowerCase().includes(q) ||
        t.TO.toLowerCase().includes(q);

      if (!matchQuery) return false;

      if (categoryFilter === "vande_bharat") {
        return t["Train Name"].includes("Vande Bharat") || t["Train Type"].includes("Vande Bharat");
      }
      if (categoryFilter === "express") {
        return (t["Train Type"].includes("Superfast") || t["Train Type"].includes("Express") || t["Train Type"].includes("Rajdhani") || t["Train Type"].includes("Duronto")) && !t["Train Name"].includes("Vande Bharat");
      }
      if (categoryFilter === "passenger") {
        return t["Train Type"].includes("Passenger") || t["Train Type"].includes("MEMU") || t["Train Type"].includes("DEMU") || t["Train Type"].includes("Special");
      }
      return true;
    });
  }, [fleetList, searchFilter, categoryFilter]);

  const executeBroadcast = async (customTrainNo, customTrainData) => {
    const targetNo = String(customTrainNo || trainNumber || "").trim();
    const targetData = customTrainData || trainData;

    setLoading(true);
    setError(null);
    setAudioUrl(null);
    setWarnings([]);

    if (!targetNo || (needsPlatform && !platformNumber) || (needsDelay && !delayHours && !delayMinutes) || (needsExpectedTime && !expectedTime)) {
      setError("Please fill in all required station fields.");
      setLoading(false);
      return;
    }

    // Resolve audio train number - always prefers the train's own verified recording
    const audioTrainNo = resolveAudioTrainNumber(targetNo);

    const payload = {
      trainNumber: audioTrainNo,
      anncType,
      ...((targetData || announceVia) && { via: announceVia ? cleanViaStations(viaStations) : [] }),
      ...(needsPlatform && { platformNumber }),
      ...(needsDelay && { delayHours: Number(delayHours || 0), delayMinutes: Number(delayMinutes || 0) }),
      ...(needsExpectedTime && { expectedTime })
    };

    try {
      const res = await fetch(`${RAILWAY_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        let errMsg = text;
        try {
          errMsg = JSON.parse(text).error || text;
        } catch {}
        throw new Error(errMsg);
      }

      const data = await res.json();
      if (data.audioUrl) {
        const fullUrl = `${RAILWAY_URL}${data.audioUrl}`;
        setAudioUrl(fullUrl);
        if (data.warnings?.length) {
          setWarnings(data.warnings);
        }
      } else {
        throw new Error("Audio URL missing in response");
      }
    } catch (err) {
      setError(err.message || "Failed to generate announcement.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    executeBroadcast();
  };

  const handleSelectTrain = (t, autoBroadcast = true) => {
    const no = String(t["Train No"]);
    setTrainNumber(no);
    setTrainData(t);
    if (Array.isArray(t.VIA)) setViaStations(t.VIA);
    setError(null);
    if (autoBroadcast) {
      executeBroadcast(no, t);
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

      {/* Maximalist Station Telemetry Banner */}
      <div className="bg-black/90 backdrop-blur-md border-b-2 border-amber-500/60 py-2.5 px-4 font-mono text-[11px] text-amber-400 overflow-x-auto shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 whitespace-nowrap">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-extrabold text-amber-300 tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              PIDS MASTER TX ONLINE
            </span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-300">
              SIGNAL: <strong className="text-emerald-400">MAIN 01 [GREEN / CLEAR]</strong>
            </span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-300">
              TRACTION OHE: <strong className="text-amber-300">25 kV AC 50Hz LIVE</strong>
            </span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-300">
              CABIN INTERLOCK: <strong className="text-cyan-400">ROUTE SECURED</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold">
              SYS CLOCK: {clockTime || "12:00:00"}
            </span>
            <span className="text-emerald-400 font-bold hidden sm:inline">
              PA POWER: 1000W RMS
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-3 sm:p-6 mt-4 space-y-7">

        {/* ================= MAXIMALIST RETRO RAILWAY STATION LED DISPLAY BOARD ================= */}
        <div className="relative rounded-2xl bg-black/90 backdrop-blur-xl border-4 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.45)] overflow-hidden">
          
          {/* Hazard Warning Diagonal Stripe Banner */}
          <div
            className="h-3 w-full border-b border-black"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 12px, #000 12px, #000 24px)"
            }}
          />

          {/* Industrial Riveted Top Header */}
          <div className="bg-neutral-950 px-4 py-2.5 border-b-2 border-amber-500/40 flex flex-wrap items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-500 bg-amber-950 flex items-center justify-center text-[8px] text-amber-400 font-black shadow-[0_0_8px_#f59e0b]">
                ★
              </span>
              <span className="font-extrabold tracking-widest text-amber-400 uppercase text-sm drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]">
                INDIAN RAILWAYS • CENTRAL TRAIN ANNUNCIATION BOARD
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 font-black tracking-widest animate-pulse">
                BROADCAST UNIT ACTIVE
              </span>
            </div>
          </div>

          {/* LED Dot Matrix Screen */}
          <div className="p-5 sm:p-7 bg-[#05070c] font-mono text-amber-400 space-y-5 relative">
            {/* Subtle LED Scanline / Raster Texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage: "radial-gradient(#f59e0b 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px"
              }}
            />

            {/* Top Status Bar on Board */}
            <div className="relative flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-500/40 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-amber-500/25 text-amber-200 border-2 border-amber-400 text-xs font-black tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                  SOUTH CENTRAL RAILWAY DIVISION
                </span>
                <span className="text-neutral-300 font-bold hidden md:inline">
                  STATION PLATFORM AUDIO SYSTEM
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-200/90 font-bold">DESIGNATED BERTH:</span>
                <span className="px-4 py-1 bg-amber-400 text-neutral-950 font-black text-base rounded shadow-[0_0_20px_rgba(251,191,36,0.9)] tracking-widest">
                  {platformNumber ? `PF ${String(platformNumber).padStart(2, "0")}` : "PF 01"}
                </span>
              </div>
            </div>

            {/* Main Segmented LED Readout */}
            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Train Number in Big Digital Segments */}
              <div className="md:col-span-4 bg-black/95 border-3 border-amber-500 rounded-2xl p-4 text-center shadow-[inset_0_0_25px_rgba(245,158,11,0.35),0_0_20px_rgba(245,158,11,0.25)]">
                <div className="text-[11px] text-amber-400 font-bold uppercase tracking-widest mb-1">
                  OFFICIAL TRAIN CODE
                </div>
                <div className="text-4xl sm:text-5xl font-black tracking-widest text-amber-300 drop-shadow-[0_0_18px_rgba(251,191,36,0.9)]">
                  {trainNumber || "20677"}
                </div>
                <div className="text-xs text-amber-200 font-black uppercase mt-1 tracking-wider">
                  {trainData?.["Train Type"] || "SUPERFAST EXPRESS"}
                </div>
              </div>

              {/* Train Name & Route */}
              <div className="md:col-span-8 bg-black/95 border-3 border-amber-500 rounded-2xl p-4 shadow-[inset_0_0_25px_rgba(245,158,11,0.35),0_0_20px_rgba(245,158,11,0.25)] space-y-2">
                <div className="text-[11px] text-amber-400 font-bold uppercase tracking-widest">
                  PASSENGER SERVICE TITLE & ROUTE CORRIDOR
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tracking-wide truncate drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]">
                  {trainData?.["Train Name"] || "Jan Shatabdi Express"}
                </div>
                <div className="text-sm sm:text-base text-amber-300 flex items-center gap-2.5 truncate font-extrabold drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                  <span>{trainData?.FROM || "VIJAYAWADA JN"}</span>
                  <span className="text-amber-400 text-lg">➔➔</span>
                  <span>{trainData?.TO || "CHENNAI CENTRAL"}</span>
                </div>
              </div>
            </div>

            {/* Bottom LED Status Ribbons */}
            <div className="relative flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-amber-500/40 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-white font-extrabold uppercase tracking-wide">
                  CURRENT DISPATCH:
                </span>
                <span className="text-amber-200 font-black bg-amber-950/90 px-3 py-1 rounded border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                  {anncType.toUpperCase()}
                </span>
              </div>
              <div className="text-amber-400/90 font-mono font-bold text-xs flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-300" />
                <span>TRI-LINGUAL (TELUGU • HINDI • ENGLISH)</span>
              </div>
            </div>
          </div>
        </div>


        {/* ================= MAXIMALIST RETRO HARDWARE CONTROL CONSOLE FORM ================= */}
        <div className="relative rounded-3xl bg-neutral-950/95 backdrop-blur-2xl border-4 border-neutral-700 p-6 sm:p-9 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.2)] space-y-7">
          
          {/* Console Top Brand Bar with Metal Screws */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-neutral-700 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <Train size={28} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase font-mono drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                  PIDS ANNUNCIATOR CONTROLLER CONSOLE
                </h2>
                <p className="text-xs text-amber-400 font-mono font-bold">
                  INDIAN RAILWAYS CENTRAL STATION PUBLIC ADDRESS SYSTEM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono">
              {isAdmin ? (
                <Link
                  to="/railway/add-train"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 border-2 border-amber-400 font-black text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)] transition"
                  title="Open the Fleet Database to add, edit, or customize any train"
                >
                  <Sliders size={15} />
                  <span>EDIT DATABASE ({fleetList.length} TRAINS)</span>
                </Link>
              ) : (
                <Link
                  to="/login?next=/railway/add-train"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 border border-neutral-700 font-bold text-xs transition"
                  title="Admin authorization required to edit fleet database"
                >
                  <Shield size={14} />
                  <span>ADMIN PANEL ({fleetList.length} TRAINS)</span>
                </Link>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* SECTION 1: TRAIN UNIT SELECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="trainNumber" className="text-sm font-black font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Zap size={16} className="text-amber-300" />
                  <span>[1] TRAIN NUMBER & FLEET SELECTION</span>
                </label>
                <span className="text-xs font-mono text-neutral-400">
                  Target: <strong className="text-amber-300 text-sm">{trainNumber}</strong>
                </span>
              </div>

              {/* Terminal Style Train Suggest Input */}
              <div className="bg-black border-3 border-amber-500/70 rounded-2xl p-1.5 focus-within:border-amber-400 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
                <TrainSuggestInput
                  value={trainNumber}
                  onChange={(val) => {
                    setTrainNumber(val);
                    setAudioUrl(null);
                  }}
                  onTrain={(t) => {
                    if (t) {
                      handleSelectTrain(t, true);
                    }
                  }}
                  inputClassName="w-full px-4 py-3 bg-transparent border-0 text-amber-300 font-mono text-base placeholder-neutral-600 focus:outline-none tracking-wider font-extrabold"
                />
              </div>

              {/* Quick Fleet Push Buttons (Tactile Retro Station Buttons) */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                  <Radio size={13} className="text-amber-400 animate-pulse" />
                  <span>Fast Access Fleets (Press Any Train to Broadcast Instantly):</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {QUICK_FLEET.map((f) => {
                    const isSelected = trainNumber === f.no;
                    const isBroadcastingThis = isSelected && loading;
                    return (
                      <button
                        key={f.no}
                        type="button"
                        onClick={() => {
                          const t = fleetList.find((tr) => String(tr["Train No"]) === String(f.no));
                          if (t) {
                            handleSelectTrain(t, true);
                          } else {
                            setTrainNumber(f.no);
                            executeBroadcast(f.no, null);
                          }
                        }}
                        className={`p-2.5 rounded-xl border-2 font-mono text-xs transition text-left flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-neutral-950 border-amber-300 font-black shadow-[0_0_20px_rgba(245,158,11,0.6)] ring-2 ring-amber-300 scale-[1.02]"
                            : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-amber-500 hover:bg-neutral-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-black ${isSelected ? "text-neutral-950" : "text-amber-400"}`}>{f.no}</span>
                          {isBroadcastingThis ? (
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                          ) : isSelected ? (
                            <span className="w-2 h-2 rounded-full bg-neutral-950" />
                          ) : null}
                        </div>
                        <div className={`truncate text-[11px] font-bold mt-1 ${isSelected ? "text-neutral-950" : "text-white"}`}>{f.name}</div>
                        <div className={`text-[9px] mt-1 font-bold ${isSelected ? "text-neutral-900" : "text-amber-400/80"}`}>
                          {isBroadcastingThis ? "BROADCASTING..." : "▶ BROADCAST"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Broadcast Transmission Indicator */}
              {loading && (
                <div className="p-3.5 bg-amber-950/90 border-2 border-amber-400 rounded-2xl flex items-center justify-between text-xs font-mono text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse">
                  <div className="flex items-center gap-2.5 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span>TRANSMITTING BROADCAST FOR TRAIN {trainNumber} &bull; {trainData?.["Train Name"] || "Express"}...</span>
                  </div>
                  <span className="text-[10px] bg-amber-400 text-neutral-950 px-2 py-0.5 rounded font-black uppercase">Live Dispatch</span>
                </div>
              )}
            </div>

            {/* SECTION 2: ANNOUNCEMENT SITUATION (ILLUMINATED HARDWARE SWITCHES) */}
            <div className="space-y-3">
              <label className="text-sm font-black font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Activity size={16} className="text-amber-300" />
                <span>[2] ANNOUNCEMENT SITUATION DISPATCH</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(templates.length ? templates : [
                  { name: "Is On", label: "Is On Platform" },
                  { name: "Has Arrived", label: "Has Arrived" },
                  { name: "Will Arrive", label: "Arriving Shortly" },
                  { name: "Is Late", label: "Running Late" }
                ]).map((t) => {
                  const isSelected = anncType === t.name;
                  const isLate = t.name.toLowerCase().includes("late");
                  return (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => setAnncType(t.name)}
                      className={`relative flex items-center justify-between p-3.5 rounded-xl border-3 font-mono transition text-left ${
                        isSelected
                          ? isLate
                            ? "bg-red-950 border-red-500 text-red-100 shadow-[0_0_25px_rgba(239,68,68,0.5)] ring-2 ring-red-400 scale-[1.02]"
                            : "bg-amber-950 border-amber-400 text-amber-100 shadow-[0_0_25px_rgba(245,158,11,0.5)] ring-2 ring-amber-300 scale-[1.02]"
                          : "bg-neutral-900/90 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-3.5 h-3.5 rounded-full shrink-0 border-2 ${
                            isSelected
                              ? isLate
                                ? "bg-red-500 border-red-200 shadow-[0_0_12px_#ef4444]"
                                : "bg-amber-400 border-amber-100 shadow-[0_0_12px_#f59e0b]"
                              : "bg-neutral-800 border-neutral-700"
                          }`}
                        />
                        <span className="text-xs font-black uppercase tracking-wider">{t.label || t.name}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-black text-amber-300 border border-amber-400">
                          ACTIVE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: PLATFORM SELECTOR (MULTI-SEGMENT BERTH BUTTONS) */}
            {needsPlatform && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Gauge size={16} className="text-amber-300" />
                    <span>[3] PLATFORM BERTH TRACK SELECTOR</span>
                  </label>
                  <span className="text-xs font-mono text-neutral-400">
                    Active: <strong className="text-amber-300 text-sm">Platform {platformNumber}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {PLATFORMS.map((pf) => {
                    const isSelected = platformNumber === pf;
                    return (
                      <button
                        key={pf}
                        type="button"
                        onClick={() => setPlatformNumber(pf)}
                        className={`py-2.5 px-1 rounded-xl border-2 font-mono text-center text-xs transition ${
                          isSelected
                            ? "bg-amber-400 text-neutral-950 border-amber-300 font-black shadow-[0_0_18px_rgba(245,158,11,0.7)] ring-2 ring-amber-300 scale-105"
                            : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-amber-400 hover:text-white"
                        }`}
                      >
                        PF {pf}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 4: ROUTE VIA STATIONS */}
            <div className="rounded-2xl border-2 border-neutral-700 bg-neutral-900/80 p-4 sm:p-5 space-y-3 font-mono shadow-inner">
              <label className="flex items-center gap-3 text-xs sm:text-sm font-black text-neutral-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announceVia}
                  onChange={(e) => {
                    setAnnounceVia(e.target.checked);
                    if (e.target.checked && viaStations.length === 0) {
                      setViaStations([""]);
                    }
                  }}
                  className="h-5 w-5 accent-amber-500 rounded bg-neutral-800 border-neutral-600"
                />
                <span className="text-amber-300">[4] ANNOUNCE INTERMEDIATE VIA STATIONS</span>
                <span className="text-neutral-500 text-xs font-normal">(OPTIONAL SCRIPT EXPANSION)</span>
              </label>

              {announceVia && (
                <div className="pl-7 space-y-2.5 pt-1">
                  <ViaStationsInput
                    value={viaStations}
                    onChange={setViaStations}
                    stations={allStations}
                    idPrefix="gen-via"
                  />
                  {Array.isArray(trainData?.VIA) && trainData.VIA.length > 0 && (
                    <div className="text-xs text-neutral-300 flex items-center gap-2 flex-wrap pt-1">
                      <span className="text-amber-400 font-bold">Scheduled Stops:</span>
                      {trainData.VIA.map((st) => (
                        <span key={st} className="px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-[11px] font-bold">
                          {st}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SECTION 5: DELAY TIME & CLOCK PANEL */}
            {showTimeOptions && (
              <div className="p-5 bg-neutral-900/95 border-3 border-red-500/60 rounded-2xl space-y-3.5 font-mono shadow-[0_0_25px_rgba(239,68,68,0.25)]">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-red-400 uppercase">
                  <Clock size={18} />
                  <span>[5] DELAY & RE-SCHEDULING PARAMETERS</span>
                </div>

                {needsDelay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-bold text-neutral-300 mb-1">HOURS LATE</span>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={delayHours}
                        onChange={(e) => setDelayHours(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-2.5 bg-black border-2 border-neutral-700 rounded-xl text-amber-300 font-mono text-base font-bold focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-neutral-300 mb-1">MINUTES LATE</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={delayMinutes}
                        onChange={(e) => setDelayMinutes(e.target.value)}
                        placeholder="30"
                        className="w-full px-4 py-2.5 bg-black border-2 border-neutral-700 rounded-xl text-amber-300 font-mono text-base font-bold focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {needsExpectedTime && (
                  <div>
                    <label htmlFor="expectedTime" className="block text-xs font-bold text-neutral-300 mb-1">
                      EXPECTED TIME OF ARRIVAL (ETA)
                    </label>
                    <input
                      type="time"
                      id="expectedTime"
                      value={expectedTime}
                      onChange={(e) => setExpectedTime(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-black border-2 border-neutral-700 rounded-xl text-amber-300 font-mono text-base font-bold focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* SECTION 6: THE MAXIMALIST INDUSTRIAL TRANSMIT BUTTON */}
            <div className="p-1 rounded-2xl bg-[repeating-linear-gradient(45deg,#f59e0b_0,#f59e0b_15px,#000_15px,#000_30px)] shadow-[0_0_35px_rgba(245,158,11,0.5)]">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden group rounded-xl border-3 border-amber-300 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black py-4 sm:py-5 px-6 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer font-mono text-sm sm:text-lg tracking-wider uppercase flex items-center justify-center gap-3 shadow-[inset_0_0_20px_rgba(255,255,255,0.4)]"
              >
                <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition duration-1000" />
                
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                    <span>SYNTHESIZING & BROADCASTING TO PA SYSTEM…</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={26} className="animate-pulse" />
                    <span>⚡ TRANSMIT FLEET AUDIO ANNOUNCEMENT (PA SYSTEM)</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* SECTION 7: PUBLIC ADDRESS OUTPUT MONITOR & VU METER */}
          <div className="pt-2">
            {error && (
              <div className="p-4 bg-red-950/90 border-3 border-red-600 text-red-200 rounded-2xl text-xs sm:text-sm font-mono flex items-start gap-3 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={20} />
                <div>
                  <div className="font-black text-sm">TRANSMISSION REJECTED</div>
                  <div className="mt-0.5">{error}</div>
                </div>
              </div>
            )}

            {audioUrl && !loading && (
              <div ref={playerSectionRef} className="p-6 bg-black/95 border-3 border-amber-400 rounded-2xl space-y-4 font-mono shadow-[0_0_35px_rgba(245,158,11,0.5)]">
                {/* Simulated VU Meter Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-neutral-800 pb-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-white font-black tracking-wide text-sm">
                      LIVE STATION PA AUDIO BROADCAST
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <span>VU LEVEL:</span>
                    <span className="px-2 py-0.5 bg-emerald-900/80 text-emerald-400 border border-emerald-600 rounded font-bold">-12dB</span>
                    <span className="px-2 py-0.5 bg-amber-900/80 text-amber-300 border border-amber-600 rounded font-bold">-3dB</span>
                    <span className="px-2 py-0.5 bg-red-900/80 text-red-400 border border-red-600 rounded font-bold">0dB PEAK</span>
                  </div>
                </div>

                <audio key={audioUrl} ref={audioRef} src={audioUrl} controls autoPlay className="w-full rounded-xl" />

                <div className="bg-neutral-900/90 border border-neutral-700/80 rounded-xl p-3 text-[11px] font-mono text-neutral-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">BROADCAST TARGET:</span>
                    <span className="text-amber-300 font-bold">{trainData?.["Train Name"] || `Train ${trainNumber}`} ({trainNumber})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">VOICE PROFILE ENGINE:</span>
                    <span className="text-emerald-400 font-bold">Profile #{resolveAudioTrainNumber(trainNumber)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">AUDIO MASTER:</span>
                    <span className="text-neutral-200 font-mono text-[10px] truncate max-w-[260px]">{audioUrl.split('/').pop()}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <a
                    href={`${audioUrl}?download=1`}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-neutral-900 hover:bg-neutral-800 border-2 border-amber-400 rounded-xl text-xs sm:text-sm font-black text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition"
                  >
                    <Download size={18} /> EXPORT MASTER AUDIO TAPE (.MP3)
                  </a>
                </div>
              </div>
            )}

            {warnings.map((w, idx) => (
              <p key={idx} className="mt-2 text-xs font-mono text-amber-400">
                ⚠ {w}
              </p>
            ))}
          </div>

          {/* SECTION 8: OPERATIONAL FLEET ROSTER (183 TRAINS) */}
          <div className="pt-7 border-t-2 border-neutral-700 space-y-4 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Train size={18} className="text-amber-400" />
                  <span>OPERATIONAL FLEET ROSTER ({availableFleetTrains.length} / {fleetList.length} ACTIVE TRAINS)</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Select any train across Indian Railways to auto-load route and broadcast parameters
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/railway/add-train"
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Sliders size={13} />
                  <span>Manage Fleet</span>
                </Link>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3.5 py-2 bg-black border-2 border-neutral-700 rounded-xl text-xs text-amber-300 font-bold focus:outline-none"
                >
                  <option value="all">ALL ACTIVE FLEETS ({fleetList.length})</option>
                  <option value="vande_bharat">VANDE BHARAT EXPRESSES</option>
                  <option value="express">SUPERFAST & EXPRESS</option>
                  <option value="passenger">PASSENGER & MEMU</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-neutral-500" size={16} />
              <input
                type="text"
                placeholder="Search available fleet by train number, express name, or city…"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-black border-2 border-neutral-800 rounded-xl text-sm text-amber-200 placeholder-neutral-600 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="max-h-72 overflow-y-auto p-2.5 bg-black/90 border-2 border-neutral-800 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableFleetTrains.map((t) => {
                const isSelected = trainNumber === t["Train No"];
                const isBroadcastingThis = isSelected && loading;
                return (
                  <button
                    key={t["Train No"]}
                    type="button"
                    onClick={() => handleSelectTrain(t, true)}
                    className={`p-3.5 rounded-xl text-left border-2 transition text-xs flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-amber-950/80 border-amber-400 text-white font-bold ring-2 ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                        : "bg-neutral-900/90 border-neutral-800 hover:border-amber-500/70 hover:bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-amber-400 text-base">{t["Train No"]}</span>
                      <span className="text-[10px] text-neutral-400 uppercase font-bold">{t["Train Type"]}</span>
                    </div>
                    <div className="truncate font-black text-white mt-1 text-sm">{t["Train Name"]}</div>
                    <div className="text-[11px] text-neutral-400 truncate mt-1">
                      {t.FROM} ➔ {t.TO}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-neutral-800/80 text-[10px] font-mono">
                      <span className={isSelected ? "text-amber-300 font-bold" : "text-neutral-500"}>
                        {isBroadcastingThis ? "BROADCASTING LIVE..." : "▶ PRESS TO ANNOUNCE"}
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}