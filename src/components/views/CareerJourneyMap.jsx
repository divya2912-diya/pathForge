import React, { useState, useEffect } from "react";
import {
  Brain, AlertTriangle, BookOpen, FolderKanban, Award, MessageSquare, Target,
  CheckCircle2, ArrowRight, Sparkles, ChevronRight, X, Compass, ExternalLink, Flame
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Pill from "../ui/Pill";
import { getRequiredSkills, getStrengthsAndGaps } from "../../data/userProfile";
import { loadMilestoneProgress } from "../../data/supabaseAuth";

export function CareerJourneyMap({ student, onNavigate }) {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [dbProgress, setDbProgress] = useState(null);

  const targetCareer = student?.targetCareer || "";
  const userSkills = (student?.skills || []).map(s => typeof s === "string" ? s : s.name);
  const userSkillsList = (student?.userSkillsList || []).map(s => s.name);
  const allUserSkills = Array.from(new Set([...userSkills, ...userSkillsList]));
  
  const requiredSkills = getRequiredSkills(targetCareer);

  // Compute actual strengths & gaps
  const isSkillMastered = (req) => {
    return allUserSkills.some(s => 
      s.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(s.toLowerCase())
    );
  };

  const actualStrengths = requiredSkills.filter(req => isSkillMastered(req));
  const actualGaps = requiredSkills.filter(req => !isSkillMastered(req));

  // Load actual milestone progress from DB / localStorage
  useEffect(() => {
    async function fetchProgress() {
      if (targetCareer) {
        const loaded = await loadMilestoneProgress(targetCareer);
        setDbProgress(loaded || {});
      }
    }
    fetchProgress();
  }, [targetCareer]);

  // Calculate learning completion
  const completedMilestones = dbProgress 
    ? Object.values(dbProgress).filter(val => val === 1).length 
    : 0;
  
  const totalMilestones = requiredSkills.length > 0 ? requiredSkills.length : 1;
  const learningPercent = Math.min(
    100,
    Math.round(((actualStrengths.length + completedMilestones) / (requiredSkills.length || 1)) * 100)
  );

  const projectsCount = student?.projectsList?.length || 0;
  const certsCount = student?.certificationsList?.length || student?.certifications?.length || 0;
  const assessmentsCount = student?.assessments?.length || 0;

  // Build skill objects for skill visualization grid/pills
  const skillNodes = requiredSkills.map((reqSkill) => {
    const isMastered = isSkillMastered(reqSkill);
    const isGap = actualGaps.includes(reqSkill);
    const isLearning = !isMastered && completedMilestones > 0 && actualGaps.slice(0, 2).includes(reqSkill);

    let state = "unstarted"; // unstarted | gap | learning | known
    if (isMastered) state = "known";
    else if (isLearning) state = "learning";
    else if (isGap) state = "gap";

    return {
      name: reqSkill,
      state,
      whyMatters: `${reqSkill} is essential for ${targetCareer || "your target role"} to build core production workflows.`,
      action: isMastered 
        ? "Skill validated in your profile."
        : "Complete learning roadmap module & build a practice project.",
    };
  });

  // Include user extra skills not explicitly in required list
  const extraUserSkills = allUserSkills.filter(
    s => !requiredSkills.some(r => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
  );
  extraUserSkills.forEach(skillName => {
    skillNodes.unshift({
      name: skillName,
      state: "known",
      whyMatters: `Verified skill on your profile boosting your overall adaptability.`,
      action: "Skill mastered and active in your profile.",
    });
  });

  // Stage 7 status text for Interview Prep
  const interviewStatus = learningPercent > 60 
    ? "Interview Ready — Practice mock screens"
    : learningPercent > 30
    ? "In Progress — Complete foundational modules first"
    : "Not Started — Complete roadmap modules";

  // Stages Configuration
  const stages = [
    {
      id: "skills",
      num: 1,
      title: "Current Skills",
      icon: Brain,
      tone: "cyan",
      navTo: "profile",
      statusText: allUserSkills.length > 0 ? `${allUserSkills.length} Skills Listed` : "No skills added yet",
      progress: allUserSkills.length > 0 ? Math.min(100, allUserSkills.length * 20) : 0,
      tags: allUserSkills.length > 0 ? allUserSkills.slice(0, 3) : ["Add skills in profile"],
      description: "Validated technical capabilities & tools."
    },
    {
      id: "gap",
      num: 2,
      title: "Skill Gap Analysis",
      icon: AlertTriangle,
      tone: "amber",
      navTo: "roadmap",
      statusText: targetCareer ? (actualGaps.length > 0 ? `${actualGaps.length} Gaps Identified` : "0 Gaps — Role Ready!") : "Set Target Career",
      progress: requiredSkills.length > 0 ? Math.round((actualStrengths.length / requiredSkills.length) * 100) : 0,
      tags: actualGaps.length > 0 ? actualGaps.slice(0, 2) : ["No gaps detected"],
      description: "Priority skills required to meet job market demands."
    },
    {
      id: "learning",
      num: 3,
      title: "Learning Roadmap",
      icon: BookOpen,
      tone: "blue",
      navTo: "roadmap",
      statusText: targetCareer ? `${learningPercent}% Completed` : "Roadmap not active",
      progress: learningPercent,
      tags: requiredSkills.slice(0, 2),
      description: "Curated learning path to bridge skill gaps."
    },
    {
      id: "projects",
      num: 4,
      title: "Projects & Portfolio",
      icon: FolderKanban,
      tone: "purple",
      navTo: "projects",
      statusText: projectsCount > 0 ? `${projectsCount} Project${projectsCount === 1 ? '' : 's'} Uploaded` : "No projects added yet",
      progress: Math.min(100, projectsCount * 33),
      tags: projectsCount > 0 ? student.projectsList.slice(0, 2).map(p => p.title) : ["Add portfolio projects"],
      description: "Real-world code samples proving practical skills."
    },
    {
      id: "certs",
      num: 5,
      title: "Certifications",
      icon: Award,
      tone: "emerald",
      navTo: "certifications",
      statusText: certsCount > 0 ? `${certsCount} Certification${certsCount === 1 ? '' : 's'} Verified` : "No certifications added yet",
      progress: Math.min(100, certsCount * 50),
      tags: certsCount > 0 ? ["Verified Credential"] : ["Upload certs"],
      description: "Industry certifications & skill credentials."
    },
    {
      id: "interview",
      num: 6,
      title: "Interview Prep",
      icon: MessageSquare,
      tone: "pink",
      navTo: "roadmap",
      statusText: interviewStatus,
      progress: Math.min(100, learningPercent),
      tags: ["System Design", "Coding Challenges", "Behavioral"],
      description: "Technical screens & behavioral interview prep."
    }
  ];

  return (
    <div className="relative w-full space-y-8 animate-in fade-in duration-500">
      {/* MAP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <Sparkles size={13} /> Dynamic Skill Intelligence System
          </div>
          <h2 className="lp-display text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Compass className="text-cyan-400 w-7 h-7" /> Career Intelligence Map
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Real-time interactive path mapping your current skills, active learning, projects, and certifications directly to your target career.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-900/60 p-3 rounded-2xl border border-white/5 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Known
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" /> Learning
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" /> Gap
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Not Started
          </div>
        </div>
      </div>

      {!targetCareer && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="shrink-0" size={18} />
            <span>Set your target career in your profile to enable full skill gap analysis and automated career mapping.</span>
          </div>
          <button
            onClick={() => onNavigate && onNavigate("profile")}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shrink-0 cursor-pointer"
          >
            Set Career Goal
          </button>
        </div>
      )}

      {/* SKILL VISUALIZATION GRID (around Stage 1 / Current Skills) */}
      {skillNodes.length > 0 && (
        <GlassCard className="p-5 md:p-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
              <Brain size={14} className="text-cyan-400" /> Real-Time Skill Inventory & Gap Visualizer
            </h3>
            <span className="text-xs text-slate-500">Click any skill for intelligence breakdown</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {skillNodes.map((skill) => {
              let badgeStyle = "bg-slate-800/80 text-slate-400 border-slate-700/80 hover:border-slate-500";
              let dotColor = "bg-slate-500";

              if (skill.state === "known") {
                badgeStyle = "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25 shadow-[0_0_10px_rgba(16,185,129,0.15)]";
                dotColor = "bg-emerald-400";
              } else if (skill.state === "learning") {
                badgeStyle = "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/25 shadow-[0_0_10px_rgba(34,211,238,0.15)]";
                dotColor = "bg-cyan-400 animate-ping";
              } else if (skill.state === "gap") {
                badgeStyle = "bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25 shadow-[0_0_10px_rgba(251,191,36,0.15)]";
                dotColor = "bg-amber-400";
              }

              return (
                <button
                  key={skill.name}
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${badgeStyle}`}
                >
                  <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                  {skill.name}
                </button>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* CONNECTED CAREER JOURNEY PIPELINE (Stages 1 to 6 Grid + Connecting Lines) */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {stages.map((stg) => {
            const IconComponent = stg.icon;
            
            return (
              <GlassCard
                key={stg.id}
                hover
                onClick={() => onNavigate && onNavigate(stg.navTo)}
                className="p-5 relative group cursor-pointer border border-white/10 hover:border-cyan-400/50 transition-all duration-300"
              >
                {/* Node Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stage 0{stg.num}</span>
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">{stg.title}</h4>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-xs text-slate-400 mb-3 min-h-[32px]">{stg.description}</p>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-cyan-300">{stg.statusText}</span>
                    <span className="text-slate-400 font-mono">{stg.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 rounded-full"
                      style={{ width: `${stg.progress}%` }}
                    />
                  </div>
                </div>

                {/* Topic / Skill Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {stg.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* STAGE 7: TARGET CAREER GOAL NODE */}
      <GlassCard strong className="p-6 md:p-8 relative overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
              <Target size={14} /> Stage 07 · Ultimate Career Goal
            </div>
            <h3 className="lp-display text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              🎯 {targetCareer || "Target Career Not Set"}
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              {targetCareer 
                ? `Calculated readiness based on your live Supabase profile, assessments, learning progress, and portfolio.`
                : `Complete your profile to set a target career and calculate your job readiness.`}
            </p>
          </div>

          <button
            onClick={() => onNavigate && onNavigate("career")}
            className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 text-slate-950 hover:opacity-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            Explore Career Path <ArrowRight size={16} />
          </button>
        </div>

        {/* DYNAMIC METRICS SUMMARY GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-6 pt-6 border-t border-white/10 relative z-10">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Skills Matched</span>
            <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
              {actualStrengths.length} / {requiredSkills.length || 0}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Skills Remaining</span>
            <span className="text-base font-bold text-amber-400 font-mono mt-0.5 block">
              {actualGaps.length} Gaps
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Learning Progress</span>
            <span className="text-base font-bold text-cyan-400 font-mono mt-0.5 block">
              {learningPercent}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Projects Uploaded</span>
            <span className="text-base font-bold text-purple-400 font-mono mt-0.5 block">
              {projectsCount} {projectsCount === 1 ? 'Project' : 'Projects'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Certifications</span>
            <span className="text-base font-bold text-blue-400 font-mono mt-0.5 block">
              {certsCount} Verified
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Interview Prep</span>
            <span className="text-xs font-bold text-pink-400 truncate mt-1 block">
              {learningPercent > 50 ? "Ready" : "In Progress"}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* SKILL DETAIL MODAL */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <GlassCard strong className="w-full max-w-md p-6 relative space-y-4 border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
            <button
              onClick={() => setSelectedSkill(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedSkill.name}</h3>
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold inline-block mt-0.5 ${
                  selectedSkill.state === "known" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" :
                  selectedSkill.state === "learning" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" :
                  selectedSkill.state === "gap" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
                  "bg-slate-800 text-slate-400 border border-slate-700"
                }`}>
                  Status: {selectedSkill.state.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-bold text-cyan-300 block mb-1">Target Career Relevance</span>
                <p className="text-slate-300 leading-relaxed">{selectedSkill.whyMatters}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-bold text-amber-300 block mb-1">Recommended Learning Action</span>
                <p className="text-slate-300 leading-relaxed">{selectedSkill.action}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedSkill(null);
                  if (onNavigate) onNavigate("roadmap");
                }}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Open Learning Roadmap <ChevronRight size={14} />
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
