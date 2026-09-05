import React, { useState } from 'react';
import { Upload, Film, HardDrive, CheckCircle2, Activity, Play, Pause } from 'lucide-react';

export default function MediaAnalysisWorkstation({ currentMedia, onMediaAnalyzed }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none font-sans space-y-4">
      {/* Workstation Header */}
      <div className="h-9 bg-studio-900 px-4 border-b border-studio-800 flex items-center justify-between font-mono text-[11px] text-studio-400 uppercase font-bold shrink-0">
        <span className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-gold" />
          SOURCE MEDIA ANALYSIS WORKSPACE
        </span>
        <span className="text-studio-500">OPENCV FRAME ENGINE</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Upload Zone */}
        <label className="border border-dashed border-studio-700 hover:border-gold bg-studio-900 rounded p-8 flex flex-col items-center justify-center cursor-pointer text-center space-y-2">
          {uploading ? (
            <div className="flex flex-col items-center gap-2 font-mono text-xs text-gold">
              <Activity className="w-6 h-6 animate-spin" />
              <span>Analyzing Frame Histogram & Scene Changes...</span>
            </div>
          ) : (
            <>
              <Film className="w-8 h-8 text-gold" />
              <span className="text-xs font-bold text-studio-100 font-mono uppercase">IMPORT FOOTAGE FILE FOR ANALYSIS</span>
              <span className="text-[11px] text-studio-500 font-mono">Supports MP4, MOV, WAV, JPG (Max 50MB)</span>
              <input 
                type="file" 
                className="hidden" 
                accept="video/*,audio/*,image/*"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </>
          )}
        </label>

        {/* Media Analysis Details */}
        {currentMedia && (
          <div className="bg-studio-900 border border-studio-800 rounded p-4 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-studio-800 pb-3">
              <span className="font-bold text-studio-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {currentMedia.filename}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-studio-950 text-gold border border-studio-800 font-bold uppercase">
                {currentMedia.type || "media"}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
              <div className="bg-studio-950 p-3 rounded border border-studio-800 space-y-1">
                <span className="text-studio-500 text-[10px] block">DURATION</span>
                <span className="text-studio-100 font-bold">{currentMedia.duration}s</span>
              </div>
              <div className="bg-studio-950 p-3 rounded border border-studio-800 space-y-1">
                <span className="text-studio-500 text-[10px] block">RESOLUTION</span>
                <span className="text-studio-100 font-bold">{currentMedia.resolution}</span>
              </div>
              <div className="bg-studio-950 p-3 rounded border border-studio-800 space-y-1">
                <span className="text-studio-500 text-[10px] block">FRAME RATE</span>
                <span className="text-studio-100 font-bold">{currentMedia.fps} fps</span>
              </div>
              <div className="bg-studio-950 p-3 rounded border border-studio-800 space-y-1">
                <span className="text-studio-500 text-[10px] block">SHOT CUTS</span>
                <span className="text-gold font-bold">{currentMedia.shot_count} cuts</span>
              </div>
            </div>

            {currentMedia.pacing_assessment && (
              <div className="bg-studio-950 p-3 rounded border border-studio-800 space-y-1 text-studio-300 font-sans">
                <span className="text-[10px] font-mono font-bold text-gold uppercase block">PACING ASSESSMENT:</span>
                <p className="leading-relaxed">{currentMedia.pacing_assessment}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
