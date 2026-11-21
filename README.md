# 🚆 RailVani — Indian Railways & Metro Announcement Simulator

> **Simulate authentic station public address announcements across 190+ Indian Railways trains and all 16 operational Metro networks in India with official human announcer voice audio.**

---

## 🌟 Key Features

- **🚉 Indian Railways Station Annunciator (`/railway`):**
  - Retro LED dot-matrix / split-flap Passenger Information Display System (PIDS).
  - Authentic South Central Railway human voice clips in **Telugu, Hindi & English** with genuine station platform chimes.
  - Four announcement situations: *Is on platform*, *Has arrived*, *Arriving shortly*, and *Running late*.
  - Realistic platform berth selector (`PF 01` – `PF 10`) and intermediate via station broadcasting.
  - Master broadcast audio player with instant MP3 downloads.

- **🚇 Metros of India Annunciator (`/metro`):**
  - In-coach digital LCD PIDS annunciator with route corridor lines (Blue, Red, Green).
  - Tri-lingual announcements with door opening warnings (*"Doors will open on the left"*).
  - Interactive directory covering all **16 Indian Metro systems**: Delhi (DMRC), Bengaluru (Namma Metro), Mumbai Metro, Kolkata Metro (Underwater line), Chennai, Hyderabad (HMRL), Ahmedabad, Pune, Kochi, Lucknow, Jaipur, Nagpur, Kanpur, Agra, Noida, and Navi Mumbai.

- **🎧 Immersive Station Ambience:**
  - Ambient railway platform background soundscape (low-frequency diesel locomotive idling rumble, distant concourse murmur, track clicks, and twin-tone pneumatic train horns).
  - Interactive visitor dock to play, pause, mute, or adjust ambient sound volume.

- **🛠️ Fleet Database Manager (`/railway/add-train`):**
  - Full CRUD administrative console for Indian Railways fleet trains.
  - Add new trains, edit existing routes, change destinations, and assign master human voice audio engines.
  - Client-side persistence via `localStorage` with real-time UI synchronization.

- **🔒 Administrative Security:**
  - Database editing, template modifications, and audio dashboards are secured under the Admin Console (`/login`).
  - Unauthenticated visitors can freely browse, search, and generate announcements.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ATLURI0001/RailVani.git
cd RailVani

# Install dependencies
npm install

# Start local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```
The output directory will be `dist/`.

---

## 🔐 Administrative Access

Access to the Fleet Database Editor (`/railway/add-train`) and Announcement Templates Editor (`/railway/templates`) is restricted to authorized operators via the Admin Console (`/login`).
Station administrator credentials can be configured securely using environment variables:
- `VITE_ADMIN_EMAIL`
- `VITE_ADMIN_PASSWORD`

Unauthenticated visitors can freely browse, simulate, and generate announcements across all railway and metro lines.

---

## ☁️ Deployment

### Cloudflare Pages
This project is configured for one-click deployment on Cloudflare Pages:
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node.js version:** `18` or `20`

---

## 📄 License
MIT License. Built for transit enthusiasts, travelers, and rail lovers across India.
