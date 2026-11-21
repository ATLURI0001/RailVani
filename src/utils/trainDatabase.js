import { ALL_INDIAN_TRAINS } from "../data/indianTrains.js";

const STORAGE_KEY = "railvani_custom_fleet_trains";

// Available Master Human Voice Audio Engines from South Central Railway backend
export const VOICE_AUDIO_PROFILES = [
  { id: "20677", name: "Vande Bharat Express (20677)", tag: "High Speed Vande Bharat Audio" },
  { id: "12077", name: "Jan Shatabdi Express (12077 / 2077)", tag: "Jan Shatabdi Intercity Audio" },
  { id: "12078", name: "Jan Shatabdi Express (12078 / 2078)", tag: "Jan Shatabdi Reverse Audio" },
  { id: "12615", name: "Grand Trunk Express (12615 / 2615)", tag: "Historic National Flagship" },
  { id: "12616", name: "Grand Trunk Express (12616 / 2616)", tag: "Grand Trunk Delhi-Chennai" },
  { id: "12727", name: "Godavari Express (12727 / 2727)", tag: "Express Corridor Audio" },
  { id: "12603", name: "Charminar Express (12603 / 2603)", tag: "Overnight Superfast Audio" },
  { id: "12604", name: "Charminar Express (12604 / 2604)", tag: "Charminar Hyderabad-Chennai" },
  { id: "12703", name: "Falaknuma Express (12703 / 2703)", tag: "South Central Corridor Audio" },
  { id: "12805", name: "Janmabhoomi Express (12805 / 2805)", tag: "Intercity Day Superfast" },
  { id: "12622", name: "Tamil Nadu Express (12622 / 2622)", tag: "Premier Superfast Audio" },
  { id: "12655", name: "Navjeevan Express (12655 / 2655)", tag: "Western-Southern Corridor" },
  { id: "12711", name: "Pinakini Express (12711 / 2711)", tag: "Vijayawada - Chennai Superfast" },
  { id: "12733", name: "Narayanadri Express (12733 / 2733)", tag: "Tirupati - Secunderabad Audio" },
  { id: "12763", name: "Padmavathi Express (12763 / 2763)", tag: "Padmavathi Superfast Audio" }
];

// All verified human voice recordings in South Central Railway backend (both 5-digit and native 4-digit)
export const VERIFIED_BACKEND_VOICES = new Set([
  // 5-digit primary trains
  "12077", "12078", "12375", "12376", "12603", "12604", "12612", "12615", "12616", "12622",
  "12655", "12656", "12659", "12660", "12664", "12703", "12709", "12710", "12711", "12712",
  "12727", "12733", "12734", "12743", "12744", "12747", "12749", "12759", "12760", "12763",
  "12764", "12769", "12784", "12787", "12805", "17008", "17016", "17206", "17208", "17210",
  "17231", "17482", "17487", "17646", "17784", "17977", "18047", "18464", "18503", "18519",
  "18638", "20677", "22604", "22642", "22832", "22849", "22852", "22859", "22880", "70458",
  "70461", "70637", "70785", "70786", "86086", "11019",
  // Native 4-digit recordings present on backend
  "2007", "2008", "2615", "2603", "2077", "7461", "7637", "3351"
]);

