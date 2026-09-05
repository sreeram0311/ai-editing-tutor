import React from 'react';
import { X, CheckCircle2, Layers, Cpu, Activity, ArrowRight, Sparkles } from 'lucide-react';

export default function AgentActivityDrawer({ isOpen, onClose, trace, selectedComponents, detectedIntent }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm transition-opacity flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Agent Activity & ReAct Trace</h3>
              <p className="text-[11px] text-slate-500 font-medium">Under-the-hood reasoning workflow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Intent & Assembled Components Card */}
          {detectedIntent && (
            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-indigo-900">
                  Detected Intent
                </span>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-indigo-600 text-white">
                  {detectedIntent}
                </span>
              </div>

              {selectedComponents && selectedComponents.length > 0 && (
                <div className="pt-2 border-t border-indigo-100/80 space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
                    Assembled Pipeline ({selectedComponents.length} Components):
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedComponents.map((comp, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-white text-indigo-950 font-bold border border-indigo-200 shadow-sm">
                          {comp}
                        </span>
                        {idx < selectedComponents.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stepper Execution Log */}
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
              ReAct Execution Steps:
            </span>

            {!trace || trace.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 space-y-1">
                <p className="text-xs font-bold">No Agent Activity Recorded Yet</p>
                <p className="text-[11px]">Ask a question in the Tutor tab to inspect how the agent reasons.</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 pl-4 pt-1">
                {trace.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white ring-2 ring-indigo-100"></div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                        <span>{item.label}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-500">
                          {item.step}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-mono leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center font-medium">
          LangGraph State Machine Engine • Agent Transparency Panel
        </div>
      </div>
    </div>
  );
}
