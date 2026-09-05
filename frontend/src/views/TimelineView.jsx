import React from 'react';
import TimelineViewer from '../components/TimelineViewer';

export default function TimelineView({ currentMedia }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">NLE Multi-Track Timeline Tool</h2>
        <p className="text-xs text-slate-500 font-medium">
          Inspect shot cut boundaries, audio waveform alignment, J-cut leads, and playhead scrubbing.
        </p>
      </div>

      <TimelineViewer mediaInfo={currentMedia} />
    </div>
  );
}
