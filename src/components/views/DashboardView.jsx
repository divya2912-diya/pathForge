import React from "react";
import {
  Compass, TrendingUp, Radar, Flame, ChevronRight, CheckCircle2, AlertTriangle, Sparkles
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import AnimatedCounter from "../ui/AnimatedCounter";
import StatusDot from "../ui/StatusDot";
import Pill from "../ui/Pill";
import ProgressRing from "../ui/ProgressRing";
import { STUDENT, ROADMAP, STRENGTHS, GAPS, RESOURCES, PROJECTS } from "../../data/mockData";

export function DashboardView({ go }) {
  const stats = [
    { label: "Overall career readiness", value: 72, icon: Compass, tone: "cyan" },
    { label: "Learning progress", value: 64, icon: TrendingUp, tone: "violet" },
    { label: "Skills mastered", value: 18, icon: Radar, tone: "green", raw: true },
    { label: "Current streak", value: 12, icon: Flame, tone: "amber", raw: true, suffix: " days" },
  ];
  return (
    <div className="space-y-8">
      <GlassCard strong className="p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="lp-display text-xl md:text-2xl font-semibold">Good morning, {STUDENT.name} 👋</h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>Your AI learning companion has identified 4 priority areas for you today.</p>
        </div>
        <button onClick={() => go("profile")} className="lp-btn-primary px-5 py-2.5 rounded-lg text-sm whitespace-nowrap cursor-pointer">Take today's assessment</button>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <GlassCard key={s.label} hover className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(34,211,238,0.1)" }}>
                <s.icon size={16} color="#67e8f9" />
              </div>
            </div>
            <p className="lp-display text-2xl font-semibold"><AnimatedCounter to={s.value} suffix={s.raw ? (s.suffix || "") : "%"} /></p>
            <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>{s.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2" hover>
          <SectionHeader title="Your personalized roadmap" subtitle="AI/ML Engineer track" action={
            <button onClick={() => go("roadmap")} className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "#67e8f9" }}>View full roadmap <ChevronRight size={13} /></button>
          } />
          <div className="space-y-3">
            {ROADMAP.slice(2, 6).map(m => (
              <div key={m.id} className="flex items-center gap-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <StatusDot status={m.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>{m.duration} · {m.difficulty}</p>
                </div>
                {m.status === "in-progress" && <span className="text-xs shrink-0" style={{ color: "#67e8f9" }}>{m.progress}%</span>}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover>
          <SectionHeader title="Skill gap analysis" />
          <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}><CheckCircle2 size={13} /> Strengths</p>
          <div className="flex flex-wrap gap-1.5 mb-4">{STRENGTHS.map(s => <Pill key={s} tone="green">{s}</Pill>)}</div>
          <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#fbbf24" }}><AlertTriangle size={13} /> Gaps</p>
          <div className="flex flex-wrap gap-1.5">{GAPS.map(s => <Pill key={s} tone="amber">{s}</Pill>)}</div>
          <button onClick={() => go("profile")} className="text-xs flex items-center gap-1 mt-5 cursor-pointer" style={{ color: "#67e8f9" }}>Full skill profile <ChevronRight size={13} /></button>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2" hover>
          <SectionHeader title="AI recommendations" subtitle="Matched to your current skill gaps" action={
            <button onClick={() => go("resources")} className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "#67e8f9" }}>All resources <ChevronRight size={13} /></button>
          } />
          <div className="grid sm:grid-cols-2 gap-3">
            {RESOURCES.slice(0, 4).map(r => (
              <div key={r.id} className="p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <Pill tone="cyan">{r.match}% match</Pill>
                  <span className="text-xs" style={{ color: "var(--text-dim)" }}>{r.time}</span>
                </div>
                <p className="text-sm font-medium lp-line-clamp-2">{r.title}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col" hover>
          <SectionHeader title="Upcoming assessment" />
          <div className="flex-1 flex flex-col items-center justify-center text-center py-2">
            <Sparkles size={26} color="#67e8f9" className="mb-3" />
            <p className="text-sm font-medium mb-1">Adaptive Knowledge Check</p>
            <p className="text-xs mb-5" style={{ color: "var(--text-dim)" }}>6 questions · ~10 minutes · Statistics & ML focus</p>
            <button onClick={() => go("profile")} className="lp-btn-primary px-5 py-2.5 rounded-lg text-sm w-full cursor-pointer">Start assessment</button>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover>
          <SectionHeader title="Recommended projects" action={<button onClick={() => go("projects")} className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "#67e8f9" }}>All projects <ChevronRight size={13} /></button>} />
          {PROJECTS.slice(0, 2).map(p => (
            <div key={p.id} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>{p.skills.slice(0, 3).join(" • ")}</p>
              </div>
              <Pill tone="cyan">{p.match}%</Pill>
            </div>
          ))}
        </GlassCard>

        <GlassCard className="p-6" hover>
          <SectionHeader title="Career readiness" action={<button onClick={() => go("career")} className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "#67e8f9" }}>Details <ChevronRight size={13} /></button>} />
          <div className="flex items-center gap-6">
            <ProgressRing value={72} size={96} stroke={8} sublabel="ready" />
            <div className="flex-1 space-y-2">
              <p className="text-sm">Target: <span className="font-medium">{STUDENT.targetCareer}</span></p>
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
