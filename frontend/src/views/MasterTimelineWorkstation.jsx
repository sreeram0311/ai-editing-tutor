import React from 'react';
import TimelineViewer from '../components/TimelineViewer';
import { Film, Layers, Sliders, Play, Settings } from 'lucide-react';

export default function MasterTimelineWorkstation({ currentMedia }) {
  return (
    <div className="h-full overflow-y-auto bg-studio-950 p-6 space-y-6 text-studio-100 font-sans">
      {/* NLE Timeline Header */}
      <div className="border border-studio-800 bg-studio-900/60 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-studio-gold/10 border border-studio-gold/30 rounded-lg text-studio-gold">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-studio-500 uppercase tracking-wider">
              <span>SEQUENCE: MAIN_TIMELINE_V1</span>
              <span>•</span>
              <span className="text-studio-gold font-bold">24.00 FPS DCI 4K</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 font-sans tracking-wide">
              Master Multi-Track NLE Timeline Workstation
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-3 py-1.5 rounded bg-studio-950 text-studio-gold border border-studio-800">
            AUTO-BEAT ALIGNED
          </span>
          <span className="px-3 py-1.5 rounded bg-studio-950 text-slate-300 border border-studio-800">
            AUDIO PRE-LAP ACTIVE
          </span>
        </div>
      </div>

      {/* Main Timeline Control & Preview Canvas */}
      <TimelineViewer mediaInfo={currentMedia} />
    </div>
  );
}
