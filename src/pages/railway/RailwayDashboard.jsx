import React from "react";
import Header from "../../components/Header";
import AudioDashboard from "../../components/AudioDashboard";
import { RAILWAY_URL } from "../../utils/api";

const RAILWAY_PAGES = [
  { to: "/railway", label: "Generator", end: true },
  { to: "/railway/admin", label: "Audio Dashboard", admin: true },
  { to: "/railway/add-train", label: "Add / Edit Trains", admin: true },
  { to: "/railway/templates", label: "Templates", admin: true }
];

export default function RailwayDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header pages={RAILWAY_PAGES} />
      <AudioDashboard
        baseUrl={RAILWAY_URL}
        title="Railway Fleet Audio Dashboard"
        description="Every available fleet, pending and archived train announcement clip."
        storageKey="railway-dashboard-filters"
        isRailway={true}
      />
    </div>
  );
}
