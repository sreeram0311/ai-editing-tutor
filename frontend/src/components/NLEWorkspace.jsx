import React, { useState } from 'react';
import { 
  Film, Scissors, Play, Pause, SkipBack, SkipForward, Volume2, 
  Maximize2, Eye, HardDrive, Clapperboard, Layers, SlidersHorizontal, 
  HelpCircle, Settings, Monitor, Sparkles, Send, Loader2, Bot, User, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function NLEWorkspace({ 
  messages, loading, onSendMessage, currentMedia, onMediaAnalyzed, 
  reactTrace, selectedComponents, detectedIntent, userSkill, setUserSkill 
}) {
  const [activeWorkspace, setActiveWorkspace] = useState('Editing');
  const [activeTool, setActiveTool] = useState('selection');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPos, setPlayheadPos] = useState(25); // percentage 0-100
  const [inputQuery, setInputQuery] = useState('');

  const duration = currentMedia?.duration || 60.0;
  const shotCount = currentMedia?.shot_count || 8;
  const fps = currentMedia?.fps || 24;
  const resolution = currentMedia?.resolution || '3840x2160 (4K DCI)';
  const filename = currentMedia?.filename || 'A001_C004_PRORES_RAW.MOV';
  const avgShot = currentMedia?.average_shot_duration || 7.5;

  const currentTime = ((playheadPos / 100) * duration).toFixed(2);
  const currentFrame = Math.floor((playheadPos / 100) * duration * fps);

  const handleSubmitQuery = (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || loading) return;
    onSendMessage(inputQuery);
    setInputQuery('');
  };

  const handlePresetClick = (query) => {
    if (loading) return;
    onSendMessage(query);
  };

  const presetTopics = [
    "What is a J-cut?",
    "Why does my video feel slow?",
    "Which editing style fits this footage?",
    "Give me an exercise for pacing",
    "Analyze video, find weakness & give exercise",
    "Tutorial of velocity editing"
  ];

  return (
    <div className="min-h-screen bg-[#111215] text-[#d1d5db] font-sans flex flex-col select-none border-t-2 border-amber-500">
      {/* 1. NLE TOP MENU BAR */}
      <header className="bg-[#181a1f] border-b border-[#282c37] px-3 py-1.5 flex items-center justify-between text-xs text-[#9ca3af]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-white tracking-wider font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            PRO EDIT STUDIO v2.0
          </div>
          <div className="hidden md:flex items-center gap-3 text-[11px]">
            <span className="hover:text-white cursor-pointer">File</span>
            <span className="hover:text-white cursor-pointer">Edit</span>
            <span className="hover:text-white cursor-pointer">Clip</span>
            <span className="hover:text-white cursor-pointer">Sequence</span>
            <span className="hover:text-white cursor-pointer font-semibold text-amber-400">AI Tutor</span>
            <span className="hover:text-white cursor-pointer">Marker</span>
            <span className="hover:text-white cursor-pointer">Window</span>
            <span className="hover:text-white cursor-pointer">Help</span>
          </div>
        </div>

        {/* NLE Workspaces Switcher */}
        <div className="flex items-center gap-1 bg-[#101114] p-0.5 rounded border border-[#282c37]">
          {['Editing', 'Color Grading', 'Audio Fairlight', 'Tutor Assistant'].map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveWorkspace(mode)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                activeWorkspace === mode
                  ? 'bg-[#282c37] text-amber-400 font-bold border border-[#3b4050]'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Skill Level Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono text-[#6b7280]">Editor Level:</span>
          <select
            value={userSkill}
            onChange={(e) => setUserSkill(e.target.value)}
            className="bg-[#101114] border border-[#282c37] text-amber-400 text-[11px] font-bold rounded px-2 py-0.5 focus:outline-none"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </header>

      {/* 2. MAIN 3-COLUMN NLE PANELS */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-1 p-1 overflow-hidden">
        
        {/* PANEL A: PROJECT BIN & MEDIA POOL (Top Left, 3 cols) */}
        <div className="lg:col-span-3 bg-[#181a1f] border border-[#282c37] rounded flex flex-col h-[520px]">
          <div className="bg-[#14151a] px-3 py-2 border-b border-[#282c37] flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-500" />
              PROJECT BIN / MEDIA POOL
            </span>
            <span className="text-[10px] font-mono text-[#6b7280]">OpenCV Engine</span>
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            {/* Upload Zone */}
            <label className="border border-dashed border-[#3b4050] hover:border-amber-500 bg-[#101114] rounded p-3 flex flex-col items-center justify-center cursor-pointer text-center">
              <Film className="w-5 h-5 text-amber-500 mb-1" />
              <span className="text-xs font-bold text-white">Import Footage File</span>
              <span className="text-[10px] text-[#6b7280]">MP4, MOV, WAV, JPG (OpenCV Analysis)</span>
              <input 
                type="file" 
                className="hidden" 
                accept="video/*,audio/*,image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    const formData = new FormData();
                    formData.append("file", e.target.files[0]);
                    fetch("/api/upload", { method: "POST", body: formData })
                      .then((res) => res.json())
                      .then((data) => onMediaAnalyzed(data.media_info));
                  }
                }}
              />
            </label>

            {/* Footage Metadata Inspector */}
            {currentMedia ? (
              <div className="bg-[#101114] p-3 rounded border border-[#282c37] space-y-2 text-xs">
                <div className="font-bold text-amber-400 border-b border-[#282c37] pb-1 truncate">
                  🎬 {currentMedia.filename}
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
                  <div><span className="text-[#6b7280]">Duration:</span> {currentMedia.duration}s</div>
                  <div><span className="text-[#6b7280]">Res:</span> {currentMedia.resolution}</div>
                  <div><span className="text-[#6b7280]">FPS:</span> {currentMedia.fps}</div>
                  <div><span className="text-[#6b7280]">Cuts:</span> {currentMedia.shot_count}</div>
                  <div className="col-span-2"><span className="text-[#6b7280]">Avg Take:</span> {currentMedia.average_shot_duration}s</div>
                </div>
                {currentMedia.pacing_assessment && (
                  <div className="bg-[#241a0d] p-2 rounded border border-amber-800/40 text-[10px] text-amber-300">
                    <strong>Pacing:</strong> {currentMedia.pacing_assessment}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#101114] p-3 rounded border border-[#282c37] text-xs text-[#6b7280] text-center">
                No active clip loaded. Upload footage or select a preset topic to begin.
              </div>
            )}

            {/* Quick Topic Chips */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono font-bold uppercase text-[#6b7280] block">Preset Topics:</span>
              <div className="space-y-1">
                {presetTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => handlePresetClick(topic)}
                    disabled={loading}
                    className="w-full text-left text-[11px] p-1.5 rounded bg-[#101114] hover:bg-[#282c37] hover:text-white border border-[#282c37] truncate text-[#9ca3af] transition-colors"
                  >
                    ▶ {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PANEL B: PROGRAM MONITOR / MASTER PREVIEW (Top Center, 5 cols) */}
        <div className="lg:col-span-5 bg-[#181a1f] border border-[#282c37] rounded flex flex-col h-[520px]">
          <div className="bg-[#14151a] px-3 py-2 border-b border-[#282c37] flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-amber-500" />
              PROGRAM MONITOR — SEQUENCE PREVIEW
            </span>
            <span className="text-[10px] font-mono text-amber-400 font-bold">
              {resolution} @ {fps}fps
            </span>
          </div>

          {/* Monitor Screen Canvas */}
          <div className="flex-1 bg-[#0b0c0e] relative flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Aspect Ratio Box */}
            <div className="w-full h-full border border-[#282c37] rounded bg-gradient-to-br from-[#12141a] via-[#0b0c0e] to-[#171922] flex flex-col items-center justify-center relative shadow-inner">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center mx-auto text-amber-400">
                  <Film className="w-6 h-6 animate-pulse" />
                </div>
                <div className="font-mono text-sm font-bold text-amber-400 tracking-wider">
                  TC 00:{Math.floor(currentTime).toString().padStart(2, '0')}:{currentFrame.toString().padStart(2, '0')}
                </div>
                <div className="text-[11px] font-mono text-[#6b7280]">
                  Clip: {filename} • Shot {(Math.floor((playheadPos / 100) * shotCount) + 1)} of {shotCount}
                </div>
              </div>
            </div>

            {/* Playback Controls Bar */}
            <div className="w-full bg-[#14151a] border-t border-[#282c37] p-2 flex items-center justify-between text-xs mt-1 rounded">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded bg-amber-500 hover:bg-amber-400 text-[#0e0f12] font-bold"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>
                <button onClick={() => setPlayheadPos(0)} className="p-1 text-[#9ca3af] hover:text-white">
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setPlayheadPos(100)} className="p-1 text-[#9ca3af] hover:text-white">
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="font-mono text-[11px] text-[#9ca3af]">
                00:{Math.floor(currentTime).toString().padStart(2, '0')}:00 / 00:{Math.floor(duration).toString().padStart(2, '0')}:00
              </span>

              <div className="flex items-center gap-2 text-[#9ca3af]">
                <Volume2 className="w-3.5 h-3.5" />
                <Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* PANEL C: AI TUTOR INSPECTOR & WORKFLOW LOG (Top Right, 4 cols) */}
        <div className="lg:col-span-4 bg-[#181a1f] border border-[#282c37] rounded flex flex-col h-[520px]">
          <div className="bg-[#14151a] px-3 py-2 border-b border-[#282c37] flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-amber-500" />
              AI ASSISTANT / INSPECTOR PANEL
            </span>
            {detectedIntent && (
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded font-bold">
                {detectedIntent}
              </span>
            )}
          </div>

          {/* ReAct Component Assembly Pipeline */}
          {selectedComponents && selectedComponents.length > 0 && (
            <div className="bg-[#101114] p-2 border-b border-[#282c37] text-[10px] font-mono">
              <span className="text-[#6b7280] font-bold block mb-1">ASSEMBLED PIPELINE:</span>
              <div className="flex flex-wrap gap-1">
                {selectedComponents.map((c, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-[#282c37] text-slate-200 border border-[#3b4050]">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dialogue & Inspector Output */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#101114]">
            {messages.length === 0 ? (
              <div className="text-center py-10 space-y-2 text-[#6b7280]">
                <Bot className="w-8 h-8 mx-auto text-amber-500/60" />
                <p className="text-xs font-bold text-white">AI Edit Assistant Ready</p>
                <p className="text-[11px] max-w-xs mx-auto">
                  Type a question below or choose a topic from the Project Bin to receive skill-adapted workflow guidance.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`text-xs p-3 rounded space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-black font-semibold ml-6'
                    : 'bg-[#181a1f] text-slate-200 border border-[#282c37] mr-2 whitespace-pre-wrap'
                }`}>
                  <div className="text-[10px] font-mono opacity-70 flex justify-between">
                    <span>{msg.sender === 'user' ? 'EDITOR' : 'ASSISTANT TUTOR'}</span>
                  </div>
                  <div>{msg.text}</div>
                </div>
              ))
            )}

            {loading && (
              <div className="p-3 bg-[#181a1f] border border-[#282c37] rounded text-xs text-amber-400 flex items-center gap-2 font-mono">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing ReAct Cycle & Assembling Tools...</span>
              </div>
            )}
          </div>

          {/* Prompt Bar Input */}
          <form onSubmit={handleSubmitQuery} className="p-2 bg-[#14151a] border-t border-[#282c37] flex gap-1.5">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask editing question or workflow advice..."
              disabled={loading}
              className="flex-1 bg-[#101114] border border-[#282c37] rounded px-2.5 py-1.5 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 font-bold text-black text-xs rounded transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. FULL-WIDTH MULTI-TRACK NLE TIMELINE (Bottom Panel) */}
      <div className="bg-[#181a1f] border-t border-[#282c37] p-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Film className="w-4 h-4" /> TIMELINE SEQUENCE
            </span>
            <div className="flex gap-1 bg-[#101114] p-0.5 rounded border border-[#282c37]">
              <button onClick={() => setActiveTool('selection')} className={`px-2 py-0.5 text-[10px] rounded ${activeTool === 'selection' ? 'bg-amber-500 text-black font-bold' : 'text-[#6b7280]'}`}>Selection (V)</button>
              <button onClick={() => setActiveTool('razor')} className={`px-2 py-0.5 text-[10px] rounded ${activeTool === 'razor' ? 'bg-amber-500 text-black font-bold' : 'text-[#6b7280]'}`}>Blade (C)</button>
            </div>
          </div>
          <span className="text-[#6b7280]">Sequence 01 • {shotCount} Cuts • {duration}s</span>
        </div>

        {/* Timeline Tracks Visualizer */}
        <div className="bg-[#101114] p-3 rounded border border-[#282c37] relative overflow-hidden space-y-2">
          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-30 shadow-[0_0_8px_#f59e0b] pointer-events-none"
            style={{ left: `${playheadPos}%` }}
          >
            <div className="w-2.5 h-2.5 bg-amber-400 transform -translate-x-1/2 rotate-45"></div>
          </div>

          {/* Time Ruler */}
          <div className="flex justify-between text-[9px] font-mono text-[#6b7280] border-b border-[#282c37] pb-1">
            <span>00:00:00</span>
            <span>00:15:00</span>
            <span>00:30:00</span>
            <span>00:45:00</span>
            <span>{duration}s</span>
          </div>

          {/* Track V1 */}
          <div className="h-8 bg-[#181a1f] rounded p-0.5 flex gap-1 border border-[#282c37]">
            {Array.from({ length: shotCount }).map((_, i) => (
              <div
                key={i}
                style={{ width: `${100 / shotCount}%` }}
                className="h-full bg-amber-950/80 border border-amber-600/80 text-amber-300 font-mono text-[9px] font-bold rounded p-1 flex items-center justify-between overflow-hidden"
              >
                <span>Clip #{i + 1}</span>
                <span>{(duration / shotCount).toFixed(1)}s</span>
              </div>
            ))}
          </div>

          {/* Track A1 */}
          <div className="h-6 bg-[#181a1f] rounded p-0.5 border border-[#282c37] flex items-center justify-around overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} style={{ height: `${Math.sin(i * 0.5) * 40 + 50}%` }} className="w-1 bg-emerald-500/70 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
