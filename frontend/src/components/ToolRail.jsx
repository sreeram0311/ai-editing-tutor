import React from 'react';
import { MessageSquare, Video, Award, User, Film } from 'lucide-react';

export default function ToolRail({ activeTool, setActiveTool }) {
  const tools = [
    { id: 'tutor', label: 'Tutor', icon: MessageSquare },
    { id: 'media', label: 'Media', icon: Video },
    { id: 'practice', label: 'Practice', icon: Award },
    { id: 'profile', label: 'Development', icon: User },
  ];

  return (
    <aside className="w-16 bg-cinema-950 border-r border-cinema-800/60 flex flex-col items-center py-6 space-y-6 shrink-0 select-none z-30">
      
      {/* Navigation Rail Items */}
      <div className="flex-1 space-y-3 w-full flex flex-col items-center">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group ${
                isActive
                  ? 'bg-cinema-900 text-amber-500 border border-cinema-800 shadow-sm'
                  : 'text-cinema-500 hover:text-cinema-100 hover:bg-cinema-900/50'
              }`}
              title={t.label}
            >
              {/* Active Indicator Accent Line */}
              {isActive && (
                <span className="absolute -left-3 top-2.5 bottom-2.5 w-1 bg-amber-500 rounded-r-full"></span>
              )}
              <Icon className="w-4.5 h-4.5 stroke-[1.75]" />

              {/* Quiet Tooltip */}
              <span className="absolute left-14 px-2.5 py-1 bg-cinema-900 text-cinema-100 text-xs font-medium rounded-md border border-cinema-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
