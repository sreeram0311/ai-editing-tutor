import React from 'react';
import { Sliders, Activity, Settings } from 'lucide-react';

export default function TopBar({ userSkill, setUserSkill, toggleDiagnostics, isDiagnosticsOpen }) {
  return (
    <header className="h-10 bg-studio-900 border-b border-studio-800 px-4 flex items-center justify-between text-xs select-none shrink-0 z-30 font-sans">
      {/* Left Application Identifier */}
      <div className="flex items-center gap-3">
        <span className="font-extrabold text-studio-100 tracking-wider text-xs font-mono uppercase">
          AI EDITING TUTOR
        </span>
        <span className="text-[10px] font-mono text-studio-500 border-l border-studio-800 pl-3">
          Post-Production Editorial Workstation v2.0
        </span>
      </div>

      {/* Center Current Sequence / Project Context */}
      <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-studio-400">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Sequence 01 — Master Edit</span>
        <span className="text-studio-600">|</span>
        <span className="text-studio-500">ProRes 422 HQ • 24.00 fps</span>
      </div>

      {/* Right Restrained Controls */}
      <div className="flex items-center gap-3">
        {/* Compact Skill Level Dropdown */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-studio-500">LEVEL:</span>
          <select
            value={userSkill}
            onChange={(e) => setUserSkill(e.target.value)}
            className="bg-studio-800 text-gold text-[11px] font-mono font-bold rounded px-2 py-0.5 border border-studio-700 focus:outline-none cursor-pointer"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Process Diagnostics Trigger */}
        <button
          onClick={toggleDiagnostics}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all border ${
            isDiagnosticsOpen
              ? 'bg-studio-800 text-gold border-gold/40'
              : 'bg-studio-850 text-studio-400 hover:text-studio-100 border-studio-700'
          }`}
          title="Open Process Diagnostics Drawer"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>DIAGNOSTICS</span>
        </button>
      </div>
    </header>
  );
}
