import { ALL_INDIAN_TRAINS } from "../data/indianTrains";

const STORAGE_KEY = "railvani_custom_fleet_trains";

// Available Master Human Voice Audio Engines from South Central Railway backend
export const VOICE_AUDIO_PROFILES = [
  { id: "20677", name: "Vande Bharat Express (20677)", tag: "High Speed Vande Bharat Audio" },
  { id: "12077", name: "Jan Shatabdi Express (12077)", tag: "Jan Shatabdi Intercity Audio" },
  { id: "12078", name: "Jan Shatabdi Express (12078)", tag: "Jan Shatabdi Reverse Audio" },
  { id: "12615", name: "Grand Trunk Express (12615)", tag: "Historic National Flagship" },
  { id: "12616", name: "Grand Trunk Express (12616)", tag: "Grand Trunk Delhi-Chennai" },
  { id: "12727", name: "Godavari Express (12727)", tag: "Express Corridor Audio" },
  { id: "12603", name: "Charminar Express (12603)", tag: "Overnight Superfast Audio" },
  { id: "12604", name: "Charminar Express (12604)", tag: "Charminar Hyderabad-Chennai" },
  { id: "12703", name: "Falaknuma Express (12703)", tag: "South Central Corridor Audio" },
  { id: "12805", name: "Janmabhoomi Express (12805)", tag: "Intercity Day Superfast" },
  { id: "12622", name: "Tamil Nadu Express (12622)", tag: "Premier Superfast Audio" },
  { id: "12655", name: "Navjeevan Express (12655)", tag: "Western-Southern Corridor" },
  { id: "12711", name: "Pinakini Express (12711)", tag: "Vijayawada - Chennai Superfast" },
  { id: "12733", name: "Narayanadri Express (12733)", tag: "Tirupati - Secunderabad Audio" },
  { id: "12763", name: "Padmavathi Express (12763)", tag: "Padmavathi Superfast Audio" }
];

// All genuine recorded trains present in South Central Railway / Indian Railways backend
export const VERIFIED_BACKEND_VOICES = new Set([
  "12077", "12078", "12375", "12376", "12603", "12604", "12612", "12615", "12616", "12622",
  "12655", "12656", "12659", "12660", "12664", "12703", "12709", "12710", "12711", "12712",
  "12727", "12733", "12734", "12743", "12744", "12747", "12749", "12759", "12760", "12763",
  "12764", "12769", "12784", "12787", "12805", "17008", "17016", "17206", "17208", "17210",
  "17231", "17482", "17487", "17646", "17784", "17977", "18047", "18464", "18503", "18519",
  "18638", "20677", "22604", "22642", "22832", "22849", "22852", "22859", "22880", "70458",
  "70461", "70637", "70785", "70786", "86086"
]);

// Combine all base trains
const BASE_TRAINS_MAP = new Map();
ALL_INDIAN_TRAINS.forEach((t) => BASE_TRAINS_MAP.set(String(t["Train No"]), t));

/**
 * Retrieve the active fleet from memory and visitor custom local storage.
 */
export function getFleetTrains() {
  const customMap = getCustomTrainsMap();
  const fleet = [];

  // Start with verified base trains (overridden by visitor edits if any)
  BASE_TRAINS_MAP.forEach((train, no) => {
    if (customMap.has(no)) {
      fleet.push(customMap.get(no));
      customMap.delete(no);
    } else {
      fleet.push(train);
    }
  });

  // Add any completely new trains added by the visitor
  customMap.forEach((customTrain) => {
    fleet.push(customTrain);
  });

  return fleet;
}

/**
 * Get custom trains from localStorage.
 */
function getCustomTrainsMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Map();
    const map = new Map();
    arr.forEach((t) => {
      if (t && t["Train No"]) {
        const tNo = String(t["Train No"]).trim();
        map.set(tNo, t);
      }
    });
    return map;
  } catch (e) {
    console.error("Error reading custom fleet trains:", e);
    return new Map();
  }
}

/**
 * Save or update a train in the visitor's editable database.
 */
export function saveCustomTrain(train) {
  if (!train || !train["Train No"]) throw new Error("Train No is required.");

  const map = getCustomTrainsMap();
  const trainNo = String(train["Train No"]).trim();

  const formattedTrain = {
    ...train,
    "Train No": trainNo,
    "Train Name": train["Train Name"]?.trim() || `Express (${trainNo})`,
    FROM: train.FROM?.trim() || "Vijayawada",
    TO: train.TO?.trim() || "Chennai Central",
    "Train Type": train["Train Type"]?.trim() || "Superfast Express",
    VIA: Array.isArray(train.VIA) ? train.VIA.map((s) => s.trim()).filter(Boolean) : [],
    description: train.description?.trim() || `Operational fleet train running between ${train.FROM || 'Vijayawada'} and ${train.TO || 'Chennai Central'}.`,
    hasFleetAudio: true,
    voiceEngine: train.voiceEngine || (VERIFIED_BACKEND_VOICES.has(trainNo) ? trainNo : "20677"),
    isCustom: true,
    updatedAt: new Date().toISOString()
  };

  map.set(trainNo, formattedTrain);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(map.values())));

  // Notify other components (RailwayGenerator, Comboboxes, etc.)
  window.dispatchEvent(new CustomEvent("railvani_fleet_updated", { detail: { trainNo, train: formattedTrain } }));
  return formattedTrain;
}

/**
 * Delete a custom train or revert an edited base train.
 */
export function deleteCustomTrain(trainNo) {
  const map = getCustomTrainsMap();
  const key = String(trainNo).trim();
  if (map.has(key)) {
    map.delete(key);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(map.values())));
    window.dispatchEvent(new CustomEvent("railvani_fleet_updated", { detail: { trainNo: key, deleted: true } }));
    return true;
  }
  return false;
}

/**
 * Reset all edits and custom trains back to factory default.
 */
export function resetFleetToDefault() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("railvani_fleet_updated", { detail: { reset: true } }));
  return getFleetTrains();
}

/**
 * Resolve which backend audio train number should be sent to the audio engine.
 * Every selected train gets its OWN exact audio recording.
 */
export function resolveAudioTrainNumber(trainNo) {
  const cleanNo = String(trainNo || "").trim();
  if (!cleanNo) return "20677";

  // 1. If this train number ITSELF is one of the verified backend recordings, ALWAYS return it directly!
  if (VERIFIED_BACKEND_VOICES.has(cleanNo)) {
    return cleanNo;
  }

  // 2. If it's a custom train with an explicit voice engine chosen by user
  const fleet = getFleetTrains();
  const match = fleet.find((t) => String(t["Train No"]) === cleanNo);
  if (match && match.voiceEngine && VERIFIED_BACKEND_VOICES.has(String(match.voiceEngine))) {
    return String(match.voiceEngine);
  }

  // Fallback to primary Vande Bharat master profile
  return "20677";
}
