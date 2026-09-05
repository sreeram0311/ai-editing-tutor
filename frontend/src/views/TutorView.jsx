import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Paperclip, Film, ArrowUpRight } from 'lucide-react';
import TutorContextPanel from '../components/TutorContextPanel';

export default function TutorView({ 
  messages, loading, onSendMessage, currentMedia, onMediaAnalyzed,
  detectedIntent, selectedComponents, userSkill 
}) {
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef(null);

  const suggestionPrompts = [
    "How do I create a J-cut?",
    "Explain velocity editing",
    "How do I make dialogue cuts smoother?",
    "Analyze this video",
    "Which editing approach works best for this scene?"
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

  const handleSuggestionClick = (promptText) => {
    if (loading) return;
    onSendMessage(promptText);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* CENTRAL CONVERSATIONAL WORKSPACE (65-70% width on desktop) */}
      <div className="lg:col-span-8 flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
        
        {/* Messages Scroll Feed — Floating naturally on clean light page background */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-lg mx-auto my-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner border border-indigo-100">
                <Bot className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  What do you want to learn about editing?
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Ask any question about cuts, velocity, sound editing, or color grading. Upload media for OpenCV inspection or pick a suggested topic below.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'tutor' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] text-xs md:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white font-medium p-4 rounded-2xl rounded-tr-none shadow-md'
                      : 'bg-white text-slate-900 border border-slate-200/90 p-5 rounded-2xl rounded-tl-none whitespace-pre-wrap shadow-sm space-y-2'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-1 font-bold">
                    <User className="w-4.5 h-4.5" />
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs font-semibold text-slate-700 flex items-center gap-3 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="font-mono text-xs">Synthesizing skill-adapted tutor guidance...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* BOTTOM INPUT SECTION */}
        <div className="pt-2 space-y-3 shrink-0">
          
          {/* Suggested Question Chips (Above Input) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Suggestions:
            </span>
            {suggestionPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(prompt)}
                disabled={loading}
                className="text-xs font-semibold whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200/90 transition-all shadow-sm shrink-0 flex items-center gap-1"
              >
                {prompt}
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>

          {/* Floating Rounded Input Bar */}
          <form onSubmit={handleSubmit} className="bg-white border border-slate-300 rounded-2xl p-2 shadow-lg flex items-center gap-2">
            
            {/* Attachment Button */}
            <label className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors" title="Attach Media for OpenCV Inspection">
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
              placeholder="What do you want to learn about editing?"
              disabled={loading}
              className="flex-1 bg-transparent px-2 py-2 text-xs md:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none font-sans"
            />

            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-indigo-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

      {/* RIGHT CONTEXT PANEL (30-35% width on desktop) */}
      <div className="lg:col-span-4 hidden lg:block">
        <TutorContextPanel
          detectedIntent={detectedIntent}
          selectedComponents={selectedComponents}
          userSkill={userSkill}
          currentMedia={currentMedia}
        />
      </div>

    </div>
  );
}
