import React, { useState, useEffect } from "react";
import {
  Compass, TrendingUp, Radar, Flame, ChevronRight, CheckCircle2, AlertTriangle, Sparkles,
  Target, Zap, FolderKanban, Activity, TargetIcon, LayoutDashboard, BrainCircuit, ExternalLink
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import AnimatedCounter from "../ui/AnimatedCounter";
import StatusDot from "../ui/StatusDot";
import Pill from "../ui/Pill";
import ProgressRing from "../ui/ProgressRing";
import { SKILL_REQUIREMENTS } from "../../data/userProfile";
import { loadMilestoneProgress } from "../../data/supabaseAuth";
import { CareerJourneyMap } from "./CareerJourneyMap";

export function DashboardView({ go, student }) {
  const [dbProgress, setDbProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine actual metrics
  const targetCareer = student?.targetCareer;
  const userName = student?.name;
  const userSkills = (student?.skills || []).map(s => s.toLowerCase());
  const userSkillsList = (student?.userSkillsList || []).map(s => s.name.toLowerCase());
  const allUserSkills = new Set([...userSkills, ...userSkillsList]);

  const requiredSkills = targetCareer ? (SKILL_REQUIREMENTS[targetCareer] || []) : [];
  
  const isMastered = (skill) => {
    return Array.from(allUserSkills).some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s));
  };

  const actualGaps = requiredSkills.filter(req => !isMastered(req));
  const actualStrengths = requiredSkills.filter(req => isMastered(req));

  const totalRequired = requiredSkills.length;
  
  // Base readiness derived from matched skills
  const careerReadiness = totalRequired === 0 ? 0 : Math.round((actualStrengths.length / totalRequired) * 100);
  
  // Real metrics
  const totalSkillsCount = allUserSkills.size;
  const totalAssessments = student?.assessments?.length || 0;
  const projects = student?.projectsList || [];
  
  const nextStep = actualGaps.length > 0 ? actualGaps[0] : null;
  const recommendedResources = student?.recommendedResources || []; // Real data placeholder

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Load actual learning progress
  useEffect(() => {
    async function init() {
      if (!targetCareer) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const loadedProgress = await loadMilestoneProgress(targetCareer);
      setDbProgress(loadedProgress);
      setIsLoading(false);
    }
    init();
  }, [targetCareer]);

  // Calculate actual DB learning progress
  let completedLearningSteps = 0;
  if (dbProgress) {
    completedLearningSteps = Object.values(dbProgress).filter(val => val === 1).length;
  }
  
  // Learning progress is total DB skills marked completed + profile skills mastered
  // We'll calculate a unified progress percentage based on all required skills
  const totalCompletedSkills = actualStrengths.length + completedLearningSteps;
  const learningProgress = totalRequired === 0 ? 0 : Math.min(100, Math.round((totalCompletedSkills / totalRequired) * 100));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Activity className="w-8 h-8 animate-spin mb-4 text-cyan-400" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // --------------------------------------------------------
  // EMPTY STATES FOR NEW USERS
  // --------------------------------------------------------
  if (!targetCareer || totalSkillsCount === 0) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
         <GlassCard strong className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
           <div>
              <h2 className="lp-display text-2xl font-bold text-white mb-2">
                {userName ? `Welcome to PathForge, ${userName.split(' ')[0]} 👋` : "Welcome to PathForge 👋"}
              </h2>
              <p className="text-slate-400 max-w-xl">
                 Complete your profile and set your career goal to begin your personalized career journey. Your dashboard is waiting to be populated.
              </p>
           </div>
           <button
             onClick={() => go("profile")}
             className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white hover:from-cyan-400 transition-all shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
           >
             Complete Profile
           </button>
         </GlassCard>

         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-50 pointer-events-none">
            {[
              { label: "Career readiness", value: "Not calculated", icon: Compass, tone: "cyan" },
              { label: "Learning progress", value: "Not started", icon: TrendingUp, tone: "violet" },
              { label: "Skills listed", value: 0, icon: Radar, tone: "green" },
              { label: "Assessments taken", value: 0, icon: Flame, tone: "amber" },
            ].map(s => (
              <GlassCard key={s.label} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5">
                    <s.icon size={16} className="text-slate-400" />
                  </div>
                </div>
                <p className="lp-display text-xl font-semibold text-slate-300 truncate">
                  {s.value}
                </p>
                <p className="text-xs mt-1 text-slate-500">{s.label}</p>
              </GlassCard>
            ))}
         </div>
         
         <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/30 border border-white/5 rounded-3xl backdrop-blur-md">
            <LayoutDashboard className="w-16 h-16 text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Dashboard Not Available</h3>
            <p className="text-slate-400 text-sm max-w-md">We need your target career and current skills to analyze your gaps and generate your dashboard.</p>
         </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // FULLY POPULATED AUTHENTIC DASHBOARD
  // --------------------------------------------------------
  const stats = [
    { label: "Career readiness", value: careerReadiness, icon: Compass, tone: "cyan", suffix: "%" },
    { label: "Learning progress", value: learningProgress, icon: TrendingUp, tone: "violet", suffix: "%" },
    { label: "Skills listed", value: totalSkillsCount, icon: Radar, tone: "green", suffix: "" },
    { label: "Assessments taken", value: totalAssessments, icon: Flame, tone: "amber", suffix: "" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Greeting Banner */}
      <GlassCard strong className="p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="lp-display text-xl md:text-2xl font-semibold">
            {greeting}{userName ? `, ${userName.split(" ")[0]}` : ""} 👋
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>
            Your current career goal: <strong className="text-cyan-300 font-medium">{targetCareer}</strong>
          </p>
        </div>
        {actualGaps.length > 0 ? (
           <button
             onClick={() => go("roadmap")}
             className="lp-btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.3)]"
           >
             Continue Learning {nextStep}
           </button>
        ) : (
           <button
             onClick={() => go("career")}
             className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl text-sm font-semibold text-white transition-colors"
           >
             Update Career Goal
           </button>
        )}
      </GlassCard>

      {/* 2. Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <GlassCard key={s.label} hover className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${s.tone}-500/10`}>
                <s.icon size={16} className={`text-${s.tone}-400`} />
              </div>
            </div>
            <p className="lp-display text-2xl font-semibold text-white">
              <AnimatedCounter to={s.value} suffix={s.suffix} />
            </p>
            <p className="text-xs mt-1 text-slate-400">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* 2.5 Dynamic Career Intelligence Journey Map */}
      <CareerJourneyMap student={student} onNavigate={go} />

      {/* 3. Career Skill Gaps */}
      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2" hover>
          <SectionHeader
            eyebrow="CAREER SKILL GAPS"
            title={`Analysis for ${targetCareer}`}
            subtitle="Comparing your current skills against industry requirements."
            action={
              <button
                onClick={() => go("roadmap")}
                className="text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors cursor-pointer"
              >
                View Skill Gaps <ChevronRight size={13} />
              </button>
            }
          />

          <div className="grid grid-cols-3 gap-4 my-6">
             <div className="bg-slate-900/50 border border-white/5 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-white mb-1">{actualStrengths.length}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Matched Skills</div>
             </div>
             <div className="bg-slate-900/50 border border-white/5 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-white mb-1">{totalRequired}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Required Skills</div>
             </div>
             <div className="bg-slate-900/50 border border-white/5 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-amber-400 mb-1">{actualGaps.length}</div>
                <div className="text-[10px] text-amber-500 uppercase font-bold tracking-wider">Missing Skills</div>
             </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Priority Gaps to Focus On
            </h4>
            
            {actualGaps.length > 0 ? (
               <div className="flex flex-wrap gap-2">
                 {actualGaps.map((gap, i) => (
                   <span key={i} className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${i === 0 ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-slate-800/50 border-white/5 text-slate-300"}`}>
                     {gap}
                   </span>
                 ))}
               </div>
            ) : (
               <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <p className="text-sm font-medium text-green-400">You have matched all core requirements for this career!</p>
               </div>
            )}
          </div>
        </GlassCard>

        {/* 4. Career Readiness Card */}
        <GlassCard className="p-6 flex flex-col" hover>
          <SectionHeader
            title="Career readiness"
            action={
              <button
                onClick={() => go("career")}
                className="text-xs flex items-center gap-1 cursor-pointer text-cyan-400 hover:text-cyan-300"
              >
                Details <ChevronRight size={13} />
              </button>
            }
          />
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <ProgressRing value={careerReadiness} size={140} stroke={10} sublabel="ready" />
            
            <div className="w-full mt-6 space-y-3 bg-slate-900/50 rounded-xl p-4 border border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Target</span>
                <span className="font-semibold text-cyan-300 truncate max-w-[120px]">{targetCareer}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Matched</span>
                <span className="font-semibold text-white">{actualStrengths.length} / {totalRequired}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 5. Recommended Resources & Upcoming Assessment */}
      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2" hover>
          <SectionHeader
            title="Recommended for you"
            subtitle="Resources based on your current career goal and skill gaps."
            action={
              <button
                onClick={() => go("resources")}
                className="text-xs flex items-center gap-1 cursor-pointer text-cyan-400 hover:text-cyan-300"
              >
                All resources <ChevronRight size={13} />
              </button>
            }
          />
          {recommendedResources.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {recommendedResources.map((r, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                  <div className="flex items-center justify-between mb-2">
                    <Pill tone="cyan">{r.skill}</Pill>
                  </div>
                  <p className="text-sm font-semibold text-white mb-2">{r.title}</p>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{r.reason}</p>
                  <a href={r.link} target="_blank" rel="noreferrer" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                     Open Resource <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
             <div className="mt-4 p-6 bg-slate-900/50 border border-white/5 rounded-xl text-center">
                <p className="text-sm text-slate-400 mb-4">No specific recommendations available right now. Check back later as you update your skills.</p>
                {nextStep && (
                   <a href={`https://www.google.com/search?q=Learn+${encodeURIComponent(nextStep)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors">
                     Search resources for {nextStep} <ExternalLink className="w-3 h-3" />
                   </a>
                )}
             </div>
          )}
        </GlassCard>

        {/* 6. Upcoming Assessment */}
        <GlassCard className="p-6 flex flex-col" hover>
          <SectionHeader title="Upcoming assessment" />
          <div className="flex-1 flex flex-col items-center justify-center text-center py-2">
             {student?.assessments && student.assessments.length > 0 ? (
                <>
                   <BrainCircuit size={26} className="text-cyan-400 mb-3" />
                   <p className="text-sm font-bold mb-1 text-white">{student.assessments[0].name || "Technical Screen"}</p>
                   <p className="text-xs mb-5 text-slate-400">
                     {student.assessments[0].questions || 5} questions · ~{student.assessments[0].time || 10} minutes
                   </p>
                   <button
                     onClick={() => go("analyzing")}
                     className="lp-btn-primary px-5 py-2.5 rounded-xl text-sm w-full cursor-pointer font-bold"
                   >
                     Take Assessment
                   </button>
                </>
             ) : (
                <>
                   <Sparkles size={26} className="text-slate-600 mb-3" />
                   <p className="text-sm font-bold mb-2 text-slate-300 uppercase tracking-widest">No Assessment Available</p>
                   <p className="text-xs mb-6 text-slate-500 max-w-[200px]">
                     Take an initial assessment to measure your skills and prove your capabilities.
                   </p>
                   <button
                     onClick={() => go("analyzing")}
                     className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-xl text-sm w-full cursor-pointer font-bold transition-colors"
                   >
                     Take Initial Assessment
                   </button>
                </>
             )}
          </div>
        </GlassCard>
      </div>

      {/* 7. Recommended Projects */}
      <GlassCard className="p-6" hover>
        <SectionHeader
          title="Recommended projects"
          action={
            <button
              onClick={() => go("projects")}
              className="text-xs flex items-center gap-1 cursor-pointer text-cyan-400 hover:text-cyan-300"
            >
              All projects <ChevronRight size={13} />
            </button>
          }
        />
        
        {projects.length > 0 ? (
           <div className="grid md:grid-cols-2 gap-4 mt-4">
             {projects.map((p, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 border border-white/5 rounded-xl">
                 <div className="flex-1 min-w-0 pr-4">
                   <p className="text-sm font-bold text-white mb-1 truncate">{p.title}</p>
                   <p className="text-xs text-slate-400 mb-2 truncate">
                     {p.skills && Array.isArray(p.skills) ? p.skills.join(" · ") : "Various Skills"}
                   </p>
                   <p className="text-xs text-amber-400/80 italic">Recommended to fill skill gaps</p>
                 </div>
                 <button onClick={() => go("projects")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border border-white/5">
                   View Project
                 </button>
               </div>
             ))}
           </div>
        ) : (
           <div className="mt-4 p-8 bg-slate-900/30 border border-white/5 rounded-2xl text-center">
              <FolderKanban className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-white mb-1 uppercase tracking-widest">No Project Recommendations</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                 Complete your profile and add your skills to receive personalized project recommendations.
              </p>
              <button onClick={() => go("projects")} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-xl text-sm font-bold transition-colors">
                Explore Project Catalog
              </button>
           </div>
        )}
      </GlassCard>

    </div>
  );
}

export default DashboardView;
