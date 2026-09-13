import React, { useState } from "react";
import { ArrowLeft, CheckCircle2, AlertTriangle, Award } from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar,
  ResponsiveContainer, Tooltip as RTooltip
} from "recharts";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import Pill from "../ui/Pill";
import ProgressBar from "../ui/ProgressBar";
import ProgressRing from "../ui/ProgressRing";
import AssessmentView from "./AssessmentView";
import {
  STUDENT, PREVIOUS_LEARNING, SKILL_GROUPS, RADAR_DATA, STRENGTHS, GAPS,
  OWNED_PROJECTS, OWNED_CERTIFICATIONS, INTERESTS
} from "../../data/mockData";

export function ProfileView() {
  const [showAssessment, setShowAssessment] = useState(false);

  if (showAssessment) {
    return (
      <div className="space-y-6">
        <button onClick={() => setShowAssessment(false)} className="flex items-center gap-1.5 text-sm cursor-pointer" style={{ color: "var(--text-dim)" }}>
          <ArrowLeft size={15} /> Back to profile
        </button>
        <AssessmentView />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GlassCard strong className="p-6 md:p-7 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-semibold shrink-0" style={{ background: "linear-gradient(135deg,#22d3ee,#8b5cf6)", color: "#04121a" }}>
          {STUDENT.name[0]}
        </div>
        <div>
          <h2 className="lp-display text-xl font-semibold">{STUDENT.name}</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-dim)" }}>{STUDENT.degree} · {STUDENT.year}</p>
          <div className="flex items-center gap-2 mt-2">
            <Pill tone="violet">Target: {STUDENT.targetCareer}</Pill>
            <Pill tone="cyan">94% career match</Pill>
          </div>
        </div>
      </GlassCard>

      <p className="text-sm max-w-3xl" style={{ color: "var(--text-dim)" }}>
        This profile combines your academic background, previous learning, technical skills, projects, certifications, interests, assessments and
        career aspirations to generate your adaptive learning pathway, recommend personalized resources, identify skill gaps, validate conceptual
        understanding and drive your AI career guidance.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover>
          <SectionHeader title="Academic profile" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}><span style={{ color: "var(--text-dim)" }}>Degree</span><span>{STUDENT.degree}</span></div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}><span style={{ color: "var(--text-dim)" }}>Year</span><span>{STUDENT.year}</span></div>
            <div className="flex justify-between py-1.5"><span style={{ color: "var(--text-dim)" }}>Target career</span><span>{STUDENT.targetCareer}</span></div>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover>
          <SectionHeader title="Previous learning" />
          <div className="space-y-2.5">
            {PREVIOUS_LEARNING.map(c => (
              <div key={c.title} className="flex items-start gap-2.5">
                <CheckCircle2 size={15} color="#34d399" className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm">{c.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>{c.provider} · {c.when}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6" hover>
        <SectionHeader title="Technical skills" subtitle="Detected from courses, projects, certifications and assessments" />
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            {SKILL_GROUPS.map((g, gi) => (
              <div key={g.name} className="mb-5 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{g.name}</span>
                  <span className="text-sm" style={{ color: "#67e8f9" }}>{g.level}%</span>
                </div>
                <ProgressBar value={g.level} tone="cyan" height={8} delay={gi * 80} />
              </div>
            ))}
            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="text-xs mr-1 flex items-center gap-1" style={{ color: "#6ee7b7" }}><CheckCircle2 size={13} /></span>
              {STRENGTHS.map(s => <Pill key={s} tone="green">{s}</Pill>)}
              {GAPS.map(s => <Pill key={s} tone="amber">{s}</Pill>)}
            </div>
          </div>
          <div className="lg:col-span-2" style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <RadarChart data={RADAR_DATA} outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.12)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#8b93a7", fontSize: 10 }} />
                <RechartsRadar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.28} />
                <RTooltip contentStyle={{ background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover>
          <SectionHeader title="Projects" />
          <div className="space-y-3">
            {OWNED_PROJECTS.map(p => (
              <div key={p.title} className="py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover>
          <SectionHeader title="Certifications" />
          <div className="space-y-3 mb-5">
            {OWNED_CERTIFICATIONS.map(c => (
              <div key={c.title} className="flex items-center gap-2.5">
                <Award size={15} color="#c4b5fd" className="shrink-0" />
                <div>
                  <p className="text-sm">{c.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>{c.provider}</p>
                </div>
              </div>
            ))}
          </div>
          <SectionHeader title="Interests" />
          <div className="flex flex-wrap gap-1.5">{INTERESTS.map(i => <Pill key={i} tone="violet">{i}</Pill>)}</div>
        </GlassCard>
      </div>

      <GlassCard className="p-6" hover>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <SectionHeader title="Assessments" subtitle="Latest knowledge validation results" />
          <button onClick={() => setShowAssessment(true)} className="lp-btn-primary px-4 py-2 rounded-lg text-sm cursor-pointer">Take new assessment</button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ProgressRing value={78} size={96} stroke={8} sublabel="last score" />
          <div className="flex-1 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}><CheckCircle2 size={13} /> Strong</p>
              <div className="flex flex-wrap gap-1.5">{["Python", "OOP"].map(s => <Pill key={s} tone="green">{s}</Pill>)}</div>
            </div>
            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#fbbf24" }}><AlertTriangle size={13} /> Needs improvement</p>
              <div className="flex flex-wrap gap-1.5">{["SQL joins", "Probability"].map(s => <Pill key={s} tone="amber">{s}</Pill>)}</div>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard strong className="p-6" hover>
        <SectionHeader title="Career aspirations" />
        <div className="flex flex-wrap items-center gap-8">
          <div><p className="lp-display text-xl font-semibold">{STUDENT.targetCareer}</p><p className="text-xs" style={{ color: "var(--text-dim)" }}>Target career</p></div>
          <div><p className="lp-display text-xl font-semibold" style={{ color: "#67e8f9" }}>94%</p><p className="text-xs" style={{ color: "var(--text-dim)" }}>Career match</p></div>
          <div><p className="lp-display text-xl font-semibold" style={{ color: "#c4b5fd" }}>72%</p><p className="text-xs" style={{ color: "var(--text-dim)" }}>Readiness</p></div>
        </div>
      </GlassCard>
    </div>
  );
}

export default ProfileView;
