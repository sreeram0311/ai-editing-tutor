import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function EditorialInspector({ detectedIntent, selectedComponents, userSkill, currentMedia }) {
  return (
    <aside className="w-80 bg-cinema-950 border-l border-cinema-800 flex flex-col h-full text-sm font-sans select-none shrink-0 overflow-y-auto p-6 space-y-6">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-cinema-800 pb-4">
        <span className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          EDITORIAL CONTEXT
        </span>
      </div>

      {/* 1. Subject & Approach */}
      <div className="space-y-4 border-b border-cinema-800 pb-5">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Current Subject
          </span>
          <span className="text-base font-bold text-white block">
            {detectedIntent || "General Editorial Consultation"}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Skill Tier
          </span>
          <span className="text-sm font-bold text-amber-400 block">
            {userSkill} Editorial
          </span>
        </div>
      </div>

      {/* 2. Technical Parameters (Monospace for metadata) */}
      <div className="space-y-3 border-b border-cinema-800 pb-5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-sans">
          Technical Parameters
        </span>
        <div className="space-y-2.5 text-slate-200 font-mono text-xs md:text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Audio Lead:</span>
            <span className="text-white font-bold">1.0s – 2.5s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Crossfade:</span>
            <span className="text-white font-bold">Constant Power</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Timecode:</span>
            <span className="text-white font-bold">Drop Frame</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Frame Rate:</span>
            <span className="text-white font-bold">{currentMedia?.fps || 24} fps</span>
          </div>
        </div>
      </div>

      {/* 3. Assembled Knowledge Modules */}
      {selectedComponents && selectedComponents.length > 0 && (
        <div className="space-y-2.5 border-b border-cinema-800 pb-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-sans">
            Relevant Pipeline Modules
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedComponents.map((comp, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-cinema-900 text-slate-200 border border-cinema-700 text-xs font-medium font-mono">
                {comp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Active Footage Info */}
      {currentMedia && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-sans">
            Active Media Footage
          </span>
          <div className="text-xs md:text-sm space-y-1 font-mono text-slate-300">
            <span className="text-white font-sans font-semibold block truncate">
              📹 {currentMedia.filename}
            </span>
            <span>Duration: {currentMedia.duration}s • Cuts: {currentMedia.shot_count}</span>
          </div>
        </div>
      )}

    </aside>
  );
}
