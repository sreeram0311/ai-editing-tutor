import React, { useState } from 'react';
import { Upload, Film, HardDrive, CheckCircle2, Activity, Play, Pause, BarChart2, Eye, Volume2 } from 'lucide-react';

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
    <div className="h-full overflow-y-auto bg-cinema-950 p-6 md:p-8 space-y-8 font-sans text-cinema-100">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cinema-800/80 pb-4">
        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider block">
            SOURCE MEDIA STUDIO
          </span>
          <h2 className="text-xl font-semibold text-cinema-100 font-sans tracking-tight">
            Footage Structure & Scene Analysis
          </h2>
        </div>

        <label className="px-4 py-2 bg-cinema-900 hover:bg-cinema-850 border border-cinema-800 rounded-xl text-xs font-medium text-cinema-200 hover:text-white cursor-pointer transition-all flex items-center gap-2">
          <Upload className="w-3.5 h-3.5 text-amber-500" />
          <span>Import Footage</span>
          <input 
            type="file" 
            className="hidden" 
            accept="video/*,audio/*,image/*"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
        </label>
      </div>

      {uploading && (
        <div className="p-8 bg-cinema-900 border border-cinema-800 rounded-2xl flex flex-col items-center justify-center space-y-3 text-center">
          <Activity className="w-6 h-6 text-amber-500 animate-spin" />
          <span className="text-xs font-medium text-cinema-300">Analyzing frame histogram, duration, FPS, and scene cut boundaries...</span>
        </div>
      )}

      {/* Main Analysis View */}
      {currentMedia ? (
        <div className="space-y-6">
          
          {/* Video Preview Canvas */}
          <div className="relative aspect-video max-h-80 w-full bg-cinema-900 rounded-2xl border border-cinema-800 overflow-hidden flex items-center justify-center shadow-2xl">
            <div className="text-center space-y-2 p-6">
              <Film className="w-10 h-10 text-amber-500 mx-auto opacity-80" />
              <div className="font-mono text-xs text-cinema-300 font-semibold">
                {currentMedia.filename}
              </div>
              <p className="text-xs text-cinema-500">
                {currentMedia.resolution} • {currentMedia.fps} fps • {currentMedia.duration}s total duration
              </p>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-cinema-950/90 border border-cinema-800/80 rounded-xl p-3 flex items-center justify-between font-mono text-xs text-cinema-400 backdrop-blur-md">
              <span className="text-amber-400 font-semibold font-sans">ACTIVE CLIP ANALYZED</span>
              <span>DETECTED CUTS: {currentMedia.shot_count}</span>
            </div>
          </div>

          {/* Structured Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="bg-cinema-900 border border-cinema-800/80 p-5 rounded-2xl space-y-1">
              <span className="text-[11px] font-medium text-cinema-500 uppercase tracking-wider block font-sans">
                SHOT STRUCTURE
              </span>
              <div className="text-lg font-bold font-mono text-cinema-100">
                {currentMedia.shot_count} Cuts
              </div>
              <span className="text-xs text-cinema-400 block">Avg shot length {(currentMedia.duration / (currentMedia.shot_count || 1)).toFixed(1)}s</span>
            </div>

            <div className="bg-cinema-900 border border-cinema-800/80 p-5 rounded-2xl space-y-1">
              <span className="text-[11px] font-medium text-cinema-500 uppercase tracking-wider block font-sans">
                PACING RHYTHM
              </span>
              <div className="text-lg font-bold font-mono text-amber-400">
                {currentMedia.pacing_assessment ? "Dynamic" : "Standard"}
              </div>
              <span className="text-xs text-cinema-400 block">Dialogue rhythmic spacing</span>
            </div>

            <div className="bg-cinema-900 border border-cinema-800/80 p-5 rounded-2xl space-y-1">
              <span className="text-[11px] font-medium text-cinema-500 uppercase tracking-wider block font-sans">
                AUDIO STEMS
              </span>
              <div className="text-lg font-bold font-mono text-emerald-400">
                Normal (48kHz)
              </div>
              <span className="text-xs text-cinema-400 block">Stereo dialogue track</span>
            </div>

            <div className="bg-cinema-900 border border-cinema-800/80 p-5 rounded-2xl space-y-1">
              <span className="text-[11px] font-medium text-cinema-500 uppercase tracking-wider block font-sans">
                FRAME PARAMETERS
              </span>
              <div className="text-lg font-bold font-mono text-sky-400">
                {currentMedia.fps} FPS
              </div>
              <span className="text-xs text-cinema-400 block">{currentMedia.resolution}</span>
            </div>

          </div>

          {/* Pacing Detailed Assessment */}
          {currentMedia.pacing_assessment && (
            <div className="bg-cinema-900 border border-cinema-800 p-6 rounded-2xl space-y-2">
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider block">
                EDITORIAL PACING ASSESSMENT
              </span>
              <p className="text-sm text-cinema-300 leading-relaxed font-sans">
                {currentMedia.pacing_assessment}
              </p>
            </div>
          )}

        </div>
      ) : (
        /* Empty Media State */
        <div className="bg-cinema-900/50 border border-cinema-800/80 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <Film className="w-10 h-10 text-amber-500/80 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-cinema-100">No media footage imported</h3>
            <p className="text-xs text-cinema-400 leading-relaxed">
              Import a video or audio file to inspect frame rates, cut points, pacing rhythm, and structural parameters.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
