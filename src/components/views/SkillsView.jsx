import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar,
  ResponsiveContainer, Tooltip as RTooltip
} from "recharts";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import ProgressBar from "../ui/ProgressBar";
import Pill from "../ui/Pill";
import { SKILL_GROUPS, RADAR_DATA, STRENGTHS, GAPS } from "../../data/mockData";

export function SkillsView() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Skill intelligence" title="Your skill profile" subtitle="Detected from courses, projects, certifications and assessment results." />
      <div className="grid lg:grid-cols-5 gap-6">
        <GlassCard className="p-6 lg:col-span-3" hover>
          {SKILL_GROUPS.map((g, gi) => (
            <div key={g.name} className="mb-6 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{g.name}</span>
                <span className="text-sm" style={{ color: "#67e8f9" }}>{g.level}%</span>
              </div>
              <ProgressBar value={g.level} tone="cyan" height={9} delay={gi * 80} />
              <div className="mt-3 space-y-2.5 pl-1">
                {g.skills.map((s, si) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>{s.name}</span>
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>{s.level}%</span>
                    </div>
                    <ProgressBar value={s.level} tone={s.level > 60 ? "green" : s.level > 30 ? "cyan" : "amber"} height={6} delay={gi * 80 + si * 60} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </GlassCard>

        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6" hover>
            <SectionHeader title="Knowledge map" />
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer>
                <RadarChart data={RADAR_DATA} outerRadius="75%">
                  <PolarGrid stroke="rgba(255,255,255,0.12)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#8b93a7", fontSize: 11 }} />
                  <RechartsRadar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.28} />
                  <RTooltip contentStyle={{ background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <p className="text-xs font-medium mb-2.5 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}><CheckCircle2 size={14} /> Strengths</p>
            <div className="flex flex-wrap gap-1.5 mb-5">{STRENGTHS.map(s => <Pill key={s} tone="green">{s}</Pill>)}</div>
            <p className="text-xs font-medium mb-2.5 flex items-center gap-1.5" style={{ color: "#fbbf24" }}><AlertTriangle size={14} /> Skill gaps</p>
            <div className="flex flex-wrap gap-1.5">{GAPS.map(s => <Pill key={s} tone="amber">{s}</Pill>)}</div>
            <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--text-dim)" }}>Recommended starting point</p>
              <p className="text-sm font-medium">Statistics & Probability → Deep Learning</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default SkillsView;
