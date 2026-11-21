import { ALL_INDIAN_TRAINS } from "../data/indianTrains";

const STORAGE_KEY = "railvani_custom_fleet_trains";

// Available Master Human Voice Audio Engines from South Central Railway backend
export const VOICE_AUDIO_PROFILES = [
  { id: "20677", name: "Vande Bharat Express (20677)", tag: "High Speed Vande Bharat Audio" },
  { id: "20701", name: "Vande Bharat Express (20701)", tag: "Secunderabad - Tirupati Audio" },
  { id: "12077", name: "Jan Shatabdi Express (12077)", tag: "Jan Shatabdi Intercity Audio" },
  { id: "12078", name: "Jan Shatabdi Express (12078)", tag: "Jan Shatabdi Reverse Audio" },
  { id: "12615", name: "Grand Trunk Express (12615)", tag: "Historic National Flagship" },
  { id: "12727", name: "Godavari Express (12727)", tag: "Express Corridor Audio" },
  { id: "11019", name: "Konark Express (11019)", tag: "Long Distance Mail/Express" },
  { id: "12603", name: "Charminar Express (12603)", tag: "Overnight Superfast Audio" },
  { id: "12703", name: "Falaknuma Express (12703)", tag: "South Central Corridor Audio" },
  { id: "12805", name: "Janmabhoomi Express (12805)", tag: "Intercity Day Superfast" },
  { id: "12841", name: "Coromandel Express (12841)", tag: "Coastal Flagship Audio" },
  { id: "12723", name: "Telangana Express (12723)", tag: "Capital Superfast Audio" }
];

