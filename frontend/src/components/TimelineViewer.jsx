import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Scissors, Film, Music, Eye, Lock, VolumeX, Plus, RefreshCw } from 'lucide-react';

export default function TimelineViewer({ mediaInfo }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPos, setPlayheadPos] = useState(15); // Percentage 0 - 100%
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTool, setActiveTool] = useState('selection'); // 'selection' | 'blade'
  const [clips, setClips] = useState([
    { id: 1, name: 'Take #1 (Master A-Roll)', duration: 7.5, color: 'bg-amber-950/60 border-amber-500/50 text-amber-200' },
    { id: 2, name: 'Take #2 (Medium Shot)', duration: 6.0, color: 'bg-sky-950/60 border-sky-500/50 text-sky-200' },
    { id: 3, name: 'Take #3 (Reaction L-Cut)', duration: 8.2, color: 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' },
    { id: 4, name: 'Take #4 (Close-up B-Roll)', duration: 5.5, color: 'bg-purple-950/60 border-purple-500/50 text-purple-200' },
    { id: 5, name: 'Take #5 (Wide Establishing)', duration: 9.0, color: 'bg-rose-950/60 border-rose-500/50 text-rose-200' },
  ]);
  const [trackMuted, setTrackMuted] = useState(false);
  const [trackLocked, setTrackLocked] = useState(false);
  
  const timelineRef = useRef(null);
  const videoRef = useRef(null);

  const duration = mediaInfo?.duration || 60.0;
  const shotCount = mediaInfo?.shot_count || clips.length;
  const fps = mediaInfo?.fps || 24;
  const res = mediaInfo?.resolution || '3840x2160 DCI 4K';
  const filename = mediaInfo?.filename || 'SEQUENCE_MASTER_V1.MOV';

  // Keyboard Shortcuts (Space: Play/Pause, J/K/L: Shuttle, C: Blade, V: Selection)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'k' || e.key === 'K') {
        setIsPlaying(false);
        setPlaybackSpeed(1);
      } else if (e.key === 'l' || e.key === 'L') {
        setIsPlaying(true);
        setPlaybackSpeed((prev) => (prev < 4 ? prev * 2 : 1));
      } else if (e.key === 'j' || e.key === 'J') {
        setIsPlaying(true);
        setPlaybackSpeed(-1);
      } else if (e.key === 'c' || e.key === 'C') {
        setActiveTool('blade');
      } else if (e.key === 'v' || e.key === 'V') {
        setActiveTool('selection');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Playhead Interval Timer
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayheadPos((prev) => {
          const next = prev + (0.3 * playbackSpeed);
          if (next >= 100) {
            setIsPlaying(false);
            return 0;
          }
          if (next < 0) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Click on Timeline Track to Scrub Playhead
  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPos = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    setPlayheadPos(newPos);

    // If Blade tool is active, perform split at playhead
    if (activeTool === 'blade') {
      splitClipAtPlayhead(newPos);
    }
  };

  // Perform Blade Split on active clips
  const splitClipAtPlayhead = (pos) => {
    const splitIndex = Math.floor((pos / 100) * clips.length);
    if (splitIndex >= 0 && splitIndex < clips.length) {
      const targetClip = clips[splitIndex];
      const newClip1 = { ...targetClip, id: Date.now(), name: `${targetClip.name} (Part A)` };
      const newClip2 = { ...targetClip, id: Date.now() + 1, name: `${targetClip.name} (Part B)` };
      
      const newClips = [...clips];
      newClips.splice(splitIndex, 1, newClip1, newClip2);
      setClips(newClips);
    }
  };

  const currentTime = ((playheadPos / 100) * duration).toFixed(2);

  return (
    <div className="bg-[#141622] border border-[#252838] rounded-2xl p-6 shadow-2xl space-y-6 font-sans text-white animate-fade-in">
      
      {/* 1. NLE Monitor Top Control Bar */}
      <div className="flex items-center justify-between border-b border-[#252838] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight font-sans">
              Master NLE Sequence Timeline
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Interactive timeline scrubbing • Shortcuts: Space (Play), J/K/L (Shuttle), C (Blade), V (Select)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-3 py-1 rounded-lg bg-[#0c0d12] text-amber-400 border border-[#252838] font-bold">
            {res} @ {fps}fps
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#0c0d12] text-slate-300 border border-[#252838] font-semibold">
            {filename}
          </span>
        </div>
      </div>

      {/* 2. Video Preview Monitor Canvas */}
      <div className="relative aspect-video max-h-72 w-full bg-[#0c0d12] rounded-2xl border border-[#252838] overflow-hidden flex flex-col items-center justify-center shadow-inner">
        
        {/* Playhead Timecode Monitor Display */}
        <div className="text-center space-y-2 p-6 font-mono">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>PLAYHEAD TIMECODE</span>
          </div>
          
          <div className="text-3xl md:text-4xl font-bold text-white tracking-widest pt-1">
            00:{Math.floor(currentTime).toString().padStart(2, '0')}:00
          </div>
          
          <p className="text-xs text-slate-400 font-sans font-medium">
            Active Take {(Math.floor((playheadPos / 100) * clips.length) + 1)} of {clips.length} • Total Duration: {duration}s
          </p>
        </div>

        {/* Video Player Transport Controls */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/90 to-transparent p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-cinema-950 font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button onClick={() => setPlayheadPos(0)} className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer" title="Jump to Beginning">
              <SkipBack className="w-4.5 h-4.5" />
            </button>
            
            <button onClick={() => setPlayheadPos(100)} className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer" title="Jump to End">
              <SkipForward className="w-4.5 h-4.5" />
            </button>

            {playbackSpeed !== 1 && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs">
                {playbackSpeed}x SPEED
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
            <button onClick={() => setTrackMuted(!trackMuted)} className="p-1.5 hover:text-white transition-colors">
              {trackMuted ? <VolumeX className="w-4.5 h-4.5 text-rose-400" /> : <Volume2 className="w-4.5 h-4.5 text-slate-200" />}
            </button>
            <Maximize2 className="w-4.5 h-4.5 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      {/* 3. Editing Tool Selection Bar */}
      <div className="flex items-center justify-between bg-[#0c0d12] p-2.5 rounded-xl border border-[#252838] text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTool('selection')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 font-bold transition-all cursor-pointer ${
              activeTool === 'selection' ? 'bg-amber-500 text-cinema-950 shadow-md' : 'text-slate-400 hover:bg-[#141622] hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" /> Selection Tool (V)
          </button>

          <button
            onClick={() => setActiveTool('blade')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 font-bold transition-all cursor-pointer ${
              activeTool === 'blade' ? 'bg-amber-500 text-cinema-950 shadow-md' : 'text-slate-400 hover:bg-[#141622] hover:text-white'
            }`}
          >
            <Scissors className="w-4 h-4" /> Blade / Razor Tool (C)
          </button>
        </div>

        <div className="text-xs font-mono text-slate-300 font-semibold">
          Active Clips on V1: <span className="text-amber-400 font-bold">{clips.length} Takes</span>
        </div>
      </div>

      {/* 4. Multi-Track Interactive NLE Timeline Track Area */}
      <div className="bg-[#0c0d12] p-5 rounded-2xl border border-[#252838] space-y-4 shadow-inner">
        
        {/* Interactive Playhead Line */}
        <div className="relative w-full h-4 font-mono text-[11px] text-slate-500 border-b border-[#252838] pb-1">
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-40 shadow-[0_0_12px_#d97706] pointer-events-none transition-all duration-75"
            style={{ left: `${playheadPos}%`, height: '180px' }}
          >
            <div className="w-3.5 h-3.5 bg-amber-500 transform -translate-x-1/2 rotate-45 rounded-xs"></div>
          </div>

          <div className="flex justify-between font-bold">
            <span>00:00:00</span>
            <span>00:15:00</span>
            <span>00:30:00</span>
            <span>00:45:00</span>
            <span>{duration}s</span>
          </div>
        </div>

        {/* Interactive Track V1 (Visual Shot Clips) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span>Track V1 — Visual Shot Takes & Cuts</span>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setTrackLocked(!trackLocked)} className="p-1 text-slate-400 hover:text-white">
                <Lock className={`w-3.5 h-3.5 ${trackLocked ? 'text-amber-400' : ''}`} />
              </button>
            </div>
          </div>

          <div 
            ref={timelineRef}
            onClick={handleTimelineClick}
            className="h-14 bg-[#141622] rounded-xl p-1.5 flex gap-1.5 border border-[#252838] relative overflow-hidden cursor-crosshair shadow-inner"
          >
            {clips.map((clip, idx) => (
              <div
                key={clip.id}
                style={{ width: `${100 / clips.length}%` }}
                className={`h-full ${clip.color} rounded-lg p-2 flex items-center justify-between text-xs font-mono font-bold overflow-hidden shrink-0 shadow-md border hover:brightness-125 transition-all`}
              >
                <span className="truncate">{clip.name}</span>
                <span className="text-[10px] opacity-70">{(duration / clips.length).toFixed(1)}s</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Track A1 (Audio Waveforms) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-emerald-400" />
              <span>Track A1 — Dialogue Stems & Audio Pre-laps</span>
            </div>
          </div>

          <div 
            onClick={handleTimelineClick}
            className={`h-12 bg-[#141622] rounded-xl p-2 border border-[#252838] relative flex items-center justify-around overflow-hidden cursor-crosshair ${
              trackMuted ? 'opacity-30' : ''
            }`}
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                style={{ height: `${isPlaying ? Math.sin(i * 0.8 + playheadPos) * 45 + 50 : Math.sin(i * 0.8) * 35 + 45}%` }}
                className="w-1 bg-emerald-500/70 rounded-full transition-all duration-100"
              ></div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
