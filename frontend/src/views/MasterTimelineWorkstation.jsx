import React from 'react';
import TimelineViewer from '../components/TimelineViewer';
import { Film } from 'lucide-react';

export default function MasterTimelineWorkstation({ currentMedia }) {
  return (
    <div className="h-full overflow-y-auto bg-cinema-950 p-6 md:p-8 space-y-6 text-cinema-100 font-sans max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-cinema-800/80 pb-4">
        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider block">
            CONTEXTUAL TIMELINE TOOL
          </span>
          <h2 className="text-xl font-semibold text-cinema-100 font-sans tracking-tight">
            Sequence Shot Cuts & Audio Alignment
          </h2>
        </div>
      </div>

      <TimelineViewer mediaInfo={currentMedia} />
    </div>
  );
}