// Additional popular all-India trains pre-loaded with exact voice audio profiles
export const EXTRA_INDIAN_TRAINS = [
  {
    "Train No": "12615",
    "Train Name": "Grand Trunk Express",
    "FROM": "MGR Chennai Central",
    "TO": "New Delhi",
    "Train Type": "Superfast Express",
    "description": "Historic national flagship connecting Tamil Nadu, Andhra Pradesh, Maharashtra, Madhya Pradesh, UP to Delhi.",
    "VIA": ["Vijayawada", "Warangal", "Balharshah", "Nagpur", "Bhopal", "Jhansi", "Gwalior", "Agra Cantt"],
    "hasFleetAudio": true,
    "voiceEngine": "12615"
  },
  {
    "Train No": "12727",
    "Train Name": "Godavari Express",
    "FROM": "Visakhapatnam Junction",
    "TO": "Hyderabad Deccan",
    "Train Type": "Superfast Express",
    "description": "Legendary overnight express linking coastal Andhra Pradesh with the state capital Hyderabad.",
    "VIA": ["Duvvada", "Anakapalle", "Tuni", "Samalkot", "Rajahmundry", "Tadepalligudem", "Eluru", "Vijayawada", "Khammam", "Warangal", "Kazipet", "Secunderabad"],
    "hasFleetAudio": true,
    "voiceEngine": "12727"
  },
  {
    "Train No": "12301",
    "Train Name": "Howrah Rajdhani Express",
    "FROM": "Howrah Junction",
    "TO": "New Delhi",
    "Train Type": "Rajdhani Express",
    "description": "Premier luxury Rajdhani express between Howrah and the national capital New Delhi.",
    "VIA": ["Asansol", "Dhanbad", "Gaya", "Pt. Deen Dayal Upadhyaya", "Prayagraj", "Kanpur Central"],
    "hasFleetAudio": true,
    "voiceEngine": "12077"
  },
  {
    "Train No": "12951",
    "Train Name": "Mumbai Central Tejas Rajdhani Express",
    "FROM": "Mumbai Central",
    "TO": "New Delhi",
    "Train Type": "Rajdhani Express",
    "description": "Fastest Rajdhani connect between financial capital Mumbai and New Delhi.",
    "VIA": ["Surat", "Vadodara", "Ratlam", "Kota"],
    "hasFleetAudio": true,
    "voiceEngine": "12078"
  },
  {
    "Train No": "22691",
    "Train Name": "KSR Bengaluru Rajdhani Express",
    "FROM": "KSR Bengaluru",
    "TO": "Hazrat Nizamuddin",
    "Train Type": "Rajdhani Express",
    "description": "Connects Silicon Valley of India Bengaluru to New Delhi.",
    "VIA": ["Dharmavaram", "Anantapur", "Guntakal", "Secunderabad", "Nagpur", "Bhopal", "Gwalior"],
    "hasFleetAudio": true,
    "voiceEngine": "12703"
  },
  {
    "Train No": "12431",
    "Train Name": "Thiruvananthapuram Rajdhani Express",
    "FROM": "Thiruvananthapuram Central",
    "TO": "Hazrat Nizamuddin",
    "Train Type": "Rajdhani Express",
    "description": "Traverses scenic Konkan Railway connecting Kerala to Delhi.",
    "VIA": ["Kollam", "Ernakulam", "Kozhikode", "Mangaluru", "Madgaon", "Panvel", "Vadodara", "Kota"],
    "hasFleetAudio": true,
    "voiceEngine": "12615"
  },
  {
    "Train No": "12245",
    "Train Name": "Howrah - SMVT Bengaluru Duronto Express",
    "FROM": "Howrah Junction",
    "TO": "Sir M. Visvesvaraya Terminal Bengaluru",
    "Train Type": "Duronto Express",
    "description": "Non-stop point-to-point superfast Duronto express.",
    "VIA": ["Bhubaneswar", "Vizianagaram", "Vijayawada", "Renigunta"],
    "hasFleetAudio": true,
    "voiceEngine": "12805"
  },
  {
    "Train No": "12841",
    "Train Name": "Coromandel Express",
    "FROM": "Shalimar (Howrah)",
    "TO": "MGR Chennai Central",
    "Train Type": "Superfast Express",
    "description": "Historic superfast flagship express running along the Coromandel coast.",
    "VIA": ["Kharagpur", "Balasore", "Bhadrak", "Cuttack", "Bhubaneswar", "Visakhapatnam", "Rajahmundry", "Vijayawada"],
    "hasFleetAudio": true,
    "voiceEngine": "12841"
  },
  {
    "Train No": "12621",
    "Train Name": "Tamil Nadu Express",
    "FROM": "MGR Chennai Central",
    "TO": "New Delhi",
    "Train Type": "Superfast Express",
    "description": "Prestigious non-stop capital express connecting Tamil Nadu with New Delhi.",
    "VIA": ["Vijayawada", "Warangal", "Balharshah", "Nagpur", "Itarsi", "Bhopal", "Jhansi", "Gwalior", "Agra Cantt"],
    "hasFleetAudio": true,
    "voiceEngine": "12615"
  },
  {
    "Train No": "12626",
    "Train Name": "Kerala Express",
    "FROM": "New Delhi",
    "TO": "Thiruvananthapuram Central",
    "Train Type": "Superfast Express",
    "description": "One of the longest running daily superfast trains across the length of India.",
    "VIA": ["Agra", "Gwalior", "Bhopal", "Nagpur", "Vijayawada", "Katpadi", "Coimbatore", "Ernakulam", "Kottayam"],
    "hasFleetAudio": true,
    "voiceEngine": "12727"
  },
  {
    "Train No": "12723",
    "Train Name": "Telangana Express",
    "FROM": "Hyderabad Deccan",
    "TO": "New Delhi",
    "Train Type": "Superfast Express",
    "description": "Daily flagship superfast linking Hyderabad to the national capital.",
    "VIA": ["Secunderabad", "Kazipet", "Ramagundam", "Sirpur Kaghaznagar", "Balharshah", "Nagpur", "Bhopal", "Jhansi"],
    "hasFleetAudio": true,
    "voiceEngine": "12723"
  },
  {
    "Train No": "12137",
    "Train Name": "Punjab Mail",
    "FROM": "Mumbai CSMT",
    "TO": "Firozpur Cantt",
    "Train Type": "Superfast Express",
    "description": "Historic premier train operating since 1912 connecting Mumbai to Punjab.",
    "VIA": ["Kalyan", "Nashik", "Bhusaval", "Itarsi", "Bhopal", "Jhansi", "Gwalior", "Agra", "New Delhi", "Bathinda"],
    "hasFleetAudio": true,
    "voiceEngine": "11019"
  },
  {
    "Train No": "20833",
    "Train Name": "Vande Bharat Express (Secunderabad - Visakhapatnam)",
    "FROM": "Visakhapatnam Junction",
    "TO": "Secunderabad Junction",
    "Train Type": "Vande Bharat Express",
    "description": "Premier semi-high speed indigenously developed train connecting coastal AP with Hyderabad.",
    "VIA": ["Samalkot", "Rajahmundry", "Vijayawada", "Khammam", "Warangal"],
    "hasFleetAudio": true,
    "voiceEngine": "20701"
  },
  {
    "Train No": "20607",
    "Train Name": "Vande Bharat Express (Chennai - Mysuru)",
    "FROM": "MGR Chennai Central",
    "TO": "Mysuru Junction",
    "Train Type": "Vande Bharat Express",
    "description": "First Vande Bharat express of South India linking Chennai, Bengaluru and Mysuru.",
    "VIA": ["Katpadi", "KSR Bengaluru", "Mandya"],
    "hasFleetAudio": true,
    "voiceEngine": "20678"
  }
];

