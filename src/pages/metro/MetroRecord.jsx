import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AudioRecorder from "../../components/AudioRecorder";
import { METRO_URL, authFetch } from "../../utils/api";

export default function MetroRecord() {
  const { folder, name } = useParams();
  const [clipInfo, setClipInfo] = useState(null);

  useEffect(() => {
    if (folder && name) {
      authFetch(`${METRO_URL}/api/audio-clips/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then(setClipInfo)
        .catch(() => {});
    }
  }, [folder, name]);

  return (
    <AudioRecorder
      title="Record Metro Announcement Clip"
      subtitle="Record clear tri-lingual metro voice announcements."
      backUrl="/metro/admin"
      uploadUrl={`${METRO_URL}/api/audio-clips/${encodeURIComponent(folder || "")}/${encodeURIComponent(name || "")}`}
      clipName={`${folder}/${name}`}
      sayText={clipInfo?.say}
    />
  );
}
