import React, { useState } from 'react';
import { Upload, Film, CheckCircle2, AlertCircle, Loader2, Activity, HardDrive } from 'lucide-react';

export default function MediaUploader({ onMediaAnalyzed, currentMedia }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload media");

      const data = await res.json();
      onMediaAnalyzed(data.media_info);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white border border-cream-300 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brown-800 text-brown-200 flex items-center justify-center">
            <Film className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-brown-900 text-sm tracking-tight font-sans">
              Media Analyzer Tool (OpenCV)
            </h3>
            <p className="text-[10px] text-brown-500 font-medium">Shot cut detection & FPS inspection</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-cream-100 text-brown-800 border border-cream-300">
          Tool 1 Active
        </span>
      </div>

      {/* Drag & Drop Upload Zone */}
      <label
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed transition-all rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer text-center relative overflow-hidden ${
          dragActive
            ? "border-brown-600 bg-brown-50"
            : "border-cream-400 hover:border-brown-500 bg-cream-50/60"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-7 h-7 animate-spin text-brown-600" />
            <span className="text-xs font-bold text-brown-900">Executing OpenCV Inspection...</span>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-white border border-cream-300 flex items-center justify-center mb-1.5 shadow-sm">
              <Upload className="w-5 h-5 text-brown-700" />
            </div>
            <span className="text-xs font-bold text-brown-900">Upload Video, Audio, or Image</span>
            <span className="text-[10px] text-brown-500 mt-0.5">MP4, MOV, WAV, MP3, JPG, PNG (Max 50MB)</span>
            <input 
              type="file" 
              className="hidden" 
              accept="video/*,audio/*,image/*"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </>
        )}
      </label>

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Output */}
      {currentMedia && (
        <div className="bg-cream-50 p-4 rounded-xl border border-cream-300 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-emerald-700 pb-2 border-b border-cream-200">
            <span className="flex items-center gap-2 truncate font-sans">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {currentMedia.filename}
            </span>
            <span className="uppercase text-[10px] font-mono px-2 py-0.5 rounded bg-white text-brown-800 border border-cream-300">
              {currentMedia.type || "media"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-white p-2 rounded-lg border border-cream-300">
              <span className="text-brown-500 block text-[10px] font-mono">Duration:</span>
              <span className="font-mono font-bold text-brown-900">{currentMedia.duration}s</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-cream-300">
              <span className="text-brown-500 block text-[10px] font-mono">Resolution:</span>
              <span className="font-mono font-bold text-brown-900">{currentMedia.resolution}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-cream-300">
              <span className="text-brown-500 block text-[10px] font-mono">FPS:</span>
              <span className="font-mono font-bold text-brown-900">{currentMedia.fps}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-cream-300">
              <span className="text-brown-500 block text-[10px] font-mono">Shot Cuts:</span>
              <span className="font-mono font-bold text-brown-900">{currentMedia.shot_count} shots</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
