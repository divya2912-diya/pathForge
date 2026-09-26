import React, { useState, useEffect } from "react";
import {
  Target, ChevronDown, CheckCircle2, Lock, ArrowRight, BookOpen, PlayCircle, ExternalLink, Activity, Trophy, Circle, Map, Compass, BrainCircuit, SearchCode, Send, Sparkles, MapPin, Layers, Award, ArrowLeft, Check, WifiOff, CloudOff, FileText, TrendingUp, AlertTriangle, ShieldCheck, ShieldAlert
} from "lucide-react";
import { loadMilestoneProgress, saveMilestoneProgress } from "../../data/supabaseAuth";
import { getRequiredSkills, calculateDynamicReadiness } from "../../data/userProfile";
import ModalShell from "../ui/ModalShell";
import GlassCard from "../ui/GlassCard";
import SkillValidationModal from "../ui/SkillValidationModal";
import { isSkillValidated } from "../../services/skillValidationService";
import { cacheLearningContent, getCachedContent, enqueueOfflineAction } from "../../services/offlineSyncService";
import { getTranslation } from "../../services/i18nService";

export function RoadmapView({ student, onUpdateStudent, go, highlightedItemId, onClearHighlight }) {
  const [dbProgress, setDbProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingCareer, setIsChangingCareer] = useState(false);
  const [viewMode, setViewMode] = useState("winding"); // 'winding' | 'tabs'
  const [activeTab, setActiveTab] = useState("foundation");
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);
  
  // Highlight / pulse effect for newly added items
  const [pulseItemId, setPulseItemId] = useState(highlightedItemId);

  useEffect(() => {
    if (highlightedItemId) {
      setPulseItemId(highlightedItemId);
      const timer = setTimeout(() => {
        setPulseItemId(null);
        if (onClearHighlight) onClearHighlight();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [highlightedItemId]);
  
  // Skill Validation Modal State
  const [validationModalSkill, setValidationModalSkill] = useState(null);

  // Active selected node modal & learning module modal
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeLearningModule, setActiveLearningModule] = useState(null);
  const [learningCompleted, setLearningCompleted] = useState(false);
  const [offlineNotice, setOfflineNotice] = useState(null);

  // Interview Prep State
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [interviewQuestion, setInterviewQuestion] = useState("");
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewFeedback, setInterviewFeedback] = useState(null);

  const lang = student?.preferredLanguage || "en";

  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load progress from Supabase or IndexedDB
  useEffect(() => {
    async function init() {
      if (!student) return;
      setIsLoading(true);
      const targetCareer = student.targetCareer;
      if (targetCareer) {
        if (navigator.onLine) {
          const loadedProgress = await loadMilestoneProgress(targetCareer);
          const progressObj = loadedProgress || {};
          setDbProgress(progressObj);
          await cacheLearningContent(`user_${student.id}_roadmap`, progressObj, student.id);
        } else {
          const cachedProgress = await getCachedContent(`user_${student.id}_roadmap`);
          setDbProgress(cachedProgress || {});
        }
      }
      setIsLoading(false);
    }
    init();
  }, [student]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Activity className="w-8 h-8 animate-spin mb-4 text-cyan-400" />
        <p>{getTranslation("common.loading", lang)}</p>
      </div>
    );
  }

  const targetCareer = student?.targetCareer;
  const userSkills = (student?.skills || []).map((s) => s.toLowerCase());
  const userSkillsList = (student?.userSkillsList || []).map((s) => s.name.toLowerCase());
  const allUserSkills = new Set([...userSkills, ...userSkillsList]);

  // ── RESUME ANALYSIS INTEGRATION ──────────────────────────────
  // Pull adaptive roadmap data from the user's actual resume analysis
  const resumeAnalysis = student?.resumeAnalysis;
  const resumeEvidence = resumeAnalysis?.evidence;
  const resumeGapAnalysis = resumeAnalysis?.gapAnalysis;
  const resumeProfileLevel = resumeAnalysis?.profileLevel;
  const hasResumeAnalysis = !!(resumeEvidence?.isValid);

  // Skills demonstrated in resume (evidence-based) — shown as ALREADY DEMONSTRATED
  const resumeDemonstratedSkills = new Set(
    (resumeGapAnalysis?.demonstratedSkills || []).map((s) => s.skill.toLowerCase())
  );
  // Skills missing from resume (shown as priority gaps)
  const resumeMissingSkills = new Set(
    (resumeGapAnalysis?.missingSkills || []).map((s) => s.skill.toLowerCase())
  );

  // Handle empty state if no target career is set
  if (!targetCareer) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Compass className="w-16 h-16 text-cyan-400/50 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Set Your Target Career Goal</h2>
        <p className="text-slate-400 mb-6 max-w-md">Select your target career in your profile to generate your personalized learning path.</p>
        <button 
          onClick={() => go?.("profile")}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:from-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          Choose Career Goal
        </button>
      </div>
    );
  }

  // Handle offline empty state if user goes offline with zero cached content
  const hasLoadedContent = Object.keys(dbProgress).length > 0 || (student?.skills || []).length > 0;
  if (isOfflineMode && !hasLoadedContent) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-12">
        <GlassCard strong className="p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <CloudOff size={28} />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 inline-block">
            🟠 {getTranslation("offline.offline", lang)}
          </span>
          <h2 className="text-xl font-bold text-white">{getTranslation("offline.emptyNotice", lang)}</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {getTranslation("offline.emptyNoticeSub", lang)}
          </p>
        </GlassCard>
      </div>
    );
  }

  const requiredSkills = getRequiredSkills(targetCareer);

  const isMastered = (skill) => {
    const skillLow = skill.toLowerCase();
    // Check profile skills
    const profileMatch = Array.from(allUserSkills).some(
      (s) => s.includes(skillLow) || skillLow.includes(s)
    );
    // ALSO check resume-demonstrated skills (evidence-based)
    const resumeMatch = resumeDemonstratedSkills.has(skillLow) ||
      Array.from(resumeDemonstratedSkills).some(
        (rs) => rs.includes(skillLow) || skillLow.includes(rs)
      );
    return profileMatch || resumeMatch;
  };

  const isSkillDbCompleted = (skill) => {
    const key = `skill_${skill.replace(/\s+/g, "_").toLowerCase()}`;
    return dbProgress[key] === 1;
  };

  // Is a skill demonstrated specifically via resume evidence?
  const isResumeProven = (skill) => {
    const skillLow = skill.toLowerCase();
    return resumeDemonstratedSkills.has(skillLow) ||
      Array.from(resumeDemonstratedSkills).some(
        (rs) => rs.includes(skillLow) || skillLow.includes(rs)
      );
  };

  const actualGaps = requiredSkills.filter((req) => !isMastered(req) && !isSkillDbCompleted(req));
  const actualStrengths = requiredSkills.filter((req) => isMastered(req) || isSkillDbCompleted(req));

  const totalRequired = requiredSkills.length;
  const progressPercent = totalRequired === 0 ? 100 : Math.round((actualStrengths.length / totalRequired) * 100);
  const nextStep = actualGaps.length > 0 ? actualGaps[0] : null;

  const half = Math.ceil(requiredSkills.length / 2);
  const foundationSkills = requiredSkills.slice(0, half);
  const specSkills = requiredSkills.slice(half);
  const projects = student?.projectsList || [];
  const certs = student?.certificationsList || [];
  const assessments = student?.assessments || [];

  // Toggle skill progress manually (Online or Offline IndexedDB Queue)
  const toggleSkill = async (skill) => {
    const key = `skill_${skill.replace(/\s+/g, "_").toLowerCase()}`;
    const currentVal = dbProgress[key] === 1 ? 0 : 1;
    setDbProgress((prev) => ({ ...prev, [key]: currentVal }));

    if (!navigator.onLine) {
      await enqueueOfflineAction("complete_node", { career: targetCareer, milestoneId: key }, student?.id, key);
      setOfflineNotice("✓ Saved locally in IndexedDB — Will sync when online.");
      setTimeout(() => setOfflineNotice(null), 4000);
    } else {
      await saveMilestoneProgress(targetCareer, key, currentVal);
      await cacheLearningContent(`user_${student?.id}_roadmap`, { ...dbProgress, [key]: currentVal }, student?.id);
    }
  };

  // Build Roadmap Nodes
  const pathNodes = [];

  pathNodes.push({
    id: "node_start",
    type: "start",
    title: "PathForge Journey Start",
    stage: "Foundation",
    desc: `Begin your journey toward becoming a ${targetCareer}.`,
    status: "completed",
    xPos: "50%",
    icon: Compass,
    hours: "0 hrs",
  });

  foundationSkills.forEach((skill, idx) => {
    const validated = isSkillValidated(student, dbProgress, skill);
    const done = validated || isMastered(skill) || isSkillDbCompleted(skill);
    const resumeProven = isResumeProven(skill);
    const isCurrent = !done && (idx === 0 || isMastered(foundationSkills[idx - 1]) || isSkillDbCompleted(foundationSkills[idx - 1]) || isSkillValidated(student, dbProgress, foundationSkills[idx - 1]));
    const positions = ["25%", "75%", "50%", "30%", "70%"];
    pathNodes.push({
      id: `skill_${skill.replace(/\s+/g, "_").toLowerCase()}`,
      type: "skill",
      title: skill,
      stage: validated ? "VALIDATED SKILL" : resumeProven ? "Already Demonstrated" : "Foundation",
      desc: validated
        ? `Skill verified via 2-round assessment — mastery proven!`
        : resumeProven
        ? `Demonstrated in your resume — no need to repeat foundational learning.`
        : `Core concepts and practical application of ${skill} for ${targetCareer}.`,
      relevance: validated
        ? `✓ Officially validated via conceptual & practical testing.`
        : resumeProven
        ? `✓ Evidence found in your uploaded resume.`
        : `Essential foundation skill for ${targetCareer} roles.`,
      status: done ? "completed" : isCurrent ? "current" : "upcoming",
      xPos: positions[idx % positions.length],
      icon: validated ? ShieldCheck : resumeProven ? CheckCircle2 : BookOpen,
      hours: validated ? "✓ Validated" : resumeProven ? "✓ Done" : `${3 + idx} wks`,
      skillName: skill,
      resumeProven,
      isValidated: validated,
    });
  });

  specSkills.forEach((skill, idx) => {
    const validated = isSkillValidated(student, dbProgress, skill);
    const done = validated || isMastered(skill) || isSkillDbCompleted(skill);
    const resumeProven = isResumeProven(skill);
    const isCurrent = !done && (actualGaps.length > 0 && actualGaps[0] === skill);
    const positions = ["75%", "35%", "65%", "25%"];
    pathNodes.push({
      id: `skill_${skill.replace(/\s+/g, "_").toLowerCase()}`,
      type: "specialization",
      title: skill,
      stage: validated ? "VALIDATED SKILL" : resumeProven ? "Already Demonstrated" : "Specialization",
      desc: validated
        ? `Skill verified via 2-round assessment — mastery proven!`
        : resumeProven
        ? `Demonstrated in your resume — skip to advanced application.`
        : `Advanced frameworks, architecture patterns, and tools for ${skill}.`,
      relevance: validated
        ? `✓ Officially validated via conceptual & practical testing.`
        : resumeProven
        ? `✓ Evidence found in your uploaded resume.`
        : `Key specialization requirement for ${targetCareer}.`,
      status: done ? "completed" : isCurrent ? "current" : "upcoming",
      xPos: positions[idx % positions.length],
      icon: validated ? ShieldCheck : resumeProven ? CheckCircle2 : Layers,
      hours: validated ? "✓ Validated" : resumeProven ? "✓ Done" : `${2 + idx} wks`,
      skillName: skill,
      resumeProven,
      isValidated: validated,
    });
  });

  const capstoneDone = projects.length > 0;
  pathNodes.push({
    id: "node_portfolio",
    type: "project",
    title: `Capstone Portfolio Project`,
    stage: "Projects & Portfolio",
    desc: `Build and deploy a full-featured project demonstrating ${targetCareer} skills.`,
    relevance: "Recruiters evaluate verified portfolio projects before your degree.",
    status: capstoneDone ? "completed" : (actualGaps.length === 0 ? "current" : "upcoming"),
    xPos: "50%",
    icon: Trophy,
    hours: "4 wks",
  });

  const interviewDone = dbProgress["node_interview"] === 1;
  pathNodes.push({
    id: "node_interview",
    type: "interview",
    title: `${targetCareer} Technical Screen`,
    stage: "Interview Prep",
    desc: `Practice role-specific coding questions, system design, and STAR behavioral answers.`,
    relevance: "Ensures technical interview stamina and algorithmic clarity.",
    status: interviewDone ? "completed" : (capstoneDone ? "current" : "upcoming"),
    xPos: "65%",
    icon: Sparkles,
    hours: "2 wks",
  });

  // Custom items added by user from Resources / Projects / Certifications
  const addedItemsList = Array.isArray(student?.addedRoadmapItems) ? student.addedRoadmapItems : [];
  addedItemsList.forEach((addedItem, idx) => {
    pathNodes.push({
      id: String(addedItem.id),
      type: "custom_added",
      title: addedItem.title,
      stage: addedItem.locationInfo?.stage || "Added Resource",
      desc: `Custom added from ${addedItem.itemType || "resources"} — Topic: ${addedItem.locationInfo?.topic || "General"}.`,
      relevance: `✓ Explicitly added to your ${targetCareer} roadmap.`,
      status: "in-progress",
      xPos: idx % 2 === 0 ? "40%" : "60%",
      icon: BookOpen,
      hours: "Custom",
      isCustomAdded: true,
      addedFrom: addedItem.itemType
    });
  });

  const careerReady = progressPercent >= 90;
  pathNodes.push({
    id: "node_ready",
    title: `Hire Ready — ${targetCareer}`,
    stage: "Career Ready",
    desc: `Profile verified, skill gaps closed, portfolio ready for applications.`,
    status: careerReady ? "completed" : "locked",
    xPos: "50%",
    icon: Award,
    hours: "Goal",
  });

  // Handlers
  const handleMarkComplete = async (node) => {
    if (node.skillName) {
      await toggleSkill(node.skillName);
    } else {
      const currentVal = dbProgress[node.id] === 1 ? 0 : 1;
      setDbProgress((prev) => ({ ...prev, [node.id]: currentVal }));
      if (!navigator.onLine) {
        await enqueueOfflineAction("complete_node", { career: targetCareer, milestoneId: node.id }, student?.id, node.id);
        setOfflineNotice("✓ Saved locally in IndexedDB — Will sync when online.");
        setTimeout(() => setOfflineNotice(null), 4000);
      } else {
        await saveMilestoneProgress(targetCareer, node.id, currentVal);
      }
    }
    setLearningCompleted(true);
  };

  const startInterview = () => {
    if (actualGaps.length > 0) {
      setInterviewQuestion(`Explain the core principles of ${actualGaps[0]} and how you would architect a solution for ${targetCareer}.`);
    } else {
      setInterviewQuestion(`Describe a complex production issue you solved using ${actualStrengths[0] || 'your core skills'}.`);
    }
    setIsInterviewing(true);
    setInterviewAnswer("");
    setInterviewFeedback(null);
  };

  const submitInterview = () => {
    if (!interviewAnswer.trim()) return;
    setInterviewFeedback({
      correctness: "Strong response! Clear structure and solid technical vocabulary.",
      points: ["Explained core architecture", "Mentioned performance optimization trade-offs"],
      revise: nextStep || "System Design Fundamentals",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Offline Mode Banner Notice */}
      {isOfflineMode && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 font-bold">
            <WifiOff size={16} />
            <span>🟠 {getTranslation("offline.offlineNotice", lang)}</span>
          </div>
          <span className="text-[11px] font-semibold opacity-80">IndexedDB Cache Active</span>
        </div>
      )}

      {/* Offline Progress Toast Notice */}
      {offlineNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-2xl animate-in slide-in-from-bottom-4">
          {offlineNotice}
        </div>
      )}

      {/* ── RESUME ANALYSIS BANNER ─────────────────────────────────── */}
      {hasResumeAnalysis && resumeProfileLevel && (
        <div
          className="p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{
            background: `${resumeProfileLevel.levelColor}08`,
            borderColor: `${resumeProfileLevel.levelColor}30`,
          }}
        >
          <div className="flex items-center gap-3">
            <FileText size={16} style={{ color: resumeProfileLevel.levelColor }} />
            <div>
              <p className="text-xs font-bold text-white">
                Resume Analysis Active — Profile Level: <span style={{ color: resumeProfileLevel.levelColor }}>{resumeProfileLevel.level}</span>
              </p>
              <p className="text-[10px] text-slate-400">
                {resumeGapAnalysis?.demonstratedCount || 0} skills already demonstrated in your resume are pre-marked completed.
                {resumeGapAnalysis?.missingCount > 0 && ` ${resumeGapAnalysis.missingCount} gaps remain.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => go?.("resume")}
            className="text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap"
            style={{ borderColor: `${resumeProfileLevel.levelColor}40`, color: resumeProfileLevel.levelColor }}
          >
            View Full Analysis →
          </button>
        </div>
      )}

      {/* 1. HEADER & CURRENT POSITION */}
      <GlassCard strong className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Compass size={14} /> {getTranslation("roadmap.title", lang)}
            </div>
            <h1 className="lp-display text-2xl font-bold text-white flex items-center gap-2">
              {targetCareer}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {getTranslation("roadmap.subtitle", lang)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-xl">
              <button
                onClick={() => setViewMode("winding")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "winding"
                    ? "bg-cyan-500 text-[#060911] shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Map size={13} /> Winding Path
              </button>
              <button
                onClick={() => setViewMode("tabs")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "tabs"
                    ? "bg-cyan-500 text-[#060911] shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers size={13} /> Tabbed Milestones
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Target Career</span>
            <span className="text-sm font-bold text-white truncate block">{targetCareer}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Overall Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-cyan-400">{progressPercent}%</span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Skills Completed</span>
            <span className="text-sm font-bold text-emerald-400">{actualStrengths.length} / {totalRequired}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">High-Priority Gaps</span>
            <span className="text-sm font-bold text-amber-400">{actualGaps.length} remaining</span>
          </div>
        </div>
      </GlassCard>

      {/* 2. NEXT PRIORITY ACTION CALLOUT */}
      {nextStep && (
        <div className="bg-gradient-to-r from-cyan-950/60 to-purple-950/40 border border-cyan-500/30 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 shadow-md">
              <Sparkles size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Recommended Next Focus</span>
              <h3 className="text-lg font-bold text-white">Master {nextStep}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{nextStep} is your highest-priority skill gap for {targetCareer}.</p>
            </div>
          </div>

          <button
            onClick={() => {
              const targetNode = pathNodes.find(n => n.title === nextStep);
              if (targetNode) {
                setSelectedNode(targetNode);
              }
            }}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#060911] font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            {getTranslation("roadmap.startLearning", lang)} {nextStep} <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* 3. WINDING SERPENTINE PATH */}
      {viewMode === "winding" && (
        <GlassCard strong className="p-6 md:p-10 relative overflow-hidden">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Career Progression Pathway</span>
            <h2 className="text-xl font-bold text-white mt-1">Interactive Learning Journey</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">Click any node to view milestone topics, learning modules, assignments, and resources.</p>
          </div>

          <div className="relative py-10 max-w-2xl mx-auto">
            {/* Winding Connecting Line Background */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-500/80 via-purple-500/50 to-slate-800 rounded-full pointer-events-none" />

            {/* Path Nodes */}
            <div className="space-y-16 relative z-10">
              {pathNodes.map((node, index) => {
                const NodeIcon = node.icon;
                const isDone = node.status === "completed";
                const isCurrent = node.status === "current";
                const isLocked = node.status === "locked";
                const isPulsing = String(node.id) === String(pulseItemId);

                return (
                  <div
                    key={node.id}
                    className="relative flex items-center"
                    style={{ justifyContent: index % 2 === 0 ? "flex-start" : "flex-end" }}
                  >
                    {/* Visual Connector Dot on Central Line */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all ${
                        isPulsing
                          ? "bg-cyan-400 border-white shadow-[0_0_20px_#22d3ee] animate-ping"
                          : isDone
                          ? "bg-cyan-400 border-cyan-300 shadow-[0_0_10px_#22d3ee]"
                          : isCurrent
                          ? "bg-purple-500 border-white animate-ping"
                          : "bg-slate-900 border-slate-700"
                      }`}
                    />

                    {/* Milestone Node Card */}
                    <div
                      onClick={() => setSelectedNode(node)}
                      className={`w-[85%] sm:w-[45%] p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                        isPulsing
                          ? "bg-cyan-950/80 border-2 border-cyan-400 text-white shadow-[0_0_35px_rgba(34,211,238,0.5)] scale-105"
                          : isDone
                          ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-100 hover:border-emerald-400"
                          : isCurrent
                          ? "bg-gradient-to-br from-cyan-950/60 to-purple-950/60 border-cyan-400 text-white shadow-[0_0_25px_rgba(34,211,238,0.25)] scale-105"
                          : isLocked
                          ? "bg-slate-900/30 border-white/5 opacity-50 blur-[0.3px]"
                          : "bg-slate-900/60 border-white/10 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900/80"
                      }`}
                    >
                      {/* Active "YOU ARE HERE" or "JUST ADDED" Floating Badge */}
                      {isPulsing ? (
                        <div className="absolute -top-3 left-4 px-2.5 py-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-[#04121a] font-black text-[10px] uppercase rounded-full shadow-lg animate-bounce">
                          ✨ Newly Added to Roadmap!
                        </div>
                      ) : isCurrent ? (
                        <div className="absolute -top-3 left-4 px-2.5 py-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 text-[#04121a] font-black text-[10px] uppercase rounded-full shadow-md animate-bounce">
                          You are here ✨
                        </div>
                      ) : null}

                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                            isDone
                              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                              : isCurrent
                              ? "bg-cyan-500 border border-cyan-300 text-[#04121a]"
                              : "bg-white/5 border border-white/10 text-slate-400"
                          }`}
                        >
                          {isDone ? <Check size={18} /> : isLocked ? <Lock size={16} /> : <NodeIcon size={18} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{node.stage}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">{node.hours}</span>
                          </div>

                          <h4 className="text-sm font-bold truncate group-hover:text-cyan-300 transition-colors">{node.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{node.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      )}

      {/* 4. TABBED MILESTONES VIEW MODE */}
      {viewMode === "tabs" && (
        <div className="space-y-6">
          <div className="flex overflow-x-auto gap-2 border-b border-white/5 pb-px custom-scrollbar">
            {["foundation", "specialization", "projects", "interview", "ready"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "border-cyan-400 text-cyan-400"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
                }`}
              >
                {tab === "ready" ? "Career Ready" : tab === "interview" ? "Interview Prep" : tab}
              </button>
            ))}
          </div>

          {(activeTab === "foundation" || activeTab === "specialization") && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(activeTab === "foundation" ? foundationSkills : specSkills).map((skill) => {
                const isValidated = isSkillValidated(student, dbProgress, skill);
                const profileMastered = isMastered(skill);
                const dbCompleted = isSkillDbCompleted(skill);
                const isCompleted = isValidated || profileMastered || dbCompleted;
                const resumeProven = isResumeProven(skill);

                return (
                  <GlassCard
                    key={skill}
                    className={`p-5 flex flex-col justify-between transition-all ${
                      isValidated ? "border-emerald-400/50 bg-emerald-950/20 shadow-lg shadow-emerald-500/10" :
                      resumeProven ? "border-emerald-500/30 bg-emerald-950/10" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold text-base ${isCompleted ? "text-slate-300" : "text-white"}`}>{skill}</h3>
                          {isValidated && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                              <ShieldCheck size={11} /> VALIDATED
                            </span>
                          )}
                        </div>
                        {resumeProven && !isValidated && (
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                            <CheckCircle2 size={9} /> Resume Demonstrated
                          </span>
                        )}
                      </div>
                      <button onClick={() => toggleSkill(skill)} className="cursor-pointer" title={isCompleted ? "Mark as in-progress" : "Mark completed"}>
                        {isCompleted ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Circle className="w-6 h-6 text-slate-600 hover:text-cyan-400" />}
                      </button>
                    </div>

                    <div className="pt-4 flex flex-col gap-2 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isValidated ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/30" :
                          resumeProven ? "bg-emerald-500/20 text-emerald-300" :
                          isCompleted ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-slate-400"
                        }`}>
                          {isValidated ? "✓ Skill Validated" : resumeProven ? "✓ Already Demonstrated" : isCompleted ? getTranslation("roadmap.completed", lang) : getTranslation("roadmap.inProgress", lang)}
                        </span>
                        
                        <button
                          onClick={() => {
                            const targetNode = pathNodes.find(n => n.title === skill);
                            if (targetNode) setSelectedNode(targetNode);
                          }}
                          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          Module Details <ArrowRight size={12} />
                        </button>
                      </div>

                      {!isValidated && (
                        <button
                          onClick={() => setValidationModalSkill(skill)}
                          className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-1"
                        >
                          <ShieldCheck size={13} /> Validate My Skill
                        </button>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. MILESTONE NODE DETAILS MODAL */}
      <ModalShell
        open={!!selectedNode}
        title={selectedNode?.title || "Milestone Details"}
        subtitle={`${selectedNode?.stage || "Milestone"} · ${selectedNode?.hours || ""}`}
        icon={BookOpen}
        onClose={() => setSelectedNode(null)}
      >
        {selectedNode && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
              <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <Sparkles size={14} /> Relevance to {targetCareer}
              </h4>
              <p>{selectedNode.relevance || selectedNode.desc}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overview</h4>
              <p className="text-sm text-slate-200 leading-relaxed">{selectedNode.desc}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  setActiveLearningModule(selectedNode);
                  setSelectedNode(null);
                  setLearningCompleted(false);
                }}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#060911] font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BookOpen size={15} /> {getTranslation("roadmap.startLearning", lang)}
              </button>

              {(selectedNode.skillName || selectedNode.type === "skill" || selectedNode.type === "specialization") && (
                <button
                  onClick={() => {
                    const sName = selectedNode.skillName || selectedNode.title;
                    setValidationModalSkill(sName);
                    setSelectedNode(null);
                  }}
                  className="px-4 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                >
                  <ShieldCheck size={16} /> Validate My Skill
                </button>
              )}

              <button
                onClick={async () => {
                  await handleMarkComplete(selectedNode);
                  setSelectedNode(null);
                }}
                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedNode.status === "completed"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                }`}
              >
                {selectedNode.status === "completed" ? `✓ ${getTranslation("roadmap.completed", lang)}` : getTranslation("roadmap.markComplete", lang)}
              </button>
            </div>
          </div>
        )}
      </ModalShell>

      {/* 6. INTERACTIVE LEARNING MODULE VIEW */}
      <ModalShell
        open={!!activeLearningModule}
        title={`Learning Module: ${activeLearningModule?.title || ""}`}
        subtitle={`${targetCareer} · ${activeLearningModule?.hours || "Estimated 3 hours"}`}
        icon={BookOpen}
        onClose={() => setActiveLearningModule(null)}
      >
        {activeLearningModule && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
              <span className="font-semibold text-cyan-300">Topic: {activeLearningModule.title}</span>
              <span className="text-slate-400">Target Role: {targetCareer}</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">Lesson Core Concepts</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In this module, you'll master the practical implementation of <strong>{activeLearningModule.title}</strong> for real-world production environments in <strong>{targetCareer}</strong>.
              </p>
            </div>

            {/* Formatted Code Explanation */}
            <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">// Code Implementation Pattern</div>
              <pre>{`// ${activeLearningModule.title} for ${targetCareer}
export async function initializeModule(config) {
  const result = await processData(config);
  return { status: "ready", data: result };
}`}</pre>
            </div>

            {/* Action & Completion Control */}
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <button
                onClick={async () => {
                  await handleMarkComplete(activeLearningModule);
                }}
                disabled={learningCompleted}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  learningCompleted
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-cyan-500 hover:bg-cyan-400 text-[#060911] shadow-lg shadow-cyan-500/20 cursor-pointer"
                }`}
              >
                {learningCompleted ? <><Check size={16} /> Progress Saved & Milestone Completed!</> : getTranslation("roadmap.markComplete", lang)}
              </button>
            </div>
          </div>
        )}
      </ModalShell>

      {/* 7. SKILL VALIDATION SYSTEM MODAL */}
      <SkillValidationModal
        isOpen={!!validationModalSkill}
        skill={validationModalSkill}
        student={student}
        onUpdateStudent={onUpdateStudent}
        onClose={() => setValidationModalSkill(null)}
        onValidationComplete={(isSuccess, skillName) => {
          if (isSuccess && skillName) {
            const key = `skill_${skillName.replace(/\s+/g, "_").toLowerCase()}`;
            setDbProgress(prev => ({
              ...prev,
              [key]: 1,
              [`${key}_validated`]: 1
            }));
          }
        }}
      />

    </div>
  );
}

export default RoadmapView;
