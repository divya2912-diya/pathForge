import React, { useState } from "react";
import {
  Clock, ChevronDown, Target, TrendingUp, Sparkles, CheckCircle2,
  FolderKanban, ArrowRight, ShieldCheck, Zap, Briefcase, DollarSign
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import StatusDot from "../ui/StatusDot";
import Pill from "../ui/Pill";
import ProgressBar from "../ui/ProgressBar";
import { STUDENT, GAP_TO_HIRE_PLAN } from "../../data/mockData";

export function RoadmapView() {
  const [expanded, setExpanded] = useState(1);
  const [tab, setTab] = useState("all"); // all | active | foundational

  const plan = GAP_TO_HIRE_PLAN;
  const overview = plan.roleOverview;

  const displayMilestones = tab === "foundational"
    ? []
    : tab === "active"
      ? plan.milestones.filter(m => m.status !== "done")
      : plan.milestones;

  return (
    <div className="space-y-7">
      {/* Header */}
      <SectionHeader
        eyebrow="CAREER ACCELERATOR BLUEPRINT"
        title={`Role Gap-to-Hire Action Plan: ${overview.targetRole}`}
        subtitle={`A prioritized hiring roadmap bridging your current skills (${STUDENT.name}) directly to top-tier ${overview.targetRole} job postings.`}
      />

      {/* Market Intelligence Hero Card */}
      <GlassCard strong className="p-6 md:p-8 relative overflow-hidden" hover>
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.14), transparent 70%)" }}
        />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Target Role: {overview.targetRole}
                </span>
                <span className="text-xs text-slate-400">· Timeline: {overview.timeline}</span>
              </div>
              <h2 className="lp-display text-2xl font-bold text-white">4 Actionable Steps to Reach 94% Hireability</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-right">
                <p className="text-[11px] text-slate-400">Avg. Market Salary</p>
                <p className="lp-display text-lg font-bold text-emerald-400">{overview.avgSalary}</p>
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Readiness Trajectory</span>
              <span className="text-cyan-400 font-semibold">{overview.baselineScore}% Baseline → {overview.projectedScore}% Fully Qualified</span>
            </div>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 bottom-0 rounded-full transition-all duration-1000"
                style={{ width: "72%", background: "linear-gradient(90deg, #22d3ee, #8b5cf6)" }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
              <span>Current: 72%</span>
              <span>Step 1: +8%</span>
              <span>Step 2: +7%</span>
              <span>Step 3: +4%</span>
              <span className="text-emerald-400 font-bold">Target: 94%</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setTab("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            tab === "all" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
          }`}
        >
          All Milestones ({plan.milestones.length})
        </button>
        <button
          onClick={() => setTab("active")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            tab === "active" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
          }`}
        >
          Active Gaps ({plan.milestones.filter(m => m.status !== "done").length})
        </button>
        <button
          onClick={() => setTab("foundational")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            tab === "foundational" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
          }`}
        >
          Foundational Credits ({plan.foundationalCompleted.length})
        </button>
      </div>

      {/* Action Milestones Timeline */}
      {tab !== "foundational" && (
        <div className="relative pl-8 space-y-5">
          <div
            className="absolute left-[15px] top-4 bottom-4 w-0.5"
            style={{ background: "linear-gradient(180deg, rgba(34,211,238,0.7), rgba(139,92,246,0.6), rgba(255,255,255,0.1))" }}
          />

          {displayMilestones.map((m) => {
            const isOpen = expanded === m.id;
            return (
              <div key={m.id} className="relative">
                <div className="absolute -left-[29px] top-5 z-10">
                  <StatusDot status={m.status} />
                </div>

                <GlassCard hover className={`p-5 md:p-6 transition-all ${m.status === "locked" ? "opacity-75" : ""}`}>
                  <div
                    onClick={() => setExpanded(isOpen ? null : m.id)}
                    className="w-full flex items-start justify-between gap-4 text-left cursor-pointer"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <span className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5" style={{ background: "rgba(34,211,238,0.12)", color: "#67e8f9", border: "1px solid rgba(34,211,238,0.25)" }}>
                        0{m.step}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="lp-display text-base font-semibold text-white">{m.title}</h3>
                          <Pill tone={m.priorityTone}>{m.priority}</Pill>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            {m.boost} Hireability ({m.scoreRange})
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1"><Clock size={12} /> {m.duration}</span>
                          <span>·</span>
                          <span className="text-cyan-300 font-medium">Required Project: {m.project}</span>
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      size={20}
                      className="shrink-0 text-slate-400 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                    />
                  </div>

                  {m.status === "in-progress" && (
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Milestone Progress</span>
                        <span className="text-cyan-400 font-semibold">{m.progress}%</span>
                      </div>
                      <ProgressBar value={m.progress} tone="cyan" height={6} />
                    </div>
                  )}

                  {isOpen && (
                    <div className="mt-5 pt-4 space-y-4 lp-fade-up" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <p className="text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                            <Target size={13} /> Identified Skill Gap
                          </p>
                          <p className="text-xs text-slate-300 leading-relaxed">{m.gap}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <p className="text-xs font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                            <Briefcase size={13} /> Why Top Companies Test This
                          </p>
                          <p className="text-xs text-slate-300 leading-relaxed">{m.whyCompaniesTest}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-300 mb-2">Key Skills Unlocked</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.skills.map((sk) => (
                            <Pill key={sk} tone="cyan">{sk}</Pill>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <FolderKanban size={14} className="text-violet-400" />
                          <span>Deliverable: <strong>{m.project}</strong></span>
                        </div>
                        <button className="lp-btn-primary px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer">
                          <span>{m.status === "in-progress" ? "Continue Sprint" : "Start Milestone"}</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </div>
            );
          })}
        </div>
      )}

      {/* Foundational Completed Credits View */}
      {(tab === "foundational" || tab === "all") && (
        <div className="space-y-3 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" /> Foundational Credits Completed
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {plan.foundationalCompleted.map((f) => (
              <GlassCard key={f.id} className="p-4" hover>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{f.provider} · {f.duration}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {f.score}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RoadmapView;
