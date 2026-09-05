import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Paperclip, ArrowUpRight, CornerDownLeft, RefreshCw, SlidersHorizontal, Film, HelpCircle } from 'lucide-react';
import EditorialFormattedResponse from '../components/EditorialFormattedResponse';

export default function EditorialTutorWorkspace({ 
  messages, loading, onSendMessage, currentMedia, onMediaAnalyzed,
  detectedIntent, selectedComponents, userSkill 
}) {
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef(null);

  const quickStartPrompts = [
    "How should I cut this dialogue scene?",
    "How can I improve the pacing?",
    "Which editing approach suits this scene?",
    "Analyze my footage"
  ];

  const categories = [
    "Pacing", "Dialogue", "Transitions", "Sound", "Color", "Storytelling", "Style"
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

  const handleQuickClick = (promptText) => {
    if (loading) return;
    onSendMessage(promptText);
  };

  return (
    <div className="h-full flex flex-col bg-cinema-950 overflow-hidden font-sans">
      
      {/* 1. TUTOR WELCOME / HOME STATE (When no messages sent yet) */}
      {messages.length === 0 ? (
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 md:p-8">
          <div className="w-full max-w-3xl space-y-8 py-6">
            
            {/* Centered Welcome Header */}
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>EDITORIAL ASSISTANT</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-sans">
                How can I help with your edit?
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-sm text-slate-300">
                <span className="text-slate-400 font-medium">Ask about:</span>
                {categories.map((cat, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-cinema-900 border border-cinema-700/80 text-slate-200 font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={handleSubmit} className="relative bg-cinema-900 border border-cinema-700/80 focus-within:border-amber-500 rounded-2xl p-4 shadow-2xl transition-all space-y-4">
              <textarea
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="What are you trying to achieve with this edit?"
                disabled={loading}
                rows={3}
                className="w-full bg-transparent text-white placeholder-slate-400 text-base md:text-lg focus:outline-none resize-none font-sans leading-relaxed px-2 pt-1 font-normal"
              />

              <div className="flex items-center justify-between pt-3 border-t border-cinema-800">
                <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cinema-950 hover:bg-cinema-850 text-slate-300 hover:text-white border border-cinema-700 text-xs md:text-sm font-medium cursor-pointer transition-colors" title="Attach Media Footage">
                  <Paperclip className="w-4 h-4 text-amber-400" />
                  <span>Attach Footage</span>
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

                <button
                  type="submit"
                  disabled={loading || !inputQuery.trim()}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-cinema-950 font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Consult Assistant</span>
                  <CornerDownLeft className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Start Suggestions */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-sans">
                Quick Start Prompts
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickStartPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickClick(prompt)}
                    className="text-left p-4 rounded-xl bg-cinema-900/80 hover:bg-cinema-900 border border-cinema-700/80 hover:border-amber-500/50 text-slate-200 hover:text-white text-sm transition-all flex items-center justify-between group font-medium"
                  >
                    <span>{prompt}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* 2. EDITORIAL CONSULTATION RESPONSE STATE */
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 max-w-4xl mx-auto w-full">
          {messages.map((msg, idx) => (
            <div key={idx} className="space-y-3">
              {msg.sender === 'user' ? (
                /* Editor Query Header */
                <div className="bg-cinema-900 border border-cinema-700/80 p-5 rounded-2xl space-y-1.5 shadow-md">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block font-sans">
                    EDITOR QUESTION
                  </span>
                  <h2 className="text-lg md:text-xl font-bold text-white font-sans leading-snug">
                    {msg.text}
                  </h2>
                </div>
              ) : (
                /* Professional Editorial Guidance Response */
                <div className="bg-cinema-900/90 border border-cinema-700/80 p-6 md:p-8 rounded-2xl space-y-6 text-slate-100 leading-relaxed font-sans shadow-2xl">
                  <div className="flex items-center justify-between border-b border-cinema-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        EDITORIAL GUIDANCE & ANALYSIS
                      </span>
                    </div>
                    <span className="text-xs text-amber-400 font-mono font-semibold">
                      {userSkill} Mode
                    </span>
                  </div>

                  {/* Formatted Response Component */}
                  <EditorialFormattedResponse rawText={msg.text} userSkill={userSkill} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="p-6 bg-cinema-900 border border-cinema-700 rounded-2xl flex items-center justify-center gap-3 text-sm text-amber-400 font-sans font-semibold shadow-lg">
              <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
              <span>Analyzing edit structure & synthesizing editorial guidance...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* 3. INPUT FOOTER (When consultation in progress) */}
      {messages.length > 0 && (
        <div className="p-4 md:p-5 bg-cinema-950 border-t border-cinema-800">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
            <label className="p-3 rounded-xl bg-cinema-900 border border-cinema-700 text-slate-300 hover:text-white cursor-pointer transition-colors" title="Attach Footage">
              <Paperclip className="w-5 h-5 text-amber-400" />
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
              placeholder="Ask a follow-up question about your edit..."
              disabled={loading}
              className="flex-1 bg-cinema-900 border border-cinema-700 focus:border-amber-500 rounded-xl px-4 py-3 text-sm md:text-base text-white placeholder-slate-400 focus:outline-none font-sans font-medium"
            />

            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-cinema-950 font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>Submit</span>
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
