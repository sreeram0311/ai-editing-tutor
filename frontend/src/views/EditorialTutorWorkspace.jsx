import React, { useState, useRef, useEffect } from 'react';
import { Send, Clapperboard, Paperclip, MessageSquare, CornerDownLeft } from 'lucide-react';

export default function EditorialTutorWorkspace({ 
  messages, loading, onSendMessage, currentMedia, onMediaAnalyzed,
  detectedIntent, selectedComponents, userSkill 
}) {
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef(null);

  const historyItems = [
    "Dialogue J-Cut Lead Time",
    "Velocity Speed Ramping",
    "Pacing & Shot Duration",
    "Color Grading Contrast",
    "Cross-cutting Suspense"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || loading) return;
    onSendMessage(inputQuery);
    setInputQuery('');
  };

  const handleHistoryClick = (item) => {
    if (loading) return;
    onSendMessage(`Explain ${item}`);
  };

  return (
    <div className="flex-1 flex gap-1 h-full min-h-[620px] overflow-hidden select-none font-sans">
      
      {/* LEFT EDITORIAL CONSULTATION HISTORY SIDEBAR */}
      <div className="w-56 bg-studio-900 border-r border-studio-800 flex flex-col h-full text-xs shrink-0 hidden md:flex">
        <div className="h-9 bg-studio-850 px-3 border-b border-studio-800 flex items-center justify-between font-mono text-[10px] font-bold text-studio-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-gold" />
            CONSULTATIONS
          </span>
        </div>

        <div className="p-2 space-y-1 overflow-y-auto flex-1 font-mono text-[11px]">
          <span className="text-[10px] text-studio-500 uppercase font-bold px-2 py-1 block">RECENT REVIEWS</span>
          {historyItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleHistoryClick(item)}
              className="w-full text-left px-2.5 py-1.5 rounded text-studio-400 hover:text-studio-100 hover:bg-studio-800 truncate transition-colors font-sans font-medium"
            >
              • {item}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN EDITORIAL CONSULTATION WORKSPACE */}
      <div className="flex-1 bg-studio-950 border border-studio-800 rounded flex flex-col h-full overflow-hidden">
        
        {/* Workspace Toolbar Header */}
        <div className="h-9 bg-studio-900 px-4 border-b border-studio-800 flex items-center justify-between font-mono text-[11px] text-studio-400 uppercase font-bold">
          <span>EDITORIAL CONSULTATION WORKSPACE</span>
          <span className="text-gold">{userSkill} MODE</span>
        </div>

        {/* Editorial Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded bg-studio-900 border border-studio-800 flex items-center justify-center text-gold font-mono font-bold text-lg">
                ED
              </div>
              <h2 className="text-base font-bold text-studio-100 uppercase tracking-wider font-mono">
                EDITORIAL CONSULTATION
              </h2>
              <p className="text-xs text-studio-400 leading-relaxed font-sans">
                Submit an editing query below to receive professional editorial guidance, narrative rationale, and step-by-step NLE execution notes.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="space-y-2">
                <div className="font-mono text-[10px] uppercase font-bold text-studio-500 tracking-wider flex items-center justify-between">
                  <span>{msg.sender === 'user' ? 'EDITOR QUERY' : 'EDITORIAL RECOMMENDATION & NOTES'}</span>
                  {msg.sender === 'tutor' && (
                    <span className="text-gold font-normal">STATION NOTE #{idx}</span>
                  )}
                </div>

                <div
                  className={`p-4 rounded text-xs md:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-studio-850 text-studio-100 border border-studio-750 font-medium max-w-2xl'
                      : 'bg-studio-900 text-studio-100 border border-studio-800 font-sans whitespace-pre-wrap space-y-3'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="p-4 bg-studio-900 border border-studio-800 rounded font-mono text-xs text-gold flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
              <span>Synthesizing Editorial Recommendations & NLE Execution Notes...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSubmit} className="p-3 bg-studio-900 border-t border-studio-800 flex gap-2">
          <label className="p-2.5 rounded bg-studio-850 border border-studio-750 text-studio-400 hover:text-studio-100 cursor-pointer" title="Attach Footage">
            <Paperclip className="w-4 h-4" />
            <input
              type="file"
              className="hidden"
              accept="video/*,audio/*,image/*"
              onChange={(e) => {
                if (e.target.files[0]) {
                  const formData = new FormData();
                  formData.append("file", e.target.files[0]);
                  fetch("/api/upload", { method: "POST", body: formData })
                    .then((res) => res.json())
                    .then((data) => onMediaAnalyzed(data.media_info));
                }
              }}
            />
          </label>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about your edit (e.g. 'How should I handle dialogue pacing in this scene?')..."
            disabled={loading}
            className="flex-1 bg-studio-950 border border-studio-800 rounded px-3 py-2 text-xs text-studio-100 placeholder-studio-500 focus:outline-none focus:border-gold font-sans font-medium"
          />

          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="px-4 py-2 bg-gold hover:bg-gold-dark disabled:opacity-30 text-studio-950 font-bold font-mono text-xs rounded transition-colors flex items-center gap-1.5"
          >
            <span>SUBMIT</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
