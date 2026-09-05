import React, { useState, useEffect } from 'react';
import { UserCheck, Award, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ProfileDashboard({ userId = "default_student", onProfileLoaded }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (onProfileLoaded) onProfileLoaded(data);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  if (loading) return <div className="p-4 text-xs text-brown-500">Loading student profile...</div>;

  return (
    <div className="bg-white border border-cream-300 rounded-2xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brown-800 text-brown-200 flex items-center justify-center">
            <UserCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-brown-900 text-sm tracking-tight font-sans">
              Learning Profile Tool
            </h3>
            <p className="text-[10px] text-brown-500 font-medium">PostgreSQL / SQLite Database Records</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-cream-100 text-brown-800 border border-cream-300">
          Tool 2 Active
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-cream-50 p-3.5 rounded-xl border border-cream-300 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-brown-600 font-bold">Completed Exercises</span>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brown-800" />
            <span className="text-xl font-extrabold text-brown-900">
              {profile?.completed_exercises || 0}
            </span>
          </div>
        </div>
        <div className="bg-cream-50 p-3.5 rounded-xl border border-cream-300 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-brown-600 font-bold">Average Score</span>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span className="text-xl font-extrabold text-emerald-700">
              {profile?.average_score || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Known Techniques & Weaknesses */}
      <div className="space-y-3 pt-1">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-brown-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Mastered Techniques:
          </span>
          <div className="flex flex-wrap gap-1">
            {profile?.known_techniques?.map((tech, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-cream-100 text-brown-900 border border-cream-300 text-[10px] font-bold">
                ✓ {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            Target Improvement Areas:
          </span>
          <div className="flex flex-wrap gap-1">
            {profile?.weak_areas?.map((wa, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold">
                ⚡ {wa}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
