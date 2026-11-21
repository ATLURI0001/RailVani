import React from "react";
import { Link } from "react-router-dom";
import { Train, Landmark, ArrowRight, Volume2, Radio, Sparkles, MapPin, ShieldCheck, CheckCircle2, Zap, Activity } from "lucide-react";
import Header from "../components/Header";
import { SERVICES } from "../utils/api";

const TICKER_ITEMS = [
  "🚆 20677 Vande Bharat Express (Vijayawada ⇄ Chennai)",
  "🔵 Delhi Metro Blue Line (Dwarka ⇄ Noida Electronic City)",
  "🚆 12077 Jan Shatabdi Express (Chennai ⇄ Vijayawada)",
  "🟣 Namma Metro Bengaluru (Challaghatta ⇄ Whitefield)",
  "🚆 12615 Grand Trunk Express (Chennai ⇄ New Delhi)",
  "🔴 Hyderabad Metro Red Line (Miyapur ⇄ LB Nagar)",
  "🚆 12727 Godavari Express (Visakhapatnam ⇄ Hyderabad)",
  "🟢 Kolkata Metro Underwater Line (Howrah Maidan ⇄ Esplanade)",
  "🚆 11019 Konark Express (Mumbai CSMT ⇄ Bhubaneswar)",
  "🔵 Mumbai Metro Line 3 Aqua Line (Aarey ⇄ BKC)",
  "🚆 20701 Vande Bharat Express (Secunderabad ⇄ Tirupati)"
];

