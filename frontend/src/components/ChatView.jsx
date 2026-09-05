import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Film } from 'lucide-react';

export default function ChatView({ onSendMessage, messages, loading, currentMedia }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const demoScenarios = [
    { label: "Velocity Tutorial", query: "heyy i need tutorial of velocity" },
    { label: "Demo 1: Knowledge", query: "What is a J-cut?" },
    { label: "Demo 2: Media Analysis", query: "Why does my video feel slow?" },
    { label: "Demo 3: Style Rec", query: "Which editing style would work best for this footage?" },
    { label: "Demo 4: Exercise", query: "Give me an exercise based on my weaknesses." },
    { label: "Demo 5: Multi-step ReAct", query: "Analyze my video, identify my biggest weakness, and give me an exercise." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleDemoClick = (query) => {
    if (loading) return;
    onSendMessage(query);
  };

  return (
    <div className="bg-white border-2 border-[#d6d3d1] rounded-2xl shadow-2xl flex flex-col h-[780px] relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b-2 border-[#d6d3d1] bg-[#1c1917] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#44403c] border-2 border-amber-500 flex items-center justify-center font-black text-amber-400 text-lg shadow-md">
            💬
          </div>
          <div>
            <h2 className="font-black text-white text-base tracking-tight flex items-center gap-2 font-sans">
              AI EDITING TUTOR ASSISTANT
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            </h2>
            <p className="text-xs text-[#d6d3d1] font-semibold">Clean Text Explanations for All Editing Software</p>
          </div>
        </div>

        {currentMedia && (
          <span className="text-xs font-mono font-bold bg-[#44403c] text-amber-300 px-3 py-1.5 rounded-full border border-amber-500 truncate max-w-[240px] flex items-center gap-1.5 shadow-sm">
            <Film className="w-4 h-4 text-amber-400 shrink-0" />
            {currentMedia.filename}
          </span>
        )}
      </div>

      {/* Preset Topics Bar */}
      <div className="px-4 py-3 bg-[#f5f5f4] border-b-2 border-[#e7e5e4] flex items-center gap-2 overflow-x-auto">
        <span className="text-xs uppercase font-mono font-black tracking-wider text-[#44403c] shrink-0 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Topics:
        </span>
        {demoScenarios.map((demo, idx) => (
          <button
            key={idx}
            onClick={() => handleDemoClick(demo.query)}
            disabled={loading}
            className="text-xs font-black whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#1c1917] hover:text-white text-[#1c1917] border-2 border-[#d6d3d1] transition-all shadow-sm shrink-0"
          >
            {demo.label}
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fafaf9]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-[#1c1917] text-amber-400 flex items-center justify-center text-3xl shadow-xl border-2 border-amber-500">
              💬
            </div>
            <div className="space-y-2 max-w-lg">
              <h3 className="text-xl font-black text-[#1c1917]">AI Editing Tutor Ready</h3>
              <p className="text-sm text-[#44403c] leading-relaxed font-semibold">
                Ask any editing question. Get clear, step-by-step text guides covering Premiere Pro, DaVinci Resolve, CapCut, Final Cut Pro, Avid, VEGAS, After Effects, and Filmora!
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
                <div className="w-9 h-9 rounded-xl bg-[#1c1917] border-2 border-amber-500 flex items-center justify-center shrink-0 shadow-md mt-1 font-bold text-amber-400">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed font-semibold ${
                  msg.sender === 'user'
                    ? 'bg-[#1c1917] text-white rounded-tr-none shadow-md'
                    : 'bg-white text-[#1c1917] border-2 border-[#e7e5e4] rounded-tl-none whitespace-pre-wrap shadow-md space-y-2'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-amber-500 border-2 border-[#1c1917] flex items-center justify-center shrink-0 shadow-md mt-1 font-bold text-[#1c1917]">
                  👤
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-9 h-9 rounded-xl bg-[#1c1917] border-2 border-amber-500 flex items-center justify-center shrink-0 shadow-md font-bold text-amber-400">
              🤖
            </div>
            <div className="bg-white border-2 border-[#e7e5e4] rounded-2xl p-4 text-xs font-bold text-[#1c1917] flex items-center gap-3 shadow-md">
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
              <span className="font-mono text-xs">Executing ReAct Workflow & Generating Tutor Response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t-2 border-[#d6d3d1] bg-white flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask an editing question (e.g. 'heyy i need tutorial of velocity' or 'What is a J-cut?')..."
          disabled={loading}
          className="flex-1 bg-[#f5f5f4] border-2 border-[#d6d3d1] rounded-xl px-4 py-3 text-xs md:text-sm text-[#1c1917] font-bold placeholder-[#78716c] focus:outline-none focus:border-[#1c1917] focus:bg-white transition-all font-sans"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-[#1c1917] hover:bg-black disabled:opacity-40 text-amber-400 font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 border border-amber-500"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
}
