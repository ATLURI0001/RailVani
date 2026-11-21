import React, { useState, useEffect, useRef, useId, useMemo } from "react";
import { X, Plus, Info } from "lucide-react";
import { RAILWAY_URL } from "../utils/api";
import { getFleetTrains } from "../utils/trainDatabase";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Searchable dropdown component
export function SelectCombobox({
  label,
  options = [],
  value = "",
  onChange,
  placeholder = "Search…",
  exclude = [],
  formatOption = String,
  id
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(0);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const autoId = useId();
  const selectId = id || autoId;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options
      .filter((opt) => !exclude.includes(opt))
      .filter((opt) => !q || formatOption(opt).toLowerCase().includes(q));
  }, [options, exclude, query, formatOption]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (listRef.current?.children[highlightIdx]) {
      listRef.current.children[highlightIdx].scrollIntoView({ block: "nearest" });
    }
  }, [highlightIdx]);

  const selectItem = (opt) => {
    onChange(opt);
    setQuery("");
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlightIdx((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && open && filtered[highlightIdx]) {
      e.preventDefault();
      selectItem(filtered[highlightIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        id={selectId}
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border-2 border-neutral-700 hover:border-neutral-500 rounded-xl text-sm bg-black/95 text-amber-300 font-mono cursor-pointer flex items-center justify-between focus:border-amber-400 focus:outline-none shadow-[inset_0_0_12px_rgba(0,0,0,0.8)]"
      >
        <span className={value ? "text-amber-200 font-bold" : "text-neutral-500"}>
          {value ? formatOption(value) : placeholder}
        </span>
        <span className="text-amber-400 text-xs">▼</span>
      </div>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-neutral-950/95 backdrop-blur-md border-2 border-amber-500/70 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.95)] max-h-60 overflow-hidden flex flex-col font-mono">
          <div className="p-2 border-b border-neutral-800 bg-black">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightIdx(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Filter..."
              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-amber-200 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div ref={listRef} className="overflow-y-auto max-h-48 p-1 divide-y divide-neutral-900">
            {filtered.length === 0 ? (
              <p className="p-2 text-xs text-neutral-500 text-center">No options found</p>
            ) : (
              filtered.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => selectItem(opt)}
                  className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition ${
                    i === highlightIdx
                      ? "bg-amber-400 text-neutral-950 font-black"
                      : opt === value
                      ? "bg-amber-950/60 text-amber-300 font-bold"
                      : "text-neutral-300 hover:bg-neutral-900"
                  }`}
                >
                  {formatOption(opt)}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Indian Railways Train Suggest Input with comprehensive offline + backend dataset
export function TrainSuggestInput({ value, onChange, onTrain, inputClassName }) {
  const debounced = useDebounce(value?.trim() || "", 150);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!debounced) {
      setSuggestions([]);
      return;
    }

    const q = debounced.toLowerCase();

    const fleet = getFleetTrains();

    // 1. Search in comprehensive Indian Trains dataset
    const localMatches = fleet.filter((t) => {
      const trainNo = String(t["Train No"] || "").toLowerCase();
      const trainName = String(t["Train Name"] || "").toLowerCase();
      const from = String(t.FROM || "").toLowerCase();
      const to = String(t.TO || "").toLowerCase();
      return (
        trainNo.startsWith(q) ||
        trainNo.includes(q) ||
        trainName.includes(q) ||
        from.includes(q) ||
        to.includes(q)
      );
    });

    // 2. Also try fetching backend suggestions if applicable
    fetch(`${RAILWAY_URL}/api/trains/suggest?prefix=${encodeURIComponent(debounced)}`)
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => [])
      .then((serverData) => {
        // Merge and deduplicate by Train No
        const mergedMap = new Map();
        localMatches.forEach((item) => mergedMap.set(String(item["Train No"]), item));
        serverData.forEach((item) => {
          const num = String(item["Train No"]);
          if (!mergedMap.has(num)) {
            mergedMap.set(num, item);
          }
        });
        setSuggestions(Array.from(mergedMap.values()).slice(0, 20));
      });
  }, [debounced]);

  const matchedTrain =
    suggestions.find((t) => String(t["Train No"]) === value?.trim()) ||
    getFleetTrains().find((t) => String(t["Train No"]) === value?.trim());

  useEffect(() => {
    onTrain?.(matchedTrain || null);
  }, [matchedTrain?.["Train No"]]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSelect = (train) => {
    onChange(String(train["Train No"]));
    onTrain?.(train);
    setOpen(false);
    setHighlightIdx(-1);
  };

  const showDropdown = open && value?.trim() !== "" && suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        id="trainNumber"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (showDropdown) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightIdx((prev) => Math.min(suggestions.length - 1, prev + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightIdx((prev) => Math.max(0, prev - 1));
            } else if (e.key === "Enter" && highlightIdx >= 0) {
              e.preventDefault();
              handleSelect(suggestions[highlightIdx]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }
        }}
        placeholder="Search by Train No, Name or Station (e.g. 22435, Vande Bharat, Rajdhani, Howrah)"
        className={inputClassName}
        autoComplete="off"
        required
      />

      {showDropdown && (
        <div className="absolute z-30 mt-1.5 w-full bg-neutral-950/95 backdrop-blur-md border-2 border-amber-500/70 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.95)] max-h-72 overflow-y-auto divide-y divide-neutral-800">
          {suggestions.map((train, idx) => {
            const isSelected = idx === highlightIdx;
            return (
              <button
                key={train["Train No"]}
                type="button"
                onClick={() => handleSelect(train)}
                className={`w-full text-left p-3 text-sm transition ${
                  isSelected ? "bg-amber-400 text-neutral-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]" : "hover:bg-neutral-900 text-amber-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-mono font-bold text-sm ${isSelected ? "text-neutral-950" : "text-amber-300"}`}>
                    {train["Train No"]} — {train["Train Name"]}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected
                        ? "bg-neutral-950 text-amber-300"
                        : "bg-amber-950/80 text-amber-300 border border-amber-500/50"
                    }`}
                  >
                    {train["Train Type"]}
                  </span>
                </div>
                <div className={`text-xs mt-1 font-mono ${isSelected ? "text-neutral-900 font-bold" : "text-neutral-400"}`}>
                  {train.FROM} ➔ {train.TO}
                </div>
                {train.description && (
                  <p className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? "text-neutral-800" : "text-neutral-500"}`}>
                    {train.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Via Stations Dynamic Input List
export function ViaStationsInput({ value = [], onChange, stations = [], idPrefix = "via" }) {
  const datalistId = useId();

  const handleUpdate = (idx, text) => {
    const updated = [...value];
    updated[idx] = text;
    onChange(updated);
  };

  const handleRemove = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const handleAdd = () => {
    onChange([...value, ""]);
  };

  return (
    <div className="space-y-2.5">
      {value.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[11px] text-amber-500/70 font-bold select-none pointer-events-none">
              #{String(i + 1).padStart(2, "0")}
            </span>
            <input
              id={`${idPrefix}-${i}`}
              list={datalistId}
              value={v}
              autoComplete="off"
              onChange={(e) => handleUpdate(i, e.target.value)}
              placeholder={`Enter via station ${i + 1} (e.g. Vijayawada, Warangal)`}
              style={{ backgroundColor: "#0a0a0a", color: "#fef3c7" }}
              className="w-full pl-11 pr-4 py-2.5 bg-neutral-950 border-2 border-neutral-700 hover:border-neutral-500 focus:border-amber-400 rounded-xl text-sm font-mono font-bold text-amber-200 placeholder-neutral-600 focus:outline-none focus:shadow-[0_0_15px_rgba(245,158,11,0.25)] transition shadow-[inset_0_0_12px_rgba(0,0,0,0.8)]"
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemove(i)}
            className="p-2.5 bg-neutral-900/90 hover:bg-red-950/80 text-neutral-400 hover:text-red-400 border border-neutral-700 hover:border-red-500 rounded-xl transition flex items-center justify-center shrink-0 shadow-sm"
            title="Remove station"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      <datalist id={datalistId}>
        {stations.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      {value.length < 15 && (
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition shadow-[0_0_12px_rgba(245,158,11,0.15)] mt-1"
        >
          <Plus size={14} className="text-amber-400" />
          <span>+ ADD VIA STATION</span>
        </button>
      )}
    </div>
  );
}
