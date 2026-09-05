import React from 'react';
import { MessageSquare, Video, Award, User } from 'lucide-react';

export default function ToolRail({ activeTool, setActiveTool }) {
  const tools = [
    { id: 'tutor', label: 'Tutor', icon: MessageSquare },
    { id: 'media', label: 'Media', icon: Video },
    { id: 'practice', label: 'Practice', icon: Award },
    { id: 'profile', label: 'Development', icon: User },
  ];

  return (
    <aside className="w-16 bg-cinema-950 border-r border-cinema-800 flex flex-col items-center py-6 space-y-6 shrink-0 select-none z-30">
      
      {/* Navigation Rail Items */}
      <div className="flex-1 space-y-4 w-full flex flex-col items-center">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all group cursor-pointer ${
                isActive
                  ? 'bg-cinema-900 text-amber-400 border border-cinema-700 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-cinema-900/60'
              }`}
              title={t.label}
            >
              {/* Active Indicator Accent Line */}
              {isActive && (
                <span className="absolute -left-2.5 top-2.5 bottom-2.5 w-1 bg-amber-500 rounded-r-full"></span>
              )}
              <Icon className="w-5 h-5 stroke-[2]" />

              {/* Quiet Tooltip */}
              <span className="absolute left-16 px-3 py-1.5 bg-cinema-900 text-white text-xs font-semibold rounded-lg border border-cinema-700 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
