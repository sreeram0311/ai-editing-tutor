import React from 'react';
import { Video, Cpu, MessageSquare, BarChart2, Target, Film, Sparkles, Activity } from 'lucide-react';

export default function Header({ 
  activeView, setActiveView, userSkill, setUserSkill, toggleActivityDrawer, isDrawerOpen 
}) {
  const navItems = [
    { id: 'tutor', label: 'Tutor', icon: MessageSquare },
    { id: 'media', label: 'Media Analyzer', icon: Video },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'profile', label: 'Learning Profile', icon: BarChart2 },
    { id: 'timeline', label: 'NLE Timeline', icon: Film },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-base tracking-tight leading-none">
              AI Editing Tutor
            </h1>
            <span className="text-[11px] text-slate-500 font-medium">Post-Production Masterclass</span>
          </div>
        </div>

        {/* Center: Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Compact Skill Selector & Agent Activity Drawer Button */}
        <div className="flex items-center gap-3">
          {/* Compact Skill Level Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Level:</span>
            <select
              value={userSkill}
              onChange={(e) => setUserSkill(e.target.value)}
              className="bg-transparent text-slate-900 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Agent Activity Drawer Trigger */}
          <button
            onClick={toggleActivityDrawer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isDrawerOpen
                ? 'bg-indigo-50 text-indigo-600 border-indigo-300'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
            title="Inspect Agent Activity & ReAct Workflow"
          >
            <Activity className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Agent Activity</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <nav className="flex md:hidden items-center justify-between pt-3 mt-3 border-t border-slate-100 overflow-x-auto gap-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold whitespace-nowrap ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
