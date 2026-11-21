import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AudioRecorder from "../../components/AudioRecorder";
import { RAILWAY_URL, authFetch } from "../../utils/api";

export default function RailwayRecord() {
  const { key } = useParams();
  const [clipInfo, setClipInfo] = useState(null);

  useEffect(() => {
    if (key) {
      authFetch(`${RAILWAY_URL}/api/audio-clips/${encodeURIComponent(key)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then(setClipInfo)
        .catch(() => {});
    }
  }, [key]);

  return (
    <AudioRecorder
      title="Record Railway Announcement Clip"
      subtitle="Record crisp, clean audio for train announcements."
      backUrl="/railway/admin"
      uploadUrl={`${RAILWAY_URL}/api/audio-clips/${encodeURIComponent(key || "")}`}
      clipName={key}
      sayText={clipInfo?.say}
    />
  );
}
