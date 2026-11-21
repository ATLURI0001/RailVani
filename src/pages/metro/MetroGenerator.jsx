import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Train, Volume2, Download, AlertCircle, Sparkles, Navigation, Layers, ChevronRight, CheckCircle2 } from "lucide-react";
import Header from "../../components/Header";
import { METRO_URL } from "../../utils/api";
import { ALL_INDIAN_METROS } from "../../data/indianMetros";

const METRO_PAGES = [
  { to: "/metro", label: "Metro Annunciator", end: true },
  { to: "/metro/stations", label: "All 16 Indian Metros Directory" }
];

export default function MetroGenerator() {
  const [data, setData] = useState(null);
  const [errorBanner, setErrorBanner] = useState("");
  const [activeLine, setActiveLine] = useState("Blue");
  const [activeStation, setActiveStation] = useState("");
  const [loading, setLoading] = useState(false);
  const [genError, setGenError] = useState(null);
  const [result, setResult] = useState(null);
  const [viewOtherMetros, setViewOtherMetros] = useState(false);
  const [selectedOtherMetro, setSelectedOtherMetro] = useState(ALL_INDIAN_METROS[0]);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch(`${METRO_URL}/api/lines`)
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load lines (${res.status})`);
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        if (resData.lines?.length) {
          setActiveLine(resData.lines[0].name);
          setActiveStation(resData.lines[0].stations[0]?.name || "");
        }
      })
      .catch((err) => {
        setErrorBanner(err.message);
      });
  }, []);

  const currentLine = data?.lines?.find((l) => l.name === activeLine);
  const currentStation = currentLine?.stations?.find((s) => s.name === activeStation);

  const extrasMap = useMemo(() => {
    return Object.fromEntries((data?.extras || []).map((e) => [e.key, e.label]));
  }, [data]);

  const handleLineChange = (lineName) => {
    setActiveLine(lineName);
    const targetLine = data.lines.find((l) => l.name === lineName);
    setActiveStation(targetLine?.stations[0]?.name || "");
    setResult(null);
    setGenError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentLine || !currentStation) return;

    setLoading(true);
    setGenError(null);
    setResult(null);

    try {
      const res = await fetch(`${METRO_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          line: currentLine.name,
          station: currentStation.name
        })
      });

      const resJson = await res.json().catch(() => ({ error: `Server error (${res.status}).` }));
      if (res.ok) {
        setResult({
          ...resJson,
          audioUrl: `${METRO_URL}${resJson.audioUrl}`
        });
      } else {
        setGenError(resJson);
      }
    } catch (err) {
      setGenError({ error: err.message || "Could not generate metro announcement." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-slate-100 font-sans pb-24 relative"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.45) 0%, rgba(2, 6, 23, 0.55) 45%, rgba(2, 6, 23, 0.72) 100%), url("/images/railway-platform-bg.jpg")',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center top'
      }}
    >
      <Header pages={METRO_PAGES} />

      {/* Hero Announcement Ticker */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Urban Rapid Transit • Digital PIDS Audio System
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <Train className="text-cyan-400" size={28} />
                Metro Rail On-Board Annunciator
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Simulate authentic high-definition in-coach passenger announcements in English, Hindi & Telugu with door opening chime warnings and interchange alerts.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                HD
              </div>
              <div>
                <div className="text-white font-semibold">Available Fleet Audio</div>
                <div className="text-slate-400">Official urban transit voice broadcast</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        {/* Main Annunciator Console */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* In-Coach LED Annunciator Mockup Header */}
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                COACH PIDS DISPLAY • LIVE AUDIO SIMULATOR
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-cyan-400 font-bold">{activeLine} Line</span>
              <span>•</span>
              <span className="text-amber-400 font-mono">DOORS OPEN: LEFT</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {errorBanner ? (
              <div className="p-4 bg-red-950/60 border border-red-800/80 text-red-300 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={18} />
                <div>
                  <div className="font-semibold">Backend Connection Alert</div>
                  <div className="text-xs mt-0.5 text-red-400">{errorBanner}</div>
                </div>
              </div>
            ) : data ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Line Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Select Metro Line
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {data.lines.map((line) => {
                      const isSelected = line.name === activeLine;
                      return (
                        <button
                          key={line.name}
                          type="button"
                          onClick={() => handleLineChange(line.name)}
                          className={`relative flex items-center justify-between p-3.5 rounded-xl border transition text-left ${
                            isSelected
                              ? "bg-slate-800/90 border-cyan-500 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500"
                              : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-4 h-4 rounded-full shrink-0 shadow-md"
                              style={{ backgroundColor: line.color, boxShadow: `0 0 10px ${line.color}88` }}
                            />
                            <div>
                              <div className="font-bold text-sm">{line.name} Line</div>
                              <div className="text-[11px] text-slate-400">
                                {line.stations?.length || 0} Stations
                              </div>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 size={18} className="text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Station Selection */}
                <div>
                  <label htmlFor="metroStation" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Select Upcoming Station (Agla Station)
                  </label>
                  <div className="relative">
                    <select
                      id="metroStation"
                      value={activeStation}
                      onChange={(e) => {
                        setActiveStation(e.target.value);
                        setResult(null);
                        setGenError(null);
                      }}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-medium focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none appearance-none"
                    >
                      {currentLine?.stations.map((s) => (
                        <option key={s.name} value={s.name} className="bg-slate-900 text-white">
                          {s.name} {s.extras?.length ? " [Interchange / Terminal]" : ""}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Electronic In-Coach Preview Screen */}
                {currentStation && (
                  <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-cyan-900/60 rounded-xl p-4 sm:p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-2">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Navigation size={13} className="text-cyan-400" />
                        UPCOMING ANNOUNCEMENT SCRIPT
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-[10px]">
                        TRI-LINGUAL BROADCAST
                      </span>
                    </div>

                    <div className="space-y-1.5 font-sans">
                      <div className="text-white text-base font-bold flex items-center gap-2">
                        <span>Next Station:</span>
                        <span className="text-cyan-300 font-extrabold">{currentStation.name}</span>
                      </div>
                      <div className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        "Next station <strong className="text-white">{currentStation.name}</strong>. Doors will open on the left.
                        {currentStation.extras?.map((k) => ` ${extrasMap[k] || k}.`).join("")}"
                      </div>
                      <div className="text-slate-400 text-xs italic pt-1">
                        (Followed by authentic Telugu and Hindi language broadcast audio)
                      </div>
                    </div>
                  </div>
                )}

                {/* Trigger Button */}
                <button
                  type="submit"
                  disabled={loading || !currentStation}
                  className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-cyan-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing Voice Audio…</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={20} />
                      <span>Broadcast Metro Announcement</span>
                    </>
                  )}
                </button>

                {/* Error Box */}
                {genError && (
                  <div className="p-4 bg-red-950/60 border border-red-800/80 text-red-300 rounded-xl text-sm flex items-start gap-3">
                    <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={18} />
                    <div className="space-y-1">
                      <div className="font-semibold">{genError.error}</div>
                      <div className="text-xs text-red-400">
                        Clip missing in database. Please choose another station or line.
                      </div>
                    </div>
                  </div>
                )}

                {/* Result Audio Player */}
                {result && (
                  <div className="bg-slate-950/90 border border-cyan-500/50 rounded-2xl p-5 space-y-4 shadow-xl shadow-cyan-500/10">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Audio Announcement Ready
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-400">
                        {currentStation?.name} • {activeLine} Line
                      </span>
                    </div>

                    <audio
                      ref={audioRef}
                      src={result.audioUrl}
                      controls
                      autoPlay
                      className="w-full rounded-lg"
                      key={result.audioUrl}
                    />

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                      <a
                        href={`${result.audioUrl}?download=1`}
                        className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                      >
                        <Download size={15} /> Download Master MP3
                      </a>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
                <p className="text-slate-400 text-sm">Connecting to Metro Transit audio feed…</p>
              </div>
            )}
          </div>
        </div>

        {/* Directory of all 16 Indian Metros */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="text-cyan-400" size={20} />
                All 16 Operational Metro Networks in India
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Quick station and line directory across all Indian urban rapid transit systems.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewOtherMetros(!viewOtherMetros)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
            >
              <span>{viewOtherMetros ? "Collapse Directory" : "Browse All 16 Metros"}</span>
              <ChevronRight size={14} className={`transform transition ${viewOtherMetros ? "rotate-90" : ""}`} />
            </button>
          </div>

          {viewOtherMetros && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ALL_INDIAN_METROS.map((metro) => {
                  const isChosen = selectedOtherMetro.id === metro.id;
                  return (
                    <button
                      key={metro.id}
                      type="button"
                      onClick={() => setSelectedOtherMetro(metro)}
                      className={`p-3 rounded-xl text-left border transition text-xs ${
                        isChosen
                          ? "bg-cyan-950/80 border-cyan-500 text-white font-bold ring-1 ring-cyan-500"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="truncate font-semibold">{metro.name}</div>
                      <div className="text-[10px] text-slate-500">{metro.city}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Metro Network Details */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {selectedOtherMetro.name} — {selectedOtherMetro.city}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedOtherMetro.blurb}</p>
                  </div>
                  <Link
                    to="/metro/stations"
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
                  >
                    View Full Directory →
                  </Link>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Lines & Corridors ({selectedOtherMetro.lines.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedOtherMetro.lines.map((l) => (
                      <div
                        key={l.name}
                        className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: l.color }}
                        />
                        <span className="font-medium text-white">{l.name} Line:</span>
                        <span className="text-slate-400">{l.stations.length} stations</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}