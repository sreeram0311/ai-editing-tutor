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

  const handleSendMessage = async (queryText) => {
    const userMsg = { sender: 'user', text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          user_id: 'default_student',
          media_info: currentMedia,
        }),
      });

      if (!res.ok) throw new Error('Chat API response failed');

      const data = await res.json();
      setReactTrace(data.react_trace || []);
      setSelectedComponents(data.selected_components || []);
      setDetectedIntent(data.detected_intent || null);

      const tutorMsg = { sender: 'tutor', text: data.final_answer };
      setMessages((prev) => [...prev, tutorMsg]);

      if (data.detected_intent === 'EXERCISE' || data.detected_intent === 'MULTI_STEP_REACT') {
        fetchExercise();
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'tutor', text: `Unable to complete request: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchExercise = async () => {
    try {
      const res = await fetch('/api/exercises/default_student');
      if (res.ok) {
        const ex = await res.json();
        setCurrentExercise(ex);
      }
    } catch (err) {
      console.error('Failed to fetch exercise:', err);
    }
  };

  return (
    <div className="h-screen w-screen bg-cinema-950 text-cinema-100 flex flex-col overflow-hidden select-none font-sans">
      
      {/* 1. COMPACT TOP HEADER */}
      <TopBar
        userSkill={userSkill}
        setUserSkill={setUserSkill}
        toggleDiagnostics={() => setIsDiagnosticsOpen(!isDiagnosticsOpen)}
        isDiagnosticsOpen={isDiagnosticsOpen}
      />

      {/* 2. MAIN WORKSPACE SHELL */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Minimal Tool Rail */}
        <ToolRail activeTool={activeView} setActiveTool={setActiveView} />

        {/* Central Active Workspace */}
        <main className="flex-1 overflow-hidden relative bg-cinema-950">
          {activeView === 'tutor' && (
            <EditorialTutorWorkspace
              messages={messages}
              loading={loading}
              onSendMessage={handleSendMessage}
              currentMedia={currentMedia}
              onMediaAnalyzed={(media) => setCurrentMedia(media)}
              detectedIntent={detectedIntent}
              selectedComponents={selectedComponents}
              userSkill={userSkill}
            />
          )}

          {activeView === 'media' && (
            <MediaAnalysisWorkstation
              currentMedia={currentMedia}
              onMediaAnalyzed={(media) => setCurrentMedia(media)}
            />
          )}

          {activeView === 'practice' && (
            <PracticeDrillsWorkstation
              exercise={currentExercise}
              onRequestNewExercise={fetchExercise}
            />
          )}

          {activeView === 'profile' && (
            <EditorialProfileWorkstation
              userId="default_student"
              skillLevel={userSkill}
              setSkillLevel={setUserSkill}
            />
          )}

          {activeView === 'timeline' && (
            <MasterTimelineWorkstation currentMedia={currentMedia} />
          )}
        </main>

        {/* Context Panel (Only when useful in tutor view or when media is loaded) */}
        {(activeView === 'tutor' && (messages.length > 0 || currentMedia)) && (
          <EditorialInspector
            detectedIntent={detectedIntent}
            selectedComponents={selectedComponents}
            userSkill={userSkill}
            currentMedia={currentMedia}
          />
        )}
      </div>

      {/* 3. ASSISTANT PROCESS DRAWER */}
      <ProcessDiagnosticsDrawer
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        trace={reactTrace}
        selectedComponents={selectedComponents}
        detectedIntent={detectedIntent}
      />
    </div>
  );
}
