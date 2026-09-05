import React, { useState } from 'react';
import { Upload, Film, FileVideo, Music, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2, Play, Pause, Activity } from 'lucide-react';

export default function MediaAnalyzerView({ currentMedia, onMediaAnalyzed }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Media Analyzer Workspace</h2>
        <p className="text-xs text-slate-500 font-medium">
          Upload video, audio, or image footage for automated OpenCV frame-by-frame scene cut detection and pacing analysis.
        </p>
      </div>

      {/* Upload Dropzone */}
      <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer text-center shadow-sm transition-all relative overflow-hidden group">
        {uploading ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <span className="text-sm font-extrabold text-slate-900">Executing OpenCV Frame Analysis...</span>
            <span className="text-xs text-slate-500">Detecting shot cuts, FPS, resolution & pacing</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner group-hover:scale-105 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Upload Media</h3>
              <p className="text-xs text-slate-500 font-semibold">Video • Audio • Image</p>
            </div>
            <span className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200">
              Browse files
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept="video/*,audio/*,image/*"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </div>
        )}
      </label>

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-4 rounded-2xl border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Results Workspace */}
      {currentMedia && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{currentMedia.filename}</h3>
                <span className="text-xs text-slate-500 font-mono">OpenCV Scene Inspection Complete</span>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase">
              {currentMedia.type || "media"}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Duration</span>
              <span className="text-lg font-black text-slate-900">{currentMedia.duration}s</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Resolution</span>
              <span className="text-lg font-black text-slate-900">{currentMedia.resolution}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Frame Rate</span>
              <span className="text-lg font-black text-slate-900">{currentMedia.fps} fps</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Detected Cuts</span>
              <span className="text-lg font-black text-indigo-600">{currentMedia.shot_count} shots</span>
            </div>
          </div>

          {currentMedia.pacing_assessment && (
            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-1.5 text-xs">
              <span className="font-extrabold text-indigo-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-600" /> Pacing Assessment:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">{currentMedia.pacing_assessment}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
