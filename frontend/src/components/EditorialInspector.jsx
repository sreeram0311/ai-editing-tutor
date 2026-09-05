import React from 'react';
import { SlidersHorizontal, ChevronRight, HardDrive } from 'lucide-react';

export default function EditorialInspector({ detectedIntent, selectedComponents, userSkill, currentMedia }) {
  return (
    <aside className="w-72 bg-studio-900 border-l border-studio-800 flex flex-col h-full text-xs font-sans select-none shrink-0 overflow-y-auto">
      {/* Inspector Panel Title */}
      <div className="h-9 bg-studio-850 px-3 border-b border-studio-800 flex items-center justify-between font-mono text-[11px] font-bold text-studio-100 uppercase tracking-wider">
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gold" />
          EDITORIAL CONTEXT
        </span>
        <span className="text-studio-500 font-normal">INSPECTOR</span>
      </div>

      <div className="p-3 space-y-4">
        {/* Core Topic & Skill Mode Section */}
        <div className="space-y-2 border-b border-studio-800 pb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-studio-500 font-bold block">Current Subject</span>
            <span className="font-semibold text-studio-100 block bg-studio-950 p-2 rounded border border-studio-800 text-[11px]">
              {detectedIntent || "General Editorial Guidance"}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-studio-500 font-bold block">Skill Mode</span>
            <span className="font-mono text-[11px] font-bold text-gold inline-block px-2 py-0.5 rounded bg-studio-950 border border-studio-800">
              {userSkill} Editorial
            </span>
          </div>
        </div>

        {/* Technical Parameters Breakdown */}
        <div className="space-y-2 border-b border-studio-800 pb-3 font-mono text-[11px]">
          <span className="text-[10px] uppercase text-studio-500 font-bold block font-mono">TECHNICAL PARAMETERS</span>
          <div className="bg-studio-950 p-2.5 rounded border border-studio-800 space-y-1.5 text-studio-400">
            <div className="flex justify-between">
              <span>Audio Lead:</span>
              <span className="text-studio-100 font-bold">1.0s – 2.5s</span>
            </div>
            <div className="flex justify-between">
              <span>Crossfade:</span>
              <span className="text-studio-100 font-bold">Constant Power</span>
            </div>
            <div className="flex justify-between">
              <span>Frame Rate:</span>
              <span className="text-studio-100 font-bold">{currentMedia?.fps || 24} fps</span>
            </div>
            <div className="flex justify-between">
              <span>Resolution:</span>
              <span className="text-studio-100 font-bold">{currentMedia?.resolution || "3840x2160"}</span>
            </div>
          </div>
        </div>

        {/* Assembled Technical Indicator */}
        {selectedComponents && selectedComponents.length > 0 && (
          <div className="space-y-1.5 border-b border-studio-800 pb-3 font-mono text-[11px]">
            <span className="text-[10px] uppercase text-studio-500 font-bold block">ASSEMBLED PIPELINE</span>
            <div className="flex flex-wrap gap-1">
              {selectedComponents.map((comp, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-studio-950 text-studio-300 border border-studio-800 text-[10px] font-bold">
                  {comp}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Active Media File */}
        {currentMedia && (
          <div className="space-y-1 font-mono text-[11px]">
            <span className="text-[10px] uppercase text-studio-500 font-bold block">ACTIVE FOOTAGE</span>
            <div className="bg-studio-950 p-2 rounded border border-studio-800 space-y-1">
              <span className="text-studio-100 font-bold block truncate">📹 {currentMedia.filename}</span>
              <span className="text-studio-500 text-[10px] block">Duration: {currentMedia.duration}s • Cuts: {currentMedia.shot_count}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
