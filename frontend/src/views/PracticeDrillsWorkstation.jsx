import React, { useState } from 'react';
import { Target, Award, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function PracticeDrillsWorkstation({ exercise, onRequestNewExercise }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showNote, setShowNote] = useState(false);

  const sampleDrills = [
    {
      id: "PRACTICE DRILL 01",
      scenario: "Dialogue Continuity & Reaction Timing",
      question: "You are cutting a high-tension two-person dialogue scene. Speaker A delivers a critical revelation line. Which edit best preserves conversational continuity and emotional impact?",
      options: [
        { id: 'A', text: "Dialogue-driven J-Cut: Introduce Speaker B's voice 1.5 seconds before visual cut.", correct: false },
        { id: 'B', text: "Reaction L-Cut: Cut to Speaker B's facial reaction while Speaker A's dialogue audio continues.", correct: true },
        { id: 'C', text: "Hard Jump Cut on the exact same frame size.", correct: false },
        { id: 'D', text: "Black screen dip to fade.", correct: false }
      ],
      note: "An L-cut enables the audience to observe the emotional reaction on the listener's face while maintaining continuous spoken dialogue audio."
    }
  ];

  const drill = exercise || sampleDrills[0];

  return (
    <div className="h-full overflow-y-auto bg-cinema-950 p-6 md:p-8 space-y-8 font-sans text-cinema-100 max-w-3xl mx-auto">
      
      {/* Exercise Room Header */}
      <div className="space-y-2 border-b border-cinema-800/80 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
          <Award className="w-3.5 h-3.5" />
          <span>EDITORIAL PRACTICE ROOM</span>
        </div>

        <h2 className="text-2xl font-semibold text-cinema-100 tracking-tight font-sans">
          {drill.scenario || drill.title || "Dialogue Continuity & Reaction Timing"}
        </h2>
      </div>

      {/* Scenario Question Card */}
      <div className="bg-cinema-900 border border-cinema-800/80 p-6 rounded-2xl space-y-4 shadow-xl">
        <span className="text-xs font-semibold text-cinema-400 uppercase tracking-wider block">
          SCENARIO CONTEXT
        </span>
        <p className="text-base text-cinema-100 leading-relaxed font-medium">
          {drill.question || drill.description}
        </p>

        {/* Options */}
        <div className="space-y-3 pt-3">
          {(drill.options || []).map((opt) => {
            const isSelected = selectedOption?.id === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedOption(opt);
                  setShowNote(true);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                  isSelected
                    ? opt.correct
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    : 'bg-cinema-950 hover:bg-cinema-850 border-cinema-800 text-cinema-300 hover:text-cinema-100'
                }`}
              >
                <span className="font-semibold text-amber-400 text-xs px-2 py-1 rounded bg-cinema-900 border border-cinema-800 shrink-0">
                  {opt.id}
                </span>
                <span className="text-sm font-medium leading-relaxed font-sans">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Editorial Explanation Note */}
        {showNote && (
          <div className="p-5 bg-cinema-950 border border-cinema-800 rounded-xl space-y-2 mt-4">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block font-sans">
              EDITORIAL NOTE
            </span>
            <p className="text-xs text-cinema-300 leading-relaxed font-sans font-medium">
              {drill.note || "Notice how keeping the audio continuous prevents sudden cuts from jarring the viewer, while letting visual reactions carry emotional weight."}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