export default function Home() {
  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col justify-between relative"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.40) 0%, rgba(2, 6, 23, 0.50) 45%, rgba(2, 6, 23, 0.70) 100%), url("/images/railway-platform-bg.jpg")',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center top'
      }}
    >
      <div>
        <Header />

        {/* Maximalist Station Telemetry Marquee */}
        <div className="bg-black/90 backdrop-blur-md border-b-2 border-amber-500/60 py-2.5 overflow-hidden whitespace-nowrap text-xs text-amber-300 font-mono shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          <div className="inline-flex gap-8 animate-marquee font-extrabold tracking-wider">
            {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                <span className="drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">{item}</span>
                <span className="text-neutral-600 font-normal">///</span>
              </span>
            ))}
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
          
          {/* Maximalist Hero Section */}
          <div className="relative overflow-hidden rounded-3xl border-4 border-amber-500/80 bg-neutral-950/85 backdrop-blur-xl p-8 sm:p-14 shadow-[0_0_50px_rgba(245,158,11,0.35),0_0_80px_rgba(0,0,0,0.9)]">
            {/* Top Hazard Chevrons */}
            <div
              className="absolute top-0 left-0 right-0 h-2"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 12px, #000 12px, #000 24px)"
              }}
            />

            <div className="relative max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-xs font-black tracking-wider uppercase font-mono shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                <Sparkles size={15} className="text-amber-300" />
                <span>CENTRAL PASSENGER AUDIO & PIDS PORTAL</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                Simulate Authentic <span className="text-amber-400 drop-shadow-[0_0_18px_rgba(251,191,36,0.8)]">Indian Railway & Metro</span> Announcements
              </h1>

              <p className="text-neutral-200 text-sm sm:text-base leading-relaxed font-sans font-medium">
                High-fidelity station public address simulator with official human announcer voice audio. Broadcast arrivals, departures, delays, platforms and next-station announcements for 180+ operational fleet trains and all 16 Indian Metro systems.
              </p>

              <div className="pt-3 flex flex-wrap gap-4">
                <Link
                  to="/railway"
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black px-7 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.6)] transition font-mono tracking-wider text-sm active:scale-95"
                >
                  <Train size={20} />
                  <span>INDIAN RAILWAYS CONSOLE</span>
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/metro"
                  className="inline-flex items-center gap-2 bg-neutral-900/90 hover:bg-neutral-800 text-cyan-300 font-extrabold px-6 py-3.5 rounded-2xl border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition font-mono text-sm active:scale-95"
                >
                  <Landmark size={20} />
                  <span>METROS OF INDIA (16 CITIES)</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Transportation Network Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase">
                SELECT TRANSIT NETWORK
              </h2>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                AVAILABLE FLEET AUDIO ACTIVE
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Indian Railways Card */}
              <Link
                to="/railway"
                className="group relative rounded-3xl bg-neutral-950/90 backdrop-blur-xl border-3 border-amber-500/80 p-6 sm:p-8 hover:border-amber-400 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-400 border-2 border-amber-400 group-hover:bg-amber-400 group-hover:text-neutral-950 transition duration-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                      <Train size={32} />
                    </div>
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border-2 border-amber-400/60 font-mono">
                      183 ACTIVE TRAINS
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-400 transition font-mono drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                    Indian Railways
                  </h3>
                  <p className="text-neutral-300 text-sm mt-2 leading-relaxed">
                    Full retro LED annunciator console for Vande Bharat, Jan Shatabdi, Grand Trunk, Charminar, Godavari and Superfast expresses with official fleet master audio in Telugu, Hindi and English.
                  </p>

                  <div className="mt-5 pt-4 border-t-2 border-neutral-800 flex flex-wrap gap-2 text-xs font-mono font-bold text-amber-300">
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700">Vande Bharat</span>
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700">Jan Shatabdi</span>
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700">Superfast Express</span>
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700">Passenger & MEMU</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-neutral-800 flex items-center justify-between text-xs text-amber-400 font-black font-mono group-hover:translate-x-1 transition uppercase tracking-wider">
                  <span>LAUNCH RETRO LED CONSOLE →</span>
                </div>
              </Link>

              {/* Metros of India Card */}
              <Link
                to="/metro"
                className="group relative rounded-3xl bg-neutral-950/90 backdrop-blur-xl border-3 border-cyan-500/80 p-6 sm:p-8 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-4 rounded-2xl bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:text-neutral-950 transition duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      <Landmark size={32} />
                    </div>
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400/60 font-mono">
                      16 METRO NETWORKS
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-400 transition font-mono drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                    Metros of India
                  </h3>
                  <p className="text-neutral-300 text-sm mt-2 leading-relaxed">
                    Digital in-coach annunciator for Delhi Metro (DMRC), Bengaluru Namma Metro, Mumbai Metro, Kolkata Underwater Line, Chennai, Hyderabad HMRL, and all 16 Indian cities.
                  </p>

                  <div className="mt-5 pt-4 border-t-2 border-neutral-800 flex flex-wrap gap-2 text-xs font-mono font-bold text-cyan-300">
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700">Delhi DMRC</span>
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700">Namma Metro</span>
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700">Mumbai</span>
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700">Kolkata</span>
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700">Hyderabad</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-neutral-800 flex items-center justify-between text-xs text-cyan-400 font-black font-mono group-hover:translate-x-1 transition uppercase tracking-wider">
                  <span>LAUNCH METRO ANNUNCIATOR →</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid gap-4 sm:grid-cols-3 pt-4 font-mono">
            <div className="p-5 rounded-2xl bg-neutral-950/85 backdrop-blur-md border-2 border-neutral-700 space-y-2 shadow-lg">
              <div className="text-amber-400 font-black text-sm flex items-center gap-2">
                <Volume2 size={20} />
                <span>AVAILABLE FLEET AUDIO</span>
              </div>
              <p className="text-neutral-300 text-xs leading-relaxed font-sans font-medium">
                Official human voice artist audio tracks curated for Indian Railways and rapid transit operational fleets.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950/85 backdrop-blur-md border-2 border-neutral-700 space-y-2 shadow-lg">
              <div className="text-indigo-400 font-black text-sm flex items-center gap-2">
                <CheckCircle2 size={20} />
                <span>TRILINGUAL BROADCASTS</span>
              </div>
              <p className="text-neutral-300 text-xs leading-relaxed font-sans font-medium">
                Full multilingual support covering Hindi, English, and regional state languages with door chimes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950/85 backdrop-blur-md border-2 border-neutral-700 space-y-2 shadow-lg">
              <div className="text-emerald-400 font-black text-sm flex items-center gap-2">
                <Radio size={20} />
                <span>STATION AMBIENCE & MP3</span>
              </div>
              <p className="text-neutral-300 text-xs leading-relaxed font-sans font-medium">
                Controllable background station noise, platform chimes, and instant broadcast MP3 download exports.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-neutral-800 bg-black/90 backdrop-blur-md py-6 text-center text-xs font-mono text-neutral-400">
        <p className="tracking-wider">RAILVANI — INDIAN RAILWAYS & METRO ANNOUNCEMENT SIMULATOR • PIDS CENTRAL</p>
      </footer>
    </div>
  );
}