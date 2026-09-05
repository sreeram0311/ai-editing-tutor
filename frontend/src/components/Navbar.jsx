import React from 'react';
import { MessageSquare, Cpu, Video, UserCheck, Target, Film, Sparkles } from 'lucide-react';

export default function Navbar({ activeSection, setActiveSection, userSkill, setUserSkill }) {
  const menuItems = [
    { id: 'chat', label: 'AI Chatbot (Main)', icon: MessageSquare },
    { id: 'trace', label: 'ReAct Activity Trace', icon: Cpu },
    { id: 'media', label: 'Media Analyzer Tool', icon: Video },
    { id: 'profile', label: 'Learning Profile', icon: UserCheck },
    { id: 'exercise', label: 'Practice Drills', icon: Target },
    { id: 'timeline', label: 'NLE Timeline', icon: Film },
  ];

  return (
    <header className="bg-[#1c1917] text-white border-b-4 border-[#78350f] sticky top-0 z-50 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#44403c] border-2 border-[#78716c] flex items-center justify-center font-extrabold text-amber-400 text-lg shadow-md">
              🎬
            </div>
            <div>
              <h1 className="font-black text-white text-lg tracking-tight font-sans">
                AI EDITING TUTOR
              </h1>
              <p className="text-xs text-[#d6d3d1] font-semibold">
                LangGraph ReAct AI • OpenCV Media Analysis • Skill-Adapted Guidance
              </p>
            </div>
          </div>

          {/* Skill Mode Selector */}
          <div className="flex items-center gap-2 bg-[#292524] px-3 py-1.5 rounded-xl border border-[#44403c]">
            <span className="text-xs font-black uppercase text-[#d6d3d1] tracking-wider">Skill Level:</span>
            <div className="flex bg-[#1c1917] p-1 rounded-lg border border-[#44403c] text-xs font-extrabold">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setUserSkill(lvl)}
                  className={`px-3 py-1 rounded font-bold transition-all ${
                    userSkill === lvl
                      ? 'bg-amber-500 text-[#1c1917] shadow-md'
                      : 'text-[#d6d3d1] hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Menu Bar */}
        <nav className="flex items-center gap-1.5 overflow-x-auto bg-[#292524] p-1.5 rounded-xl border border-[#44403c]">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-400 px-2 flex items-center gap-1 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Navigate Menu:
          </span>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-[#1c1917] shadow-lg border border-amber-400 scale-[1.02]'
                    : 'text-[#e7e5e4] hover:bg-[#44403c] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1c1917]' : 'text-amber-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
