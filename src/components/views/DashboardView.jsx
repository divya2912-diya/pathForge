import React from "react";
import {
  Compass, TrendingUp, Radar, Flame, ChevronRight, CheckCircle2, AlertTriangle, Sparkles,
  Target, Zap, FolderKanban
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import AnimatedCounter from "../ui/AnimatedCounter";
import StatusDot from "../ui/StatusDot";
import Pill from "../ui/Pill";
import ProgressRing from "../ui/ProgressRing";
import ProgressBar from "../ui/ProgressBar";
import { RESOURCES, PROJECTS } from "../../data/mockData";
import { getGapToHirePlan, getStrengthsAndGaps, SKILL_REQUIREMENTS } from "../../data/userProfile";

export function DashboardView({ go, student }) {
  const targetCareer = student?.targetCareer || "Software Engineer";
  const userName = student?.name || "there";
  const careerReadiness = student?.careerReadiness ?? 50;
  const userSkills = student?.skills || [];

  const plan = getGapToHirePlan(targetCareer);
  const { strengths, gaps } = getStrengthsAndGaps(userSkills, targetCareer);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const stats = [
    { label: "Career readiness", value: careerReadiness, icon: Compass, tone: "cyan" },
    { label: "Learning progress", value: Math.min(95, Math.round(careerReadiness * 0.85)), icon: TrendingUp, tone: "violet" },
    { label: "Skills listed", value: userSkills.length || 0, icon: Radar, tone: "green", raw: true },
    { label: "Assessments taken", value: student?.assessmentScore !== null && student?.assessmentScore !== undefined ? 1 : 0, icon: Flame, tone: "amber", raw: true },
  ];

  const overview = plan.roleOverview;

  return (
    <div className="space-y-8">
      {/* Greeting Banner */}
      <GlassCard strong className="p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="lp-display text-xl md:text-2xl font-semibold">
            {greeting}, {userName.split(" ")[0]} 👋
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>
            {gaps.length > 0
              ? <>Your AI career companion identified <strong className="text-white">{gaps.length} high-impact gap{gaps.length !== 1 ? "s" : ""}</strong> to unlock higher hireability for <span className="text-cyan-300 font-medium">{targetCareer}</span>.</>
              : <>Your profile is looking strong! Keep building toward <span className="text-cyan-300 font-medium">{targetCareer}</span>.</>
            }
          </p>
        </div>
        <button
          id="btn-dashboard-assessment"
          onClick={() => go("profile")}
          className="lp-btn-primary px-5 py-2.5 rounded-xl text-sm whitespace-nowrap cursor-pointer"
        >
          {"Take today's assessment"}
        </button>
      </GlassCard>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <GlassCard key={s.label} hover className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(34,211,238,0.1)" }}>
                <s.icon size={16} color="#67e8f9" />
              </div>
            </div>
            <p className="lp-display text-2xl font-semibold">
              <AnimatedCounter to={s.value} suffix={s.raw ? "" : "%"} />
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Role Gap-to-Hire Action Plan Card + Skill Gap Analysis */}
      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2" hover>
          <SectionHeader
            eyebrow="CAREER GAP CLOSER"
            title="Role Gap-to-Hire Action Plan"
            subtitle={`Close critical skill gaps to boost your ${targetCareer} hireability from ${overview.baselineScore}% to ${overview.projectedScore}%.`}
            action={
              <button
                id="btn-dashboard-view-roadmap"
                onClick={() => go("roadmap")}
                className="text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors cursor-pointer"
              >
                View full action plan <ChevronRight size={13} />
              </button>
            }
          />

          {/* Hireability Stepper Tracker */}
          <div className="my-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">
                Current Readiness: <strong className="text-white">{careerReadiness}%</strong>
              </span>
              <span className="text-cyan-400 font-medium flex items-center gap-1">
                <Target size={13} /> Target Hireability: <strong>{overview.projectedScore}%</strong>
              </span>
            </div>
            <div className="relative h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 bottom-0 rounded-full transition-all duration-1000"
                style={{ width: `${careerReadiness}%`, background: "linear-gradient(90deg, #22d3ee, #8b5cf6)" }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
              <span>Baseline: {overview.baselineScore}%</span>
              {plan.milestones.slice(0, 2).map((m) => (
                <span key={m.id} className={m.id === 1 ? "text-cyan-300" : "text-violet-300"}>{m.boost}</span>
              ))}
              <span className="text-emerald-400 font-semibold">{overview.projectedScore}% Hired</span>
            </div>
          </div>

          {/* Priority Gap Items */}
          <div className="space-y-3">
            {plan.milestones.slice(0, 3).map((m) => (
              <div
                key={m.id}
                onClick={() => go("roadmap")}
                className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-cyan-400/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: "rgba(34,211,238,0.12)", color: "#67e8f9" }}>
                    0{m.step}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-white truncate">{m.title}</p>
                      <Pill tone={m.priorityTone}>{m.priority}</Pill>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{m.project}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(52,211,153,0.12)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.25)" }}>
                    {m.boost} boost
                  </span>
                  <StatusDot status={m.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Skill Gap Analysis */}
        <GlassCard className="p-6" hover>
          <SectionHeader title="Skill gap analysis" />
          <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}>
            <CheckCircle2 size={13} /> Strengths
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {strengths.length > 0
              ? strengths.map(s => <Pill key={s} tone="green">{s}</Pill>)
              : <p className="text-xs text-slate-400">Complete onboarding to see strengths</p>
            }
          </div>
          <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#fbbf24" }}>
            <AlertTriangle size={13} /> High-Priority Gaps
          </p>
          <div className="flex flex-wrap gap-1.5">
            {gaps.length > 0
              ? gaps.map(s => <Pill key={s} tone="amber">{s}</Pill>)
              : <p className="text-xs text-slate-400">No gaps detected — great work!</p>
            }
          </div>
          <button
            id="btn-dashboard-full-profile"
            onClick={() => go("profile")}
            className="text-xs flex items-center gap-1 mt-6 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Full skill profile <ChevronRight size={13} />
          </button>
        </GlassCard>
      </div>

      {/* AI Recommendations & Upcoming Assessment */}
      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2" hover>
          <SectionHeader
            title="AI recommendations"
            subtitle="Matched to your current skill gaps"
            action={
              <button
                id="btn-dashboard-all-resources"
                onClick={() => go("resources")}
                className="text-xs flex items-center gap-1 cursor-pointer"
                style={{ color: "#67e8f9" }}
              >
                All resources <ChevronRight size={13} />
              </button>
            }
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {RESOURCES.slice(0, 4).map(r => (
              <div key={r.id} className="p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <Pill tone="cyan">{r.match}% match</Pill>
                  <span className="text-xs" style={{ color: "var(--text-dim)" }}>{r.time}</span>
                </div>
                <p className="text-sm font-medium lp-line-clamp-2 text-white">{r.title}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col" hover>
          <SectionHeader title="Upcoming assessment" />
          <div className="flex-1 flex flex-col items-center justify-center text-center py-2">
            <Sparkles size={26} color="#67e8f9" className="mb-3" />
            <p className="text-sm font-medium mb-1 text-white">Adaptive Knowledge Check</p>
            <p className="text-xs mb-5" style={{ color: "var(--text-dim)" }}>6 questions · ~10 minutes · {targetCareer} focus</p>
            {student?.assessmentScore !== null && student?.assessmentScore !== undefined && (
              <p className="text-xs mb-3 text-emerald-400">
                Last score: <strong>{student.assessmentScore}%</strong>
              </p>
            )}
            <button
              id="btn-dashboard-start-assessment"
              onClick={() => go("profile")}
              className="lp-btn-primary px-5 py-2.5 rounded-xl text-sm w-full cursor-pointer"
            >
              {student?.assessmentScore !== null && student?.assessmentScore !== undefined ? "Retake assessment" : "Start assessment"}
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Recommended Projects & Career Readiness */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover>
          <SectionHeader
            title="Recommended projects"
            action={
              <button
                id="btn-dashboard-all-projects"
                onClick={() => go("projects")}
                className="text-xs flex items-center gap-1 cursor-pointer"
                style={{ color: "#67e8f9" }}
              >
                All projects <ChevronRight size={13} />
              </button>
            }
          />
          {PROJECTS.slice(0, 2).map(p => (
            <div key={p.id} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <p className="text-sm font-medium text-white">{p.title}</p>
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>{p.skills.slice(0, 3).join(" · ")}</p>
              </div>
              <Pill tone="cyan">{p.match}%</Pill>
            </div>
          ))}
        </GlassCard>

        <GlassCard className="p-6" hover>
          <SectionHeader
            title="Career readiness"
            action={
              <button
                id="btn-dashboard-career-details"
                onClick={() => go("career")}
                className="text-xs flex items-center gap-1 cursor-pointer"
                style={{ color: "#67e8f9" }}
              >
                Details <ChevronRight size={13} />
              </button>
            }
          />
          <div className="flex items-center gap-6">
            <ProgressRing value={careerReadiness} size={96} stroke={8} sublabel="ready" />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-white">
                Target: <span className="font-semibold text-cyan-300">{targetCareer}</span>
              </p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                {strengths.length} of {(SKILL_REQUIREMENTS[targetCareer] || []).length || 10} required skills matched
              </p>
              {gaps.length > 0 && (
                <p className="text-xs" style={{ color: "#fbbf24" }}>
                  Focus: {gaps.slice(0, 3).join(", ")}
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default DashboardView;
