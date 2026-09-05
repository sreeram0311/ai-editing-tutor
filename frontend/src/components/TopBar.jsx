import React from 'react';
import { Sparkles, Cpu, ChevronDown } from 'lucide-react';

export default function TopBar({ userSkill, setUserSkill, toggleDiagnostics, isDiagnosticsOpen }) {
  return (
    <header className="h-14 bg-[#0c0d12] border-b border-[#252838] px-6 flex items-center justify-between text-base select-none shrink-0 z-30 font-sans">
      
      {/* Left Application Identifier */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-white tracking-tight text-base font-sans">
            AI EDITING TUTOR
          </span>
          <span className="hidden sm:inline text-xs md:text-sm text-slate-300 ml-3 font-normal">
            Editorial Intelligence for Video Editors
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Skill Selector */}
        <div className="relative flex items-center gap-2 text-sm text-slate-300">
          <span className="text-slate-400 font-medium">Skill:</span>
          <div className="relative">
            <select
              value={userSkill}
              onChange={(e) => setUserSkill(e.target.value)}
              className="bg-[#141622] text-amber-400 text-sm font-semibold rounded-lg pl-3.5 pr-8 py-1.5 border border-[#252838] focus:outline-none focus:border-amber-500 cursor-pointer appearance-none"
            >
              <option value="Beginner" className="bg-[#141622] text-white">Beginner</option>
              <option value="Intermediate" className="bg-[#141622] text-white">Intermediate</option>
              <option value="Advanced" className="bg-[#141622] text-white">Advanced</option>
            </select>
            <ChevronDown className="w-4 h-4 text-amber-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Assistant Process Drawer Button */}
        <button
          onClick={toggleDiagnostics}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all border cursor-pointer ${
            isDiagnosticsOpen
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
              : 'bg-[#141622] text-slate-200 hover:text-white border-[#252838] hover:border-[#35394e]'
          }`}
          title="Inspect Assistant Process"
        >
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>Assistant Process</span>
        </button>
      </div>
    </header>
  );
}
