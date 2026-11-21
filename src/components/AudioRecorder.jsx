import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mic, Square, Play, Pause, Upload, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { authFetch } from "../utils/api";

export default function AudioRecorder({
  title,
  subtitle,
  backUrl,
  uploadUrl,
  clipName,
  sayText
}) {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setError(null);
    setUploadSuccess(false);
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError("Microphone access denied or unavailable: " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (playing) {
      audioPlayerRef.current.pause();
      setPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setPlaying(true);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const res = await authFetch(uploadUrl, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Upload failed (${res.status})`);
      }
      setUploadSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to upload recording.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
        <div>
          <Link
            to={backUrl}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-3"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{title || "Record Clip"}</h1>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>

        {clipName && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-400 font-medium">Target Clip</span>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{clipName}</p>
            {sayText && (
              <p className="text-xs text-blue-700 mt-1 italic">Say: "{sayText}"</p>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-start gap-2">
            <Check size={16} className="mt-0.5 shrink-0" />
            <span>Clip recorded and uploaded successfully!</span>
          </div>
        )}

        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl space-y-4">
          <div className="text-3xl font-mono text-gray-700 font-semibold">
            {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
          </div>

          <div className="flex justify-center gap-3">
            {!recording ? (
              <button
                type="button"
                onClick={startRecording}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-full shadow-sm transition"
              >
                <Mic size={18} />
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-medium px-5 py-2.5 rounded-full shadow-sm transition animate-pulse"
              >
                <Square size={18} />
                <span>Stop Recording</span>
              </button>
            )}
          </div>
        </div>

        {audioUrl && (
          <div className="space-y-4 pt-2">
            <audio
              ref={audioPlayerRef}
              src={audioUrl}
              onEnded={() => setPlaying(false)}
              className="hidden"
            />
            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <button
                type="button"
                onClick={togglePlayback}
                className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <span className="text-xs text-gray-500 font-medium">Recording Preview</span>
              <a
                href={audioUrl}
                download={`${clipName || "recording"}.webm`}
                className="text-xs text-blue-600 hover:underline"
              >
                Save
              </a>
            </div>

            <button
              type="button"
              disabled={uploading}
              onClick={handleUpload}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition disabled:bg-emerald-300"
            >
              <Upload size={16} />
              <span>{uploading ? "Uploading…" : "Upload to Server"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
