import React, { useState } from 'react';
import { Target, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PracticeDrillsWorkstation() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showNote, setShowNote] = useState(false);

  const sampleDrills = [
    {
      id: "EDITORIAL EXERCISE 04",
      scenario: "Dialogue Continuity & Reaction Timing",
      question: "You are cutting a high-tension two-person dialogue scene. Speaker A delivers a critical revelation line. Which edit best preserves conversational continuity and emotional impact?",
      options: [
        { id: 'A', text: "Dialogue-driven J-Cut: Introduce Speaker B's voice 1.5 seconds before visual cut.", correct: false },
        { id: 'B', text: "Reaction L-Cut: Cut to Speaker B's facial reaction while Speaker A's dialogue continues.", correct: true },
        { id: 'C', text: "Hard Jump Cut on the exact same frame size.", correct: false },
        { id: 'D', text: "Black screen dip to fade.", correct: false }
      ],
      note: "Correct. An L-cut enables the audience to observe the emotional impact on the listener's face while maintaining continuous spoken dialogue audio."
    }
  ];

  const drill = sampleDrills[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none font-sans space-y-4">
      <div className="h-9 bg-studio-900 px-4 border-b border-studio-800 flex items-center justify-between font-mono text-[11px] text-studio-400 uppercase font-bold shrink-0">
        <span className="flex items-center gap-2">
          <Target className="w-4 h-4 text-gold" />
          EDITORIAL PRACTICE WORKSTATION
        </span>
        <span className="text-gold font-mono">{drill.id}</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-studio-950 border border-studio-800 rounded">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-studio-500 uppercase font-bold">SCENARIO:</span>
          <h3 className="text-sm font-extrabold text-studio-100">{drill.scenario}</h3>
        </div>

        <p className="text-xs text-studio-200 leading-relaxed font-semibold">
          {drill.question}
        </p>

        {/* Options */}
        <div className="space-y-2 pt-2">
          {drill.options.map((opt) => {
            const isSelected = selectedOption?.id === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedOption(opt);
                  setShowNote(true);
                }}
                className={`w-full text-left p-3 rounded border font-mono text-xs transition-all flex items-start gap-3 ${
                  isSelected
                    ? opt.correct
                      ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-600 text-rose-200'
                    : 'bg-studio-900 hover:bg-studio-850 border-studio-800 text-studio-300'
                }`}
              >
                <span className="font-bold text-gold px-1.5 py-0.5 rounded bg-studio-950 border border-studio-800 text-[10px]">
                  {opt.id}
                </span>
                <span className="font-sans text-xs font-semibold leading-relaxed">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Editorial Note */}
        {showNote && (
          <div className="p-3 bg-studio-900 border border-studio-800 rounded space-y-1 font-mono text-xs text-studio-300">
            <span className="text-gold font-bold text-[10px] uppercase block">EDITORIAL NOTE:</span>
            <p className="font-sans leading-relaxed text-xs">{drill.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
