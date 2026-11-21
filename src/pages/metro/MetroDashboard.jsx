import React from "react";
import Header from "../../components/Header";
import AudioDashboard from "../../components/AudioDashboard";
import { METRO_URL } from "../../utils/api";

const METRO_PAGES = [
  { to: "/metro", label: "Generator", end: true },
  { to: "/metro/admin", label: "Audio Dashboard", admin: true },
  { to: "/metro/stations", label: "Lines & Stations", admin: true }
];

const FOLDER_LABELS = {
  stations: "Stations",
  phrases: "Phrases"
};

export default function MetroDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header pages={METRO_PAGES} />
      <AudioDashboard
        baseUrl={METRO_URL}
        title="Hyderabad Metro Fleet Audio Dashboard"
        description="Every available fleet, pending and archived metro announcement clip."
        folderLabels={FOLDER_LABELS}
        storageKey="metro-dashboard-filters"
      />
    </div>
  );
}
