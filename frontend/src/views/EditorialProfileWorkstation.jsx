import React, { useState, useEffect } from 'react';
import { Sliders, Award, BookOpen, AlertTriangle, CheckCircle2, RefreshCw, BarChart2, User, ChevronRight } from 'lucide-react';

export default function EditorialProfileWorkstation({ userId = "default_student", skillLevel, setSkillLevel }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const skills = [
    { name: 'Pacing & Rhythmic Cutting', progress: 85, level: 'ADVANCED' },
    { name: 'J-Cuts & L-Cuts (Audio Lead/Lag)', progress: 78, level: 'INTERMEDIATE' },
    { name: 'Match Cutting & Eyeline Vectoring', progress: 92, level: 'ADVANCED' },
    { name: 'Color Space & Rec.709 Normalization', progress: 60, level: 'INTERMEDIATE' },
    { name: 'Montage & Kuleshov Assembly', progress: 45, level: 'BEGINNER' },
  ];

  const renderAsciiBar = (percent) => {
    const totalBlocks = 16;
    const filled = Math.round((percent / 100) * totalBlocks);
    const empty = totalBlocks - filled;
    return `[ ${'█'.repeat(filled)}${'░'.repeat(empty)} ]`;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-xs font-mono text-studio-500">
        <RefreshCw className="w-4 h-4 animate-spin mr-2 text-studio-gold" />
        LOADING EDITORIAL DEVELOPMENT PROFILE...
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-studio-950 p-6 space-y-6 text-studio-100 font-sans">
      
      {/* Header Banner */}
      <div className="border border-studio-800 bg-studio-900/60 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-studio-gold/10 border border-studio-gold/30 rounded-lg text-studio-gold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-studio-500 uppercase tracking-wider">
              <span>USER ID: {userId}</span>
              <span>•</span>
              <span className="text-studio-gold font-bold">STATUS: ACTIVE SEQUENCE DEVELOPMENT</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 font-sans tracking-wide">
              Editorial Development & Mastery Profile
            </h2>
          </div>
        </div>

        {/* Skill Selector Quick Toggle */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-studio-400">SELECT TIER:</span>
          <select
            value={skillLevel || profile?.skill_level || 'Intermediate'}
            onChange={(e) => setSkillLevel && setSkillLevel(e.target.value)}
            className="bg-studio-950 border border-studio-700 text-studio-gold text-xs font-mono rounded px-3 py-1.5 focus:outline-none focus:border-studio-gold"
          >
            <option value="Beginner">BEGINNER EDITOR</option>
            <option value="Intermediate">INTERMEDIATE EDITOR</option>
            <option value="Advanced">ADVANCED EDITORIAL DIRECTOR</option>
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-studio-900 border border-studio-800 p-4 rounded-xl space-y-1">
          <span className="font-mono text-[10px] text-studio-500 uppercase tracking-wider block">CURRENT EDIT TIER</span>
          <div className="text-lg font-bold font-mono text-studio-gold uppercase">
            {profile?.skill_level || skillLevel || 'INTERMEDIATE'}
          </div>
          <span className="text-[11px] text-studio-400 block font-mono">Adaptive AI Response Calibration</span>
        </div>

        <div className="bg-studio-900 border border-studio-800 p-4 rounded-xl space-y-1">
          <span className="font-mono text-[10px] text-studio-500 uppercase tracking-wider block">DRILLS COMPLETED</span>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {profile?.completed_exercises || 12} PRACTICES
          </div>
          <span className="text-[11px] text-studio-400 block font-mono">100% Practical Verification</span>
        </div>

        <div className="bg-studio-900 border border-studio-800 p-4 rounded-xl space-y-1">
          <span className="font-mono text-[10px] text-studio-500 uppercase tracking-wider block">AVERAGE ACCURACY</span>
          <div className="text-lg font-bold font-mono text-sky-400">
            {profile?.average_score || 88}% EVALUATION
          </div>
          <span className="text-[11px] text-studio-400 block font-mono">Rhythmic & Structural Fidelity</span>
        </div>

        <div className="bg-studio-900 border border-studio-800 p-4 rounded-xl space-y-1">
          <span className="font-mono text-[10px] text-studio-500 uppercase tracking-wider block">TECHNIQUES STORED</span>
          <div className="text-lg font-bold font-mono text-amber-400">
            {profile?.known_techniques?.length || 7} REPERTOIRE
          </div>
          <span className="text-[11px] text-studio-400 block font-mono">NLE Cut Library</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Skill Breakdown & Progress Bars */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-studio-900 border border-studio-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-studio-800 pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-studio-gold" />
                <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider font-mono">
                  CORE EDITORIAL COMPETENCY BREAKDOWN
                </h3>
              </div>
              <span className="text-[10px] font-mono text-studio-500">PRECISION METRICS</span>
            </div>

            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <div key={idx} className="space-y-1.5 bg-studio-950 p-3 rounded-lg border border-studio-800/80">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-200 font-semibold">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-studio-500 font-bold">{skill.level}</span>
                      <span className="text-studio-gold font-bold">{skill.progress}%</span>
                    </div>
                  </div>
                  <div className="font-mono text-[11px] text-studio-gold tracking-tighter">
                    {renderAsciiBar(skill.progress)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mastered Techniques & Known Competencies */}
          <div className="bg-studio-900 border border-studio-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-studio-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider font-mono">
                  MASTERED EDITORIAL TECHNIQUES
                </h3>
              </div>
              <span className="text-[10px] font-mono text-studio-500">VERIFIED SKILLS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              {(profile?.known_techniques || [
                'J-Cut Dialogue Pre-lap',
                'Action Cutting on Movement',
                'Match Cut Geometry Alignment',
                'Audio L-Cut Dialogue Tail',
                'Eyeline Vector Continuity',
                'Speed Ramp Transition',
                'Color Contrast Separation'
              ]).map((tech, i) => (
                <div key={i} className="bg-studio-950 p-2.5 rounded border border-studio-800 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-studio-300">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Weak Areas & Tutor Notes */}
        <div className="space-y-6">
          {/* Target Improvement Areas */}
          <div className="bg-studio-900 border border-studio-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-studio-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-xs text-slate-100 uppercase tracking-wider font-mono">
                  TARGET IMPROVEMENT AREAS
                </h3>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {(profile?.weak_areas || [
                'Montage Pacing Balance',
                'Multi-Cam Clip Syncing',
                'Subtle Audio Crossfades'
              ]).map((wa, i) => (
                <div key={i} className="bg-studio-950 p-3 rounded border border-amber-950/50 text-amber-300 flex items-start gap-2">
                  <span className="text-amber-400 font-bold">!</span>
                  <div>
                    <div className="font-bold text-amber-200">{wa}</div>
                    <div className="text-[10px] text-studio-400 mt-0.5">Recommended drill available in Practice tab</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Tutor Notes */}
          <div className="bg-studio-900 border border-studio-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-studio-800 pb-2">
              <span className="font-mono text-[10px] text-studio-gold font-bold uppercase tracking-wider">
                TUTOR DIAGNOSTIC LOG
              </span>
              <span className="font-mono text-[10px] text-studio-500">LATEST EVAL</span>
            </div>

            <p className="text-xs font-mono text-studio-300 leading-relaxed bg-studio-950 p-3 rounded border border-studio-800">
              "{profile?.recent_feedback || 'Student demonstrates strong understanding of J/L dialogue pre-laps. Suggest focusing next sequence on montage compression and eye-trace placement across rapid hard cuts.'}"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
