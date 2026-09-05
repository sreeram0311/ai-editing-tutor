import React, { useState } from 'react';
import { Target, CheckCircle2, Sparkles } from 'lucide-react';

export default function ExerciseView({ exercise, onRequestNewExercise }) {
  const [completed, setCompleted] = useState(false);

  if (!exercise) {
    return (
      <div className="bg-white border border-cream-300 rounded-2xl p-6 shadow-lg text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brown-800 text-brown-200 flex items-center justify-center mx-auto shadow-sm">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-brown-900">Custom Practice Studio</h3>
          <p className="text-xs text-brown-600 mt-1 max-w-xs mx-auto">
            Generate tailored editing drills based on your identified profile weaknesses.
          </p>
        </div>
        <button
          onClick={onRequestNewExercise}
          className="px-4 py-2 rounded-xl bg-brown-800 hover:bg-brown-900 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 mx-auto"
        >
          <Sparkles className="w-4 h-4 text-brown-200" />
          Generate Practice Task
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-cream-300 rounded-2xl p-5 shadow-lg space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brown-800 text-brown-200 flex items-center justify-center">
            <Target className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-brown-900 text-sm tracking-tight">{exercise.title}</h3>
            <p className="text-[10px] text-brown-500 font-medium">Target: {exercise.target_weakness}</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-cream-100 text-brown-800 border border-cream-300 uppercase">
          {exercise.difficulty}
        </span>
      </div>

      <div className="bg-cream-50 p-3.5 rounded-xl border border-cream-300 leading-relaxed text-brown-900 font-medium">
        {exercise.description}
      </div>

      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold text-brown-700 uppercase tracking-wider block">
          Evaluation Goals:
        </span>
        <ul className="space-y-1.5 bg-cream-50 p-3 rounded-xl border border-cream-300">
          {exercise.goals?.map((goal, idx) => (
            <li key={idx} className="flex items-start gap-2 text-brown-900 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => setCompleted(!completed)}
        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow ${
          completed 
            ? "bg-emerald-700 text-white" 
            : "bg-brown-800 hover:bg-brown-900 text-white"
        }`}
      >
        <CheckCircle2 className="w-4 h-4" />
        {completed ? "Exercise Completed ✓" : "Mark Exercise Complete"}
      </button>
    </div>
  );
}
