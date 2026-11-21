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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? formatOption(value) : placeholder}
        </span>
        <span className="text-gray-400 text-xs">▼</span>
      </div>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-100">
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
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div ref={listRef} className="overflow-y-auto max-h-48 p-1">
            {filtered.length === 0 ? (
              <p className="p-2 text-xs text-gray-400 text-center">No options found</p>
            ) : (
              filtered.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => selectItem(opt)}
                  className={`w-full text-left px-3 py-1.5 text-sm rounded ${
                    i === highlightIdx
                      ? "bg-blue-600 text-white"
                      : opt === value
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
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
        <div className="absolute z-30 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto divide-y divide-gray-100">
          {suggestions.map((train, idx) => (
            <button
              key={train["Train No"]}
              type="button"
              onClick={() => handleSelect(train)}
              className={`w-full text-left p-3 text-sm transition ${
                idx === highlightIdx ? "bg-blue-600 text-white" : "hover:bg-blue-50/70 text-gray-800"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm">
                  {train["Train No"]} — {train["Train Name"]}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    idx === highlightIdx
                      ? "bg-blue-800 text-white"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {train["Train Type"]}
                </span>
              </div>
              <div className={`text-xs mt-1 font-medium ${idx === highlightIdx ? "text-blue-100" : "text-gray-600"}`}>
                {train.FROM} ➔ {train.TO}
              </div>
              {train.description && (
                <p className={`text-[11px] mt-1 line-clamp-1 ${idx === highlightIdx ? "text-blue-200" : "text-gray-400"}`}>
                  {train.description}
                </p>
              )}
            </button>
          ))}
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
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            id={`${idPrefix}-${i}`}
            list={datalistId}
            value={v}
            onChange={(e) => handleUpdate(i, e.target.value)}
            placeholder={`Via station ${i + 1}`}
            className="flex-1 min-w-0 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleRemove(i)}
            className="px-2 text-gray-400 hover:text-red-600 transition"
            title="Remove"
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
          className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline pt-1"
        >
          <Plus size={14} /> Add via station
        </button>
      )}
    </div>
  );
}
