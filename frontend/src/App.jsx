import React, { useState } from 'react';
import Header from './components/Header';
import AgentActivityDrawer from './components/AgentActivityDrawer';
import TutorView from './views/TutorView';
import MediaAnalyzerView from './views/MediaAnalyzerView';
import PracticeView from './views/PracticeView';
import ProfileView from './views/ProfileView';
import TimelineView from './views/TimelineView';

export default function App() {
  const [activeView, setActiveView] = useState('tutor'); // 'tutor' is default primary view!
  const [userSkill, setUserSkill] = useState('Beginner');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
        { sender: 'tutor', text: `⚠️ Error processing request: ${err.message}` },
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
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {/* 1. TOP HEADER */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        userSkill={userSkill}
        setUserSkill={setUserSkill}
        toggleActivityDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        isDrawerOpen={isDrawerOpen}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        
        {/* VIEW A: TUTOR PAGE (PRIMARY EXPERIENCE) */}
        {activeView === 'tutor' && (
          <TutorView
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

        {/* VIEW B: MEDIA ANALYZER PAGE */}
        {activeView === 'media' && (
          <MediaAnalyzerView
            currentMedia={currentMedia}
            onMediaAnalyzed={(media) => setCurrentMedia(media)}
          />
        )}

        {/* VIEW C: PRACTICE DRILLS PAGE */}
        {activeView === 'practice' && (
          <PracticeView
            exercise={currentExercise}
            onRequestNewExercise={fetchExercise}
          />
        )}

        {/* VIEW D: LEARNING PROFILE PAGE */}
        {activeView === 'profile' && (
          <ProfileView userId="default_student" />
        )}

        {/* VIEW E: NLE TIMELINE TOOL PAGE */}
        {activeView === 'timeline' && (
          <TimelineView currentMedia={currentMedia} />
        )}

      </main>

      {/* 3. AGENT ACTIVITY SLIDE-OVER DRAWER */}
      <AgentActivityDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        trace={reactTrace}
        selectedComponents={selectedComponents}
        detectedIntent={detectedIntent}
      />
    </div>
  );
}
