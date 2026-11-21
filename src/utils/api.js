// Base URLs for RailVani backend services
export const BASE_URL = "https://announcement-hub-backend.onrender.com";
export const RAILWAY_URL = `${BASE_URL}/railway`;
export const METRO_URL = `${BASE_URL}/metro`;

export const SERVICES = [
  {
    path: "railway",
    short: "Indian Railways",
    name: "Indian Railways (RailVani)",
    tagline: "National Rail Audio System",
    blurb: "Simulate authentic station announcements for Vande Bharat, Rajdhani, Shatabdi, and 180+ Superfast expresses in Telugu, Hindi and English with authentic railway chime.",
    theme: "from-blue-900 to-indigo-950",
    badge: "180+ Trains Supported",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30"
  },
  {
    path: "metro",
    short: "Metros of India",
    name: "Metros of India (MetroVani)",
    tagline: "Rapid Transit Audio System",
    blurb: "Next-station audio announcements across all 16 operational Indian metro systems: Delhi, Bengaluru, Mumbai, Kolkata, Chennai, Hyderabad, and more with authentic door chimes.",
    theme: "from-emerald-950 to-teal-950",
    badge: "16 Metro Networks",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
  }
];

const TOKEN_KEY = "hubAdminToken";

export function getAdminToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {}
}

export async function authFetch(url, options = {}) {
  const token = getAdminToken();
  const headers = {
    ...(options.headers || {})
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  return response;
}
