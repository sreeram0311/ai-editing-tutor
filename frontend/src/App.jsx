import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ChatView from './components/ChatView';
import ReActTracePanel from './components/ReActTracePanel';
import MediaUploader from './components/MediaUploader';
import ProfileDashboard from './components/ProfileDashboard';
import ExerciseView from './components/ExerciseView';
import TimelineViewer from './components/TimelineViewer';

export default function App() {
  const [activeSection, setActiveSection] = useState('chat'); // 'chat' is MAIN by default!
  const [userSkill, setUserSkill] = useState('Beginner');
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
    <div className="min-h-screen bg-[#f5f5f4] text-[#1c1917] font-sans pb-12">
      {/* Navigation Menu Bar Header */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userSkill={userSkill}
        setUserSkill={setUserSkill}
      />

      {/* Main Content Workspace Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
        
        {/* SECTION 1: CHATBOT IS MAIN (DEFAULT VIEW) */}
        {activeSection === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <ChatView
                onSendMessage={handleSendMessage}
                messages={messages}
                loading={loading}
                currentMedia={currentMedia}
              />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <ReActTracePanel
                trace={reactTrace}
                selectedComponents={selectedComponents}
                detectedIntent={detectedIntent}
              />
              <MediaUploader
                onMediaAnalyzed={(media) => setCurrentMedia(media)}
                currentMedia={currentMedia}
              />
            </div>
          </div>
        )}

        {/* SECTION 2: REACT ACTIVITY TRACE */}
        {activeSection === 'trace' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <ReActTracePanel
              trace={reactTrace}
              selectedComponents={selectedComponents}
              detectedIntent={detectedIntent}
            />
          </div>
        )}

        {/* SECTION 3: MEDIA ANALYZER TOOL */}
        {activeSection === 'media' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <MediaUploader
              onMediaAnalyzed={(media) => setCurrentMedia(media)}
              currentMedia={currentMedia}
            />
          </div>
        )}

        {/* SECTION 4: LEARNING PROFILE */}
        {activeSection === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <ProfileDashboard userId="default_student" />
          </div>
        )}

        {/* SECTION 5: PRACTICE DRILLS */}
        {activeSection === 'exercise' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <ExerciseView
              exercise={currentExercise}
              onRequestNewExercise={fetchExercise}
            />
          </div>
        )}

        {/* SECTION 6: NLE TIMELINE */}
        {activeSection === 'timeline' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <TimelineViewer mediaInfo={currentMedia} />
          </div>
        )}

      </main>
    </div>
  );
}
