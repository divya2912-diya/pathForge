import React from "react";
import { CheckCircle2, XCircle, Bot } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import ProgressRing from "../ui/ProgressRing";
import { CAREER_SKILLS } from "../../data/mockData";

export function CareerView() {
  const matched = CAREER_SKILLS.filter(s => s.have).length;
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Career intelligence" title="Target career: AI / ML Engineer" />
      <div className="grid sm:grid-cols-3 gap-4">
        <GlassCard strong className="p-6 flex flex-col items-center"><ProgressRing value={94} size={100} stroke={9} sublabel="career match" tone="#22d3ee" /></GlassCard>
        <GlassCard strong className="p-6 flex flex-col items-center"><ProgressRing value={72} size={100} stroke={9} sublabel="readiness" tone="#8b5cf6" /></GlassCard>
        <GlassCard className="p-6 flex flex-col justify-center items-center text-center">
          <p className="lp-display text-2xl font-semibold">{matched}<span className="text-base" style={{ color: "var(--text-dim)" }}>/{CAREER_SKILLS.length}</span></p>
          <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>skills matched</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <SectionHeader title="Skills comparison" subtitle="Your skills vs. industry requirements" />
        <div className="space-y-2">
          {CAREER_SKILLS.map(s => (
            <div key={s.skill} className="flex items-center justify-between py-2.5 px-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-sm">{s.skill}</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-xs w-24" style={{ color: s.have ? "#6ee7b7" : "#f87171" }}>
                  {s.have ? <CheckCircle2 size={14} /> : <XCircle size={14} />} You
                </div>
                <div className="flex items-center gap-1.5 text-xs w-24" style={{ color: "#6ee7b7" }}>
                  <CheckCircle2 size={14} /> Required
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard strong className="p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(34,211,238,0.12)" }}>
          <Bot size={18} color="#67e8f9" />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">AI career advice</p>
          <p className="text-sm" style={{ color: "#c7cede" }}>
            You're 72% ready for your target role. Focus on Docker, System Design and Deep Learning over the next 6 weeks to close the largest gaps.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

export default CareerView;
