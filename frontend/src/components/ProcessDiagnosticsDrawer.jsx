import React from 'react';
import { X, CheckCircle2, Activity, ArrowRight } from 'lucide-react';

export default function ProcessDiagnosticsDrawer({ isOpen, onClose, trace, selectedComponents, detectedIntent }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity flex justify-end">
      <div className="w-full max-w-md bg-studio-900 h-full border-l border-studio-800 flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="h-11 bg-studio-850 px-4 border-b border-studio-800 flex items-center justify-between font-mono text-xs font-bold text-studio-100 uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gold" />
            PROCESS DIAGNOSTICS & REACT TRACE
          </span>
          <button onClick={onClose} className="p-1 text-studio-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {/* Intent Card */}
          {detectedIntent && (
            <div className="bg-studio-950 p-3 rounded border border-studio-800 space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-studio-500 font-bold uppercase">QUESTION INTENT</span>
                <span className="text-gold font-bold">{detectedIntent}</span>
              </div>

              {selectedComponents && selectedComponents.length > 0 && (
                <div className="pt-2 border-t border-studio-800 space-y-1">
                  <span className="text-[10px] text-studio-500 font-bold uppercase block">ASSEMBLED PIPELINE:</span>
                  <div className="flex flex-wrap items-center gap-1 text-[11px]">
                    {selectedComponents.map((c, i) => (
                      <React.Fragment key={i}>
                        <span className="px-2 py-0.5 rounded bg-studio-900 text-studio-200 border border-studio-800">
                          {c}
                        </span>
                        {i < selectedComponents.length - 1 && <ArrowRight className="w-3 h-3 text-studio-600" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stepper Timeline */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-studio-400 uppercase tracking-wider block">
              EXECUTION TIMELINE STEPS:
            </span>

            {!trace || trace.length === 0 ? (
              <div className="p-6 text-center bg-studio-950 rounded border border-studio-800 text-studio-500 text-xs">
                No diagnostic execution recorded yet. Submit a query to inspect agent steps.
              </div>
            ) : (
              <div className="space-y-2">
                {trace.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1 text-[11px]">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>{item.label}</span>
                      <span className="text-[10px] text-slate-500">{item.step}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[10px]">{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
