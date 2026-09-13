import React, { useState } from "react";
import { UploadCloud, Loader2, AlertTriangle, Sparkles, ChevronRight, RefreshCw } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import ProgressRing from "../ui/ProgressRing";
import ProgressBar from "../ui/ProgressBar";
import Pill from "../ui/Pill";

export function ResumeView() {
  const [phase, setPhase] = useState("idle"); // idle | analyzing | results
  const [fileName, setFileName] = useState(null);

  const analyze = () => { setPhase("analyzing"); setTimeout(() => setPhase("results"), 1800); };

  if (phase === "idle") {
    return (
      <div className="max-w-xl mx-auto">
        <SectionHeader eyebrow="Resume intelligence" title="Analyze your resume" subtitle="Simulated ATS scoring and skill-gap analysis against your target role." />
        <GlassCard strong className="p-10 text-center border-dashed">
          <UploadCloud size={30} color="#67e8f9" className="mx-auto mb-4" />
          <p className="text-sm mb-1">{fileName || "Drop your resume here, or browse"}</p>
          <p className="text-xs mb-6" style={{ color: "var(--text-dim)" }}>PDF or DOCX, up to 5MB</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setFileName("Alex_Resume_2026.pdf")} className="lp-btn-ghost px-5 py-2.5 rounded-lg text-sm cursor-pointer">Choose file</button>
            <button onClick={analyze} disabled={!fileName} className="lp-btn-primary px-5 py-2.5 rounded-lg text-sm cursor-pointer" style={{ opacity: fileName ? 1 : 0.4, pointerEvents: fileName ? "auto" : "none" }}>Analyze resume</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (phase === "analyzing") {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <Loader2 size={30} color="#67e8f9" className="animate-spin mb-4" />
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>Parsing {fileName} against AI/ML Engineer requirements...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SectionHeader eyebrow="Results" title="Resume analysis" />
      <div className="grid sm:grid-cols-3 gap-4">
        <GlassCard strong className="p-6 flex flex-col items-center">
          <ProgressRing value={78} size={100} stroke={9} sublabel="ATS score" tone="#22d3ee" />
        </GlassCard>
        <GlassCard className="p-6 flex flex-col justify-center">
          <p className="text-xs mb-1" style={{ color: "var(--text-dim)" }}>Technical skills</p>
          <p className="lp-display text-2xl font-semibold mb-2">8<span className="text-base" style={{ color: "var(--text-dim)" }}>/12 required</span></p>
          <ProgressBar value={67} tone="cyan" height={6} />
        </GlassCard>
        <GlassCard className="p-6 flex flex-col justify-center">
          <p className="text-xs mb-1" style={{ color: "var(--text-dim)" }}>Soft skills</p>
          <p className="lp-display text-2xl font-semibold mb-2">4<span className="text-base" style={{ color: "var(--text-dim)" }}>/7 required</span></p>
          <ProgressBar value={57} tone="violet" height={6} />
        </GlassCard>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <GlassCard className="p-6">
          <p className="text-xs font-medium mb-3 flex items-center gap-1.5" style={{ color: "#fbbf24" }}><AlertTriangle size={14} /> Missing skills</p>
          <div className="flex flex-wrap gap-1.5">{["Docker", "Kubernetes", "System Design"].map(s => <Pill key={s} tone="amber">{s}</Pill>)}</div>
        </GlassCard>
        <GlassCard className="p-6">
          <p className="text-xs font-medium mb-3 flex items-center gap-1.5" style={{ color: "#67e8f9" }}><Sparkles size={14} /> Suggested improvements</p>
          <ul className="space-y-2 text-sm" style={{ color: "#c7cede" }}>
            {["Add measurable project outcomes", "Expand technical skills section", "Add a relevant certification", "Link your GitHub projects"].map(t => (
              <li key={t} className="flex items-start gap-2"><ChevronRight size={13} className="mt-0.5 shrink-0" style={{ color: "#67e8f9" }} /> {t}</li>
            ))}
          </ul>
        </GlassCard>
      </div>
      <button onClick={() => setPhase("idle")} className="lp-btn-ghost px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 w-fit cursor-pointer"><RefreshCw size={14} /> Analyze another resume</button>
    </div>
  );
}

export default ResumeView;
