import React from 'react';
import { X, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ProcessDiagnosticsDrawer({ isOpen, onClose, trace, selectedComponents, detectedIntent }) {
  if (!isOpen) return null;

  const stages = [
    { name: 'Understanding', desc: 'Intent classification & user query analysis' },
    { name: 'Knowledge Retrieval', desc: 'Assembling NLE technique models & rules' },
    { name: 'Media Analysis', desc: 'Shot cut boundary & frame parameter inspection' },
    { name: 'Editorial Synthesis', desc: 'Calibrating recommendations to skill tier' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity flex justify-end">
      <div className="w-full max-w-md bg-cinema-950 h-full border-l border-cinema-800/80 flex flex-col shadow-2xl font-sans">
        
        {/* Header */}
        <div className="h-12 bg-cinema-900 px-6 border-b border-cinema-800 flex items-center justify-between text-sm font-semibold text-cinema-100">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-500" />
            <span>Assistant Process</span>
          </div>
          <button onClick={onClose} className="p-1 text-cinema-500 hover:text-cinema-100 transition-colors">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-cinema-300">
          
          {/* Query Intent */}
          {detectedIntent && (
            <div className="bg-cinema-900 p-4 rounded-xl border border-cinema-800 space-y-2">
              <span className="text-[11px] font-medium text-cinema-500 uppercase tracking-wider block">
                Classified Subject Intent
              </span>
              <span className="text-sm font-semibold text-amber-400 block">
                {detectedIntent}
              </span>
            </div>
          )}

          {/* Assistant Workflow Stages */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-cinema-400 uppercase tracking-wider block">
              Execution Process Workflow
            </span>

            <div className="space-y-3">
              {stages.map((stage, idx) => (
                <div key={idx} className="bg-cinema-900 p-3.5 rounded-xl border border-cinema-800/80 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center font-mono text-[11px] font-semibold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-cinema-100 block">
                      {stage.name}
                    </span>
                    <span className="text-[11px] text-cinema-400 block leading-relaxed">
                      {stage.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assembled Components */}
          {selectedComponents && selectedComponents.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-cinema-800/60">
              <span className="text-xs font-semibold text-cinema-400 uppercase tracking-wider block">
                Assembled Component Pipeline
              </span>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {selectedComponents.map((comp, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-cinema-900 text-cinema-200 border border-cinema-800 text-xs font-medium">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trace Steps (If detailed inspection requested) */}
          {trace && trace.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-cinema-800/60 font-mono text-xs">
              <span className="text-xs font-semibold font-sans text-cinema-400 uppercase tracking-wider block">
                ReAct Step Log
              </span>
              <div className="space-y-2">
                {trace.map((item, idx) => (
                  <div key={idx} className="bg-cinema-900/80 p-3 rounded-lg border border-cinema-800 space-y-1">
                    <div className="flex justify-between font-semibold text-cinema-200">
                      <span>{item.label}</span>
                      <span className="text-cinema-500">{item.step}</span>
                    </div>
                    <p className="text-cinema-400 text-[11px] leading-relaxed font-sans">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
