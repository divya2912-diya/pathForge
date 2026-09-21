import React, { useState, useRef } from "react";
import {
  UploadCloud, Loader2, AlertTriangle, Sparkles, ChevronRight,
  RefreshCw, FileText, X, CheckCircle2
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import ProgressRing from "../ui/ProgressRing";
import ProgressBar from "../ui/ProgressBar";
import Pill from "../ui/Pill";
import { SKILL_REQUIREMENTS } from "../../data/userProfile";

export function ResumeView({ student }) {
  const [phase, setPhase] = useState("idle"); // idle | analyzing | results
  const [fileInfo, setFileInfo] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const targetCareer = student?.targetCareer || "Software Engineer";
  const userSkills = student?.skills || [];
  const required = SKILL_REQUIREMENTS[targetCareer] || [];

  // Calculate personalized analysis results
  const matched = userSkills.filter(s =>
    required.some(r =>
      r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())
    )
  );
  const missing = required.filter(r =>
    !userSkills.some(s =>
      r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())
    )
  );

  const atsScore = Math.min(95, Math.max(30, Math.round(
    (matched.length / Math.max(required.length, 1)) * 100 * 0.8 + 15
  )));
  const techScore = Math.round((matched.length / Math.max(required.length, 1)) * 100);

  const handleFile = (file) => {
    if (!file) return;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(file.type) && !["pdf", "doc", "docx"].includes(ext)) {
      alert("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeKB = (file.size / 1024).toFixed(0);
    setFileInfo({
      name: file.name,
      size: file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`,
      type: ext.toUpperCase(),
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const analyze = () => {
    setPhase("analyzing");
    setTimeout(() => setPhase("results"), 2000);
  };

  const reset = () => {
    setPhase("idle");
    setFileInfo(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Suggestions based on missing skills
  const suggestions = [
    missing.length > 0 && `Add these missing skills to your resume: ${missing.slice(0, 3).join(", ")}`,
    "Add measurable outcomes to your project descriptions (e.g., '↑ accuracy by 12%')",
    "Include links to GitHub repositories and live demo URLs",
    userSkills.length < 5 && "Expand your technical skills section with more technologies",
    "Add a brief professional summary targeting your role as a " + targetCareer,
  ].filter(Boolean).slice(0, 4);

  if (phase === "idle") {
    return (
      <div className="max-w-xl mx-auto">
        <SectionHeader
          eyebrow="Resume intelligence"
          title="Analyze your resume"
          subtitle={`ATS scoring and skill-gap analysis against ${targetCareer} requirements.`}
        />

        {/* Upload zone */}
        <div
          className="rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer"
          style={{
            background: dragOver ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.02)",
            border: `2px dashed ${dragOver ? "rgba(34,211,238,0.6)" : "rgba(255,255,255,0.15)"}`,
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !fileInfo && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            id="resume-file-input"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {fileInfo ? (
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)" }}>
                <FileText size={26} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-white">{fileInfo.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
                  {fileInfo.type} · {fileInfo.size}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 size={14} /> File ready for analysis
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFileInfo(null); }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mx-auto cursor-pointer"
              >
                <X size={12} /> Remove file
              </button>
            </div>
          ) : (
            <>
              <UploadCloud size={32} color={dragOver ? "#22d3ee" : "#67e8f9"} className="mx-auto mb-4" />
              <p className="text-sm font-medium mb-1">
                {dragOver ? "Drop your resume here" : "Drop your resume here, or click to browse"}
              </p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>PDF or DOCX · up to 5MB</p>
            </>
          )}
        </div>

        {fileInfo && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              id="btn-resume-change"
              onClick={() => inputRef.current?.click()}
              className="lp-btn-ghost px-5 py-2.5 rounded-lg text-sm cursor-pointer"
            >
              Change file
            </button>
            <button
              id="btn-resume-analyze"
              onClick={analyze}
              className="lp-btn-primary px-6 py-2.5 rounded-lg text-sm cursor-pointer"
            >
              Analyze resume
            </button>
          </div>
        )}

        {/* Target career info */}
        <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}>
          <p className="text-xs text-slate-400">Analyzing against your target role:</p>
          <p className="text-sm font-semibold text-cyan-300 mt-1">{targetCareer}</p>
          <p className="text-xs text-slate-500 mt-1">{required.length} required skills · {matched.length} already in your profile</p>
        </div>
      </div>
    );
  }

  if (phase === "analyzing") {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <Loader2 size={32} color="#67e8f9" className="animate-spin mb-5" />
        <p className="text-base font-medium text-white mb-2">Analyzing your resume...</p>
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>
          Matching {fileInfo?.name} against {targetCareer} requirements
        </p>
        <div className="mt-6 space-y-2 text-xs text-slate-500 text-left max-w-xs">
          {["Parsing document structure...", "Extracting skills & keywords...", "Comparing to job requirements...", "Generating improvement tips..."].map((msg, i) => (
            <p key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
              {msg}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // Results
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader eyebrow="Results" title="Resume analysis" />
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <FileText size={13} />
          {fileInfo?.name}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <GlassCard strong className="p-6 flex flex-col items-center">
          <p className="text-xs text-slate-400 mb-3">ATS Score</p>
          <ProgressRing value={atsScore} size={100} stroke={9} sublabel="ATS score" tone="#22d3ee" />
          <p className="text-xs mt-3 text-center" style={{ color: "var(--text-dim)" }}>
            {atsScore >= 75 ? "Above average — good match!" : atsScore >= 55 ? "Needs some work" : "Significant gaps found"}
          </p>
        </GlassCard>
        <GlassCard className="p-6 flex flex-col justify-center">
          <p className="text-xs mb-1" style={{ color: "var(--text-dim)" }}>Technical skills</p>
          <p className="lp-display text-2xl font-semibold mb-2">
            {matched.length}<span className="text-base" style={{ color: "var(--text-dim)" }}>/{required.length} required</span>
          </p>
          <ProgressBar value={techScore} tone="cyan" height={6} />
        </GlassCard>
        <GlassCard className="p-6 flex flex-col justify-center">
          <p className="text-xs mb-1" style={{ color: "var(--text-dim)" }}>Skills missing</p>
          <p className="lp-display text-2xl font-semibold mb-2 text-amber-400">
            {missing.length}<span className="text-base text-slate-400">/{required.length} required</span>
          </p>
          <ProgressBar value={Math.round((missing.length / Math.max(required.length, 1)) * 100)} tone="amber" height={6} />
        </GlassCard>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <GlassCard className="p-6">
          <p className="text-xs font-medium mb-3 flex items-center gap-1.5" style={{ color: "#fbbf24" }}>
            <AlertTriangle size={14} /> Missing skills
          </p>
          {missing.length > 0
            ? <div className="flex flex-wrap gap-1.5">{missing.slice(0, 6).map(s => <Pill key={s} tone="amber">{s}</Pill>)}</div>
            : <p className="text-sm text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={14} /> No critical gaps detected!</p>
          }
        </GlassCard>
        <GlassCard className="p-6">
          <p className="text-xs font-medium mb-3 flex items-center gap-1.5" style={{ color: "#67e8f9" }}>
            <Sparkles size={14} /> Suggested improvements
          </p>
          <ul className="space-y-2 text-sm" style={{ color: "#c7cede" }}>
            {suggestions.map(t => (
              <li key={t} className="flex items-start gap-2">
                <ChevronRight size={13} className="mt-0.5 shrink-0" style={{ color: "#67e8f9" }} />
                {t}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {matched.length > 0 && (
        <GlassCard className="p-5">
          <p className="text-xs font-medium mb-3 flex items-center gap-1.5" style={{ color: "#6ee7b7" }}>
            <CheckCircle2 size={14} /> Matching skills found
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matched.map(s => <Pill key={s} tone="green">{s}</Pill>)}
          </div>
        </GlassCard>
      )}

      <button
        id="btn-resume-reset"
        onClick={reset}
        className="lp-btn-ghost px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 w-fit cursor-pointer"
      >
        <RefreshCw size={14} /> Analyze another resume
      </button>
    </div>
  );
}

export default ResumeView;
