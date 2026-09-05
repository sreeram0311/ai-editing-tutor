import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Scissors, Film, Music, Eye } from 'lucide-react';

export default function TimelineViewer({ mediaInfo }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPos, setPlayheadPos] = useState(20);
  const [activeTool, setActiveTool] = useState('selection');

  const duration = mediaInfo?.duration || 60.0;
  const shotCount = mediaInfo?.shot_count || 8;
  const fps = mediaInfo?.fps || 24;
  const res = mediaInfo?.resolution || '3840x2160';
  const filename = mediaInfo?.filename || 'SEQUENCE_MAIN_V1.MOV';

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

  return (
    <div className="bg-cinema-900 border border-cinema-800/80 rounded-2xl p-6 shadow-xl space-y-6 font-sans text-cinema-100">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cinema-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Film className="w-4 h-4 text-amber-500" />
          <h3 className="font-semibold text-cinema-100 text-sm font-sans tracking-wide">
            Sequence Timeline & Scrubber
          </h3>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-cinema-400">
          <span className="px-2.5 py-1 rounded bg-cinema-950 text-amber-400 border border-cinema-800">
            {res} @ {fps}fps
          </span>
          <span className="px-2.5 py-1 rounded bg-cinema-950 text-cinema-300 border border-cinema-800">
            {filename}
          </span>
        </div>
      </div>

      {/* Video Preview Monitor */}
      <div className="relative aspect-video max-h-64 w-full bg-cinema-950 rounded-xl border border-cinema-800/80 overflow-hidden flex flex-col items-center justify-center shadow-inner">
        <div className="text-center space-y-2 p-4 font-mono text-xs">
          <p className="text-amber-400 font-semibold">
            TC 00:{Math.floor(currentTime).toString().padStart(2, '0')}:00 / 00:{Math.floor(duration).toString().padStart(2, '0')}:00
          </p>
          <p className="text-cinema-500 font-sans text-xs">
            Shot Cut {(Math.floor((playheadPos / 100) * shotCount) + 1)} of {shotCount}
          </p>
        </div>

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-cinema-950 via-cinema-950/90 to-transparent p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-cinema-950 font-bold transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button onClick={() => setPlayheadPos(0)} className="p-1.5 text-cinema-500 hover:text-white">
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setPlayheadPos(100)} className="p-1.5 text-cinema-500 hover:text-white">
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-cinema-500 text-xs">
            <Volume2 className="w-4 h-4 text-cinema-300" />
            <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>

      {/* Multi-Track NLE Timeline */}
      <div className="bg-cinema-950 p-4 rounded-xl border border-cinema-800 relative overflow-hidden space-y-4">
        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-30 shadow-[0_0_8px_#d97706] pointer-events-none transition-all duration-75"
          style={{ left: `${playheadPos}%` }}
        >
          <div className="w-2.5 h-2.5 bg-amber-500 transform -translate-x-1/2 rotate-45 rounded-xs"></div>
        </div>

        {/* Time Ruler */}
        <div className="flex justify-between text-[10px] font-mono text-cinema-500 border-b border-cinema-800 pb-1">
          <span>00:00:00</span>
          <span>00:15:00</span>
          <span>00:30:00</span>
          <span>00:45:00</span>
          <span>{duration}s</span>
        </div>

        {/* Track V1 */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-cinema-400 font-medium">
            <Film className="w-3.5 h-3.5 text-amber-500" /> Track V1 (Visual Cuts)
          </div>
          <div className="h-10 bg-cinema-900 rounded-lg p-1 flex gap-1 border border-cinema-800 relative overflow-hidden">
            {Array.from({ length: shotCount }).map((_, idx) => (
              <div
                key={idx}
                style={{ width: `${100 / shotCount}%` }}
                className="h-full bg-amber-950/40 border border-amber-500/30 rounded p-1 flex items-center justify-between text-[11px] font-mono text-amber-300 font-medium overflow-hidden shrink-0"
              >
                <span className="truncate">Clip #{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Track A1 */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-cinema-400 font-medium">
            <Music className="w-3.5 h-3.5 text-emerald-400" /> Track A1 (Audio Dialogue Stem)
          </div>
          <div className="h-8 bg-cinema-900 rounded-lg p-1 border border-cinema-800 relative flex items-center justify-around overflow-hidden">
            {Array.from({ length: 45 }).map((_, i) => (
              <div
                key={i}
                style={{ height: `${Math.sin(i * 0.7) * 40 + 50}%` }}
                className="w-1 bg-emerald-500/60 rounded-full"
              ></div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
