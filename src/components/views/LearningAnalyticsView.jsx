import React, { useState } from "react";
import { 
  TrendingUp, Compass, Radar, Flame, Award, 
  CheckCircle2, Clock, Zap, Target, BookOpen, AlertTriangle, ChevronRight, Activity, PieChart, Sparkles, BarChart2,
  Users, Download, UserCheck, ShieldAlert, Sliders, ArrowUpRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import ProgressRing from "../ui/ProgressRing";
import { buildUserLearningContext } from "../../services/userContextService";
import { getTranslation } from "../../services/i18nService";
import { recordStyleInteraction } from "../../services/learningStyleService";

export function LearningAnalyticsView({ student, onUpdateStudent, go, language = "en" }) {
  const ctx = buildUserLearningContext(student);
  const lang = language || student?.preferredLanguage || "en";

  const [activeTab, setActiveTab] = useState("overview"); // overview | skills | consistency | trends | style | educator
  const [viewRole, setViewRole] = useState("student"); // student | educator

  // Format activity duration
  const totalHours = ctx.learningActivity.totalHours;
  const streak = ctx.learningActivity.currentStreak;
  const activeDays = ctx.learningActivity.activeDays;
  const totalSessions = ctx.learningActivity.totalSessions;

  const hasAssessments = ctx.assessmentSummary.totalCount > 0;
  const hasActivity = totalSessions > 0;

  // Trend Data for Charts
  const trendData = [
    { day: "Mon", hours: 1.5, score: 65, topics: 1 },
    { day: "Tue", hours: 2.0, score: 70, topics: 2 },
    { day: "Wed", hours: 3.2, score: 78, topics: 2 },
    { day: "Thu", hours: 1.8, score: 82, topics: 3 },
    { day: "Fri", hours: 4.0, score: 85, topics: 4 },
    { day: "Sat", hours: 2.5, score: 88, topics: 4 },
    { day: "Sun", hours: 3.5, score: ctx.assessmentSummary.avgScore || 90, topics: ctx.roadmapProgress.completed || 5 }
  ];

  // Cohort Mock Data for Educator Mode
  const cohortStudents = [
    { name: student?.name || "Current Student", career: ctx.targetCareer, readiness: ctx.careerReadinessScore, streak: streak, avgScore: ctx.assessmentSummary.avgScore || 85, status: "On Track" },
    { name: "Alex Rivera", career: "Full Stack Developer", readiness: 84, streak: 12, avgScore: 88, status: "On Track" },
    { name: "Priya Sharma", career: "AI / ML Engineer", readiness: 92, streak: 18, avgScore: 94, status: "Top Performer" },
    { name: "Marcus Chen", career: "Cloud / DevOps", readiness: 42, streak: 1, avgScore: 48, status: "At Risk" },
    { name: "Sofia Rossi", career: "Data Scientist", readiness: 78, streak: 7, avgScore: 81, status: "On Track" },
    { name: "David Kim", career: "Cybersecurity Engineer", readiness: 35, streak: 0, avgScore: 45, status: "Needs Support" }
  ];

  const exportReport = () => {
    const reportText = `PathForge Learning Analytics Report
Generated: ${new Date().toLocaleDateString()}
Student: ${ctx.name}
Target Career: ${ctx.targetCareer}
Career Readiness Score: ${ctx.careerReadinessScore}%
Roadmap Progress: ${ctx.roadmapProgress.percent}%
Mastered Skills (${ctx.masteredSkills.length}): ${ctx.masteredSkills.join(", ")}
Skill Gaps (${ctx.skillGaps.length}): ${ctx.skillGaps.join(", ")}
Study Streak: ${streak} Days
Average Assessment Score: ${ctx.assessmentSummary.avgScore}%
    `;
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `PathForge_Report_${ctx.name.replace(/\s+/g, "_")}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <SectionHeader 
            eyebrow={getTranslation("analytics.title", lang).toUpperCase()} 
            title={viewRole === "student" ? "Learning Analytics & Progress Intelligence" : "Educator & Cohort Intelligence Center"} 
            subtitle={viewRole === "student" 
              ? getTranslation("analytics.subtitle", lang)
              : "Monitor student cohort progress, skill development trends, and at-risk learners."} 
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Educator / Student View Mode Toggle */}
          <div className="flex items-center p-1 bg-white/[0.04] border border-white/10 rounded-xl text-xs">
            <button
              onClick={() => setViewRole("student")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewRole === "student" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <Activity size={13} /> Student View
            </button>
            <button
              onClick={() => { setViewRole("educator"); setActiveTab("educator"); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewRole === "educator" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <Users size={13} /> Educator Mode
            </button>
          </div>

          {/* Export Report Button */}
          <button
            onClick={exportReport}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            title="Download Learning Progress Summary Report"
          >
            <Download size={14} className="text-cyan-400" /> Export Report
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl w-fit overflow-x-auto max-w-full text-xs">
        {[
          { id: "overview", label: "Overview" },
          { id: "skills", label: "Skill Matrix" },
          { id: "consistency", label: "Consistency" },
          { id: "trends", label: "Learning Trends" },
          { id: "style", label: "Learning Style" },
          { id: "educator", label: "Educator Cohort", highlight: true },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === "educator") setViewRole("educator");
              else setViewRole("student");
            }}
            className={`px-4 py-2 rounded-xl font-bold capitalize transition-all cursor-pointer shrink-0 ${
              activeTab === tab.id 
                ? tab.highlight
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
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
              onClick={() => go?.("assessment")} 
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
                    onClick={() => go?.("assessment")} 
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

      {/* ── TAB 4: LEARNING TRENDS (RECHARTS) ─────────────────────────── */}
      {activeTab === "trends" && (
        <div className="space-y-6">
          <GlassCard strong className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 size={18} className="text-cyan-400" />
                <h3 className="font-bold text-white text-base">Weekly Learning & Score Trajectory</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">7-Day Activity Trend</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#09101f", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="hours" name="Study Hours" stroke="#22d3ee" fillOpacity={1} fill="url(#colorHours)" strokeWidth={2} />
                  <Area type="monotone" dataKey="score" name="Assessment Score %" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400" /> Study Hours
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-400" /> Assessment Score Trajectory (%)
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── TAB 5: ADAPTIVE LEARNING STYLE ─────────────────────────────── */}
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

      {/* ── TAB 6: EDUCATOR & COHORT ANALYTICS ─────────────────────────── */}
      {activeTab === "educator" && (
        <div className="space-y-6">
          {/* Educator Cohort Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="p-5 border-purple-500/20 bg-purple-500/[0.03]">
              <p className="text-xs text-slate-400 font-medium">Total Cohort Students</p>
              <p className="text-2xl font-bold text-white mt-1">6 Active</p>
            </GlassCard>
            <GlassCard className="p-5 border-emerald-500/20 bg-emerald-500/[0.03]">
              <p className="text-xs text-slate-400 font-medium">Avg Cohort Readiness</p>
              <p className="text-2xl font-bold text-emerald-300 mt-1">74%</p>
            </GlassCard>
            <GlassCard className="p-5 border-cyan-500/20 bg-cyan-500/[0.03]">
              <p className="text-xs text-slate-400 font-medium">Topic Completion Rate</p>
              <p className="text-2xl font-bold text-cyan-300 mt-1">68%</p>
            </GlassCard>
            <GlassCard className="p-5 border-amber-500/20 bg-amber-500/[0.03]">
              <p className="text-xs text-slate-400 font-medium">At-Risk Students Alert</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">2 Need Support</p>
            </GlassCard>
          </div>

          {/* Student Roster Table */}
          <GlassCard strong className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-purple-400" />
                <h3 className="font-bold text-white text-base">Class Roster & Continuous Improvement</h3>
              </div>
              <button 
                onClick={exportReport}
                className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Download size={13} /> Export Cohort CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-3 px-3 font-semibold">Student Name</th>
                    <th className="py-3 px-3 font-semibold">Target Career</th>
                    <th className="py-3 px-3 font-semibold">Readiness Score</th>
                    <th className="py-3 px-3 font-semibold">Study Streak</th>
                    <th className="py-3 px-3 font-semibold">Avg Quiz Score</th>
                    <th className="py-3 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cohortStudents.map((st, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                          {st.name.slice(0, 2).toUpperCase()}
                        </div>
                        {st.name}
                      </td>
                      <td className="py-3 px-3 text-slate-300">{st.career}</td>
                      <td className="py-3 px-3 font-bold text-cyan-300">{st.readiness}%</td>
                      <td className="py-3 px-3 text-amber-300 font-semibold">{st.streak} Days</td>
                      <td className="py-3 px-3 text-purple-300 font-semibold">{st.avgScore}%</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          st.status === "Top Performer" || st.status === "On Track"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}>
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  );
}

export default LearningAnalyticsView;
