import React from 'react';
import { Sparkles, Cpu, ChevronDown } from 'lucide-react';

export default function TopBar({ userSkill, setUserSkill, toggleDiagnostics, isDiagnosticsOpen }) {
  return (
    <header className="h-12 bg-cinema-950 border-b border-cinema-800/60 px-6 flex items-center justify-between text-sm select-none shrink-0 z-30 font-sans">
      
      {/* Left Application Identifier */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="font-semibold text-cinema-100 tracking-tight text-sm font-sans">
            AI EDITING TUTOR
          </span>
          <span className="hidden sm:inline text-xs text-cinema-500 ml-2 font-normal">
            Editorial Intelligence for Video Editors
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Skill Selector */}
        <div className="relative flex items-center gap-1.5 text-xs text-cinema-400">
          <span className="text-cinema-500 font-medium">Skill:</span>
          <div className="relative">
            <select
              value={userSkill}
              onChange={(e) => setUserSkill(e.target.value)}
              className="bg-cinema-900 text-amber-400 text-xs font-semibold rounded-lg pl-3 pr-7 py-1 border border-cinema-800 focus:outline-none focus:border-amber-500/50 cursor-pointer appearance-none"
            >
              <option value="Beginner" className="bg-cinema-900 text-cinema-100">Beginner</option>
              <option value="Intermediate" className="bg-cinema-900 text-cinema-100">Intermediate</option>
              <option value="Advanced" className="bg-cinema-900 text-cinema-100">Advanced</option>
            </select>
            <ChevronDown className="w-3 h-3 text-amber-500 absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Assistant Process Drawer Button */}
        <button
          onClick={toggleDiagnostics}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
            isDiagnosticsOpen
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-cinema-900 text-cinema-400 hover:text-cinema-100 border-cinema-800 hover:border-cinema-700'
          }`}
          title="Inspect Assistant Process"
        >
          <Cpu className="w-3.5 h-3.5 text-amber-500" />
          <span>Assistant Process</span>
        </button>
      </div>
    </header>
  );
}
