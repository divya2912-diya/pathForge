import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, XCircle, Bot, TrendingUp, Plus, ExternalLink, Bookmark, ShieldCheck, FolderKanban, 
  Compass, ArrowRight, Briefcase, Award, Sparkles, RefreshCw, FileText, Check, AlertTriangle
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import ProgressRing from "../ui/ProgressRing";
import { SKILL_REQUIREMENTS, getStrengthsAndGaps } from "../../data/userProfile";
import { getCatalogProjects, getCatalogCertifications } from "../../data/supabaseAuth";
import { ONBOARD_CAREERS } from "../../data/mockData";
import { handleCareerChange } from "../../services/careerService";
import { buildUserLearningContext } from "../../services/userContextService";

export function CareerView({ student, onUpdateStudent }) {
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  useEffect(() => {
    async function loadResources() {
      setLoadingResources(true);
      const [p, c] = await Promise.all([getCatalogProjects(), getCatalogCertifications()]);
      setProjects(p || []);
      setCertifications(c || []);
      setLoadingResources(false);
    }
    loadResources();
  }, []);

  const ctx = buildUserLearningContext(student);
  const targetCareer = student?.targetCareer || "Software Engineer";

  const onSelectCareer = (newCareer) => {
    handleCareerChange(newCareer, student, onUpdateStudent);
  };
  
  const userSkills = student?.skills || [];
  const required = SKILL_REQUIREMENTS[targetCareer] || ["JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs"];
  const { strengths, gaps } = getStrengthsAndGaps(userSkills, targetCareer);
  
  const careerReadiness = required.length > 0 ? Math.round((strengths.length / required.length) * 100) : 50;
  const matchedCount = required.filter(r =>
    userSkills.some(s =>
      r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())
    )
  ).length;
  const matchPct = Math.round((matchedCount / Math.max(required.length, 1)) * 100);

  const skillsComparison = required.map(r => ({
    skill: r,
    have: userSkills.some(s =>
      r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())
    ),
  }));

  const handleAddSkill = (skill) => {
    if (!onUpdateStudent) return;
    const updatedSkills = [...userSkills, skill];
    const newProgression = { 
      courseId: "self-taught", 
      title: `${skill} Self-Taught`, 
      progress: 100, 
      lastAccessed: new Date().toISOString() 
    };
    onUpdateStudent({ 
      ...student, 
      skills: updatedSkills,
      learningProgress: [...(student.learningProgress || []), newProgression]
    }, `Added ${skill} to your mastered skills!`);
  };

  // Generate dynamic AI advice based on gap categories
  let advice = `You're ${careerReadiness}% ready for ${targetCareer}. You have strong foundational skills! Keep building your portfolio with projects and certifications to stand out to recruiters.`;
  if (gaps.length > 0) {
    advice = `You're ${careerReadiness}% ready for ${targetCareer}. Your priority is closing gaps in ${gaps.slice(0, 3).join(", ")}. Master these over the coming weeks to increase your job application match rates!`;
  }

  // Find recommendations for gaps
  const getRecommendationsForGap = (gap) => {
    const gapLower = gap.toLowerCase();
    const recommendedProject = projects.find(p => (p.skills || []).some(s => s.toLowerCase().includes(gapLower) || gapLower.includes(s.toLowerCase())));
    const recommendedCert = certifications.find(c => (c.skills_covered || []).some(s => s.toLowerCase().includes(gapLower) || gapLower.includes(s.toLowerCase())));
    return { project: recommendedProject, cert: recommendedCert };
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header with Career Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionHeader
          eyebrow="Academic & Career Intelligence"
          title={`Target career: ${targetCareer}`}
          subtitle="Real-time skill match, dynamic career path switching, and internship preparation plans."
        />
        <div className="flex items-center gap-2.5 shrink-0 bg-white/[0.03] p-2 border border-white/10 rounded-2xl">
          <Compass size={16} className="text-cyan-400 ml-1" />
          <label className="text-xs text-slate-300 font-bold">Switch Goal:</label>
          <select
            value={targetCareer}
            onChange={(e) => onSelectCareer(e.target.value)}
            className="px-3.5 py-2 bg-slate-900 border border-cyan-500/40 rounded-xl text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-md"
          >
            {ONBOARD_CAREERS.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-white">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <GlassCard strong className="p-6 flex flex-col items-center">
          <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Career Skill Match</p>
          <ProgressRing value={matchPct} size={110} stroke={9} sublabel="skill match" tone="#22d3ee" />
        </GlassCard>
        <GlassCard strong className="p-6 flex flex-col items-center">
          <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Overall Readiness</p>
          <ProgressRing value={careerReadiness} size={110} stroke={9} sublabel="readiness" tone="#8b5cf6" />
        </GlassCard>
        <GlassCard className="p-6 flex flex-col justify-center items-center text-center">
          <p className="lp-display text-3xl font-bold text-white">
            {matchedCount}<span className="text-base font-normal text-slate-400">/{required.length}</span>
          </p>
          <p className="text-xs mt-1 text-slate-400 font-medium">skills matched</p>
          {gaps.length > 0 ? (
            <span className="mt-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {gaps.length} gaps to close
            </span>
          ) : (
            <span className="mt-3 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              100% Target Met!
            </span>
          )}
        </GlassCard>
      </div>

      {/* Internship & Interview Readiness Plan */}
      <GlassCard strong className="p-6 space-y-4 border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.02] to-purple-500/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={20} className="text-cyan-400" />
            <h3 className="font-bold text-white text-base">Internship & Job Placement Action Plan</h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            Role: {targetCareer}
          </span>
        </div>

        <div className="grid md:grid-cols-4 gap-3 pt-2">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Step 1</span>
            <p className="text-xs font-bold text-white">Skill Foundation</p>
            <p className="text-[11px] text-slate-400">{matchedCount}/{required.length} skills mastered</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Step 2</span>
            <p className="text-xs font-bold text-white">Portfolio Projects</p>
            <p className="text-[11px] text-slate-400">{ctx.projects.length} projects completed</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Step 3</span>
            <p className="text-xs font-bold text-white">Certifications</p>
            <p className="text-[11px] text-slate-400">{ctx.certifications.length} certificates verified</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Step 4</span>
            <p className="text-xs font-bold text-white">Interview Prep</p>
            <p className="text-[11px] text-slate-400">Mock questions & coding tests</p>
          </div>
        </div>
      </GlassCard>

      {/* Skills Comparison */}
      <GlassCard className="p-6">
        <SectionHeader
          title="Skills Comparison & Gap Identification"
          subtitle={`Your skills vs. ${targetCareer} industry requirements`}
        />
        <div className="space-y-1 mt-4">
          {skillsComparison.map(s => (
            <div
              key={s.skill}
              className="flex items-center justify-between py-3 px-3 group hover:bg-white/[0.03] transition-colors rounded-xl border-b border-white/5"
            >
              <span className="text-sm font-medium text-slate-200">{s.skill}</span>
              <div className="flex items-center gap-4">
                {!s.have && (
                  <button 
                    onClick={() => handleAddSkill(s.skill)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg border border-cyan-500/30 cursor-pointer"
                  >
                    <Plus size={14} /> I have this skill
                  </button>
                )}
                <div className="flex items-center gap-1.5 text-xs font-bold w-28 justify-end" style={{ color: s.have ? "#6ee7b7" : "#f87171" }}>
                  {s.have ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                  {s.have ? "Mastered" : "Gap Identified"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* AI Career Advice */}
      <GlassCard strong className="p-6 flex items-start gap-4 border-cyan-500/20">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Bot size={22} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-white">AI Mentor Explainable Career Advice</p>
          <p className="text-xs text-slate-300 leading-relaxed">{advice}</p>
        </div>
      </GlassCard>

      {/* Gap closure tips */}
      {gaps.length > 0 && (
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-400" />
            <h3 className="text-base font-bold text-white">Recommended Actions to Close Your Skill Gaps</h3>
          </div>
          <div className="space-y-4">
            {gaps.slice(0, 4).map((gap, i) => {
              const recs = getRecommendationsForGap(gap);
              return (
                <div key={gap} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                    {i + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-bold text-white">Master {gap}</p>
                    
                    {loadingResources ? (
                      <div className="h-4 bg-white/5 animate-pulse rounded w-1/2" />
                    ) : (!recs.project && !recs.cert) ? (
                      <p className="text-xs text-slate-400">
                        Complete the related roadmap milestone to close this gap and increase your hireability.
                      </p>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        {recs.project && (
                          <div className="flex-1 bg-white/[0.02] border border-white/10 p-3 rounded-xl hover:border-cyan-500/30 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-2 mb-1">
                              <FolderKanban size={14} className="text-cyan-400" />
                              <span className="text-xs font-bold text-cyan-400">Recommended Project</span>
                            </div>
                            <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">{recs.project.title}</p>
                          </div>
                        )}
                        {recs.cert && (
                          <div className="flex-1 bg-white/[0.02] border border-white/10 p-3 rounded-xl hover:border-emerald-500/30 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-2 mb-1">
                              <ShieldCheck size={14} className="text-emerald-400" />
                              <span className="text-xs font-bold text-emerald-400">Recommended Cert</span>
                            </div>
                            <p className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">{recs.cert.title}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

export default CareerView;
