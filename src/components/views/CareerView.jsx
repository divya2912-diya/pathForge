import React from "react";
import { CheckCircle2, XCircle, Bot, TrendingUp } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import ProgressRing from "../ui/ProgressRing";
import { SKILL_REQUIREMENTS, getStrengthsAndGaps } from "../../data/userProfile";

export function CareerView({ student }) {
  const targetCareer = student?.targetCareer || "Software Engineer";
  const userSkills = student?.skills || [];
  const careerReadiness = student?.careerReadiness ?? 50;

  const required = SKILL_REQUIREMENTS[targetCareer] || [];
  const { strengths, gaps } = getStrengthsAndGaps(userSkills, targetCareer);
  const matchedCount = required.filter(r =>
    userSkills.some(s =>
      r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())
    )
  ).length;
  const matchPct = Math.round((matchedCount / Math.max(required.length, 1)) * 100);

  // Build full skills comparison list
  const skillsComparison = required.map(r => ({
    skill: r,
    have: userSkills.some(s =>
      r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())
    ),
  }));

  const advice = gaps.length > 0
    ? `You're ${careerReadiness}% ready for ${targetCareer}. Focus on ${gaps.slice(0, 3).join(", ")} over the next several weeks to close the largest gaps and unlock significantly more job matches.`
    : `You're ${careerReadiness}% ready for ${targetCareer}. You have strong foundational skills! Keep building your portfolio with projects and certifications to stand out to recruiters.`;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Career intelligence"
        title={`Target career: ${targetCareer}`}
        subtitle="Your current readiness compared against industry requirements."
      />

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-3 gap-4">
        <GlassCard strong className="p-6 flex flex-col items-center">
          <p className="text-xs text-slate-400 mb-3">Career match</p>
          <ProgressRing value={matchPct} size={100} stroke={9} sublabel="career match" tone="#22d3ee" />
        </GlassCard>
        <GlassCard strong className="p-6 flex flex-col items-center">
          <p className="text-xs text-slate-400 mb-3">Readiness</p>
          <ProgressRing value={careerReadiness} size={100} stroke={9} sublabel="readiness" tone="#8b5cf6" />
        </GlassCard>
        <GlassCard className="p-6 flex flex-col justify-center items-center text-center">
          <p className="lp-display text-2xl font-semibold">
            {matchedCount}<span className="text-base" style={{ color: "var(--text-dim)" }}>/{required.length}</span>
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>skills matched</p>
          {gaps.length > 0 && (
            <p className="text-xs mt-2 text-amber-400">{gaps.length} gaps to close</p>
          )}
        </GlassCard>
      </div>

      {/* Skills comparison */}
      <GlassCard className="p-6">
        <SectionHeader
          title="Skills comparison"
          subtitle={`Your skills vs. ${targetCareer} industry requirements`}
        />
        <div className="space-y-0">
          {skillsComparison.map(s => (
            <div
              key={s.skill}
              className="flex items-center justify-between py-2.5 px-1"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-sm">{s.skill}</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-xs w-24" style={{ color: s.have ? "#6ee7b7" : "#f87171" }}>
                  {s.have ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {s.have ? "You have it" : "Gap"}
                </div>
                <div className="flex items-center gap-1.5 text-xs w-24" style={{ color: "#6ee7b7" }}>
                  <CheckCircle2 size={14} /> Required
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* AI Career Advice */}
      <GlassCard strong className="p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(34,211,238,0.12)" }}>
          <Bot size={18} color="#67e8f9" />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">AI career advice</p>
          <p className="text-sm" style={{ color: "#c7cede" }}>{advice}</p>
        </div>
      </GlassCard>

      {/* Gap closure tips */}
      {gaps.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} color="#67e8f9" />
            <p className="text-sm font-semibold">How to close your gaps</p>
          </div>
          <div className="space-y-3">
            {gaps.slice(0, 4).map((gap, i) => (
              <div key={gap} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: "rgba(34,211,238,0.15)", color: "#67e8f9" }}>
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{gap}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Complete the related roadmap milestone to close this gap and increase your hireability.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

export default CareerView;
