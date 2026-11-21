import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

import RailwayGenerator from "./pages/railway/RailwayGenerator";
import RailwayDashboard from "./pages/railway/RailwayDashboard";
import RailwayAddTrain from "./pages/railway/RailwayAddTrain";
import RailwayTemplates from "./pages/railway/RailwayTemplates";
import RailwayRecord from "./pages/railway/RailwayRecord";

import MetroGenerator from "./pages/metro/MetroGenerator";
import MetroDashboard from "./pages/metro/MetroDashboard";
import MetroStations from "./pages/metro/MetroStations";
import MetroRecord from "./pages/metro/MetroRecord";

import AdminGuard from "./components/AdminGuard";
import StationAmbiencePlayer from "./components/StationAmbiencePlayer";

export default function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Railway Routes */}
      <Route path="/railway" element={<RailwayGenerator />} />
      <Route
        path="/railway/add-train"
        element={
          <AdminGuard>
            <RailwayAddTrain />
          </AdminGuard>
        }
      />
      <Route
        path="/railway/templates"
        element={
          <AdminGuard>
            <RailwayTemplates />
          </AdminGuard>
        }
      />
      <Route
        path="/railway/admin"
        element={
          <AdminGuard>
            <RailwayDashboard />
          </AdminGuard>
        }
      />
      <Route
        path="/railway/record/:key"
        element={
          <AdminGuard>
            <RailwayRecord />
          </AdminGuard>
        }
      />

      {/* Metro Routes */}
      <Route path="/metro" element={<MetroGenerator />} />
      <Route path="/metro/stations" element={<MetroStations />} />
      <Route
        path="/metro/admin"
        element={
          <AdminGuard>
            <MetroDashboard />
          </AdminGuard>
        }
      />
      <Route
        path="/metro/record/:folder/:name"
        element={
          <AdminGuard>
            <MetroRecord />
          </AdminGuard>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <StationAmbiencePlayer />
    </>
  );
}
