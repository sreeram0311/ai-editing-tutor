import React from 'react';
import { Cpu, CheckCircle2, Layers, ArrowRight, Activity, Radio, Sparkles } from 'lucide-react';

export default function ReActTracePanel({ trace, selectedComponents, detectedIntent }) {
  return (
    <div className="bg-white border border-cream-300 rounded-2xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brown-800 text-brown-200 flex items-center justify-center">
            <Cpu className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-brown-900 text-sm tracking-tight font-sans">
              Agent Activity / ReAct Trace
            </h3>
            <p className="text-[10px] text-brown-500 font-medium">Reason ➔ Act ➔ Observe Step Log</p>
          </div>
        </div>

        {detectedIntent && (
          <span className="text-xs px-3 py-1 rounded-full font-mono font-bold bg-brown-100 text-brown-800 border border-brown-200 shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brown-600" />
            {detectedIntent}
          </span>
        )}
      </div>

      {/* Assembled Component Pipeline */}
      {selectedComponents && selectedComponents.length > 0 && (
        <div className="bg-cream-50 p-3.5 rounded-xl border border-cream-300 space-y-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-brown-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brown-600" />
            Dynamic Component Assembly ({selectedComponents.length})
          </div>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {selectedComponents.map((comp, idx) => (
              <React.Fragment key={idx}>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-white text-brown-900 border border-cream-300 font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brown-600"></span>
                  {comp}
                </span>
                {idx < selectedComponents.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-brown-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* ReAct Execution Timeline */}
      <div className="space-y-2 pt-1">
        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-brown-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            ReAct Execution Log
          </span>
          <span className="text-[10px] text-brown-500 font-normal">Step Trace</span>
        </div>

        {!trace || trace.length === 0 ? (
          <div className="bg-cream-50 p-5 rounded-xl border border-cream-300 text-center space-y-1">
            <p className="text-xs text-brown-800 font-bold">ReAct Log Ready</p>
            <p className="text-[11px] text-brown-600 max-w-xs mx-auto font-medium">
              Ask a question to see real-time component assembly and step execution.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {trace.map((item, idx) => (
              <div
                key={idx}
                className="bg-cream-50 rounded-xl p-3 border border-cream-300 flex items-start gap-3 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <div className="font-bold text-brown-900 flex items-center justify-between">
                    <span className="text-xs">{item.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-brown-600 border border-cream-300">
                      {item.step}
                    </span>
                  </div>
                  <p className="text-brown-700 leading-relaxed text-[11px] font-mono">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
