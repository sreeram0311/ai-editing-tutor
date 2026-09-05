import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Paperclip, ArrowUpRight, CornerDownLeft, RefreshCw, SlidersHorizontal, Film, HelpCircle } from 'lucide-react';

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
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-6">
          <div className="w-full max-w-2xl space-y-8 py-8">
            
            {/* Centered Welcome Header */}
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EDITORIAL ASSISTANT</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-semibold text-cinema-100 tracking-tight font-sans">
                How can I help with your edit?
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-cinema-400">
                <span className="text-cinema-500 font-medium">Ask about:</span>
                {categories.map((cat, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md bg-cinema-900 border border-cinema-800 text-cinema-300 font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={handleSubmit} className="relative bg-cinema-900 border border-cinema-800 focus-within:border-amber-500/50 rounded-2xl p-3 shadow-2xl transition-all space-y-3">
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
                className="w-full bg-transparent text-cinema-100 placeholder-cinema-500 text-sm focus:outline-none resize-none font-sans leading-relaxed px-2 pt-1"
              />

              <div className="flex items-center justify-between pt-2 border-t border-cinema-800/60">
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cinema-950 hover:bg-cinema-850 text-cinema-400 hover:text-cinema-100 border border-cinema-800 text-xs font-medium cursor-pointer transition-colors" title="Attach Media Footage">
                  <Paperclip className="w-3.5 h-3.5 text-amber-500" />
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
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-cinema-950 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                >
                  <span>Consult Assistant</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick Start Suggestions */}
            <div className="space-y-3">
              <span className="text-xs font-medium text-cinema-500 uppercase tracking-wider block font-sans">
                Quick Start Prompts
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {quickStartPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickClick(prompt)}
                    className="text-left p-3 rounded-xl bg-cinema-900/60 hover:bg-cinema-900 border border-cinema-800/80 hover:border-cinema-700 text-cinema-300 hover:text-cinema-100 text-xs transition-all flex items-center justify-between group font-medium"
                  >
                    <span>{prompt}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cinema-500 group-hover:text-amber-500 transition-colors shrink-0 ml-2" />
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
                <div className="bg-cinema-900 border border-cinema-800 p-5 rounded-2xl space-y-1">
                  <span className="text-xs font-medium text-amber-500 uppercase tracking-wider block font-sans">
                    EDITOR QUESTION
                  </span>
                  <h2 className="text-base md:text-lg font-semibold text-cinema-100 font-sans">
                    {msg.text}
                  </h2>
                </div>
              ) : (
                /* Professional Editorial Guidance Response */
                <div className="bg-cinema-900/70 border border-cinema-800 p-6 md:p-8 rounded-2xl space-y-6 text-cinema-100 leading-relaxed font-sans shadow-xl">
                  <div className="flex items-center justify-between border-b border-cinema-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-xs font-semibold text-cinema-300 uppercase tracking-wider">
                        EDITORIAL GUIDANCE & ANALYSIS
                      </span>
                    </div>
                    <span className="text-xs text-cinema-500 font-mono">
                      {userSkill} Mode
                    </span>
                  </div>

                  <div className="prose prose-invert max-w-none text-sm leading-relaxed font-sans space-y-4">
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="p-6 bg-cinema-900 border border-cinema-800 rounded-2xl flex items-center justify-center gap-3 text-xs text-amber-400 font-sans font-medium">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
              <span>Analyzing edit structure & synthesizing editorial guidance...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* 3. INPUT FOOTER (When consultation in progress) */}
      {messages.length > 0 && (
        <div className="p-4 bg-cinema-950 border-t border-cinema-800/80">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
            <label className="p-2.5 rounded-xl bg-cinema-900 border border-cinema-800 text-cinema-400 hover:text-cinema-100 cursor-pointer transition-colors" title="Attach Footage">
              <Paperclip className="w-4 h-4 text-amber-500" />
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
              className="flex-1 bg-cinema-900 border border-cinema-800 rounded-xl px-4 py-2 text-xs text-cinema-100 placeholder-cinema-500 focus:outline-none focus:border-amber-500/50 font-sans font-medium"
            />

            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-cinema-950 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>Submit</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
