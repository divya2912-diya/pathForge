import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Bot, TrendingUp, Plus, ExternalLink, Bookmark, ShieldCheck, FolderKanban } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import SectionHeader from "../ui/SectionHeader";
import ProgressRing from "../ui/ProgressRing";
import { SKILL_REQUIREMENTS, getStrengthsAndGaps } from "../../data/userProfile";
import { getCatalogProjects, getCatalogCertifications } from "../../data/supabaseAuth";
import { ONBOARD_CAREERS } from "../../data/mockData";
import { handleCareerChange } from "../../services/careerService";

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

  const targetCareer = student?.targetCareer || "Software Engineer";

  const onSelectCareer = (newCareer) => {
    handleCareerChange(newCareer, student, onUpdateStudent);
  };
  const userSkills = student?.skills || [];
  
  const required = SKILL_REQUIREMENTS[targetCareer] || [];
  const { strengths, gaps } = getStrengthsAndGaps(userSkills, targetCareer);
  
  // Dynamic career readiness calculation based on matched skills vs required
  const careerReadiness = required.length > 0 ? Math.round((strengths.length / required.length) * 100) : 50;
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

  const handleAddSkill = (skill) => {
    if (!onUpdateStudent) return;
    const updatedSkills = [...userSkills, skill];
    // Add dummy progression for newly added skill
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
    });
  };

  // Generate dynamic AI advice based on gap categories
  let advice = `You're ${careerReadiness}% ready for ${targetCareer}. You have strong foundational skills! Keep building your portfolio with projects and certifications to stand out to recruiters.`;
  if (gaps.length > 0) {
    const isFrontend = gaps.some(g => g.includes("React") || g.includes("CSS") || g.includes("UI"));
    const isBackend = gaps.some(g => g.includes("Node") || g.includes("SQL") || g.includes("API"));
    const isData = gaps.some(g => g.includes("Python") || g.includes("Machine") || g.includes("Data"));
    
    let focusArea = "core missing skills";
    if (isFrontend && !isBackend) focusArea = "frontend frameworks and UI design";
    if (isBackend && !isFrontend) focusArea = "backend architecture and databases";
    if (isFrontend && isBackend) focusArea = "both frontend and backend technologies to complete your full stack";
    if (isData) focusArea = "data manipulation, algorithms, and models";

    advice = `You're ${careerReadiness}% ready for ${targetCareer}. Your biggest priority right now should be ${focusArea}. Focus on ${gaps.slice(0, 3).join(", ")} over the next several weeks to unlock significantly more job matches.`;
  }

  // Find recommendations for gaps
  const getRecommendationsForGap = (gap) => {
    const gapLower = gap.toLowerCase();
    const recommendedProject = projects.find(p => (p.skills || []).some(s => s.toLowerCase().includes(gapLower) || gapLower.includes(s.toLowerCase())));
    const recommendedCert = certifications.find(c => (c.skills_covered || []).some(s => s.toLowerCase().includes(gapLower) || gapLower.includes(s.toLowerCase())));
    return { project: recommendedProject, cert: recommendedCert };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionHeader
          eyebrow="Career intelligence"
          title={`Target career: ${targetCareer}`}
          subtitle="Your current readiness compared against industry requirements."
        />
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-slate-400 font-semibold">Change Career:</label>
          <select
            value={targetCareer}
            onChange={(e) => onSelectCareer(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-cyan-500/30 rounded-xl text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {ONBOARD_CAREERS.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-white">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

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
              className="flex items-center justify-between py-3 px-2 group hover:bg-white/[0.02] transition-colors rounded-lg"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-sm font-medium text-slate-200">{s.skill}</span>
              <div className="flex items-center gap-4 sm:gap-6">
                {!s.have && (
                  <button 
                    onClick={() => handleAddSkill(s.skill)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1.5 rounded-md"
                  >
                    <Plus size={14} /> I have this
                  </button>
                )}
                <div className="flex items-center gap-1.5 text-xs w-24 font-medium" style={{ color: s.have ? "#6ee7b7" : "#f87171" }}>
                  {s.have ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {s.have ? "You have it" : "Gap"}
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
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} color="#67e8f9" />
            <p className="text-base font-semibold">How to close your gaps</p>
          </div>
          <div className="space-y-5">
            {gaps.slice(0, 4).map((gap, i) => {
              const recs = getRecommendationsForGap(gap);
              return (
                <div key={gap} className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: "rgba(34,211,238,0.15)", color: "#67e8f9" }}>
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-base font-bold text-white mb-2">Master {gap}</p>
                    
                    {loadingResources ? (
                      <div className="h-4 bg-white/5 animate-pulse rounded w-1/2 mt-2"></div>
                    ) : (!recs.project && !recs.cert) ? (
                       <p className="text-sm text-slate-400">
                        Complete the related roadmap milestone to close this gap and increase your hireability.
                      </p>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3 mt-3">
                        {recs.project && (
                          <div className="flex-1 bg-[#0f172a]/50 border border-slate-700/50 p-3 rounded-xl hover:border-cyan-500/30 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-2 mb-1.5">
                              <FolderKanban size={14} className="text-cyan-400" />
                              <span className="text-xs font-bold text-cyan-400">Recommended Project</span>
                            </div>
                            <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">{recs.project.title}</p>
                          </div>
                        )}
                        {recs.cert && (
                          <div className="flex-1 bg-[#0f172a]/50 border border-slate-700/50 p-3 rounded-xl hover:border-emerald-500/30 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-2 mb-1.5">
                              <ShieldCheck size={14} className="text-emerald-400" />
                              <span className="text-xs font-bold text-emerald-400">Recommended Cert</span>
                            </div>
                            <p className="text-sm font-medium text-slate-200 group-hover:text-emerald-300 transition-colors">{recs.cert.title}</p>
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
