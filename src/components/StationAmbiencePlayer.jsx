import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, Radio, Sliders } from "lucide-react";

export default function StationAmbiencePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35); // 35% comfortable ambient level
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio play prevented by browser policy:", err);
      });
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
  };

  return (
    <>
      {/* Hidden Loop Audio Element */}
      <audio
        ref={audioRef}
        src="/audio/station-ambience.wav"
        loop
        preload="auto"
      />

      {/* Persistent Floating Ambience Controller Dock */}
      <aside aria-label="Railway Station Ambience Controller" className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-slate-900/95 border border-slate-700/80 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-2xl shadow-black/80 text-white transition-all">
        {/* Animated Sound Wave or Indicator */}
        <button
          type="button"
          onClick={togglePlay}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          title={isPlaying ? "Click to Pause Station Ambience" : "Click to Play Realistic Platform Noise"}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
            isPlaying ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30" : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
          }`}>
            {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
          </div>

          <div className="text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-tight text-white">
                Platform Ambience
              </span>
              {isPlaying && (
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-full bg-amber-400 animate-pulse" />
                  <span className="w-0.5 h-2/3 bg-amber-400 animate-pulse delay-75" />
                  <span className="w-0.5 h-4/5 bg-amber-400 animate-pulse delay-150" />
                </span>
              )}
            </div>
            <div className="text-[9px] text-slate-400">
              {isPlaying ? "Station noise playing" : "Paused • Click to play"}
            </div>
          </div>
        </button>

        {/* Volume & Toggle Expander */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-slate-400 hover:text-white transition"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
        </div>
      </aside>
    </>
  );
}