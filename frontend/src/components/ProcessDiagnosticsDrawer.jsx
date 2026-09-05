import React from 'react';
import { X, Cpu } from 'lucide-react';

export default function ProcessDiagnosticsDrawer({ isOpen, onClose, trace, selectedComponents, detectedIntent }) {
  if (!isOpen) return null;

  const stages = [
    { name: 'Understanding', desc: 'Intent classification & user query analysis' },
    { name: 'Knowledge Retrieval', desc: 'Assembling NLE technique models & rules' },
    { name: 'Media Analysis', desc: 'Shot cut boundary & frame parameter inspection' },
    { name: 'Editorial Synthesis', desc: 'Calibrating recommendations to skill tier' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs transition-opacity flex justify-end font-sans">
      <div className="w-full max-w-lg bg-cinema-950 h-full border-l border-cinema-800 flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="h-14 bg-cinema-900 px-6 border-b border-cinema-800 flex items-center justify-between text-base font-bold text-white">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-amber-400" />
            <span>Assistant Process</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-200">
          
          {/* Query Intent */}
          {detectedIntent && (
            <div className="bg-cinema-900 p-5 rounded-2xl border border-cinema-700/80 space-y-2 shadow-md">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Classified Subject Intent
              </span>
              <span className="text-base font-bold text-amber-400 block">
                {detectedIntent}
              </span>
            </div>
          )}

          {/* Assistant Workflow Stages */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Execution Process Workflow
            </span>

            <div className="space-y-3">
              {stages.map((stage, idx) => (
                <div key={idx} className="bg-cinema-900 p-4 rounded-xl border border-cinema-700/80 flex items-start gap-3.5 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-white block">
                      {stage.name}
                    </span>
                    <span className="text-xs text-slate-300 block leading-relaxed">
                      {stage.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assembled Components */}
          {selectedComponents && selectedComponents.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-cinema-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Assembled Component Pipeline
              </span>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {selectedComponents.map((comp, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-cinema-900 text-slate-200 border border-cinema-700 text-xs font-medium font-mono">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
