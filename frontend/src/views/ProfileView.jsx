import React, { useState, useEffect } from 'react';
import { UserCheck, Award, BookOpen, AlertTriangle, CheckCircle2, Sliders, ArrowUpRight } from 'lucide-react';

export default function ProfileView({ userId = "default_student" }) {
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  if (loading) return <div className="p-8 text-center text-xs text-slate-500 font-semibold">Loading student profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <UserCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Learning Profile & Progress</h2>
        <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
          Track your editing mastery, completed practice drills, and tailored skill recommendations.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Current Editor Level</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{profile?.skill_level || "Beginner"} Mode</h3>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Drills Completed</span>
              <span className="text-lg font-black text-slate-900">{profile?.completed_exercises || 0}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Average Score</span>
              <span className="text-lg font-black text-indigo-600">{profile?.average_score || 75}%</span>
            </div>
          </div>
        </div>

        {/* Mastered Topics vs Topics to Practice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Mastered Topics */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Topics Learned:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile?.known_techniques?.map((tech, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-white text-slate-800 text-xs font-bold border border-slate-200 shadow-sm">
                  ✓ {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Topics To Practice */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Topics To Practice:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile?.weak_areas?.map((wa, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200 shadow-sm">
                  ⚡ {wa}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Recent Feedback */}
        {profile?.recent_feedback && (
          <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100 space-y-1.5 text-xs">
            <span className="font-extrabold text-indigo-900 uppercase tracking-wider text-[11px]">
              Tutor Feedback Note:
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              "{profile.recent_feedback}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
