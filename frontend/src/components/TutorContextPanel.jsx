import React, { useState } from 'react';
import { BookOpen, ChevronRight, ChevronLeft, Sparkles, Layers, Sliders, CheckCircle2 } from 'lucide-react';

export default function TutorContextPanel({ detectedIntent, selectedComponents, userSkill, currentMedia }) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="hidden lg:flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
        title="Expand Tutor Context"
      >
        <ChevronLeft className="w-4 h-4 text-indigo-600" />
        <span className="writing-vertical text-[10px] font-mono uppercase tracking-wider text-slate-500">Context</span>
      </button>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-xs font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="font-extrabold text-slate-900 text-sm">Tutor Context</h3>
        </div>

        <button
          onClick={() => setCollapsed(true)}
          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Context Metric Items */}
      <div className="space-y-3">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Current Topic:</span>
          <span className="font-bold text-slate-900 text-xs block px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            {detectedIntent || "General Editing Guidance"}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Skill Adaptation:</span>
          <span className="font-bold text-indigo-700 text-xs inline-block px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100">
            {userSkill} Level Mode
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Active Knowledge Module:</span>
          <span className="font-medium text-slate-700 text-xs block leading-relaxed">
            Cutting Techniques, Audio Transitions & Multi-Software Execution
          </span>
        </div>

        {selectedComponents && selectedComponents.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Tools Used:</span>
            <div className="flex flex-wrap gap-1">
              {selectedComponents.map((c, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {currentMedia && (
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Attached Media File:</span>
            <span className="font-mono text-[11px] text-slate-800 truncate block font-bold">
              📹 {currentMedia.filename}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