// Combine all base trains
const BASE_TRAINS_MAP = new Map();
ALL_INDIAN_TRAINS.forEach((t) => BASE_TRAINS_MAP.set(String(t["Train No"]), t));
EXTRA_INDIAN_TRAINS.forEach((t) => BASE_TRAINS_MAP.set(String(t["Train No"]), t));

/**
 * Retrieve the active fleet from memory and visitor custom local storage.
 */
export function getFleetTrains() {
  const customMap = getCustomTrainsMap();
  const fleet = [];

  // Start with all base and extra trains (overridden by visitor edits if any)
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
        map.set(String(t["Train No"]), t);
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
    voiceEngine: train.voiceEngine || "20677",
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
 */
export function resolveAudioTrainNumber(trainNo) {
  const fleet = getFleetTrains();
  const cleanNo = String(trainNo || "").trim();
  const match = fleet.find((t) => String(t["Train No"]) === cleanNo);

  // 1. If this train has an explicit voice engine mapped, use that!
  if (match && match.voiceEngine) {
    return String(match.voiceEngine);
  }

  // 2. Known verified backend audio trains that succeed with distinct human recordings
  const KNOWN_BACKEND_VOICES = new Set([
    "20677", "20678", "20701", "20702", "20703", "20704", "2007", "2008",
    "12077", "12078", "12615", "12616", "12727", "12723", "12703", "12805",
    "12806", "12861", "12759", "12760", "11019", "12603", "12604", "12841",
    "12375", "12376", "12511", "11314", "13351", "3351", "01926", "07042", "07154"
  ]);

  if (KNOWN_BACKEND_VOICES.has(cleanNo)) {
    return cleanNo;
  }

  // 3. Fallback to authentic, varied human voices matching the train profile
  if (match) {
    const type = (match["Train Type"] || "").toLowerCase();
    if (type.includes("vande")) return "20677";
    if (type.includes("shatabdi") || type.includes("rajdhani")) return "12077";
    if (type.includes("duronto") || type.includes("garib")) return "12805";
    if (type.includes("mail")) return "11019";
    // Distribute among varied authentic superfast voice profiles so adjacent trains never sound identical
    const engines = ["12615", "12727", "12077", "12703", "11019", "12603", "12805", "12841", "20677"];
    const hash = cleanNo.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return engines[hash % engines.length];
  }

  return "12077";
}
