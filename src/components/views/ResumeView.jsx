import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud, Loader2, AlertTriangle, Sparkles, ChevronRight,
  RefreshCw, FileText, X, CheckCircle2, Target, Briefcase,
  ExternalLink, Layers, Search, FileCode2, Check, ArrowRight,
  BookOpen, Lock, Award, Zap, TrendingUp, Users, Brain,
  GitBranch, Shield, Star, Circle, ChevronDown, Info,
  AlertCircle, ThumbsUp, FolderOpen, Link2
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import ProgressRing from "../ui/ProgressRing";
import ProgressBar from "../ui/ProgressBar";
import Pill from "../ui/Pill";
import { extractTextFromPDF } from "../../utils/pdfParser";
import { runFullAdaptivePipeline } from "../../utils/resumeAnalysisEngine";

// ── STATUS COLORS & ICONS ─────────────────────────────────────

const statusConfig = {
  already_demonstrated: {
    bg: "bg-emerald-950/30",
    border: "border-emerald-500/40",
    text: "text-emerald-300",
    badge: "bg-emerald-500/20 text-emerald-300",
    label: "Already Demonstrated",
    icon: CheckCircle2,
  },
  completed: {
    bg: "bg-emerald-950/20",
    border: "border-emerald-500/30",
    text: "text-emerald-200",
    badge: "bg-emerald-500/15 text-emerald-300",
    label: "Completed",
    icon: Check,
  },
  in_progress: {
    bg: "bg-cyan-950/20",
    border: "border-cyan-500/30",
    text: "text-cyan-200",
    badge: "bg-cyan-500/15 text-cyan-300",
    label: "In Progress",
    icon: TrendingUp,
  },
  available: {
    bg: "bg-blue-950/20",
    border: "border-blue-500/30",
    text: "text-blue-200",
    badge: "bg-blue-500/15 text-blue-300",
    label: "Start Learning",
    icon: BookOpen,
  },
  locked: {
    bg: "bg-slate-900/30",
    border: "border-white/5",
    text: "text-slate-400",
    badge: "bg-white/5 text-slate-500",
    label: "Locked",
    icon: Lock,
  },
};

// ── PROFILE LEVEL BADGE ───────────────────────────────────────

