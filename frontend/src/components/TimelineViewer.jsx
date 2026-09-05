import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Scissors, Film, Music, Eye, SlidersHorizontal } from 'lucide-react';

export default function TimelineViewer({ mediaInfo }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPos, setPlayheadPos] = useState(20); // 0 - 100%
  const [activeTool, setActiveTool] = useState('selection');

  const duration = mediaInfo?.duration || 60.0;
  const shotCount = mediaInfo?.shot_count || 8;
  const fps = mediaInfo?.fps || 24;
  const res = mediaInfo?.resolution || '3840x2160 (4K DCI)';
  const filename = mediaInfo?.filename || 'A001_C004_PRORES_RAW.MOV';
  const avgShot = mediaInfo?.average_shot_duration || 7.5;

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayheadPos((prev) => (prev >= 100 ? 0 : prev + 0.4));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentTime = ((playheadPos / 100) * duration).toFixed(2);

  const clipColors = [
    'bg-amber-950/80 border-amber-600/80 text-amber-200',
    'bg-indigo-950/80 border-indigo-600/80 text-indigo-200',
    'bg-emerald-950/80 border-emerald-600/80 text-emerald-200',
    'bg-rose-950/80 border-rose-600/80 text-rose-200',
    'bg-slate-800 border-slate-600 text-slate-200'
  ];

  return (
    <div className="bg-studio-900 border border-studio-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* NLE Monitor Top Bar */}
      <div className="flex items-center justify-between border-b border-studio-800 pb-3">
        <div className="flex items-center gap-2.5">
          <Film className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm font-sans tracking-wide">
            Master Editing Suite & Preview Monitor
          </h3>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-studio-950 text-amber-400 border border-amber-500/30">
            {res} @ {fps}fps
          </span>
          <span className="px-2.5 py-1 rounded bg-studio-950 text-slate-300 border border-studio-800">
            {filename}
          </span>
        </div>
      </div>

      {/* Main Video Preview Canvas */}
      <div className="relative aspect-video max-h-72 w-full bg-studio-950 rounded-xl border border-studio-800 overflow-hidden flex flex-col items-center justify-center group shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-br from-studio-950 via-studio-900 to-studio-950 flex items-center justify-center">
          <div className="text-center space-y-2 p-4">
            <SlidersHorizontal className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-xs font-mono font-bold text-amber-400">
              PLAYHEAD TIMECODE: {currentTime}s / {duration}s
            </p>
            <p className="text-[11px] text-studio-500 font-medium">
              Shot Cut {(Math.floor((playheadPos / 100) * shotCount) + 1)} of {shotCount} • Pace: {avgShot}s avg shot length
            </p>
          </div>
        </div>

        {/* Video Player Transport Controls */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-studio-950 via-studio-950/90 to-transparent p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-studio-950 font-bold transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button onClick={() => setPlayheadPos(0)} className="p-1.5 text-studio-500 hover:text-white">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={() => setPlayheadPos(100)} className="p-1.5 text-studio-500 hover:text-white">
              <SkipForward className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-amber-300 ml-2 font-bold">
              TC 00:{Math.floor(currentTime).toString().padStart(2, '0')}:00 / 00:{Math.floor(duration).toString().padStart(2, '0')}:00
            </span>
          </div>

          <div className="flex items-center gap-3 text-studio-500 text-xs font-mono">
            <span>Shortcuts: J / K / L</span>
            <Volume2 className="w-4 h-4 text-slate-300" />
            <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>

      {/* Editing Tool selection */}
      <div className="flex items-center justify-between bg-studio-950 p-2 rounded-xl border border-studio-800 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTool('selection')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
              activeTool === 'selection' ? 'bg-amber-500 text-studio-950 shadow' : 'text-studio-500 hover:bg-studio-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Selection Tool (V)
          </button>
          <button
            onClick={() => setActiveTool('razor')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
              activeTool === 'razor' ? 'bg-amber-500 text-studio-950 shadow' : 'text-studio-500 hover:bg-studio-900'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" /> Blade Tool (C)
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Detected Cuts: <span className="text-amber-400 font-bold">{shotCount} Clips</span>
        </div>
      </div>

      {/* Multi-Track NLE Timeline */}
      <div className="bg-studio-950 p-4 rounded-xl border border-studio-800 relative overflow-hidden space-y-3">
        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-30 shadow-[0_0_8px_#f59e0b] pointer-events-none transition-all duration-75"
          style={{ left: `${playheadPos}%` }}
        >
          <div className="w-3 h-3 bg-amber-400 transform -translate-x-1/2 rotate-45 rounded-sm"></div>
        </div>

        {/* Time Ruler */}
        <div className="flex justify-between text-[10px] font-mono text-studio-500 border-b border-studio-800 pb-1">
          <span>00:00:00</span>
          <span>00:15:00</span>
          <span>00:30:00</span>
          <span>00:45:00</span>
          <span>{duration}s</span>
        </div>

        {/* Video Track V1 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 font-semibold">
            <Film className="w-3.5 h-3.5 text-amber-400" /> Track V1 — Main A-Roll / Shot Cuts
          </div>
          <div className="h-10 bg-studio-900 rounded-lg p-1 flex gap-1 border border-studio-800 relative overflow-hidden">
            {Array.from({ length: shotCount }).map((_, idx) => (
              <div
                key={idx}
                style={{ width: `${100 / shotCount}%` }}
                className={`h-full ${clipColors[idx % clipColors.length]} rounded border p-1 flex items-center justify-between text-[10px] font-mono font-bold overflow-hidden shrink-0 shadow-sm`}
              >
                <span className="truncate">Take #{idx + 1}</span>
                <span className="text-[9px] opacity-70">{(duration / shotCount).toFixed(1)}s</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Track A1 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 font-semibold">
            <Music className="w-3.5 h-3.5 text-emerald-400" /> Track A1 — Dialogue Stem & J/L Cuts
          </div>
          <div className="h-8 bg-studio-900 rounded-lg p-1 border border-studio-800 relative flex items-center justify-around overflow-hidden">
            {Array.from({ length: 45 }).map((_, i) => (
              <div
                key={i}
                style={{ height: `${Math.sin(i * 0.7) * 40 + 50}%` }}
                className="w-1 bg-emerald-500/70 rounded-full"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
