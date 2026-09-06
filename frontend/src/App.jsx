import React, { useState } from 'react';
import ToolRail from './components/ToolRail';
import TopBar from './components/TopBar';
import EditorialInspector from './components/EditorialInspector';
import ProcessDiagnosticsDrawer from './components/ProcessDiagnosticsDrawer';

import EditorialTutorWorkspace from './views/EditorialTutorWorkspace';
import MediaAnalysisWorkstation from './views/MediaAnalysisWorkstation';
import PracticeDrillsWorkstation from './views/PracticeDrillsWorkstation';
import EditorialProfileWorkstation from './views/EditorialProfileWorkstation';
import MasterTimelineWorkstation from './views/MasterTimelineWorkstation';

export default function App() {
  const [activeView, setActiveView] = useState('tutor');
  const [userSkill, setUserSkill] = useState('Beginner');
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [reactTrace, setReactTrace] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [detectedIntent, setDetectedIntent] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);

  const handleSendMessage = async (queryText, mediaInfo = null) => {
    if (!queryText || !queryText.trim()) return;

    const userMsg = { sender: 'user', text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Clear previous trace while loading
    setReactTrace([]);
    setSelectedComponents([]);
    setDetectedIntent(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          user_id: 'default_student',
          media_info: mediaInfo || currentMedia || null,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error ${res.status}: ${errText}`);
      }

      const data = await res.json();

      // Update ReAct trace panel
      if (data.react_trace && data.react_trace.length > 0) {
        setReactTrace(data.react_trace);
        setIsDiagnosticsOpen(true); // Auto-open trace panel on response
      }

      if (data.selected_components) setSelectedComponents(data.selected_components);
      if (data.detected_intent) setDetectedIntent(data.detected_intent);

      // Add AI reply to chat
      const aiMsg = {
        sender: 'ai',
        text: data.response || 'No response received.',
        intent: data.detected_intent,
        components: data.selected_components,
      };
      setMessages((prev) => [...prev, aiMsg]);

    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Error: ${err.message}. Make sure the backend is running on port 8000.`,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaAnalyzed = (mediaData) => {
    setCurrentMedia(mediaData);
  };

  const renderActiveView = () => {
    const commonProps = {
      messages,
      loading,
      onSendMessage: handleSendMessage,
      currentMedia,
      onMediaAnalyzed: handleMediaAnalyzed,
      detectedIntent,
      selectedComponents,
      userSkill,
      currentExercise,
      setCurrentExercise,
    };

    switch (activeView) {
      case 'tutor':
        return <EditorialTutorWorkspace {...commonProps} />;
      case 'media':
        return <MediaAnalysisWorkstation {...commonProps} />;
      case 'practice':
        return <PracticeDrillsWorkstation {...commonProps} />;
      case 'profile':
        return <EditorialProfileWorkstation {...commonProps} userSkill={userSkill} setUserSkill={setUserSkill} />;
      case 'timeline':
        return <MasterTimelineWorkstation {...commonProps} />;
      default:
        return <EditorialTutorWorkspace {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Tool Rail */}
      <ToolRail activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          userSkill={userSkill}
          detectedIntent={detectedIntent}
          selectedComponents={selectedComponents}
          onToggleDiagnostics={() => setIsDiagnosticsOpen((v) => !v)}
          isDiagnosticsOpen={isDiagnosticsOpen}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Right: Editorial Inspector */}
      <EditorialInspector
        currentMedia={currentMedia}
        detectedIntent={detectedIntent}
        selectedComponents={selectedComponents}
      />

      {/* Bottom: ReAct Trace Drawer */}
      <ProcessDiagnosticsDrawer
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        reactTrace={reactTrace}
        detectedIntent={detectedIntent}
        selectedComponents={selectedComponents}
      />
    </div>
  );
}