function ProfileLevelBadge({ level, color, score }) {
  const levelIcons = {
    "Emerging": AlertTriangle,
    "Foundation": Star,
    "Developing": TrendingUp,
    "Career Ready": Award,
  };
  const LevelIcon = levelIcons[level] || Star;

  return (
    <div className="flex flex-col items-center gap-3 p-5 rounded-2xl border"
      style={{
        background: `${color}10`,
        borderColor: `${color}40`,
      }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
        <LevelIcon size={24} style={{ color }} />
      </div>
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Profile Level</p>
        <p className="text-xl font-black text-white mt-0.5">{level}</p>
      </div>
      <div className="w-full">
        <ProgressBar value={score} tone="cyan" height={6} />
        <p className="text-[10px] text-slate-400 text-center mt-1">{score}/100 readiness score</p>
      </div>
    </div>
  );
}

// ── SKILL NODE (ROADMAP PREVIEW) ──────────────────────────────

function RoadmapSkillNode({ node }) {
  const cfg = statusConfig[node.status] || statusConfig.locked;
  const Icon = cfg.icon;

  return (
    <div className={`p-3 rounded-xl border ${cfg.bg} ${cfg.border} flex items-start gap-3 transition-all`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} border ${cfg.border}`}>
        <Icon size={13} className={cfg.text} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`text-xs font-bold truncate ${cfg.text}`}>{node.title}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>
        {node.desc && (
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{node.desc}</p>
        )}
      </div>
    </div>
  );
}

// ── MAIN RESUME VIEW ──────────────────────────────────────────

export function ResumeView({ student, onUpdateStudent, go }) {
  const [phase, setPhase] = useState("idle"); // idle | analyzing | results
  const [analysisMode, setAnalysisMode] = useState("career");
  const [jobDescriptionInput, setJobDescriptionInput] = useState("");
  const [analyzeStepIndex, setAnalyzeStepIndex] = useState(0);

  const [fileInfo, setFileInfo] = useState(student?.resumeFile || null);
  const [extractedText, setExtractedText] = useState(student?.resumeText || "");
  const [rawFile, setRawFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Full analysis result (persisted per user)
  const [analysisResult, setAnalysisResult] = useState(
    student?.resumeAnalysis?.evidence ? student.resumeAnalysis : null
  );

  // Collapsible roadmap
  const [showFullRoadmap, setShowFullRoadmap] = useState(false);
  const [showRawEvidence, setShowRawEvidence] = useState(false);

  const inputRef = useRef(null);

  const targetCareer = student?.targetCareer;

  // Keep in sync if student prop changes (e.g. re-upload)
  useEffect(() => {
    if (student?.resumeFile && !fileInfo) {
      setFileInfo(student.resumeFile);
    }
    if (student?.resumeText && !extractedText) {
      setExtractedText(student.resumeText);
    }
    if (student?.resumeAnalysis?.evidence && !analysisResult) {
      setAnalysisResult(student.resumeAnalysis);
    }
  }, [student]);

  // ── FILE HANDLER ──────────────────────────────────────────

  const handleFile = async (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
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
    const info = {
      name: file.name,
      size: file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`,
      type: ext.toUpperCase(),
      updatedAt: new Date().toLocaleDateString(),
    };

    setRawFile(file);
    setFileInfo(info);
    setAnalysisResult(null); // Reset previous analysis

    try {
      let text = "";
      if (ext === "pdf") {
        text = await extractTextFromPDF(file);
      } else {
        // For DOCX/DOC — extract raw text (best effort)
        text = await file.text();
      }
      setExtractedText(text);
      onUpdateStudent?.(
        { resumeFile: info, resumeText: text, resumeAnalysis: null },
        "Resume file ready!"
      );
    } catch (err) {
      console.error("Text extraction error:", err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // ── ANALYSIS PIPELINE ─────────────────────────────────────

  const ANALYSIS_STEPS = [
    "Extracting full resume text...",
    "Detecting sections (education, projects, experience)...",
    "Identifying verified skills from evidence...",
    "Parsing project technologies...",
    "Matching against target career requirements...",
    "Computing skill gap analysis with evidence...",
    "Calculating adaptive profile level...",
    "Generating personalized roadmap nodes...",
    "Determining next best action...",
    "Finalizing analysis...",
  ];

  const analyzeResume = async () => {
    if (!extractedText && !rawFile) {
      alert("Please upload a resume file first.");
      return;
    }
    setPhase("analyzing");
    setAnalyzeStepIndex(0);

    try {
      let text = extractedText;
      if (!text && rawFile) {
        const ext = fileInfo?.type?.toLowerCase();
        if (ext === "pdf") text = await extractTextFromPDF(rawFile);
        else text = await rawFile.text();
      }

      // Animate through steps
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        setAnalyzeStepIndex(i);
        await new Promise((r) => setTimeout(r, 300));
      }

      // Determine target career for analysis
      let analysisTargetCareer = targetCareer || "Software Engineer";
      if (analysisMode === "job-description" && jobDescriptionInput.trim()) {
        // For JD mode, still use target career but note the JD
        analysisTargetCareer = targetCareer || "Software Engineer";
      }

      // Run the full adaptive pipeline
      const result = runFullAdaptivePipeline(text, analysisTargetCareer);

      if (!result.success) {
        alert(result.error || "Analysis failed. Check the resume content.");
        setPhase("idle");
        return;
      }

      // Store per-user (merged into student object)
      const analysisToStore = {
        ...result,
        fileName: fileInfo?.name,
        analyzedTarget: analysisTargetCareer,
        analyzedAt: new Date().toISOString(),
      };

      setAnalysisResult(analysisToStore);
      onUpdateStudent?.(
        {
          resumeFile: fileInfo,
          resumeText: text,
          resumeAnalysis: analysisToStore,
          // Auto-sync verified skills back into profile
          skills: [
            ...(student?.skills || []),
            ...result.evidence.verifiedSkills.filter(
              (s) => !(student?.skills || []).includes(s)
            ),
          ],
        },
        "Resume analysis complete! Profile updated with verified skills."
      );

      setPhase("results");
    } catch (err) {
      console.error("Resume analysis error:", err);
      alert("Analysis failed. Please verify the file is a readable PDF or DOCX.");
      setPhase("idle");
    }
  };

  const reset = () => {
    setPhase("idle");
    setAnalysisResult(null);
  };

  const removeFile = (e) => {
    e?.stopPropagation();
    setFileInfo(null);
    setRawFile(null);
    setExtractedText("");
    setAnalysisResult(null);
    onUpdateStudent?.(
      { resumeFile: null, resumeText: null, resumeAnalysis: null },
      "Resume removed"
    );
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── RENDER: RESULTS ───────────────────────────────────────

  const renderResults = () => {
    if (!analysisResult || !analysisResult.evidence) return null;
    const { evidence, gapAnalysis, profileLevel, adaptiveRoadmap, rationale, nextAction } = analysisResult;

    const demonstratedNodes = adaptiveRoadmap.filter((n) => n.type === "demonstrated");
    const gapNodes = adaptiveRoadmap.filter((n) => n.type === "gap");
    const partialNodes = adaptiveRoadmap.filter((n) => n.type === "partial");
    const totalNodes = adaptiveRoadmap.length;
    const completedNodes = adaptiveRoadmap.filter((n) =>
      n.status === "already_demonstrated" || n.status === "completed"
    ).length;

    return (
      <div className="space-y-6 max-w-5xl mx-auto">

        {/* Top Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FileText size={14} className="text-cyan-400" />
            Analyzed: <span className="text-white font-bold">{fileInfo?.name}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Target: <span className="text-cyan-300 font-semibold">{gapAnalysis.targetCareer}</span></span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">{new Date(analysisResult.analyzedAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => go?.("roadmap")}
              className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRight size={13} /> Go to Full Roadmap
            </button>
            <button
              onClick={reset}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={12} /> Re-analyze
            </button>
          </div>
        </div>

        {/* ── SECTION 1: RESUME SUMMARY ──────────────────── */}
        <GlassCard strong className="p-6">
          <SectionHeader
            eyebrow="RESUME SUMMARY"
            title="What We Found in Your Resume"
            subtitle="All data extracted exclusively from your uploaded resume. No assumptions made."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">

            {/* Profile Level */}
            {profileLevel && (
              <ProfileLevelBadge
                level={profileLevel.level}
                color={profileLevel.levelColor}
                score={profileLevel.normalizedScore}
              />
            )}

            {/* Contact & Links */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Link2 size={13} /> Contact & Links
              </p>
              {[
                { label: "Email", val: evidence.contactInfo.email },
                { label: "Phone", val: evidence.contactInfo.phone },
                { label: "LinkedIn", val: evidence.contactInfo.linkedin },
                { label: "GitHub", val: evidence.contactInfo.github },
                { label: "Portfolio", val: evidence.contactInfo.portfolio },
              ].map(({ label, val }) => (
                <div key={label}>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">{label}: </span>
                  <span className={`text-xs font-medium ${val.includes("Not found") ? "text-slate-600" : "text-slate-200"}`}>
                    {val}
                  </span>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={13} /> Education
              </p>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500">Degree: </span>
                  <span className={evidence.education.degree.includes("Not found") ? "text-slate-600" : "text-slate-200 font-medium"}>
                    {evidence.education.degree}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Institution: </span>
                  <span className={evidence.education.institution.includes("Not found") ? "text-slate-600" : "text-slate-200 font-medium"}>
                    {evidence.education.institution}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Period: </span>
                  <span className={evidence.education.period.includes("Not found") ? "text-slate-600" : "text-slate-200 font-medium"}>
                    {evidence.education.period}
                  </span>
                </div>
                {evidence.education.gpa && (
                  <div>
                    <span className="text-slate-500">GPA/CGPA: </span>
                    <span className="text-emerald-300 font-bold">{evidence.education.gpa}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills Overview */}
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Verified Skills", count: evidence.verifiedSkills.length, icon: Check, color: "cyan" },
              { label: "Projects Found", count: evidence.projects.length, icon: FolderOpen, color: "violet" },
              { label: "Certifications", count: evidence.certifications.length, icon: Award, color: "amber" },
              { label: "Hackathons", count: evidence.hackathons.length, icon: Zap, color: "pink" },
            ].map(({ label, count, icon: Icon, color }) => (
              <div key={label} className={`p-4 rounded-xl bg-${color}-500/5 border border-${color}-500/20 flex items-center gap-3`}>
                <div className={`w-9 h-9 rounded-lg bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center`}>
                  <Icon size={16} className={`text-${color}-400`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{count}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Detected Sections */}
          <div className="mt-4">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Detected Resume Sections</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(evidence.detectedSections).map((sec) => (
                <span key={sec} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 size={11} /> {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </span>
              ))}
              {evidence.missingSections.map((sec) => (
                <span key={sec} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/5 text-xs font-semibold text-slate-500">
                  <X size={11} /> {sec.charAt(0).toUpperCase() + sec.slice(1)} — Not found
                </span>
              ))}
            </div>
          </div>

          {/* Verified Skills */}
          {evidence.verifiedSkills.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                Verified Skills Extracted from Resume ({evidence.verifiedSkills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {evidence.verifiedSkills.map((s) => (
                  <Pill key={s} tone="cyan">{s}</Pill>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {evidence.projects.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                Projects Detected ({evidence.projects.length})
              </p>
              <div className="space-y-2">
                {evidence.projects.slice(0, 5).map((p, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                    <FolderOpen size={14} className="text-violet-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">{p.title}</p>
                      {p.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.technologies.slice(0, 6).map((t) => (
                            <Pill key={t} tone="violet">{t}</Pill>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {evidence.certifications.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                Certifications ({evidence.certifications.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {evidence.certifications.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300">
                    <Award size={11} className="inline mr-1" />{c.name.substring(0, 60)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {evidence.experience.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                Work Experience / Internships Detected
              </p>
              <div className="space-y-1.5">
                {evidence.experience.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <Briefcase size={12} className={e.isInternship ? "text-amber-400" : "text-emerald-400"} />
                    <span className="font-semibold">{e.role}</span>
                    {e.company && <span className="text-slate-500">@ {e.company}</span>}
                    {e.isInternship && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">Internship</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hackathons */}
          {evidence.hackathons.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                Hackathons ({evidence.hackathons.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {evidence.hackathons.map((h, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-300">
                    <Zap size={11} className="inline mr-1" />{h.substring(0, 60)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {evidence.achievements.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                Achievements / Awards ({evidence.achievements.length})
              </p>
              <div className="space-y-1">
                {evidence.achievements.slice(0, 5).map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <Star size={11} className="text-yellow-400 mt-0.5 shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* ── SECTION 2: SKILL GAP ANALYSIS ──────────────── */}
        <GlassCard className="p-6">
          <SectionHeader
            eyebrow="SKILL GAP ANALYSIS"
            title={`Resume vs. ${gapAnalysis.targetCareer} Requirements`}
            subtitle="Evidence-based comparison. Only skills with actual resume evidence are marked demonstrated."
          />

          {/* Summary Row */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center">
              <p className="text-2xl font-bold text-emerald-400">{gapAnalysis.demonstratedCount}</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase mt-0.5">Demonstrated</p>
            </div>
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-center">
              <p className="text-2xl font-bold text-cyan-400">{gapAnalysis.partialCount}</p>
              <p className="text-[10px] text-cyan-500 font-bold uppercase mt-0.5">Partial Evidence</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-center">
              <p className="text-2xl font-bold text-amber-400">{gapAnalysis.missingCount}</p>
              <p className="text-[10px] text-amber-500 font-bold uppercase mt-0.5">Missing</p>
            </div>
          </div>

          {/* Demonstrated Skills */}
          {gapAnalysis.demonstratedSkills.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-3">
                <CheckCircle2 size={14} /> STRONG / DEMONSTRATED
              </p>
              <div className="space-y-2">
                {gapAnalysis.demonstratedSkills.map((item) => (
                  <div key={item.skill} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/15 border border-emerald-500/20">
                    <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-300">{item.skill}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.evidence}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partial Skills */}
          {gapAnalysis.partialSkills.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 mb-3">
                <TrendingUp size={14} /> DEVELOPING / PARTIAL EVIDENCE
              </p>
              <div className="space-y-2">
                {gapAnalysis.partialSkills.map((item) => (
                  <div key={item.skill} className="flex items-start gap-3 p-3 rounded-xl bg-cyan-950/15 border border-cyan-500/20">
                    <Circle size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-cyan-300">{item.skill}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {gapAnalysis.missingSkills.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-3">
                <AlertTriangle size={14} /> MISSING / NOT FOUND IN RESUME
              </p>
              <div className="space-y-2">
                {gapAnalysis.missingSkills.map((item) => (
                  <div key={item.skill} className="flex items-start gap-3 p-3 rounded-xl bg-amber-950/10 border border-amber-500/20">
                    <div className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-black ${item.priority === "critical" ? "bg-red-500/20 text-red-400" : "bg-amber-500/15 text-amber-400"}`}>
                      {item.priority === "critical" ? "CRITICAL" : "IMPORTANT"}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-300">{item.skill}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Gaps */}
          {gapAnalysis.experienceGaps.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase size={13} /> Practical Experience Gaps
              </p>
              <div className="space-y-2">
                {gapAnalysis.experienceGaps.map((g, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                    <AlertCircle size={13} className="text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-300">{g.gap}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">→ {g.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* ── SECTION 3: WHY THESE GAPS? ─────────────────── */}
        {rationale && rationale.length > 0 && (
          <GlassCard className="p-6">
            <SectionHeader
              eyebrow="WHY THESE GAPS?"
              title="Evidence Behind Your Analysis"
              subtitle="PathForge explains every gap decision based strictly on what was found in your resume."
            />
            <div className="mt-4 space-y-3">
              {rationale.map((r, i) => {
                const colorMap = {
                  strength: "emerald",
                  gap: "amber",
                  project: "violet",
                  experience: "blue",
                  level: "cyan",
                };
                const color = colorMap[r.type] || "slate";
                return (
                  <div key={i} className={`p-4 rounded-xl bg-${color}-500/5 border border-${color}-500/20 flex items-start gap-3`}>
                    <span className="text-base shrink-0 mt-0.5">{r.icon}</span>
                    <p className="text-xs text-slate-200 leading-relaxed">{r.text}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}

        {/* ── SECTION 4: PERSONALIZED ROADMAP PREVIEW ────── */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <SectionHeader
              eyebrow="PERSONALIZED ROADMAP"
              title={`Your ${gapAnalysis.targetCareer} Learning Path`}
              subtitle="Generated from your resume evidence. Demonstrated skills are pre-marked. Only gaps need learning."
            />
            <button
              onClick={() => go?.("roadmap")}
              className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              Full Roadmap <ArrowRight size={12} />
            </button>
          </div>

          {/* Progress Overview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-5">
            <ProgressRing
              value={Math.round((completedNodes / Math.max(1, totalNodes - 2)) * 100)}
              size={60}
              stroke={5}
              tone="#22d3ee"
            />
            <div>
              <p className="text-sm font-bold text-white">
                {completedNodes - 1} / {totalNodes - 3} skills addressed
              </p>
              <p className="text-xs text-slate-400">
                {demonstratedNodes.length} demonstrated · {gapNodes.length} gaps to close · {partialNodes.length} to verify
              </p>
            </div>
          </div>

          {/* Roadmap nodes (limited preview) */}
          <div className="space-y-2">
            {adaptiveRoadmap
              .filter((n) => n.type !== "start")
              .slice(0, showFullRoadmap ? 999 : 8)
              .map((node) => (
                <RoadmapSkillNode key={node.id} node={node} />
              ))}
          </div>

          {adaptiveRoadmap.length > 9 && (
            <button
              onClick={() => setShowFullRoadmap(!showFullRoadmap)}
              className="mt-3 w-full py-2.5 text-xs font-bold text-slate-400 hover:text-cyan-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/5 rounded-xl hover:border-cyan-500/20"
            >
              <ChevronDown size={13} className={showFullRoadmap ? "rotate-180" : ""} />
              {showFullRoadmap ? "Show Less" : `Show ${adaptiveRoadmap.length - 9} More Steps`}
            </button>
          )}
        </GlassCard>

        {/* ── SECTION 5: NEXT BEST ACTION ────────────────── */}
        {nextAction && (
          <div className={`p-5 md:p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            nextAction.urgency === "high"
              ? "bg-gradient-to-r from-red-950/40 to-amber-950/40 border-amber-500/40"
              : nextAction.urgency === "medium"
              ? "bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-cyan-500/40"
              : "bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border-emerald-500/30"
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                nextAction.urgency === "high" ? "bg-amber-500/20 border border-amber-500/30 text-amber-300"
                : nextAction.urgency === "medium" ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-300"
                : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
              }`}>
                <Zap size={22} />
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  nextAction.urgency === "high" ? "text-amber-400" : "text-cyan-400"
                }`}>
                  Next Best Action
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{nextAction.action}</h3>
                <p className="text-xs text-slate-300 mt-0.5 max-w-xl">{nextAction.reason}</p>
              </div>
            </div>
            <a
              href={nextAction.resource}
              target="_blank"
              rel="noreferrer"
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all ${
                nextAction.urgency === "high"
                  ? "bg-amber-500 hover:bg-amber-400 text-[#060911]"
                  : nextAction.urgency === "medium"
                  ? "bg-cyan-500 hover:bg-cyan-400 text-[#060911]"
                  : "bg-emerald-500 hover:bg-emerald-400 text-[#060911]"
              }`}
            >
              Start Now <ExternalLink size={13} />
            </a>
          </div>
        )}

        {/* ── ATS QUALITY SIGNALS ─────────────────────────── */}
        <GlassCard className="p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Shield size={13} /> ATS & Resume Quality Signals
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl flex items-center gap-3 ${evidence.hasMetrics ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-amber-500/5 border border-amber-500/20"}`}>
              {evidence.hasMetrics ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertTriangle size={14} className="text-amber-400" />}
              <div>
                <p className="text-xs font-bold text-white">Quantified Metrics</p>
                <p className="text-[10px] text-slate-400">{evidence.hasMetrics ? "Impact numbers detected (%, $, performance gains)" : "Add measurable outcomes to bullet points (e.g., 'Improved X by 20%')"}</p>
              </div>
            </div>
            <div className={`p-3 rounded-xl flex items-center gap-3 ${evidence.hasActionVerbs ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-amber-500/5 border border-amber-500/20"}`}>
              {evidence.hasActionVerbs ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertTriangle size={14} className="text-amber-400" />}
              <div>
                <p className="text-xs font-bold text-white">Action Verbs</p>
                <p className="text-[10px] text-slate-400">{evidence.hasActionVerbs ? "Strong action verbs detected (built, developed, optimized)" : "Start bullet points with power verbs (Engineered, Architected, Led)"}</p>
              </div>
            </div>
            <div className={`p-3 rounded-xl flex items-center gap-3 ${evidence.contactInfo.github !== "Not found in resume" ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-amber-500/5 border border-amber-500/20"}`}>
              {evidence.contactInfo.github !== "Not found in resume" ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertTriangle size={14} className="text-amber-400" />}
              <div>
                <p className="text-xs font-bold text-white">GitHub Profile</p>
                <p className="text-[10px] text-slate-400">{evidence.contactInfo.github !== "Not found in resume" ? `GitHub found: ${evidence.contactInfo.github}` : "Add your GitHub URL to the resume header"}</p>
              </div>
            </div>
            <div className={`p-3 rounded-xl flex items-center gap-3 ${evidence.certifications.length > 0 ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-amber-500/5 border border-amber-500/20"}`}>
              {evidence.certifications.length > 0 ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertTriangle size={14} className="text-amber-400" />}
              <div>
                <p className="text-xs font-bold text-white">Certifications</p>
                <p className="text-[10px] text-slate-400">{evidence.certifications.length > 0 ? `${evidence.certifications.length} certification(s) found` : "No certifications detected — consider adding relevant ones"}</p>
              </div>
            </div>
          </div>
        </GlassCard>

      </div>
    );
  };

  // ── MAIN RENDER ────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-fade-in pb-16">

      {/* ── HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <SectionHeader
            eyebrow="Adaptive Career Analysis System"
            title="Resume Analyzer"
            subtitle="Upload your actual resume to receive a 100% evidence-based skill gap analysis and personalized roadmap."
          />
        </div>
        {targetCareer && (
          <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2 shrink-0">
            <Target size={15} /> Target: {targetCareer}
          </div>
        )}
      </div>

      {/* ── GUARDRAIL: No Target Career */}
      {!targetCareer && (
        <GlassCard className="p-8 text-center border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
          <AlertTriangle size={44} className="mx-auto text-amber-400 mb-3" />
          <h3 className="text-lg font-bold text-white">Set your target career before analyzing your resume.</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-6">
            PathForge compares your resume against industry requirements for your specific target role.
          </p>
          <button
            onClick={() => go?.("profile")}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-bold text-xs text-white hover:from-amber-400 shadow-md transition-all cursor-pointer"
          >
            Set Target Career →
          </button>
        </GlassCard>
      )}

      {/* ── ANALYSIS MODE (only when career set and not yet in results) */}
      {targetCareer && phase !== "results" && !analysisResult && (
        <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-fit">
          <button
            onClick={() => setAnalysisMode("career")}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              analysisMode === "career" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <Target size={14} /> Analyze Against Target Role ({targetCareer})
          </button>
          <button
            onClick={() => setAnalysisMode("job-description")}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              analysisMode === "job-description" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileCode2 size={14} /> Analyze Against Job Description
          </button>
        </div>
      )}

      {/* ── JD Input */}
      {targetCareer && analysisMode === "job-description" && phase !== "results" && !analysisResult && (
        <GlassCard className="p-5 space-y-3 border-cyan-500/20">
          <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} /> Paste Target Job Description
          </label>
          <textarea
            rows={4}
            value={jobDescriptionInput}
            onChange={(e) => setJobDescriptionInput(e.target.value)}
            placeholder="Paste the real job description text here to align your analysis..."
            className="w-full bg-[#060911] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
          <p className="text-[10px] text-slate-500">Analysis will still run against your target career ({targetCareer}). The job description text improves context.</p>
        </GlassCard>
      )}

      {/* ── UPLOAD ZONE (idle phase only) */}
      {targetCareer && phase === "idle" && !analysisResult && (
        <div className="max-w-2xl mx-auto space-y-6">
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
                <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  <FileText size={28} />
                </div>
                <div>
                  <p className="font-bold text-white text-base">{fileInfo.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {fileInfo.type} · {fileInfo.size} {fileInfo.updatedAt && `· Added ${fileInfo.updatedAt}`}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} /> Resume ready for adaptive analysis
                </div>
              </div>
            ) : (
              <>
                <UploadCloud size={40} className="mx-auto mb-3 text-cyan-400" />
                <h3 className="text-sm font-bold text-white mb-1">
                  {dragOver ? "Drop your resume here" : "Upload your resume"}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Drag & drop your PDF or DOCX (up to 5MB). Analysis is 100% based on your actual resume content.
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#060911] font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Upload Resume
                </button>
              </>
            )}
          </div>

          {fileInfo && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Replace Resume
                </button>
                <button
                  onClick={removeFile}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-300 transition-all cursor-pointer"
                >
                  Remove Resume
                </button>
              </div>
              <button
                onClick={analyzeResume}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles size={14} /> Run Adaptive Analysis
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── ANALYZING STATE */}
      {phase === "analyzing" && (
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Brain size={36} className="text-cyan-400 animate-pulse" />
            </div>
            <Loader2 size={22} className="animate-spin text-cyan-400 absolute -top-2 -right-2" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Running Adaptive Analysis...</h3>
          <p className="text-xs text-slate-400 mb-6">
            Extracting evidence from <strong className="text-white">{fileInfo?.name}</strong> and comparing against <strong className="text-cyan-300">{targetCareer}</strong> requirements.
          </p>
          <div className="space-y-2 text-xs text-left w-full max-w-sm">
            {ANALYSIS_STEPS.map((step, i) => (
              <div key={i} className={`flex items-center gap-2 transition-all ${
                i < analyzeStepIndex ? "text-emerald-400" :
                i === analyzeStepIndex ? "text-cyan-300 font-semibold" :
                "text-slate-600"
              }`}>
                {i < analyzeStepIndex ? (
                  <CheckCircle2 size={13} />
                ) : i === analyzeStepIndex ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Circle size={13} />
                )}
                {step}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-600 mt-6">No fake data generated — analysis is 100% evidence-based.</p>
        </div>
      )}

      {/* ── RESULTS (or show previous analysis if available) */}
      {(phase === "results" || (analysisResult && phase === "idle")) && renderResults()}

      {/* ── Previous analysis indicator (idle + has result) */}
      {phase === "idle" && analysisResult && (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl mt-2">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-cyan-400" />
              <div>
                <p className="text-xs font-bold text-white">{fileInfo?.name || "Resume on file"}</p>
                <p className="text-[10px] text-slate-500">
                  Last analyzed: {analysisResult.analyzedAt ? new Date(analysisResult.analyzedAt).toLocaleString() : "Previously"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Replace
              </button>
              <button
                onClick={analyzeResume}
                className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer flex items-center gap-1"
              >
                <RefreshCw size={12} /> Re-analyze
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ResumeView;
