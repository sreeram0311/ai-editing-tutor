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
          <select
            value={userSkill}
            onChange={(e) => setUserSkill(e.target.value)}
            className="bg-cinema-900 text-cinema-100 text-xs font-medium rounded-lg px-2.5 py-1 border border-cinema-800 focus:outline-none focus:border-amber-500/50 cursor-pointer appearance-none pr-6"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <ChevronDown className="w-3 h-3 text-cinema-400 absolute right-2 pointer-events-none" />
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
