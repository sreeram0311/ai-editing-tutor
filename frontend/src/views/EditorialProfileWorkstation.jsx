import React, { useState, useEffect } from 'react';
import { User, CheckCircle2, AlertTriangle, RefreshCw, BarChart2, Award } from 'lucide-react';

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
    { name: 'Pacing & Rhythmic Cutting', progress: 85, level: 'Advanced' },
    { name: 'J-Cuts & L-Cuts (Audio Lead/Lag)', progress: 78, level: 'Intermediate' },
    { name: 'Match Cutting & Eyeline Continuity', progress: 92, level: 'Advanced' },
    { name: 'Color Space & Rec.709 Normalization', progress: 60, level: 'Intermediate' },
    { name: 'Montage & Kuleshov Assembly', progress: 45, level: 'Beginner' },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-xs font-sans text-cinema-500">
        <RefreshCw className="w-4 h-4 animate-spin mr-2 text-amber-500" />
        Loading Editorial Development Profile...
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-cinema-950 p-6 md:p-8 space-y-8 font-sans text-cinema-100 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-cinema-800/80 pb-5">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider block font-sans">
            EDITORIAL DEVELOPMENT
          </span>
          <h2 className="text-2xl font-semibold text-cinema-100 font-sans tracking-tight">
            Editor Mastery & Competency Profile
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-cinema-500">Level:</span>
          <span className="px-3 py-1 bg-cinema-900 border border-cinema-800 rounded-lg text-amber-400 font-semibold">
            {profile?.skill_level || skillLevel || 'Intermediate'} Editor
          </span>
        </div>
      </div>

      {/* Core Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-cinema-900 border border-cinema-800/80 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-medium text-cinema-500 uppercase tracking-wider block">Completed Exercises</span>
          <div className="text-2xl font-bold font-sans text-cinema-100">{profile?.completed_exercises || 12}</div>
          <span className="text-xs text-cinema-400 block font-sans">Practical drills verified</span>
        </div>

        <div className="bg-cinema-900 border border-cinema-800/80 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-medium text-cinema-500 uppercase tracking-wider block">Average Accuracy</span>
          <div className="text-2xl font-bold font-sans text-amber-400">{profile?.average_score || 88}%</div>
          <span className="text-xs text-cinema-400 block font-sans">Technique score</span>
        </div>

        <div className="bg-cinema-900 border border-cinema-800/80 p-5 rounded-2xl space-y-1">
          <span className="text-xs font-medium text-cinema-500 uppercase tracking-wider block">Techniques Stored</span>
          <div className="text-2xl font-bold font-sans text-emerald-400">{profile?.known_techniques?.length || 7}</div>
          <span className="text-xs text-cinema-400 block font-sans">NLE repertoire cuts</span>
        </div>
      </div>

      {/* Skills Progress Bars */}
      <div className="bg-cinema-900 border border-cinema-800/80 p-6 rounded-2xl space-y-5 shadow-xl">
        <span className="text-xs font-semibold text-cinema-300 uppercase tracking-wider block">
          CORE EDITORIAL SKILLS
        </span>

        <div className="space-y-4">
          {skills.map((skill, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-cinema-200">{skill.name}</span>
                <span className="text-amber-400 font-semibold">{skill.progress}%</span>
              </div>
              <div className="h-2 w-full bg-cinema-950 rounded-full overflow-hidden border border-cinema-800">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${skill.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mastered Concepts & Target Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-cinema-900 border border-cinema-800/80 p-6 rounded-2xl space-y-4">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> MASTERED CONCEPTS
          </span>
          <div className="space-y-2 text-xs text-cinema-300 font-medium">
            {(profile?.known_techniques || [
              'J-Cut Dialogue Pre-lap',
              'Action Cutting on Movement',
              'Match Cut Geometry Alignment',
              'Audio L-Cut Dialogue Tail',
              'Eyeline Vector Continuity'
            ]).map((tech, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-cinema-950 border border-cinema-800">
                <span className="text-emerald-400">✓</span>
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cinema-900 border border-cinema-800/80 p-6 rounded-2xl space-y-4">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> RECOMMENDED NEXT SKILLS
          </span>
          <div className="space-y-2 text-xs text-cinema-300 font-medium">
            {(profile?.weak_areas || [
              'Montage Pacing Balance',
              'Multi-Cam Clip Syncing',
              'Subtle Audio Crossfades'
            ]).map((wa, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-cinema-950 border border-cinema-800">
                <span className="text-amber-400">⚡</span>
                <span>{wa}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
