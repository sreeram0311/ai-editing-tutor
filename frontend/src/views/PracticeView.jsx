import React, { useState } from 'react';
import { Target, CheckCircle2, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

export default function PracticeView({ exercise, onRequestNewExercise }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const sampleDrills = [
    {
      title: "Dialogue Cut Continuity",
      question: "You are editing a two-person dialogue scene. Person A stops speaking and Person B responds. Which transition maintains natural flow without a jarring cut?",
      options: [
        { id: 'A', text: "L-Cut: Keep Person A's audio trailing while visually cutting to Person B's reaction.", correct: true },
        { id: 'B', text: "Hard Jump Cut on the exact same frame angle.", correct: false },
        { id: 'C', text: "Black screen fade for 2 seconds.", correct: false },
        { id: ' D', text: "Spinning whip-pan zoom transition.", correct: false }
      ],
      explanation: "L-cuts allow the listener's facial reaction to be seen while the speaker's voice naturally tapers off, mimicking real-life conversational attention."
    },
    {
      title: "Action Rhythm & Velocity Drop",
      question: "You want to emphasize a dancer landing a flip in slow motion. When should the speed ramp drop from 300% to 25%?",
      options: [
        { id: 'A', text: "Drop speed right at the peak of the flip before landing.", correct: true },
        { id: 'B', text: "Drop speed 10 seconds before the flip starts.", correct: false },
        { id: 'C', text: "Drop speed after the dancer has already walked away.", correct: false }
      ],
      explanation: "Dropping velocity right at the action peak maximizes kinetic energy and impact."
    }
  ];

  const [activeDrillIndex, setActiveDrillIndex] = useState(0);
  const currentDrill = sampleDrills[activeDrillIndex];

  const handleSelectOption = (opt) => {
    setSelectedOption(opt);
    setShowExplanation(true);
  };

  const handleNextDrill = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setActiveDrillIndex((prev) => (prev + 1) % sampleDrills.length);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <Target className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Practice Drills Studio</h2>
        <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
          Test your editing instincts with real post-production scenarios. Select an answer to reveal detailed explanations.
        </p>
      </div>

      {/* Drill Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
            Drill #{activeDrillIndex + 1}: {currentDrill.title}
          </span>
          <button
            onClick={handleNextDrill}
            className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
          >
            Next Drill ➔
          </button>
        </div>

        {/* Question */}
        <p className="text-base font-extrabold text-slate-900 leading-snug">
          {currentDrill.question}
        </p>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentDrill.options.map((opt) => {
            const isSelected = selectedOption?.id === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                  isSelected
                    ? opt.correct
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                      : 'bg-rose-50 border-rose-500 text-rose-950 shadow-sm'
                    : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center shrink-0 ${
                  isSelected
                    ? opt.correct ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}>
                  {opt.id}
                </span>
                <span className="text-xs md:text-sm font-semibold pt-1 leading-relaxed">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {showExplanation && (
          <div className="bg-indigo-50/80 p-5 rounded-2xl border border-indigo-100 space-y-2 text-xs">
            <span className="font-extrabold text-indigo-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Explanation & Insight:
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              {currentDrill.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
