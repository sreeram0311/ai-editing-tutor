import React from 'react';
import { SlidersHorizontal, Layers, Film } from 'lucide-react';

export default function EditorialInspector({ detectedIntent, selectedComponents, userSkill, currentMedia }) {
  return (
    <aside className="w-72 bg-cinema-950 border-l border-cinema-800/60 flex flex-col h-full text-xs font-sans select-none shrink-0 overflow-y-auto p-5 space-y-6">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-cinema-800/80 pb-3">
        <span className="text-xs font-semibold text-cinema-300 uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
          EDITORIAL CONTEXT
        </span>
      </div>

      {/* 1. Subject & Approach */}
      <div className="space-y-4 border-b border-cinema-800/60 pb-5">
        <div className="space-y-1">
          <span className="text-[11px] text-cinema-500 font-medium uppercase tracking-wider block">
            Current Subject
          </span>
          <span className="text-sm font-semibold text-cinema-100 block">
            {detectedIntent || "General Editorial Consultation"}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-cinema-500 font-medium uppercase tracking-wider block">
            Skill Tier
          </span>
          <span className="text-xs font-medium text-amber-400 block">
            {userSkill} Editorial
          </span>
        </div>
      </div>

      {/* 2. Technical Parameters (Monospace for metadata) */}
      <div className="space-y-3 border-b border-cinema-800/60 pb-5">
        <span className="text-[11px] text-cinema-500 font-medium uppercase tracking-wider block font-sans">
          Technical Parameters
        </span>
        <div className="space-y-2 text-cinema-300 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-cinema-500 font-sans">Audio Lead:</span>
            <span className="text-cinema-100">1.0s – 2.5s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cinema-500 font-sans">Crossfade:</span>
            <span className="text-cinema-100">Constant Power</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cinema-500 font-sans">Timecode standard:</span>
            <span className="text-cinema-100">Drop Frame</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cinema-500 font-sans">Frame Rate:</span>
            <span className="text-cinema-100">{currentMedia?.fps || 24} fps</span>
          </div>
        </div>
      </div>

      {/* 3. Assembled Knowledge Modules */}
      {selectedComponents && selectedComponents.length > 0 && (
        <div className="space-y-2 border-b border-cinema-800/60 pb-5">
          <span className="text-[11px] text-cinema-500 font-medium uppercase tracking-wider block font-sans">
            Relevant Pipeline Modules
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {selectedComponents.map((comp, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-cinema-900 text-cinema-300 border border-cinema-800 text-xs font-medium">
                {comp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Active Footage Info */}
      {currentMedia && (
        <div className="space-y-2">
          <span className="text-[11px] text-cinema-500 font-medium uppercase tracking-wider block font-sans">
            Active Media Footage
          </span>
          <div className="text-xs space-y-1 font-mono text-cinema-400">
            <span className="text-cinema-100 font-sans font-medium block truncate">
              📹 {currentMedia.filename}
            </span>
            <span>Duration: {currentMedia.duration}s • Cuts: {currentMedia.shot_count}</span>
          </div>
        </div>
      )}

    </aside>
  );
}
