import React, { useState } from "react";
import { 
  TrendingUp, Compass, Radar, Flame, Award, 
  CheckCircle2, Clock, Zap, Target, BookOpen, AlertTriangle, ChevronRight, Activity, PieChart, Sparkles, BarChart2
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import AnimatedCounter from "../ui/AnimatedCounter";
import ProgressRing from "../ui/ProgressRing";
import { buildUserLearningContext } from "../../services/userContextService";
import { getTranslation } from "../../services/i18nService";
import { recordStyleInteraction } from "../../services/learningStyleService";

export function LearningAnalyticsView({ student, onUpdateStudent, go }) {
  const ctx = buildUserLearningContext(student);
  const lang = student?.preferredLanguage || "en";

  const [activeTab, setActiveTab] = useState("overview");

  // Format activity duration
  const totalHours = ctx.learningActivity.totalHours;
  const streak = ctx.learningActivity.currentStreak;
  const activeDays = ctx.learningActivity.activeDays;
  const totalSessions = ctx.learningActivity.totalSessions;

  const hasAssessments = ctx.assessmentSummary.totalCount > 0;
  const hasActivity = totalSessions > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <SectionHeader 
            eyebrow={getTranslation("analytics.title", lang).toUpperCase()} 
            title="Learning Analytics & Intelligence" 
            subtitle={getTranslation("analytics.subtitle", lang)} 
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-fit text-xs">
          {["overview", "skills", "consistency", "style"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                activeTab === tab 
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB 1: OVERVIEW ─────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard 
              hover 
              onClick={() => go?.("career")} 
              className="p-5 cursor-pointer border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.03] to-transparent"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Compass size={20} />
                </div>
                <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                  View Career <ChevronRight size={12} />
                </span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">
                {ctx.careerReadinessScore}%
              </p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{getTranslation("dashboard.careerReadiness", lang)}</p>
            </GlassCard>

            <GlassCard 
              hover 
              onClick={() => go?.("roadmap")} 
              className="p-5 cursor-pointer border-purple-500/20 bg-gradient-to-br from-purple-500/[0.03] to-transparent"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <TrendingUp size={20} />
                </div>
                <span className="text-[11px] font-bold text-purple-400 flex items-center gap-1">
                  View Roadmap <ChevronRight size={12} />
                </span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">
                {ctx.roadmapProgress.percent}%
              </p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{getTranslation("dashboard.learningProgress", lang)}</p>
            </GlassCard>

            <GlassCard 
              hover 
              onClick={() => go?.("profile")} 
              className="p-5 cursor-pointer border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.03] to-transparent"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Radar size={20} />
                </div>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  View Skills <ChevronRight size={12} />
                </span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">
                {ctx.masteredSkills.length}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{getTranslation("dashboard.skillsDeveloped", lang)}</p>
            </GlassCard>

            <GlassCard 
              hover 
              onClick={() => go?.("roadmap")} 
              className="p-5 cursor-pointer border-amber-500/20 bg-gradient-to-br from-amber-500/[0.03] to-transparent"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Flame size={20} />
                </div>
                <span className="text-[11px] font-bold text-amber-400">
                  {streak > 0 ? `${streak} Days` : "No streak"}
                </span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">
                {streak}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{getTranslation("analytics.streak", lang)}</p>
            </GlassCard>
          </div>

          {/* Assessment & Skill Gaps Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Career Readiness Breakdown */}
            <GlassCard strong className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target size={18} className="text-cyan-400" />
                  <h3 className="font-bold text-white text-base">Career Skill Match</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  Target: {ctx.targetCareer}
                </span>
              </div>

              {ctx.requiredSkills.length > 0 ? (
                <div className="space-y-4">
                  {/* Matched Required Skills */}
                  <div>
                    <p className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Matched Skills ({ctx.matchedRequiredSkills.length}/{ctx.requiredSkills.length}):
                    </p>
                    {ctx.matchedRequiredSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {ctx.matchedRequiredSkills.map(s => (
                          <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No skills matched to this target career yet.</p>
                    )}
                  </div>

                  {/* Missing Skill Gaps */}
                  <div>
                    <p className="text-xs font-semibold text-amber-300 mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={14} /> Skills to Develop ({ctx.skillGaps.length}):
                    </p>
                    {ctx.skillGaps.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {ctx.skillGaps.map(s => (
                          <button
                            key={s}
                            onClick={() => go?.("roadmap")}
                            title={`Click to learn ${s} on your Roadmap`}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {s} <ChevronRight size={11} />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-300 font-semibold">🎉 All core target career skills mastered!</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs bg-white/[0.02] rounded-xl border border-white/5">
                  Set your target career in your profile to analyze skill matching.
                </div>
              )}
            </GlassCard>

            {/* Assessment Performance */}
            <GlassCard strong className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-purple-400" />
                  <h3 className="font-bold text-white text-base">Assessment Performance</h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {ctx.assessmentSummary.totalCount} Taken
                </span>
              </div>

              {hasAssessments ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div>
                      <p className="text-xs text-slate-400">{getTranslation("analytics.avgScore", lang)}</p>
                      <p className="text-2xl font-bold text-purple-300 mt-0.5">{ctx.assessmentSummary.avgScore}%</p>
                    </div>
                    <ProgressRing progress={ctx.assessmentSummary.avgScore} size={54} strokeWidth={5} color="#c4b5fd" />
                  </div>

                  {ctx.assessmentSummary.strengths.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-emerald-400 mb-1.5">Strongest Topics:</p>
                      <p className="text-xs text-slate-300">{ctx.assessmentSummary.strengths.join(", ")}</p>
                    </div>
                  )}

                  {ctx.assessmentSummary.weakTopics.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-amber-300 mb-1.5">Topics Needing Practice:</p>
                      <p className="text-xs text-slate-300">{ctx.assessmentSummary.weakTopics.join(", ")}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
                  <Award className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-slate-400 font-medium mb-3">
                    {getTranslation("analytics.noAssessments", lang)}
                  </p>
                  <button 
                    onClick={() => go?.("roadmap")} 
                    className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Take First Assessment
                  </button>
                </div>
              )}
            </GlassCard>

          </div>
        </div>
      )}

      {/* ── TAB 2: SKILLS MATRIX ────────────────────────────────────────── */}
      {activeTab === "skills" && (
        <GlassCard strong className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Radar size={18} className="text-emerald-400" />
            <h3 className="font-bold text-white text-base">Skill Development Matrix</h3>
          </div>

          {ctx.requiredSkills.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {ctx.requiredSkills.map(skill => {
                const isMastered = ctx.matchedRequiredSkills.includes(skill);
                const status = isMastered ? "MASTERED" : "LEARNING";
                return (
                  <div key={skill} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{skill}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Required for {ctx.targetCareer}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isMastered 
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" 
                        : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                    }`}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No skills assessed yet. Complete your profile to view skill matrix.</p>
          )}
        </GlassCard>
      )}

      {/* ── TAB 3: STUDY CONSISTENCY ───────────────────────────────────── */}
      {activeTab === "consistency" && (
        <GlassCard strong className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-amber-400" />
            <h3 className="font-bold text-white text-base">Study Consistency & Activity</h3>
          </div>

          {hasActivity ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                <p className="text-2xl font-bold text-amber-400">{streak}</p>
                <p className="text-xs text-slate-400 mt-1">Current Streak (Days)</p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                <p className="text-2xl font-bold text-cyan-400">{activeDays}</p>
                <p className="text-xs text-slate-400 mt-1">Active Learning Days</p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                <p className="text-2xl font-bold text-purple-400">{totalSessions}</p>
                <p className="text-xs text-slate-400 mt-1">Total Sessions</p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                <p className="text-2xl font-bold text-emerald-400">{totalHours}h</p>
                <p className="text-xs text-slate-400 mt-1">Total Time Spent</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
              <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-400 font-medium">
                {getTranslation("analytics.noData", lang)}
              </p>
            </div>
          )}
        </GlassCard>
      )}

      {/* ── TAB 4: ADAPTIVE LEARNING STYLE ─────────────────────────────── */}
      {activeTab === "style" && (
        <GlassCard strong className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-cyan-400" />
              <h3 className="font-bold text-white text-base">{getTranslation("learningStyle.title", lang)}</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              Primary: {ctx.learningPreferences.primaryStyle}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            {getTranslation("learningStyle.discovering", lang)}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: getTranslation("learningStyle.practice", lang), score: ctx.learningPreferences.practice, type: "practice", color: "from-cyan-500 to-blue-500" },
              { label: getTranslation("learningStyle.visual", lang), score: ctx.learningPreferences.visual, type: "video", color: "from-purple-500 to-pink-500" },
              { label: getTranslation("learningStyle.reading", lang), score: ctx.learningPreferences.reading, type: "article", color: "from-emerald-500 to-teal-500" },
              { label: getTranslation("learningStyle.auditory", lang), score: ctx.learningPreferences.auditory, type: "audio", color: "from-amber-500 to-orange-500" },
            ].map(item => (
              <div 
                key={item.label}
                onClick={() => recordStyleInteraction(item.type, student, onUpdateStudent)}
                className="p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl space-y-2 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{item.label}</span>
                  <span className="font-bold text-cyan-300">{item.score}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

    </div>
  );
}

export default LearningAnalyticsView;
