import React from 'react';
import { MessageSquare, Video, Target, BarChart2, Film } from 'lucide-react';

export default function ToolRail({ activeTool, setActiveTool }) {
  const tools = [
    { id: 'tutor', label: 'EDITORIAL TUTOR', icon: MessageSquare },
    { id: 'media', label: 'MEDIA ANALYZER', icon: Video },
    { id: 'practice', label: 'EDITORIAL DRILLS', icon: Target },
    { id: 'profile', label: 'DEVELOPMENT PROFILE', icon: BarChart2 },
    { id: 'timeline', label: 'SEQUENCE TIMELINE', icon: Film },
  ];

  return (
    <aside className="w-14 bg-studio-900 border-r border-studio-800 flex flex-col items-center py-4 space-y-6 shrink-0 select-none z-30">
      {/* Brand Icon */}
      <div className="w-9 h-9 rounded bg-studio-800 border border-studio-700 flex items-center justify-center text-gold font-bold text-xs font-mono">
        ET
      </div>

      {/* Navigation Tools */}
      <div className="flex-1 space-y-3 w-full flex flex-col items-center">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`relative w-10 h-10 rounded flex items-center justify-center transition-colors group ${
                isActive
                  ? 'bg-studio-800 text-gold border border-studio-700'
                  : 'text-studio-500 hover:text-studio-100 hover:bg-studio-850'
              }`}
              title={t.label}
            >
              {/* Selected Left Accent Line */}
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-gold rounded-r"></span>
              )}
              <Icon className="w-4.5 h-4.5 stroke-[1.75]" />

              {/* Tooltip */}
              <span className="absolute left-14 px-2 py-1 bg-studio-800 text-studio-100 text-[10px] font-mono font-bold rounded border border-studio-700 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
