import React from "react";
import {
  Compass, TrendingUp, Radar, Flame, ChevronRight, CheckCircle2, AlertTriangle, Sparkles,
  Target, ArrowRight, Zap, FolderKanban
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import AnimatedCounter from "../ui/AnimatedCounter";
import StatusDot from "../ui/StatusDot";
import Pill from "../ui/Pill";
import ProgressRing from "../ui/ProgressRing";
import ProgressBar from "../ui/ProgressBar";
import { STUDENT, STRENGTHS, GAPS, RESOURCES, PROJECTS, GAP_TO_HIRE_PLAN } from "../../data/mockData";

export function DashboardView({ go }) {
  const stats = [
    { label: "Overall career readiness", value: 72, icon: Compass, tone: "cyan" },
    { label: "Learning progress", value: 64, icon: TrendingUp, tone: "violet" },
    { label: "Skills mastered", value: 18, icon: Radar, tone: "green", raw: true },
    { label: "Current streak", value: 12, icon: Flame, tone: "amber", raw: true, suffix: " days" },
  ];

  const plan = GAP_TO_HIRE_PLAN;

  return (
    <div className="space-y-8">
      {/* Greeting Banner */}
      <GlassCard strong className="p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="lp-display text-xl md:text-2xl font-semibold">Good morning, {STUDENT.name} 👋</h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>
            Your AI career companion identified 3 high-impact gaps to unlock 94% hireability for <span className="text-cyan-300 font-medium">{STUDENT.targetCareer}</span>.
          </p>
        </div>
        <button onClick={() => go("profile")} className="lp-btn-primary px-5 py-2.5 rounded-xl text-sm whitespace-nowrap cursor-pointer">
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
              <AnimatedCounter to={s.value} suffix={s.raw ? (s.suffix || "") : "%"} />
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
            subtitle={`Close 3 critical skill gaps to boost your ${STUDENT.targetCareer} hireability from 72% to 94%.`}
            action={
              <button
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
              <span className="text-slate-400">Current Readiness: <strong className="text-white">72%</strong></span>
              <span className="text-cyan-400 font-medium flex items-center gap-1">
                <Target size={13} /> Target Hireability: <strong>94%</strong>
              </span>
            </div>
            <div className="relative h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 bottom-0 rounded-full transition-all duration-1000"
                style={{ width: "72%", background: "linear-gradient(90deg, #22d3ee, #8b5cf6)" }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
              <span>Baseline: 72%</span>
              <span className="text-cyan-300">+8% Deep Learning</span>
              <span className="text-violet-300">+7% Docker/FastAPI</span>
              <span className="text-emerald-400 font-semibold">94% Hired</span>
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
            {STRENGTHS.map(s => <Pill key={s} tone="green">{s}</Pill>)}
          </div>
          <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#fbbf24" }}>
            <AlertTriangle size={13} /> High-Priority Gaps
          </p>
          <div className="flex flex-wrap gap-1.5">
            {GAPS.map(s => <Pill key={s} tone="amber">{s}</Pill>)}
          </div>
          <button onClick={() => go("profile")} className="text-xs flex items-center gap-1 mt-6 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
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
              <button onClick={() => go("resources")} className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "#67e8f9" }}>
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
            <p className="text-xs mb-5" style={{ color: "var(--text-dim)" }}>6 questions · ~10 minutes · Statistics & ML focus</p>
            <button onClick={() => go("profile")} className="lp-btn-primary px-5 py-2.5 rounded-xl text-sm w-full cursor-pointer">
              Start assessment
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
              <button onClick={() => go("projects")} className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "#67e8f9" }}>
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
              <button onClick={() => go("career")} className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "#67e8f9" }}>
                Details <ChevronRight size={13} />
              </button>
            }
          />
          <div className="flex items-center gap-6">
            <ProgressRing value={72} size={96} stroke={8} sublabel="ready" />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-white">Target: <span className="font-semibold text-cyan-300">{STUDENT.targetCareer}</span></p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>18 of 25 required skills matched</p>
              <p className="text-xs" style={{ color: "#fbbf24" }}>Focus: Docker, System Design, Deep Learning</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default DashboardView;