// Comprehensive mapping of legacy 4-digit Indian Railways numbers to their 5-digit official recorded counterparts
export const FOUR_TO_FIVE_MAP = {
  // Superfast & Mail Express series (pre-2010 4-digit to modern 5-digit)
  "2615": "12615", // Grand Trunk Express
  "2616": "12616", // Grand Trunk Express
  "2603": "12603", // Charminar Express
  "2604": "12604", // Charminar Express
  "2727": "12727", // Godavari Express
  "2703": "12703", // Falaknuma Express
  "2805": "12805", // Janmabhoomi Express
  "2077": "12077", // Jan Shatabdi Express
  "2078": "12078", // Jan Shatabdi Express
  "2709": "12709", // Simhapuri Express
  "2710": "12710", // Simhapuri Express
  "2711": "12711", // Pinakini Express
  "2712": "12712", // Pinakini Express
  "2733": "12733", // Narayanadri Express
  "2734": "12734", // Narayanadri Express
  "2763": "12763", // Padmavathi Express
  "2764": "12764", // Padmavathi Express
  "2622": "12622", // Tamil Nadu Express
  "2655": "12655", // Navjeevan Express
  "2656": "12656", // Navjeevan Express
  "2659": "12659", // Gurudev Express
  "2660": "12660", // Gurudev Express
  "2664": "12664", // Howrah Superfast
  "2375": "12375", // Jasidih Express
  "2376": "12376", // Jasidih Express
  "2612": "12612", // Garib Rath Express
  "2743": "12743",
  "2744": "12744",
  "2747": "12747",
  "2749": "12749",
  "2759": "12759",
  "2760": "12760",
  "2769": "12769",
  "2784": "12784",
  "2787": "12787",
  "2604": "22604", // Villupuram - Kharagpur Superfast
  "2642": "22642", // Shalimar - Thiruvananthapuram Express
  "2832": "22832", // Satya Sai Prashanti Nilayam Superfast
  "2849": "22849", // Ranchi - Rameswaram Superfast
  "2852": "22852", // Vivek Express
  "2859": "22859", // Puri - Chennai Central Superfast
  "2880": "22880", // Tirupati - Bhubaneswar Superfast

  // SCR Express series (7xxx -> 17xxx)
  "7206": "17206", // Seshadri Express
  "7208": "17208", // Seshadri Express
  "7210": "17210", // Seshadri Express
  "7231": "17231", // Narasapur Express
  "7482": "17482", // Tirupati Express
  "7487": "17487", // Tirumala Express
  "7646": "17646", // Repalle Express
  "7784": "17784", // Dhone - Kacheguda Express
  "7977": "17977", // Marathwada Express
  "7008": "17008", // Secunderabad Express
  "7016": "17016", // Visakha Express

  // East Coast & South Eastern series (8xxx -> 18xxx)
  "8047": "18047", // Amaravati Express
  "8464": "18464", // Prashanti Express
  "8503": "18503", // Shirdi - Visakhapatnam Express
  "8519": "18519", // Visakhapatnam - Mumbai LTT Express
  "8638": "18638", // Hatia Express

  // Suburban, Passenger & DEMU/MEMU series
  "7458": "70458", // Guntur - Macherla Passenger
  "7461": "70461", // Macherla - Nadikude Passenger
  "7637": "70637", // Guntur - Tenali DEMU
  "7085": "70785", // Vijayawada - Guntur MEMU
  "7785": "70785", // Vijayawada - Guntur MEMU
  "7086": "70786", // Guntur - Vijayawada MEMU
  "7786": "70786", // Guntur - Vijayawada MEMU
  "8086": "86086", // Guntur - Repalle Passenger
  "6086": "86086", // Guntur - Repalle Passenger

  // Central Railway & Special series
  "1019": "11019", // Konark Express
  "2007": "20677", // Visakhapatnam - Chennai Vande Bharat
  "2008": "20677"  // Visakhapatnam - Chennai Vande Bharat
};

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
        // Dynamically resolve voiceEngine to prevent stale hardcoded 20677 overrides from earlier sessions
        t.voiceEngine = resolveAudioTrainNumber(tNo);
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
    voiceEngine: resolveAudioTrainNumber(trainNo),
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
 * Handles both 5-digit modern numbers and legacy 4-digit numbers with 100% exact match.
 */
export function resolveAudioTrainNumber(trainNo) {
  const cleanNo = String(trainNo || "").trim();
  if (!cleanNo) return "20677";

  // 1. Direct match in verified recordings
  if (VERIFIED_BACKEND_VOICES.has(cleanNo)) {
    return cleanNo;
  }

  // 2. Check explicit 4-digit to 5-digit mapping
  if (FOUR_TO_FIVE_MAP[cleanNo]) {
    return FOUR_TO_FIVE_MAP[cleanNo];
  }

  // 3. Algorithmic pre-2010 Indian Railways 4-digit conversion:
  if (cleanNo.length === 4) {
    // 2xxx series -> 12xxx (e.g. 2727 Godavari -> 12727, 2615 GT -> 12615)
    if (cleanNo.startsWith("2")) {
      const five = "1" + cleanNo;
      if (VERIFIED_BACKEND_VOICES.has(five)) return five;
    }
    // 7xxx series -> 17xxx (Express) or 70xxx (Passenger/DEMU)
    if (cleanNo.startsWith("7")) {
      const fiveExp = "1" + cleanNo;
      if (VERIFIED_BACKEND_VOICES.has(fiveExp)) return fiveExp;
      const fivePass = "70" + cleanNo.slice(1);
      if (VERIFIED_BACKEND_VOICES.has(fivePass)) return fivePass;
    }
    // 8xxx series -> 18xxx (e.g. 8464 Prashanti -> 18464)
    if (cleanNo.startsWith("8")) {
      const five = "1" + cleanNo;
      if (VERIFIED_BACKEND_VOICES.has(five)) return five;
    }
    // 1xxx series -> 11xxx (e.g. 1019 Konark -> 11019)
    if (cleanNo.startsWith("1")) {
      const five = "11" + cleanNo.slice(1);
      if (VERIFIED_BACKEND_VOICES.has(five)) return five;
    }
  }

  // 4. Return cleanNo directly so backend can attempt it or report genuine error
  return cleanNo;
}
